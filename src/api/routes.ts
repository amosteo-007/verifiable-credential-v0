/**
 * API Routes for Verifiable Credential Issuance
 * RESTful endpoints for financial institutions
 */

import { Router, Request, Response } from 'express';
import {
  issueCredential,
  verifyCredential,
  batchIssueCredentials
} from '../services/credential-issuer';
import { getAllIssuers, getIssuerByDid } from '../config/bank-issuers';
import { getAllCustomers, getCustomerKYC } from '../mocks/kyc-database';
import { IssueCredentialRequest, VerifiableCredential } from '../types/credentials';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Verifiable Credential Issuance API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * Get all registered bank issuers
 */
router.get('/issuers', (req: Request, res: Response) => {
  try {
    const issuers = getAllIssuers();
    // Don't expose private keys in the response
    const sanitizedIssuers = issuers.map(issuer => ({
      did: issuer.did,
      name: issuer.name,
      jurisdiction: issuer.jurisdiction,
      regulators: issuer.regulators,
      tier: issuer.tier,
      signatureAlgorithm: issuer.signatureAlgorithm,
      publicKey: issuer.publicKey
    }));
    res.json(sanitizedIssuers);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve issuers',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Get specific issuer by DID
 */
router.get('/issuers/:did', (req: Request, res: Response) => {
  try {
    const { did } = req.params;
    const issuer = getIssuerByDid(did);

    if (!issuer) {
      return res.status(404).json({
        error: 'Issuer not found',
        did
      });
    }

    // Don't expose private key
    const sanitizedIssuer = {
      did: issuer.did,
      name: issuer.name,
      jurisdiction: issuer.jurisdiction,
      regulators: issuer.regulators,
      tier: issuer.tier,
      signatureAlgorithm: issuer.signatureAlgorithm,
      publicKey: issuer.publicKey
    };

    res.json(sanitizedIssuer);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve issuer',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Get all customers (for testing/admin purposes)
 */
router.get('/customers', (req: Request, res: Response) => {
  try {
    const customers = getAllCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve customers',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Get customer KYC data by ID
 */
router.get('/customers/:kycId', (req: Request, res: Response) => {
  try {
    const { kycId } = req.params;
    const customer = getCustomerKYC(kycId);

    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found',
        kycId
      });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve customer',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Issue a verifiable credential
 * POST /api/credentials/issue
 */
router.post('/credentials/issue', async (req: Request, res: Response) => {
  try {
    const request: IssueCredentialRequest = req.body;

    // Validate required fields
    if (!request.customerKycId) {
      return res.status(400).json({
        error: 'Missing required field: customerKycId'
      });
    }

    if (!request.issuerDid) {
      return res.status(400).json({
        error: 'Missing required field: issuerDid'
      });
    }

    if (!request.kycLevel) {
      return res.status(400).json({
        error: 'Missing required field: kycLevel'
      });
    }

    if (request.accreditedInvestor === undefined) {
      return res.status(400).json({
        error: 'Missing required field: accreditedInvestor'
      });
    }

    if (!request.jurisdiction || request.jurisdiction.length === 0) {
      return res.status(400).json({
        error: 'Missing required field: jurisdiction'
      });
    }

    // Issue the credential
    const credential = await issueCredential(request);

    res.status(201).json({
      success: true,
      credential
    });
  } catch (error) {
    res.status(400).json({
      error: 'Failed to issue credential',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Batch issue credentials
 * POST /api/credentials/batch-issue
 */
router.post('/credentials/batch-issue', async (req: Request, res: Response) => {
  try {
    const requests: IssueCredentialRequest[] = req.body.requests;

    if (!Array.isArray(requests) || requests.length === 0) {
      return res.status(400).json({
        error: 'Invalid request: expected array of credential requests'
      });
    }

    const result = await batchIssueCredentials(requests);

    res.status(200).json({
      success: true,
      totalRequests: requests.length,
      successful: result.successful.length,
      failed: result.failed.length,
      credentials: result.successful,
      errors: result.failed
    });
  } catch (error) {
    res.status(400).json({
      error: 'Failed to batch issue credentials',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Verify a credential
 * POST /api/credentials/verify
 */
router.post('/credentials/verify', async (req: Request, res: Response) => {
  try {
    const credential: VerifiableCredential = req.body;

    if (!credential || !credential.id || !credential.proof) {
      return res.status(400).json({
        error: 'Invalid credential format'
      });
    }

    const result = await verifyCredential(credential);

    res.json({
      valid: result.valid,
      errors: result.errors,
      credential: {
        id: credential.id,
        issuer: credential.issuer.id,
        subject: credential.credentialSubject.id,
        issuanceDate: credential.issuanceDate,
        expirationDate: credential.expirationDate
      }
    });
  } catch (error) {
    res.status(400).json({
      error: 'Failed to verify credential',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
