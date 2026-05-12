/**
 * Transaction Parser Utility
 * Parses quick input text like "ăn sáng 30k" into amount and category
 */

export interface ParsedTransaction {
  amount: number;
  rawAmount: string;
  text: string;
  suggestedCategory: string | null;
  confidence: number; // 0-1, confidence level of parsing
}

/**
 * Regex patterns to extract amounts from text
 * Supports: 30k, 30K, 30,000, 30.5k, 100000, etc.
 */
const AMOUNT_PATTERNS = [
  // Match k suffix (most specific, should be first)
  { pattern: /(\d+(?:[.,]\d+)*)\s*k(?:đ)?/i, multiply: 1000 }, // 30k, 30.5k, 1,000k
  // Match đ suffix
  { pattern: /(\d+(?:[.,]\d+)*)\s*(?:đ|đồng)/i, multiply: 1 }, // 30đ, 30đồng
  // Match comma-separated thousands (1,000,000)
  { pattern: /(\d{1,3}(?:[.,]\d{3})+)/i, multiply: 1 }, // 1,000,000 or 1.000.000
  // Match plain numbers last (fallback)
  { pattern: /(\d+)(?:\s|$)/i, multiply: 1 }, // 5000
];


/**
 * Category keywords mapping in Vietnamese
 * Maps common phrases to expense categories
 */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  food: ["ăn", "cơm", "cà phê", "trà", "nước", "bánh", "mì", "phở", "cơm tấm", "bún", "ăn sáng", "ăn trưa", "ăn tối", "uống"],
  transport: ["xe", "taxi", "bus", "đi lại", "xăng", "vé", "vận chuyển", "grab", "be", "gomotor", "fuel"],
  shopping: ["mua", "sắm", "shoping", "hàng", "đồ", "quần áo", "giầy", "túi", "cosmetic"],
  entertainment: ["xem", "chơi", "game", "phim", "nhạc", "vui", "giải trí", "karaoke", "phòng", "cinema"],
  utilities: ["điện", "nước", "internet", "điện thoại", "hóa đơn", "tiền"],
  health: ["bác sĩ", "thuốc", "viện", "y tế", "khám", "chích", "bệnh", "gym", "fitness"],
  other: ["khác", "tạp", "chi phí"],
};

/**
 * Convert amount string to number
 * Handles formats: 30k, 30.5k, 30,000, 1,000,000, etc.
 */
function parseAmount(amountStr: string): number {
  // Remove spaces
  let cleaned = amountStr.trim().replace(/\s/g, "");
  
  // Check if this looks like a comma-separated number (has multiple commas, like 1,000,000)
  // or decimal number (has exactly one comma/dot with <= 2-3 digits after)
  const commaCount = (cleaned.match(/,/g) || []).length;
  const dotCount = (cleaned.match(/\./g) || []).length;
  
  if (commaCount >= 2) {
    // Multiple commas likely indicate thousands separator - remove all commas
    cleaned = cleaned.replace(/,/g, "");
  } else if (commaCount === 1 || dotCount === 1) {
    // Single comma/dot - could be thousands or decimal separator
    // Check what comes after the last comma/dot
    const parts = cleaned.replace(",", ".").split(".");
    if (parts[1] && parts[1].length > 2) {
      // More than 2 digits after separator = thousands separator
      cleaned = cleaned.replace(/,/g, "");
    } else {
      // 1-2 digits after separator = decimal
      cleaned = cleaned.replace(",", ".");
    }
  }
  
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Extract amount from text
 * Returns the first valid amount found
 */
function extractAmount(text: string): { amount: number; matched: string } | null {
  for (const { pattern, multiply } of AMOUNT_PATTERNS) {
    const match = pattern.exec(text);
    if (match && match[1]) {
      const amountStr = match[1];
      const num = parseAmount(amountStr);
      const amount = num * multiply;
      if (amount > 0) {
        return {
          amount: Math.round(amount),
          matched: match[0],
        };
      }
    }
  }
  return null;
}

/**
 * Suggest category based on keywords in text
 * Returns category name and confidence level
 */
function suggestCategory(text: string): { category: string; confidence: number } | null {
  const lowerText = text.toLowerCase();
  let bestMatch: { category: string; confidence: number } | null = null;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        // Higher confidence for exact word match
        const confidence = keyword.length > 3 ? 0.9 : 0.7;

        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = { category, confidence };
        }

        // If we find a longer keyword, boost confidence
        if (keyword.length > 5) {
          return bestMatch; // Early exit for high confidence
        }
      }
    }
  }

  return bestMatch;
}

/**
 * Main parsing function
 * Parses input text and extracts amount + suggested category
 */
export function parseTransactionInput(input: string): ParsedTransaction {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      amount: 0,
      rawAmount: "",
      text: "",
      suggestedCategory: null,
      confidence: 0,
    };
  }

  // Extract amount
  const amountResult = extractAmount(trimmed);
  const amount = amountResult?.amount || 0;

  // Suggest category
  const categoryResult = suggestCategory(trimmed);

  return {
    amount,
    rawAmount: amountResult?.matched || "",
    text: trimmed,
    suggestedCategory: categoryResult?.category || null,
    confidence: categoryResult?.confidence || 0,
  };
}

/**
 * Validate parsed transaction
 * Checks if parsing was successful and meaningful
 */
export function isValidParsedTransaction(parsed: ParsedTransaction): boolean {
  return parsed.amount > 0 && parsed.confidence >= 0.7;
}

/**
 * Get all available categories
 */
export function getAvailableCategories(): string[] {
  return Object.keys(CATEGORY_KEYWORDS);
}
