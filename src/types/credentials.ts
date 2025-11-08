/**
 * Verifiable Credential Types for Financial Institution Integration
 * Based on W3C Verifiable Credentials Data Model v1.1
 */

export type SignatureAlgorithm = 'Ed25519' | 'secp256k1';

export interface DIDDocument {
  id: string;
  name: string;
  jurisdiction?: string[];
  regulators?: string[];
  tier?: number;
}

export interface HashedPII {
  name: string;
  dateOfBirth: string;
  citizenship: string;
  address: string;
}

export interface KYCClaims {
  kycLevel: 'basic' | 'enhanced' | 'institutional';
  amlScreening: 'passed' | 'failed' | 'pending';
  sanctionsCheck: 'passed' | 'failed' | 'pending';
  pepScreening: 'passed' | 'failed' | 'pending';
  sourceOfFunds: 'verified' | 'unverified' | 'pending';
  accreditedInvestor: boolean;
  entityType: 'individual' | 'corporate' | 'institutional';
}

export interface AmountVerification {
  value: number;
  currency: string;
}

export interface CredentialSubject {
  id: string; // DID of the credential holder
  hashedPII: HashedPII;
  claims: KYCClaims;
  amountVerifiedFor: AmountVerification;
  tier: number;
  jurisdictions: string[];
}

export interface CredentialStatus {
  id: string;
  type: 'DID3RevocationRegistry' | 'StatusList2021';
  registryContract?: string;
  tokenId?: string;
}

export interface Proof {
  type: 'Ed25519Signature2020' | 'EcdsaSecp256k1Signature2019';
  created: string;
  verificationMethod: string;
  proofPurpose: 'assertionMethod' | 'authentication';
  proofValue: string;
}

export interface VerifiableCredential {
  '@context': string[];
  id: string;
  type: string[];
  issuer: DIDDocument;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: CredentialSubject;
  decommissionedAt: string | null;
  credentialStatus: CredentialStatus;
  proof: Proof;
}

// Request types for API
export interface IssueCredentialRequest {
  customerKycId: string;
  issuerDid: string;
  kycLevel: 'basic' | 'enhanced' | 'institutional';
  accreditedInvestor: boolean;
  jurisdiction: string[];
  expiryDays?: number;
  signatureAlgorithm?: SignatureAlgorithm;
}

export interface CustomerKYCData {
  kycId: string;
  name: string;
  dateOfBirth: string;
  citizenship: string;
  address: string;
  kycLevel: 'basic' | 'enhanced' | 'institutional';
  amlScreening: 'passed' | 'failed' | 'pending';
  sanctionsCheck: 'passed' | 'failed' | 'pending';
  pepScreening: 'passed' | 'failed' | 'pending';
  sourceOfFunds: 'verified' | 'unverified' | 'pending';
  accreditedInvestor: boolean;
  entityType: 'individual' | 'corporate' | 'institutional';
  verifiedAmount: number;
  currency: string;
  tier: number;
  jurisdictions: string[];
  userDid?: string;
}

export interface BankIssuer {
  did: string;
  name: string;
  jurisdiction: string[];
  regulators: string[];
  tier: number;
  privateKey: string;
  publicKey: string;
  signatureAlgorithm: SignatureAlgorithm;
}
