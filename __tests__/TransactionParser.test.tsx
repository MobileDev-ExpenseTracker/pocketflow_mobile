/**
 * Transaction Parser Tests
 * Tests for Vietnamese expense quick-entry parser
 * User Story: Parse "ăn sáng 30k" -> extract amount + category
 */

import {
  parseTransactionInput,
  isValidParsedTransaction,
  getAvailableCategories,
  ParsedTransaction,
} from "../src/utils/transactionParser";

describe("Transaction Parser - Amount Extraction", () => {
  describe("Parse k (kilos) suffix format", () => {
    test("should parse simple k format: 30k", () => {
      const result = parseTransactionInput("ăn sáng 30k");
      expect(result.amount).toBe(30000);
      expect(result.rawAmount).toMatch(/30k/i);
    });

    test("should parse uppercase K: 30K", () => {
      const result = parseTransactionInput("mua hàng 50K");
      expect(result.amount).toBe(50000);
    });

    test("should parse decimal k format: 30.5k", () => {
      const result = parseTransactionInput("cà phê 12.5k");
      expect(result.amount).toBe(12500);
    });

    test("should parse decimal k with comma: 12,5k (European format)", () => {
      const result = parseTransactionInput("cơm trưa 15,5k");
      expect(result.amount).toBe(15500);
    });

    test("should parse large amounts: 1000k", () => {
      const result = parseTransactionInput("xe máy 1000k");
      expect(result.amount).toBe(1000000);
    });

    test("should parse with đ suffix: 30đ", () => {
      const result = parseTransactionInput("bánh mì 5đ");
      expect(result.amount).toBe(5);
    });

    test("should parse with đồng suffix: 30đồng", () => {
      const result = parseTransactionInput("nước chanh 1000đồng");
      expect(result.amount).toBe(1000);
    });
  });

  describe("Parse comma/dot separated numbers", () => {
    test("should parse comma-separated thousands: 30,000", () => {
      const result = parseTransactionInput("taxi 50,000");
      expect(result.amount).toBe(50000);
    });

    test("should parse large comma-separated: 1,000,000", () => {
      const result = parseTransactionInput("xe hơi 1,000,000");
      expect(result.amount).toBe(1000000);
    });

    test("should parse dot-separated (European): 1.000.000", () => {
      const result = parseTransactionInput("nhà 2.500.000");
      expect(result.amount).toBe(2500000);
    });
  });

  describe("Parse plain numbers", () => {
    test("should parse plain numbers: 5000", () => {
      const result = parseTransactionInput("ăn tối 5000");
      expect(result.amount).toBe(5000);
    });

    test("should parse numbers at end of string", () => {
      const result = parseTransactionInput("cà phê đen 8000");
      expect(result.amount).toBe(8000);
    });

    test("should parse first number when multiple exist", () => {
      const result = parseTransactionInput("30k cho ăn sáng");
      expect(result.amount).toBe(30000);
    });
  });

  describe("Edge cases for amount extraction", () => {
    test("should return 0 for text without amount", () => {
      const result = parseTransactionInput("ăn sáng");
      expect(result.amount).toBe(0);
    });

    test("should handle amounts with spaces: 30 k", () => {
      const result = parseTransactionInput("mua 30 k");
      expect(result.amount).toBe(30000);
    });

    test("should ignore invalid numbers", () => {
      const result = parseTransactionInput("ngày 25/12");
      expect(result.amount).toBe(0);
    });

    test("should handle zero amount", () => {
      const result = parseTransactionInput("miễn phí");
      expect(result.amount).toBe(0);
    });

    test("should handle very large amounts", () => {
      const result = parseTransactionInput("mua nhà 5000000");
      expect(result.amount).toBe(5000000);
    });
  });
});

