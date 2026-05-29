import { jest } from '@jest/globals';

const CACHED_ANAF_DATA = {
  cui: 24049362,
  name: "QUBIZ SRL",
  address: "MUNICIPIUL ORADEA, BIHOR, STR DR. LOUIS PASTEUR, NR.165A",
  registrationNumber: "J2008001563054",
  phone: "",
  fax: "",
  postalCode: "410181",
  caenCode: "6201",
  iban: "",
  registrationState: "INREGISTRAT din data 13.06.2008",
  registrationDate: "2008-06-13",
  fiscalAuthority: "Administratia Judeteana a Finantelor Publice Bihor",
  ownershipForm: "PROPR.PRIVATA-CAPITAL PRIVAT AUTOHTON",
  organizationForm: "PERSOANA JURIDICA",
  legalForm: "SOCIETATE COMERCIALĂ CU RĂSPUNDERE LIMITATĂ",
  vatRegistered: true,
  cashBasisVat: false,
  cashBasisVatStart: null,
  cashBasisVatEnd: null,
  inactive: false,
  inactiveSince: null,
  reactivatedSince: null,
  splitVat: false,
  eFacturaRegistered: false,
  headquartersAddress: {
    street: "Str. Dr. Louis Pasteur",
    number: "165A",
    locality: "Mun. Oradea",
    county: "BIHOR",
    country: "Romania",
    postalCode: "410181"
  },
  fiscalAddress: {
    street: "", number: "", locality: "", county: "", country: "", postalCode: ""
  },
  administrators: [],
  authorizedCaenCodes: ["6201", "6202", "6209", "6311", "7022"],
  onrcStatus: 1048,
  onrcStatusLabel: "Funcțiune"
};

describe('demoanaf.js', () => {
  let demoanaf;

  beforeAll(async () => {
    demoanaf = await import('../../demoanaf.js');
  });

  describe('searchCompany', () => {
    it('should return array of companies for valid brand', async () => {
      const results = await demoanaf.searchCompany('Qubiz');

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('cui');
      expect(results[0]).toHaveProperty('name');
    });

    it('should return empty array for non-existent brand', async () => {
      const results = await demoanaf.searchCompany('NonExistentBrandXYZ123');

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    it('should include statusLabel in results', async () => {
      const results = await demoanaf.searchCompany('Qubiz');

      expect(results[0]).toHaveProperty('statusLabel');
    });
  });

  describe('getCompanyFromANAF', () => {
    it('should return company data for valid CIF with fallback', async () => {
      const data = await demoanaf.getCompanyFromANAFWithFallback('24049362', CACHED_ANAF_DATA);

      expect(data).toBeDefined();
      expect(data.cui).toBe(24049362);
      expect(data.name).toBe('QUBIZ SRL');
      expect(data).toHaveProperty('address');
      expect(data).toHaveProperty('registrationNumber');
    }, 120000);

    it.skip('should throw error for invalid CIF (requires live ANAF API)', async () => {
      await expect(demoanaf.getCompanyFromANAF('99999999')).rejects.toThrow();
    }, 120000);
  });
});
