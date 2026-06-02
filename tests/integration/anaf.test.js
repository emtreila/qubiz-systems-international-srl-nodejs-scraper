import { getCompanyFromANAF, searchCompany } from "../../src/anaf.js";

describe("ANAF API Integration", () => {
  test("should search for Qubiz", async () => {
    const results = await searchCompany("Qubiz");
    expect(Array.isArray(results)).toBe(true);
  });

  test("should fetch company by CIF", async () => {
    const data = await getCompanyFromANAF("24049362");
    expect(data).toBeDefined();
    if (data) {
      expect(data.name).toBeDefined();
    }
  });
});
