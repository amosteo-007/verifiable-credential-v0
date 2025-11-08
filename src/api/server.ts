/**
 * Express Server for Verifiable Credential Issuance API
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import router from './routes';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../../public')));

// CORS middleware for development
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// API documentation endpoint
app.get('/api-info', (req: Request, res: Response) => {
  res.json({
    service: 'Financial Institution Verifiable Credential Issuance API',
    version: '1.0.0',
    description: 'RESTful API for issuing and verifying KYC-based verifiable credentials',
    endpoints: {
      health: 'GET /api/health',
      issuers: 'GET /api/issuers',
      issuer: 'GET /api/issuers/:did',
      customers: 'GET /api/customers',
      customer: 'GET /api/customers/:kycId',
      issueCredential: 'POST /api/credentials/issue',
      batchIssue: 'POST /api/credentials/batch-issue',
      verifyCredential: 'POST /api/credentials/verify'
    },
    documentation: 'https://github.com/did3/verifiable-credentials',
    examples: {
      issueCredential: {
        method: 'POST',
        endpoint: '/api/credentials/issue',
        body: {
          customerKycId: 'KYC-001',
          issuerDid: 'did:did3:bank:jpmorgan',
          kycLevel: 'enhanced',
          accreditedInvestor: true,
          jurisdiction: ['US'],
          expiryDays: 365,
          signatureAlgorithm: 'Ed25519'
        }
      }
    }
  });
});

// Mount API routes
app.use('/api', router);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('DIDgateway - Institutional Trust Network');
    console.log('='.repeat(60));
    console.log(`Server running on port ${PORT}`);
    console.log(`Landing Page: http://localhost:${PORT}/`);
    console.log(`API Documentation: http://localhost:${PORT}/api-info`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log('='.repeat(60));
    console.log('\nAvailable Endpoints:');
    console.log('  GET  /                        - DIDgateway landing page');
    console.log('  GET  /api-info                - API documentation');
    console.log('  GET  /api/health              - Health check');
    console.log('  GET  /api/issuers             - List all bank issuers');
    console.log('  GET  /api/issuers/:did        - Get issuer details');
    console.log('  GET  /api/customers           - List all customers');
    console.log('  GET  /api/customers/:kycId    - Get customer KYC data');
    console.log('  POST /api/credentials/issue   - Issue a credential');
    console.log('  POST /api/credentials/batch-issue - Batch issue credentials');
    console.log('  POST /api/credentials/verify  - Verify a credential');
    console.log('='.repeat(60));
  });
}

export default app;
