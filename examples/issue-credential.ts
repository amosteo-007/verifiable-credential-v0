/**
 * Example: Issue a Verifiable Credential
 * Demonstrates how to use the credential issuance service
 */

import { issueCredential, verifyCredential } from '../src/services/credential-issuer';
import { IssueCredentialRequest } from '../src/types/credentials';
import { JPMORGAN_ISSUER } from '../src/config/bank-issuers';

async function main() {
  console.log('='.repeat(80));
  console.log('Verifiable Credential Issuance Example');
  console.log('='.repeat(80));
  console.log();

  // Example 1: Issue credential for high-value accredited investor
  console.log('Example 1: Enhanced KYC for Accredited Investor');
  console.log('-'.repeat(80));

  const request1: IssueCredentialRequest = {
    customerKycId: 'KYC-001',
    issuerDid: JPMORGAN_ISSUER.did,
    kycLevel: 'enhanced',
    accreditedInvestor: true,
    jurisdiction: ['US'],
    expiryDays: 365,
    signatureAlgorithm: 'Ed25519'
  };

  try {
    const credential1 = await issueCredential(request1);
    console.log('✓ Credential issued successfully!');
    console.log();
    console.log('Credential Details:');
    console.log(`  ID: ${credential1.id}`);
    console.log(`  Issuer: ${credential1.issuer.name}`);
    console.log(`  Subject: ${credential1.credentialSubject.id}`);
    console.log(`  KYC Level: ${credential1.credentialSubject.claims.kycLevel}`);
    console.log(`  Accredited Investor: ${credential1.credentialSubject.claims.accreditedInvestor}`);
    console.log(`  Verified Amount: ${credential1.credentialSubject.amountVerifiedFor.currency} ${credential1.credentialSubject.amountVerifiedFor.value.toLocaleString()}`);
    console.log(`  Tier: ${credential1.credentialSubject.tier}`);
    console.log(`  Jurisdiction: ${credential1.credentialSubject.jurisdictions.join(', ')}`);
    console.log(`  Issued: ${credential1.issuanceDate}`);
    console.log(`  Expires: ${credential1.expirationDate}`);
    console.log(`  Signature Algorithm: ${credential1.proof.type}`);
    console.log();

    // Verify the credential
    console.log('Verifying credential...');
    const verification1 = await verifyCredential(credential1);
    console.log(`  Valid: ${verification1.valid ? '✓' : '✗'}`);
    if (verification1.errors.length > 0) {
      console.log(`  Errors: ${verification1.errors.join(', ')}`);
    }
    console.log();

    // Display full credential (prettified)
    console.log('Full Credential JSON:');
    console.log(JSON.stringify(credential1, null, 2));
    console.log();

  } catch (error) {
    console.error('✗ Error:', error instanceof Error ? error.message : String(error));
  }

  console.log();
  console.log('='.repeat(80));

  // Example 2: Basic KYC for retail customer
  console.log('Example 2: Basic KYC for Retail Customer');
  console.log('-'.repeat(80));

  const request2: IssueCredentialRequest = {
    customerKycId: 'KYC-002',
    issuerDid: 'did:did3:bank:jpmorgan',
    kycLevel: 'basic',
    accreditedInvestor: false,
    jurisdiction: ['US'],
    expiryDays: 180
  };

  try {
    const credential2 = await issueCredential(request2);
    console.log('✓ Credential issued successfully!');
    console.log();
    console.log('Credential Details:');
    console.log(`  ID: ${credential2.id}`);
    console.log(`  Subject: ${credential2.credentialSubject.id}`);
    console.log(`  KYC Level: ${credential2.credentialSubject.claims.kycLevel}`);
    console.log(`  Verified Amount: ${credential2.credentialSubject.amountVerifiedFor.currency} ${credential2.credentialSubject.amountVerifiedFor.value.toLocaleString()}`);
    console.log();
  } catch (error) {
    console.error('✗ Error:', error instanceof Error ? error.message : String(error));
  }

  console.log();
  console.log('='.repeat(80));

  // Example 3: Corporate/Institutional KYC
  console.log('Example 3: Institutional KYC for Corporate Entity');
  console.log('-'.repeat(80));

  const request3: IssueCredentialRequest = {
    customerKycId: 'KYC-003',
    issuerDid: 'did:did3:bank:jpmorgan',
    kycLevel: 'institutional',
    accreditedInvestor: true,
    jurisdiction: ['US', 'EU'],
    expiryDays: 730, // 2 years
    signatureAlgorithm: 'Ed25519'
  };

  try {
    const credential3 = await issueCredential(request3);
    console.log('✓ Credential issued successfully!');
    console.log();
    console.log('Credential Details:');
    console.log(`  ID: ${credential3.id}`);
    console.log(`  Subject: ${credential3.credentialSubject.id}`);
    console.log(`  Entity Type: ${credential3.credentialSubject.claims.entityType}`);
    console.log(`  KYC Level: ${credential3.credentialSubject.claims.kycLevel}`);
    console.log(`  Verified Amount: ${credential3.credentialSubject.amountVerifiedFor.currency} ${credential3.credentialSubject.amountVerifiedFor.value.toLocaleString()}`);
    console.log(`  Multi-Jurisdiction: ${credential3.credentialSubject.jurisdictions.join(', ')}`);
    console.log();
  } catch (error) {
    console.error('✗ Error:', error instanceof Error ? error.message : String(error));
  }

  console.log('='.repeat(80));
}

main().catch(console.error);
