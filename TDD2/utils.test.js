// utils.test.js
const utils = require("./utils");

describe("Utility Module Testing", () => {
  // 1️⃣ Exact equality matchers
  describe("Exact Equality", () => {
    test("sum(2,2) toBe 4 (pass)", () => {
      expect(utils.sum(2, 2)).toBe(4);
    });

    test("sum(2,2) toBe 5 (fail)", () => {
      expect(utils.sum(2, 2)).toBe(5);
    });

    test("createUser() toEqual expected object (pass)", () => {
      const mockDate = new Date("2020-01-01T00:00:00Z");
      jest.spyOn(global, "Date").mockImplementation(() => mockDate);

      const user = utils.createUser("Alice", 30);
      expect(user).toEqual({
        name: "Alice",
        age: 30,
        createdAt: mockDate,
      });

      jest.restoreAllMocks();
    });

    test("createUser() toEqual wrong object (fail)", () => {
      const mockDate = new Date("2020-01-01T00:00:00Z");
      jest.spyOn(global, "Date").mockImplementation(() => mockDate);

      const user = utils.createUser("Alice", 30);
      expect(user).toEqual({
        name: "Alice",
        age: 25, // wrong age
        createdAt: mockDate,
      });

      jest.restoreAllMocks();
    });

    test("toStrictEqual vs toEqual difference (pass/fail demo)", () => {
      const a = { name: "Bob" };
      const b = { name: "Bob", extra: undefined };

      expect(a).toEqual(b); // passes
      expect(a).not.toStrictEqual(b); // passes (shows difference)
    });
  });

  // 2️⃣ Negation
  describe("Negation (.not)", () => {
    test("sum(1,1) not toBe 3 (pass)", () => {
      expect(utils.sum(1, 1)).not.toBe(3);
    });

    test("sum(1,1) not toBe 2 (fail)", () => {
      expect(utils.sum(1, 1)).not.toBe(2);
    });

    test("string not toMatch regex (pass)", () => {
      expect("hello world").not.toMatch(/bye/);
    });

    test("string not toMatch regex (fail)", () => {
      expect("hello world").not.toMatch(/hello/);
    });
  });

  // 3️⃣ Truthiness
  describe("Truthiness Matchers", () => {
    test("toBeNull (pass)", () => {
      const value = null;
      expect(value).toBeNull();
    });

    test("toBeNull (fail)", () => {
      expect(5).toBeNull();
    });

    test("toBeUndefined (pass)", () => {
      let value;
      expect(value).toBeUndefined();
    });

    test("toBeUndefined (fail)", () => {
      expect("text").toBeUndefined();
    });

    test("toBeDefined (pass)", () => {
      const value = "defined";
      expect(value).toBeDefined();
    });

    test("toBeDefined (fail)", () => {
      let value;
      expect(value).toBeDefined();
    });

    test("toBeTruthy (pass)", () => {
      expect(utils.findInArray([1, 2, 3], 2)).toBeTruthy();
    });

    test("toBeTruthy (fail)", () => {
      expect(utils.findInArray([1, 2, 3], 4)).toBeTruthy();
    });

    test("toBeFalsy (pass)", () => {
      expect(utils.findInArray([1, 2, 3], 4)).toBeFalsy();
    });

    test("toBeFalsy (fail)", () => {
      expect(utils.findInArray([1, 2, 3], 2)).toBeFalsy();
    });
  });

  // 4️⃣ Number matchers
  describe("Number Matchers", () => {
    test("toBeGreaterThan (pass)", () => {
      expect(utils.sum(2, 3)).toBeGreaterThan(4);
    });

    test("toBeGreaterThan (fail)", () => {
      expect(utils.sum(2, 3)).toBeGreaterThan(5);
    });

    test("toBeLessThanOrEqual (pass)", () => {
      expect(utils.approximateDivision(10, 2)).toBeLessThanOrEqual(5);
    });

    test("toBeLessThanOrEqual (fail)", () => {
      expect(utils.approximateDivision(10, 2)).toBeLessThanOrEqual(4);
    });

    test("toBeCloseTo (pass)", () => {
      expect(utils.approximateDivision(0.3, 0.1)).toBeCloseTo(3);
    });

    test("toBeCloseTo (fail)", () => {
      expect(utils.approximateDivision(0.3, 0.1)).toBeCloseTo(2.9, 5);
    });
  });

  // 5️⃣ String matchers
  describe("String Matchers", () => {
    test("toMatch regex (pass)", () => {
      expect("My name is Alice").toMatch(/Alice/);
    });

    test("toMatch regex (fail)", () => {
      expect("My name is Alice").toMatch(/Bob/);
    });

    test("not.toMatch (pass)", () => {
      expect("My name is Alice").not.toMatch(/Bob/);
    });

    test("not.toMatch (fail)", () => {
      expect("My name is Alice").not.toMatch(/Alice/);
    });
  });

  // 6️⃣ Arrays / Iterables
  describe("Iterable Matchers", () => {
    const arr = [1, 2, 3];
    const set = new Set(["apple", "banana", "cherry"]);

    test("toContain (pass)", () => {
      expect(arr).toContain(2);
    });

    test("toContain (fail)", () => {
      expect(arr).toContain(5);
    });

    test("Set toContain (pass)", () => {
      expect(set).toContain("banana");
    });

    test("Set toContain (fail)", () => {
      expect(set).toContain("mango");
    });

    test("not.toContain (pass)", () => {
      expect(arr).not.toContain(10);
    });

    test("not.toContain (fail)", () => {
      expect(arr).not.toContain(1);
    });
  });

  // 7️⃣ Exceptions
  describe("Exception Matchers", () => {
    test("parseJSON throws when no string (pass)", () => {
      expect(() => utils.parseJSON()).toThrow("No JSON string provided");
    });

    test("parseJSON throws (fail case)", () => {
      expect(() => utils.parseJSON()).not.toThrow(); // should fail
    });

    test("parseJSON parses valid JSON (pass)", () => {
      expect(utils.parseJSON('{"a":1}')).toEqual({ a: 1 });
    });

    test("parseJSON parses invalid JSON (fail)", () => {
      expect(() => utils.parseJSON("invalid")).toThrow();
    });
  });
});