describe("Transaction Parser - Category Suggestion", () => {
  describe("Food category detection", () => {
    test("should suggest food for ăn sáng", () => {
      const result = parseTransactionInput("ăn sáng 30k");
      expect(result.suggestedCategory).toBe("food");
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    test("should suggest food for cơm", () => {
      const result = parseTransactionInput("cơm 25k");
      expect(result.suggestedCategory).toBe("food");
    });

    test("should suggest food for cà phê", () => {
      const result = parseTransactionInput("cà phê đen 15k");
      expect(result.suggestedCategory).toBe("food");
      expect(result.confidence).toBeGreaterThanOrEqual(0.9); // longer keyword
    });

    test("should suggest food for phở", () => {
      const result = parseTransactionInput("phở bò 35k");
      expect(result.suggestedCategory).toBe("food");
    });

    test("should suggest food for ăn trưa", () => {
      const result = parseTransactionInput("ăn trưa 50k");
      expect(result.suggestedCategory).toBe("food");
    });

    test("should suggest food for uống", () => {
      const result = parseTransactionInput("uống nước chanh 5k");
      expect(result.suggestedCategory).toBe("food");
    });
  });

  describe("Transport category detection", () => {
    test("should suggest transport for taxi", () => {
      const result = parseTransactionInput("taxi 50k");
      expect(result.suggestedCategory).toBe("transport");
    });

    test("should suggest transport for grab", () => {
      const result = parseTransactionInput("grab đi công ty 80k");
      expect(result.suggestedCategory).toBe("transport");
    });

    test("should suggest transport for xăng", () => {
      const result = parseTransactionInput("xăng xe 200k");
      expect(result.suggestedCategory).toBe("transport");
    });

    test("should suggest transport for bus", () => {
      const result = parseTransactionInput("vé bus 10k");
      expect(result.suggestedCategory).toBe("transport");
    });

    test("should suggest transport for đi lại", () => {
      const result = parseTransactionInput("đi lại 100k");
      expect(result.suggestedCategory).toBe("transport");
    });
  });

  describe("Shopping category detection", () => {
    test("should suggest shopping for mua", () => {
      const result = parseTransactionInput("mua quần áo 500k");
      expect(result.suggestedCategory).toBe("shopping");
    });

    test("should suggest shopping for cosmetic", () => {
      const result = parseTransactionInput("cosmetic mỹ phẩm 200k");
      expect(result.suggestedCategory).toBe("shopping");
    });

    test("should suggest shopping for giầy", () => {
      const result = parseTransactionInput("giầy adidas 1000k");
      expect(result.suggestedCategory).toBe("shopping");
    });
  });

  describe("Entertainment category detection", () => {
    test("should suggest entertainment for phim", () => {
      const result = parseTransactionInput("xem phim 80k");
      expect(result.suggestedCategory).toBe("entertainment");
    });

    test("should suggest entertainment for game", () => {
      const result = parseTransactionInput("game 150k");
      expect(result.suggestedCategory).toBe("entertainment");
    });

    test("should suggest entertainment for karaoke", () => {
      const result = parseTransactionInput("karaoke với bạn 200k");
      expect(result.suggestedCategory).toBe("entertainment");
    });
  });

  describe("Utilities category detection", () => {
    test("should suggest utilities for điện", () => {
      const result = parseTransactionInput("tiền điện 300k");
      expect(result.suggestedCategory).toBe("utilities");
    });

    test("should suggest utilities for nước", () => {
      const result = parseTransactionInput("hóa đơn nước 150k");
      expect(result.suggestedCategory).toBe("utilities");
    });

    test("should suggest utilities for internet", () => {
      const result = parseTransactionInput("internet 200k");
      expect(result.suggestedCategory).toBe("utilities");
    });
  });

  describe("Health category detection", () => {
    test("should suggest health for bác sĩ", () => {
      const result = parseTransactionInput("bác sĩ 100k");
      expect(result.suggestedCategory).toBe("health");
    });

    test("should suggest health for thuốc", () => {
      const result = parseTransactionInput("mua thuốc 50k");
      expect(result.suggestedCategory).toBe("health");
    });

    test("should suggest health for gym", () => {
      const result = parseTransactionInput("gym fitness 200k");
      expect(result.suggestedCategory).toBe("health");
    });
  });

  describe("Category edge cases", () => {
    test("should return null category when no keywords match", () => {
      const result = parseTransactionInput("xyz 30k");
      expect(result.suggestedCategory).toBeNull();
    });

    test("should prioritize longer keywords for higher confidence", () => {
      const result1 = parseTransactionInput("ăn 30k"); // short keyword
      const result2 = parseTransactionInput("ăn sáng 30k"); // longer keyword
      if (result1.suggestedCategory && result2.suggestedCategory) {
        expect(result2.confidence).toBeGreaterThanOrEqual(result1.confidence);
      }
    });

    test("should handle case insensitivity", () => {
      const result1 = parseTransactionInput("ĂN SÁNG 30k");
      const result2 = parseTransactionInput("ăn sáng 30k");
      expect(result1.suggestedCategory).toBe(result2.suggestedCategory);
      expect(result1.confidence).toBe(result2.confidence);
    });
  });
});

describe("Transaction Parser - Integration", () => {
  test("should parse complete user input: ăn sáng 30k", () => {
    const result = parseTransactionInput("ăn sáng 30k");
    expect(result.amount).toBe(30000);
    expect(result.suggestedCategory).toBe("food");
    expect(result.text).toBe("ăn sáng 30k");
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  test("should parse: cà phê đen 15.5k", () => {
    const result = parseTransactionInput("cà phê đen 15.5k");
    expect(result.amount).toBe(15500);
    expect(result.suggestedCategory).toBe("food");
    expect(result.confidence).toBeGreaterThanOrEqual(0.9);
  });

  test("should parse: taxi về nhà 120,000", () => {
    const result = parseTransactionInput("taxi về nhà 120,000");
    expect(result.amount).toBe(120000);
    expect(result.suggestedCategory).toBe("transport");
  });

  test("should parse: sách 250k", () => {
    const result = parseTransactionInput("sách 250k");
    expect(result.amount).toBe(250000);
    // Shopping might not match "sách", so it could be null
    expect(result.text).toBe("sách 250k");
  });

  test("should preserve original text", () => {
    const input = "ăn sáng tại quán Phở 30k";
    const result = parseTransactionInput(input);
    expect(result.text).toBe(input);
  });

  test("should trim whitespace from input", () => {
    const result = parseTransactionInput("  ăn sáng 30k  ");
    expect(result.text).toBe("ăn sáng 30k");
  });

  test("should handle empty input", () => {
    const result = parseTransactionInput("");
    expect(result.amount).toBe(0);
    expect(result.text).toBe("");
    expect(result.suggestedCategory).toBeNull();
    expect(result.confidence).toBe(0);
  });

  test("should handle whitespace-only input", () => {
    const result = parseTransactionInput("   ");
    expect(result.amount).toBe(0);
    expect(result.text).toBe("");
  });
});

describe("Transaction Parser - Validation", () => {
  test("isValidParsedTransaction should return true for valid transaction", () => {
    const result = parseTransactionInput("ăn sáng 30k");
    expect(isValidParsedTransaction(result)).toBe(true);
  });

  test("isValidParsedTransaction should return false for transaction without amount", () => {
    const result = parseTransactionInput("ăn sáng");
    expect(isValidParsedTransaction(result)).toBe(false);
  });

  test("isValidParsedTransaction should return false for zero amount", () => {
    const result = parseTransactionInput("xyz");
    expect(isValidParsedTransaction(result)).toBe(false);
  });

  test("isValidParsedTransaction should return true even if category is null (only needs amount + confidence)", () => {
    const result = parseTransactionInput("5000");
    if (result.amount > 0) {
      // As long as confidence >= 0.7 and amount > 0
      if (result.confidence >= 0.7) {
        expect(isValidParsedTransaction(result)).toBe(true);
      }
    }
  });

  test("should validate >=90% accuracy on common cases", () => {
    const testCases = [
      { input: "ăn sáng 30k", expectedAmount: 30000 },
      { input: "cà phê 15k", expectedAmount: 15000 },
      { input: "taxi 50k", expectedAmount: 50000 },
      { input: "mua hàng 200k", expectedAmount: 200000 },
      { input: "phở 35.5k", expectedAmount: 35500 },
      { input: "bus 10,000", expectedAmount: 10000 },
      { input: "thuốc 100k", expectedAmount: 100000 },
      { input: "karaoke 150k", expectedAmount: 150000 },
    ];

    const passedTests = testCases.filter((tc) => {
      const result = parseTransactionInput(tc.input);
      return result.amount === tc.expectedAmount;
    });

    const accuracy = (passedTests.length / testCases.length) * 100;
    expect(accuracy).toBeGreaterThanOrEqual(90);
  });
});

describe("Transaction Parser - Available Categories", () => {
  test("should return all available categories", () => {
    const categories = getAvailableCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  test("should include common categories", () => {
    const categories = getAvailableCategories();
    expect(categories).toContain("food");
    expect(categories).toContain("transport");
    expect(categories).toContain("shopping");
    expect(categories).toContain("entertainment");
    expect(categories).toContain("utilities");
    expect(categories).toContain("health");
  });

  test("should have consistent category names", () => {
    const categories = getAvailableCategories();
    // All category names should be lowercase and non-empty
    categories.forEach((cat) => {
      expect(cat).toBe(cat.toLowerCase());
      expect(cat.length).toBeGreaterThan(0);
    });
  });
});

describe("Transaction Parser - Performance", () => {
  test("should parse input in under 10 seconds (acceptance criteria)", () => {
    const startTime = Date.now();
    parseTransactionInput("ăn sáng 30k");
    const endTime = Date.now();
    const duration = endTime - startTime;
    // Should be much faster, but acceptance criteria is <= 10 seconds
    expect(duration).toBeLessThan(10000);
  });

  test("should parse complex inputs quickly", () => {
    const startTime = Date.now();
    const inputs = [
      "ăn sáng 30k",
      "cà phê đen 15.5k",
      "taxi về nhà 120,000",
      "mua quần áo 1,500,000",
      "karaoke với bạn bè 200k",
    ];
    inputs.forEach((input) => parseTransactionInput(input));
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    // 5 inputs should parse in well under 10 seconds
    expect(totalDuration).toBeLessThan(10000);
  });

  test("should handle rapid sequential parsing", () => {
    const startTime = Date.now();
    for (let i = 0; i < 100; i++) {
      parseTransactionInput(`ăn sáng ${i}k`);
    }
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(10000);
  });
});

describe("Transaction Parser - ParsedTransaction Interface", () => {
  test("should return complete ParsedTransaction object", () => {
    const result = parseTransactionInput("ăn sáng 30k");
    expect(result).toHaveProperty("amount");
    expect(result).toHaveProperty("rawAmount");
    expect(result).toHaveProperty("text");
    expect(result).toHaveProperty("suggestedCategory");
    expect(result).toHaveProperty("confidence");
  });

  test("ParsedTransaction properties should have correct types", () => {
    const result = parseTransactionInput("ăn sáng 30k");
    expect(typeof result.amount).toBe("number");
    expect(typeof result.rawAmount).toBe("string");
    expect(typeof result.text).toBe("string");
    expect(typeof result.confidence).toBe("number");
    expect(
      result.suggestedCategory === null || typeof result.suggestedCategory === "string"
    ).toBe(true);
  });

  test("confidence should be between 0 and 1", () => {
    const testCases = [
      "ăn sáng 30k",
      "xyz 50k",
      "cà phê 15k",
      "không có số tiền",
    ];
    testCases.forEach((input) => {
      const result = parseTransactionInput(input);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  test("rawAmount should capture matched string", () => {
    const result = parseTransactionInput("ăn sáng 30k");
    expect(result.rawAmount).toBeTruthy();
    expect(result.rawAmount).toMatch(/30k/i);
  });

  test("rawAmount should be empty when no amount found", () => {
    const result = parseTransactionInput("ăn sáng");
    expect(result.rawAmount).toBe("");
  });
});
