/**
 * Bank Issuer Configurations
 * Mock configurations for financial institutions that issue verifiable credentials
 */

import { BankIssuer } from '../types/credentials';

/**
 * JPMorgan Chase Test Issuer
 * Ed25519 keys for testing
 */
export const JPMORGAN_ISSUER: BankIssuer = {
  did: 'did:did3:bank:jpmorgan',
  name: 'JPMorgan Chase Bank, N.A.',
  jurisdiction: ['US'],
  regulators: ['OCC', 'FINRA', 'SEC', 'Federal Reserve'],
  tier: 5,
  // Generated Ed25519 key pair - In production, these would be securely stored in HSM
  privateKey: '54186ec52d7261b0f6b484e4692a7de73f5a6332ce1e6b9964e053824a783994',
  publicKey: 'cd55868eb107b66bf1d0055387fabdc7a632688037a38103e42e98da293255cf',
  signatureAlgorithm: 'Ed25519'
};

/**
 * Goldman Sachs Test Issuer
 * secp256k1 keys for testing
 */
export const GOLDMAN_SACHS_ISSUER: BankIssuer = {
  did: 'did:did3:bank:goldmansachs',
  name: 'Goldman Sachs Bank USA',
  jurisdiction: ['US'],
  regulators: ['OCC', 'SEC', 'FINRA'],
  tier: 5,
  // Generated secp256k1 key pair
  privateKey: '8009afda5d258a17b4eff2c107540d2eeb546e2edc74a1f8ebab9470f5cfc36d',
  publicKey: '025c0424a9ef3787a4ef008353314c3788ff951ae09645487fc640df733d7da72e',
  signatureAlgorithm: 'secp256k1'
};

/**
 * HSBC Test Issuer
 * Ed25519 keys for testing
 */
export const HSBC_ISSUER: BankIssuer = {
  did: 'did:did3:bank:hsbc',
  name: 'HSBC Bank plc',
  jurisdiction: ['UK', 'EU', 'APAC'],
  regulators: ['FCA', 'PRA', 'ECB'],
  tier: 5,
  privateKey: 'c752847833e258e915fdd8dd0d65983e32ee0549857bdebbccb6c619dc9d8e57',
  publicKey: '358812b95b1a2ccead7b5f190b5458298423cf5cc5e0a9e27185e9ebeddcf92a',
  signatureAlgorithm: 'Ed25519'
};

/**
 * DBS Bank Test Issuer (Singapore)
 * secp256k1 keys for testing
 */
export const DBS_ISSUER: BankIssuer = {
  did: 'did:did3:bank:dbs',
  name: 'DBS Bank Ltd',
  jurisdiction: ['SG', 'APAC'],
  regulators: ['MAS'],
  tier: 4,
  privateKey: '0f5a99c0c04f490f7d1bc851cb3623461bfb05ccc7f3492db3ae652bc94071ce',
  publicKey: '025815520bd779e958606656a22b0179738f8c3b9220547455c191945855c68b4d',
  signatureAlgorithm: 'secp256k1'
};

/**
 * Registry of all bank issuers
 */
const ISSUER_REGISTRY: Map<string, BankIssuer> = new Map([
  [JPMORGAN_ISSUER.did, JPMORGAN_ISSUER],
  [GOLDMAN_SACHS_ISSUER.did, GOLDMAN_SACHS_ISSUER],
  [HSBC_ISSUER.did, HSBC_ISSUER],
  [DBS_ISSUER.did, DBS_ISSUER]
]);

/**
 * Get issuer configuration by DID
 */
export function getIssuerByDid(did: string): BankIssuer | null {
  return ISSUER_REGISTRY.get(did) || null;
}

/**
 * Get all registered issuers
 */
export function getAllIssuers(): BankIssuer[] {
  return Array.from(ISSUER_REGISTRY.values());
}

/**
 * Register a new issuer
 */
export function registerIssuer(issuer: BankIssuer): void {
  ISSUER_REGISTRY.set(issuer.did, issuer);
}

/**
 * Check if an issuer is registered
 */
export function isIssuerRegistered(did: string): boolean {
  return ISSUER_REGISTRY.has(did);
}
