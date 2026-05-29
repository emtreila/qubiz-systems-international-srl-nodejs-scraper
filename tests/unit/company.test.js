import { getCompanyBrand } from "../../company.js";

describe("getCompanyBrand", () => {
  test("should return Qubiz", () => {
    expect(getCompanyBrand()).toBe("Qubiz");
  });
});
