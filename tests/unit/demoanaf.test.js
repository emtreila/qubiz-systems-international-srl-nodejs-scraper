import { searchCompany, getCompanyFromANAFWithFallback } from '../../src/anaf.js';

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

describe('ANAF Module', () => {
  describe('searchCompany', () => {
    it('should return array of companies for valid brand', async () => {
      const results = await searchCompany('Qubiz');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('cui');
      expect(results[0]).toHaveProperty('name');
    });

    it('should return empty array for non-existent brand', async () => {
      const results = await searchCompany('NonExistentBrandXYZ123');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });

  describe('getCompanyFromANAFWithFallback', () => {
    it('should return cached data for invalid CIF', async () => {
      const data = await getCompanyFromANAFWithFallback('0000000', CACHED_ANAF_DATA);
      expect(data).toBeDefined();
      expect(data.cui).toBe(24049362);
      expect(data.name).toBe('QUBIZ SRL');
    }, 15000);
  });
});
