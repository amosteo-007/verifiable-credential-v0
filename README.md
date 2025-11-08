# Financial Institution Verifiable Credential Integration

A comprehensive TypeScript implementation for financial institutions to issue W3C-compliant verifiable credentials based on KYC (Know Your Customer) data.

## Overview

This project provides a complete solution for banks and financial institutions to:
- Issue verifiable credentials after successful KYC verification
- Support multiple signature algorithms (Ed25519, secp256k1)
- Manage credential lifecycle (issuance, verification, revocation)
- Integrate with existing KYC databases via RESTful API

## Features

### Core Functionality
- ✅ **W3C Verifiable Credentials** compliance
- ✅ **Multi-signature support** (Ed25519 & secp256k1)
- ✅ **Privacy-preserving** with hashed PII
- ✅ **RESTful API** for easy integration
- ✅ **Batch processing** for high-volume operations
- ✅ **Mock KYC database** for testing
- ✅ **Multiple tier support** (1-5)
- ✅ **Multi-jurisdiction** credentials

### Credential Schema

The credentials include:
- `kycLevel`: basic, enhanced, or institutional
- `accreditedInvestor`: boolean flag
- `jurisdiction`: array of jurisdictions
- `issuerDid`: DID of the issuing bank
- `expiry`: configurable expiration date
- `amountVerifiedFor`: verified transaction limits
- `tier`: credibility tier (1-5)

### Supported Banks (Test Configurations)

1. **JPMorgan Chase Bank** (Ed25519)
   - DID: `did:did3:bank:jpmorgan`
   - Tier: 5
   - Jurisdictions: US

2. **Goldman Sachs** (secp256k1)
   - DID: `did:did3:bank:goldmansachs`
   - Tier: 5
   - Jurisdictions: US

3. **HSBC** (Ed25519)
   - DID: `did:did3:bank:hsbc`
   - Tier: 5
   - Jurisdictions: UK, EU, APAC

4. **DBS Bank** (secp256k1)
   - DID: `did:did3:bank:dbs`
   - Tier: 4
   - Jurisdictions: SG, APAC

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Run examples
npm run example
```

## Quick Start

### 1. Start the API Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 2. Issue a Credential

```bash
curl -X POST http://localhost:3000/api/credentials/issue \
  -H "Content-Type: application/json" \
  -d '{
    "customerKycId": "KYC-001",
    "issuerDid": "did:did3:bank:jpmorgan",
    "kycLevel": "enhanced",
    "accreditedInvestor": true,
    "jurisdiction": ["US"],
    "expiryDays": 365,
    "signatureAlgorithm": "Ed25519"
  }'
```

### 3. Verify a Credential

```bash
curl -X POST http://localhost:3000/api/credentials/verify \
  -H "Content-Type: application/json" \
  -d @credential.json
```

## API Endpoints

### Health & Discovery

- `GET /api/health` - Health check
- `GET /api/issuers` - List all registered bank issuers
- `GET /api/issuers/:did` - Get specific issuer details

### Customer Management

- `GET /api/customers` - List all customers (testing)
- `GET /api/customers/:kycId` - Get customer KYC data

### Credential Operations

- `POST /api/credentials/issue` - Issue a single credential
- `POST /api/credentials/batch-issue` - Batch issue credentials
- `POST /api/credentials/verify` - Verify a credential

## Example Credential Structure

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://did3.org/contexts/credentials/v1"
  ],
  "id": "did:did3:credential:abc123def456",
  "type": ["VerifiableCredential", "KYCCredential"],

  "issuer": {
    "id": "did:did3:bank:jpmorgan",
    "name": "JPMorgan Chase Bank, N.A.",
    "jurisdiction": ["US"],
    "regulators": ["OCC", "FINRA", "SEC", "Federal Reserve"],
    "tier": 5
  },

  "issuanceDate": "2024-11-05T10:00:00Z",
  "expirationDate": "2025-11-05T10:00:00Z",

  "credentialSubject": {
    "id": "did:did3:user:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",

    "hashedPII": {
      "name": "0x3a5c8d2f...",
      "dateOfBirth": "0x8f2e1b9d...",
      "citizenship": "0x1b9d4e7a...",
      "address": "0x6e4a2c8b..."
    },

    "claims": {
      "kycLevel": "enhanced",
      "amlScreening": "passed",
      "sanctionsCheck": "passed",
      "pepScreening": "passed",
      "sourceOfFunds": "verified",
      "accreditedInvestor": true,
      "entityType": "individual"
    },

    "amountVerifiedFor": {
      "value": 5000000,
      "currency": "USD"
    },

    "tier": 2,
    "jurisdictions": ["US"]
  },

  "decommissionedAt": null,

  "credentialStatus": {
    "id": "https://did3.org/credentials/status/abc123def456",
    "type": "DID3RevocationRegistry",
    "registryContract": "0x...",
    "tokenId": "12345"
  },

  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2024-11-05T10:00:00Z",
    "verificationMethod": "did:did3:bank:jpmorgan#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z3FXQjVCXj1..."
  }
}
```

