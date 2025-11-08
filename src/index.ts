/**
 * Main entry point for the Verifiable Credential library
 * Exports all public APIs
 */

// Types
export * from './types/credentials';

// Services
export {
  issueCredential,
  verifyCredential,
  revokeCredential,
  batchIssueCredentials
} from './services/credential-issuer';

// Utilities
export {
  generateKeyPair,
  sha256Hash,
  hashPII,
  signCredential,
  verifySignature,
  generateCredentialId,
  generateStatusUrl
} from './utils/crypto';

// Configuration
export {
  JPMORGAN_ISSUER,
  GOLDMAN_SACHS_ISSUER,
  HSBC_ISSUER,
  DBS_ISSUER,
  getIssuerByDid,
  getAllIssuers,
  registerIssuer,
  isIssuerRegistered
} from './config/bank-issuers';

// Mock database (for testing)
export {
  getCustomerKYC,
  upsertCustomerKYC,
  getAllCustomers,
  deleteCustomerKYC,
  searchCustomers,
  initializeMockDatabase
} from './mocks/kyc-database';
