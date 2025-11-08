/**
 * Cryptographic utilities for signing verifiable credentials
 * Supports Ed25519 and secp256k1 signature algorithms
 */

import * as ed25519 from '@noble/ed25519';
import * as secp256k1 from '@noble/secp256k1';
import { createHash } from 'crypto';
import { SignatureAlgorithm } from '../types/credentials';

// Initialize noble-ed25519 with SHA-512 hash function
ed25519.etc.sha512Sync = (...messages: Uint8Array[]) => {
  const hash = createHash('sha512');
  for (const message of messages) {
    hash.update(message);
  }
  return Uint8Array.from(hash.digest());
};

// Initialize noble-secp256k1 with SHA-256 hash function
secp256k1.etc.hmacSha256Sync = (key: Uint8Array, ...messages: Uint8Array[]) => {
  const hash = createHash('sha256');
  hash.update(key);
  for (const message of messages) {
    hash.update(message);
  }
  return Uint8Array.from(hash.digest());
};

/**
 * Generate a key pair for the specified algorithm
 */
export async function generateKeyPair(algorithm: SignatureAlgorithm): Promise<{
  privateKey: string;
  publicKey: string;
}> {
  if (algorithm === 'Ed25519') {
    const privateKey = ed25519.utils.randomPrivateKey();
    const publicKey = await ed25519.getPublicKey(privateKey);

    return {
      privateKey: Buffer.from(privateKey).toString('hex'),
      publicKey: Buffer.from(publicKey).toString('hex')
    };
  } else if (algorithm === 'secp256k1') {
    const privateKey = secp256k1.utils.randomPrivateKey();
    const publicKey = secp256k1.getPublicKey(privateKey, true); // compressed

    return {
      privateKey: Buffer.from(privateKey).toString('hex'),
      publicKey: Buffer.from(publicKey).toString('hex')
    };
  }

  throw new Error(`Unsupported algorithm: ${algorithm}`);
}

/**
 * Hash data using SHA-256
 */
export function sha256Hash(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

/**
 * Create a hash of PII data for privacy
 */
export function hashPII(value: string, salt?: string): string {
  const dataToHash = salt ? `${value}:${salt}` : value;
  return '0x' + sha256Hash(dataToHash);
}

/**
 * Sign data with Ed25519
 */
async function signWithEd25519(data: string, privateKeyHex: string): Promise<string> {
  const privateKey = Buffer.from(privateKeyHex, 'hex');
  const messageHash = Buffer.from(sha256Hash(data), 'hex');
  const signature = await ed25519.sign(messageHash, privateKey);

  // Return as base58-like encoded string (using hex for simplicity)
  return 'z' + Buffer.from(signature).toString('hex');
}

/**
 * Sign data with secp256k1
 */
async function signWithSecp256k1(data: string, privateKeyHex: string): Promise<string> {
  const privateKey = Buffer.from(privateKeyHex, 'hex');
  const messageHash = sha256Hash(data);
  const signature = await secp256k1.sign(messageHash, privateKey);

  // Return as base58-like encoded string (using hex for simplicity)
  return 'z' + signature.toCompactHex();
}

/**
 * Sign credential data with the specified algorithm
 */
export async function signCredential(
  credentialData: string,
  privateKey: string,
  algorithm: SignatureAlgorithm
): Promise<string> {
  if (algorithm === 'Ed25519') {
    return signWithEd25519(credentialData, privateKey);
  } else if (algorithm === 'secp256k1') {
    return signWithSecp256k1(credentialData, privateKey);
  }

  throw new Error(`Unsupported signature algorithm: ${algorithm}`);
}

/**
 * Verify Ed25519 signature
 */
async function verifyEd25519(
  data: string,
  signatureWithPrefix: string,
  publicKeyHex: string
): Promise<boolean> {
  try {
    const signature = Buffer.from(signatureWithPrefix.slice(1), 'hex'); // Remove 'z' prefix
    const publicKey = Buffer.from(publicKeyHex, 'hex');
    const messageHash = Buffer.from(sha256Hash(data), 'hex');

    return await ed25519.verify(signature, messageHash, publicKey);
  } catch (error) {
    return false;
  }
}

/**
 * Verify secp256k1 signature
 */
async function verifySecp256k1(
  data: string,
  signatureWithPrefix: string,
  publicKeyHex: string
): Promise<boolean> {
  try {
    const signatureHex = signatureWithPrefix.slice(1); // Remove 'z' prefix
    const signature = secp256k1.Signature.fromCompact(signatureHex);
    const publicKey = Buffer.from(publicKeyHex, 'hex');
    const messageHash = sha256Hash(data);

    return secp256k1.verify(signature, messageHash, publicKey);
  } catch (error) {
    return false;
  }
}

/**
 * Verify a credential signature
 */
export async function verifySignature(
  credentialData: string,
  signature: string,
  publicKey: string,
  algorithm: SignatureAlgorithm
): Promise<boolean> {
  if (algorithm === 'Ed25519') {
    return verifyEd25519(credentialData, signature, publicKey);
  } else if (algorithm === 'secp256k1') {
    return verifySecp256k1(credentialData, signature, publicKey);
  }

  throw new Error(`Unsupported signature algorithm: ${algorithm}`);
}

/**
 * Generate a deterministic credential ID
 */
export function generateCredentialId(issuerDid: string, subjectId: string): string {
  const combined = `${issuerDid}:${subjectId}:${Date.now()}`;
  const hash = sha256Hash(combined);
  return `did:did3:credential:${hash.substring(0, 16)}`;
}

/**
 * Generate a status registry URL
 */
export function generateStatusUrl(credentialId: string): string {
  const hash = credentialId.split(':').pop() || '';
  return `https://did3.org/credentials/status/${hash}`;
}
