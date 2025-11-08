/**
 * Credential Issuance Service
 * Core service for issuing verifiable credentials based on KYC data
 */

import {
  VerifiableCredential,
  IssueCredentialRequest,
  CustomerKYCData,
  BankIssuer,
  Proof
} from '../types/credentials';
import {
  signCredential,
  hashPII,
  generateCredentialId,
  generateStatusUrl
} from '../utils/crypto';
import { getCustomerKYC } from '../mocks/kyc-database';
import { getIssuerByDid } from '../config/bank-issuers';

/**
 * Issue a verifiable credential based on KYC data
 */
export async function issueCredential(
  request: IssueCredentialRequest
): Promise<VerifiableCredential> {
  // 1. Validate the issuer
  const issuer = getIssuerByDid(request.issuerDid);
  if (!issuer) {
    throw new Error(`Invalid issuer DID: ${request.issuerDid}`);
  }

  // 2. Retrieve customer KYC data
  const kycData = getCustomerKYC(request.customerKycId);
  if (!kycData) {
    throw new Error(`Customer not found: ${request.customerKycId}`);
  }

  // 3. Validate KYC status - all checks must pass
  if (
    kycData.amlScreening !== 'passed' ||
    kycData.sanctionsCheck !== 'passed' ||
    kycData.pepScreening !== 'passed'
  ) {
    throw new Error('Customer has not passed all required KYC checks');
  }

  // 4. Validate request parameters against KYC data
  if (request.kycLevel !== kycData.kycLevel) {
    throw new Error(`KYC level mismatch: requested ${request.kycLevel}, customer has ${kycData.kycLevel}`);
  }

  if (request.accreditedInvestor !== kycData.accreditedInvestor) {
    throw new Error('Accredited investor status mismatch');
  }

  // 5. Generate credential ID and dates
  const subjectDid = kycData.userDid || `did:did3:user:${request.customerKycId}`;
  const credentialId = generateCredentialId(issuer.did, subjectDid);
  const issuanceDate = new Date();
  const expiryDays = request.expiryDays || 365;
  const expirationDate = new Date(issuanceDate);
  expirationDate.setDate(expirationDate.getDate() + expiryDays);

  // 6. Hash PII for privacy
  const hashedPII = {
    name: hashPII(kycData.name),
    dateOfBirth: hashPII(kycData.dateOfBirth),
    citizenship: hashPII(kycData.citizenship),
    address: hashPII(kycData.address)
  };

  // 7. Build credential subject
  const credentialSubject = {
    id: subjectDid,
    hashedPII,
    claims: {
      kycLevel: kycData.kycLevel,
      amlScreening: kycData.amlScreening,
      sanctionsCheck: kycData.sanctionsCheck,
      pepScreening: kycData.pepScreening,
      sourceOfFunds: kycData.sourceOfFunds,
      accreditedInvestor: kycData.accreditedInvestor,
      entityType: kycData.entityType
    },
    amountVerifiedFor: {
      value: kycData.verifiedAmount,
      currency: kycData.currency
    },
    tier: kycData.tier,
    jurisdictions: request.jurisdiction
  };

  // 8. Build unsigned credential
  const unsignedCredential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://did3.org/contexts/credentials/v1'
    ],
    id: credentialId,
    type: ['VerifiableCredential', 'KYCCredential'],
    issuer: {
      id: issuer.did,
      name: issuer.name,
      jurisdiction: issuer.jurisdiction,
      regulators: issuer.regulators,
      tier: issuer.tier
    },
    issuanceDate: issuanceDate.toISOString(),
    expirationDate: expirationDate.toISOString(),
    credentialSubject,
    decommissionedAt: null,
    credentialStatus: {
      id: generateStatusUrl(credentialId),
      type: 'DID3RevocationRegistry' as const,
      registryContract: '0x' + '0'.repeat(40), // Mock contract address
      tokenId: Math.floor(Math.random() * 100000).toString()
    }
  };

  // 9. Create canonical representation for signing
  const canonicalData = JSON.stringify(unsignedCredential, Object.keys(unsignedCredential).sort());

  // 10. Sign the credential
  const signatureAlgorithm = request.signatureAlgorithm || issuer.signatureAlgorithm;
  const proofValue = await signCredential(
    canonicalData,
    issuer.privateKey,
    signatureAlgorithm
  );

  // 11. Build proof
  const proofType = signatureAlgorithm === 'Ed25519'
    ? 'Ed25519Signature2020'
    : 'EcdsaSecp256k1Signature2019';

  const proof: Proof = {
    type: proofType,
    created: issuanceDate.toISOString(),
    verificationMethod: `${issuer.did}#key-1`,
    proofPurpose: 'assertionMethod',
    proofValue
  };

  // 12. Return complete verifiable credential
  return {
    ...unsignedCredential,
    proof
  };
}

/**
 * Verify a credential's signature
 */
export async function verifyCredential(
  credential: VerifiableCredential
): Promise<{
  valid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  try {
    // 1. Verify expiration
    const now = new Date();
    const expirationDate = new Date(credential.expirationDate);
    if (now > expirationDate) {
      errors.push('Credential has expired');
    }

    // 2. Verify not decommissioned
    if (credential.decommissionedAt !== null) {
      errors.push('Credential has been decommissioned');
    }

    // 3. Verify issuer exists
    const issuer = getIssuerByDid(credential.issuer.id);
    if (!issuer) {
      errors.push('Unknown issuer');
      return { valid: false, errors };
    }

    // 4. Verify signature
    // Create canonical representation (without proof)
    const { proof, ...credentialWithoutProof } = credential;
    const canonicalData = JSON.stringify(credentialWithoutProof, Object.keys(credentialWithoutProof).sort());

    const { verifySignature } = await import('../utils/crypto');
    const signatureValid = await verifySignature(
      canonicalData,
      proof.proofValue,
      issuer.publicKey,
      issuer.signatureAlgorithm
    );

    if (!signatureValid) {
      errors.push('Invalid signature');
    }

    return {
      valid: errors.length === 0 && signatureValid,
      errors
    };
  } catch (error) {
    errors.push(`Verification error: ${error instanceof Error ? error.message : String(error)}`);
    return { valid: false, errors };
  }
}

/**
 * Revoke a credential (set decommissionedAt)
 */
export function revokeCredential(
  credential: VerifiableCredential
): VerifiableCredential {
  return {
    ...credential,
    decommissionedAt: new Date().toISOString()
  };
}

/**
 * Batch issue credentials for multiple customers
 */
export async function batchIssueCredentials(
  requests: IssueCredentialRequest[]
): Promise<{
  successful: VerifiableCredential[];
  failed: Array<{ request: IssueCredentialRequest; error: string }>;
}> {
  const successful: VerifiableCredential[] = [];
  const failed: Array<{ request: IssueCredentialRequest; error: string }> = [];

  for (const request of requests) {
    try {
      const credential = await issueCredential(request);
      successful.push(credential);
    } catch (error) {
      failed.push({
        request,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return { successful, failed };
}
