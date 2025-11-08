/**
 * Mock KYC Database
 * Simulates a financial institution's KYC database
 */

import { CustomerKYCData } from '../types/credentials';

/**
 * In-memory mock KYC database
 * In production, this would be a real database connection
 */
const kycDatabase: Map<string, CustomerKYCData> = new Map();

// Initialize with sample customers
export function initializeMockDatabase(): void {
  const sampleCustomers: CustomerKYCData[] = [
    {
      kycId: 'KYC-001',
      name: 'Alice Johnson',
      dateOfBirth: '1985-03-15',
      citizenship: 'US',
      address: '123 Wall Street, New York, NY 10005',
      kycLevel: 'enhanced',
      amlScreening: 'passed',
      sanctionsCheck: 'passed',
      pepScreening: 'passed',
      sourceOfFunds: 'verified',
      accreditedInvestor: true,
      entityType: 'individual',
      verifiedAmount: 5000000,
      currency: 'USD',
      tier: 2,
      jurisdictions: ['US'],
      userDid: 'did:did3:user:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
    },
    {
      kycId: 'KYC-002',
      name: 'Bob Smith',
      dateOfBirth: '1990-07-22',
      citizenship: 'US',
      address: '456 Market Street, San Francisco, CA 94102',
      kycLevel: 'basic',
      amlScreening: 'passed',
      sanctionsCheck: 'passed',
      pepScreening: 'passed',
      sourceOfFunds: 'verified',
      accreditedInvestor: false,
      entityType: 'individual',
      verifiedAmount: 100000,
      currency: 'USD',
      tier: 3,
      jurisdictions: ['US'],
      userDid: 'did:did3:user:0x8f3e4d5c6b7a8901234567890abcdef12345678'
    },
    {
      kycId: 'KYC-003',
      name: 'Acme Corporation',
      dateOfBirth: '2010-01-01',
      citizenship: 'US',
      address: '789 Corporate Blvd, Chicago, IL 60601',
      kycLevel: 'institutional',
      amlScreening: 'passed',
      sanctionsCheck: 'passed',
      pepScreening: 'passed',
      sourceOfFunds: 'verified',
      accreditedInvestor: true,
      entityType: 'corporate',
      verifiedAmount: 50000000,
      currency: 'USD',
      tier: 1,
      jurisdictions: ['US', 'EU'],
      userDid: 'did:did3:user:0xabcdef1234567890abcdef1234567890abcdef12'
    },
    {
      kycId: 'KYC-004',
      name: 'Chen Wei',
      dateOfBirth: '1988-11-30',
      citizenship: 'SG',
      address: '10 Marina Boulevard, Singapore 018983',
      kycLevel: 'enhanced',
      amlScreening: 'passed',
      sanctionsCheck: 'passed',
      pepScreening: 'passed',
      sourceOfFunds: 'verified',
      accreditedInvestor: true,
      entityType: 'individual',
      verifiedAmount: 3000000,
      currency: 'USD',
      tier: 2,
      jurisdictions: ['SG', 'APAC'],
      userDid: 'did:did3:user:0x1234567890abcdef1234567890abcdef12345678'
    },
    {
      kycId: 'KYC-005',
      name: 'Maria Garcia',
      dateOfBirth: '1992-05-18',
      citizenship: 'ES',
      address: 'Calle Gran Via 28, Madrid 28013, Spain',
      kycLevel: 'basic',
      amlScreening: 'passed',
      sanctionsCheck: 'passed',
      pepScreening: 'passed',
      sourceOfFunds: 'verified',
      accreditedInvestor: false,
      entityType: 'individual',
      verifiedAmount: 250000,
      currency: 'EUR',
      tier: 3,
      jurisdictions: ['EU'],
      userDid: 'did:did3:user:0x9876543210fedcba9876543210fedcba98765432'
    }
  ];

  sampleCustomers.forEach(customer => {
    kycDatabase.set(customer.kycId, customer);
  });

  console.log(`Mock KYC database initialized with ${kycDatabase.size} customers`);
}

/**
 * Retrieve customer KYC data by ID
 */
export function getCustomerKYC(kycId: string): CustomerKYCData | null {
  return kycDatabase.get(kycId) || null;
}

/**
 * Add or update customer KYC data
 */
export function upsertCustomerKYC(customer: CustomerKYCData): void {
  kycDatabase.set(customer.kycId, customer);
}

/**
 * Get all customers (for admin purposes)
 */
export function getAllCustomers(): CustomerKYCData[] {
  return Array.from(kycDatabase.values());
}

/**
 * Delete customer KYC data
 */
export function deleteCustomerKYC(kycId: string): boolean {
  return kycDatabase.delete(kycId);
}

/**
 * Search customers by criteria
 */
export function searchCustomers(criteria: {
  kycLevel?: string;
  accreditedInvestor?: boolean;
  entityType?: string;
  jurisdiction?: string;
}): CustomerKYCData[] {
  const customers = Array.from(kycDatabase.values());

  return customers.filter(customer => {
    if (criteria.kycLevel && customer.kycLevel !== criteria.kycLevel) {
      return false;
    }
    if (criteria.accreditedInvestor !== undefined && customer.accreditedInvestor !== criteria.accreditedInvestor) {
      return false;
    }
    if (criteria.entityType && customer.entityType !== criteria.entityType) {
      return false;
    }
    if (criteria.jurisdiction && !customer.jurisdictions.includes(criteria.jurisdiction)) {
      return false;
    }
    return true;
  });
}

// Initialize the database when this module is loaded
initializeMockDatabase();
