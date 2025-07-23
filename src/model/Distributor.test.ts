// Distributor.test.ts
import { Distributor } from "./Distributor";

const isDistributor = (obj: any): obj is Distributor => {
  return (
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.email === "string" &&
    typeof obj.market === "string"
  );
};

describe("Distributor Interface", () => {
  it("should validate a correct Distributor object", () => {
    const validDistributor: Distributor = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      market: "North America",
    };

    expect(isDistributor(validDistributor)).toBe(true);
  });

  it("should invalidate an incorrect Distributor object", () => {
    const invalidDistributor = {
      id: "1", 
      name: "John Doe",
      email: "john@example.com",
      market: "North America",
    };

    expect(isDistributor(invalidDistributor)).toBe(false);
  });

  it("should invalidate an object with missing properties", () => {
    const incompleteDistributor = {
      id: 1,
      name: "John Doe",
    };

    expect(isDistributor(incompleteDistributor)).toBe(false);
  });
});
