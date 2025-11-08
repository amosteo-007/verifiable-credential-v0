#!/bin/bash
# API Usage Examples for Verifiable Credential Issuance

BASE_URL="http://localhost:3000/api"

echo "========================================="
echo "Verifiable Credential API Examples"
echo "========================================="
echo ""

# Health check
echo "1. Health Check"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/health" | jq .
echo ""
echo ""

# List all issuers
echo "2. List All Bank Issuers"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/issuers" | jq .
echo ""
echo ""

# Get specific issuer
echo "3. Get JPMorgan Issuer Details"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/issuers/did:did3:bank:jpmorgan" | jq .
echo ""
echo ""

# List all customers
echo "4. List All Customers"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/customers" | jq .
echo ""
echo ""

# Get specific customer
echo "5. Get Customer KYC Data"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/customers/KYC-001" | jq .
echo ""
echo ""

# Issue a credential
echo "6. Issue Verifiable Credential (Enhanced KYC)"
echo "----------------------------------------"
curl -s -X POST "$BASE_URL/credentials/issue" \
  -H "Content-Type: application/json" \
  -d '{
    "customerKycId": "KYC-001",
    "issuerDid": "did:did3:bank:jpmorgan",
    "kycLevel": "enhanced",
    "accreditedInvestor": true,
    "jurisdiction": ["US"],
    "expiryDays": 365,
    "signatureAlgorithm": "Ed25519"
  }' | jq .
echo ""
echo ""

# Issue another credential (Basic KYC)
echo "7. Issue Verifiable Credential (Basic KYC)"
echo "----------------------------------------"
curl -s -X POST "$BASE_URL/credentials/issue" \
  -H "Content-Type: application/json" \
  -d '{
    "customerKycId": "KYC-002",
    "issuerDid": "did:did3:bank:jpmorgan",
    "kycLevel": "basic",
    "accreditedInvestor": false,
    "jurisdiction": ["US"],
    "expiryDays": 180
  }' | jq .
echo ""
echo ""

# Batch issue credentials
echo "8. Batch Issue Credentials"
echo "----------------------------------------"
curl -s -X POST "$BASE_URL/credentials/batch-issue" \
  -H "Content-Type: application/json" \
  -d '{
    "requests": [
      {
        "customerKycId": "KYC-001",
        "issuerDid": "did:did3:bank:jpmorgan",
        "kycLevel": "enhanced",
        "accreditedInvestor": true,
        "jurisdiction": ["US"],
        "expiryDays": 365
      },
      {
        "customerKycId": "KYC-002",
        "issuerDid": "did:did3:bank:jpmorgan",
        "kycLevel": "basic",
        "accreditedInvestor": false,
        "jurisdiction": ["US"],
        "expiryDays": 180
      }
    ]
  }' | jq .
echo ""
echo ""

# Verify a credential (note: replace with actual credential from above)
echo "9. Verify Credential"
echo "----------------------------------------"
echo "Note: First issue a credential, then copy it to verify.json and run:"
echo 'curl -X POST "$BASE_URL/credentials/verify" -H "Content-Type: application/json" -d @verify.json | jq .'
echo ""

echo "========================================="
echo "Examples completed!"
echo "========================================="
