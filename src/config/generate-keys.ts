/**
 * Utility to generate real key pairs for bank issuers
 * Run this once to generate production keys
 */

import { generateKeyPair } from '../utils/crypto';

async function generateBankKeys() {
  console.log('Generating key pairs for bank issuers...\n');

  // JPMorgan - Ed25519
  const jpmKeys = await generateKeyPair('Ed25519');
  console.log('JPMorgan Chase (Ed25519):');
  console.log('  Private Key:', jpmKeys.privateKey);
  console.log('  Public Key:', jpmKeys.publicKey);
  console.log();

  // Goldman Sachs - secp256k1
  const gsKeys = await generateKeyPair('secp256k1');
  console.log('Goldman Sachs (secp256k1):');
  console.log('  Private Key:', gsKeys.privateKey);
  console.log('  Public Key:', gsKeys.publicKey);
  console.log();

  // HSBC - Ed25519
  const hsbcKeys = await generateKeyPair('Ed25519');
  console.log('HSBC (Ed25519):');
  console.log('  Private Key:', hsbcKeys.privateKey);
  console.log('  Public Key:', hsbcKeys.publicKey);
  console.log();

  // DBS - secp256k1
  const dbsKeys = await generateKeyPair('secp256k1');
  console.log('DBS Bank (secp256k1):');
  console.log('  Private Key:', dbsKeys.privateKey);
  console.log('  Public Key:', dbsKeys.publicKey);
  console.log();
}

generateBankKeys().catch(console.error);