## Programmatic Usage

```typescript
import { issueCredential, verifyCredential } from './src/services/credential-issuer';
import { IssueCredentialRequest } from './src/types/credentials';

// Issue a credential
const request: IssueCredentialRequest = {
  customerKycId: 'KYC-001',
  issuerDid: 'did:did3:bank:jpmorgan',
  kycLevel: 'enhanced',
  accreditedInvestor: true,
  jurisdiction: ['US'],
  expiryDays: 365,
  signatureAlgorithm: 'Ed25519'
};

const credential = await issueCredential(request);

// Verify the credential
const verification = await verifyCredential(credential);
console.log(`Valid: ${verification.valid}`);
```

## Project Structure

```
verifiable-credential-v0/
├── src/
│   ├── types/           # TypeScript type definitions
│   │   └── credentials.ts
│   ├── utils/           # Cryptographic utilities
│   │   └── crypto.ts
│   ├── config/          # Bank issuer configurations
│   │   └── bank-issuers.ts
│   ├── mocks/           # Mock KYC database
│   │   └── kyc-database.ts
│   ├── services/        # Core business logic
│   │   └── credential-issuer.ts
│   └── api/             # REST API
│       ├── routes.ts
│       └── server.ts
├── examples/            # Usage examples
│   ├── issue-credential.ts
│   └── api-examples.sh
└── tests/              # Test files
```

## Security Considerations

### Production Deployment

⚠️ **Important**: This is a reference implementation for testing and development.

For production use:

1. **Key Management**
   - Store private keys in Hardware Security Modules (HSM)
   - Use key rotation policies
   - Implement multi-signature schemes

2. **Database**
   - Replace mock database with production-grade solution
   - Implement proper access controls
   - Use encryption at rest and in transit

3. **Authentication**
   - Add OAuth 2.0 / OpenID Connect
   - Implement API rate limiting
   - Use mutual TLS for bank-to-bank communication

4. **Compliance**
   - Ensure GDPR compliance for PII handling
   - Implement audit logging
   - Follow financial regulations (SOC 2, PCI-DSS)

## ISO 20022 Compatibility

While this implementation uses RESTful JSON, it can be adapted for ISO 20022 XML messaging:

```xml
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:vcrd.001.001.01">
  <VrfblCdtlIssnc>
    <IssrId>did:did3:bank:jpmorgan</IssrId>
    <CstmrKYCId>KYC-001</CstmrKYCId>
    <KYCLvl>enhanced</KYCLvl>
    <AccrdtdInvstr>true</AccrdtdInvstr>
  </VrfblCdtlIssnc>
</Document>
```

## Testing

Run the example script:

```bash
npm run example
```

Or use the API examples:

```bash
chmod +x examples/api-examples.sh
./examples/api-examples.sh
```

## Sample Customers

The mock database includes 5 test customers:

- **KYC-001**: Alice Johnson (Enhanced, Accredited, $5M)
- **KYC-002**: Bob Smith (Basic, Non-accredited, $100K)
- **KYC-003**: Acme Corporation (Institutional, $50M)
- **KYC-004**: Chen Wei (Enhanced, Singapore, $3M)
- **KYC-005**: Maria Garcia (Basic, EU, €250K)

## Contributing

Contributions are welcome! Please ensure:
- Code follows TypeScript best practices
- All tests pass
- Documentation is updated
- Security considerations are addressed

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/did3/verifiable-credentials/issues)
- Documentation: [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)

## Acknowledgments

- W3C Verifiable Credentials Working Group
- DID3 Protocol Team
- Financial Institution Integration Partners
