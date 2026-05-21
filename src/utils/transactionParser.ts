
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
  //k suffix
  { pattern: /(\d+(?:[.,]\d+)*)\s*k(?:đ)?/i, multiply: 1000 }, // 30k, 30.5k, 1,000k
  //đ suffix
  { pattern: /(\d+(?:[.,]\d+)*)\s*(?:đ|đồng)/i, multiply: 1 }, // 30đ, 30đồng
  //comma-separated thousands (1,000,000)
  { pattern: /(\d{1,3}(?:[.,]\d{3}){1,})/i, multiply: 1 }, // 1,000,000 or 1.000.000
  //plain numbers last (fallback)
  { pattern: /(\d+)(?:\s|$)/i, multiply: 1 }, // 5000
];


//common phrase
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  food: ["ăn", "cơm", "cà phê", "trà", "nước", "bánh", "mì", "phở", "cơm tấm", "bún", "ăn sáng", "ăn trưa", "ăn tối", "ăn", "uống"],
  transport: ["xe", "taxi", "bus", "đi lại", "xăng", "vé", "vận chuyển", "grab", "be", "gomotor", "fuel",],
  shopping: ["mua", "sắm", "shoping", "hàng", "đồ", "quần áo", "giầy", "túi", "cosmetic"],
  entertainment: ["xem", "chơi", "game", "phim", "nhạc", "vui", "giải trí", "karaoke", "phòng", "cinema"],
  utilities: ["điện", "nước", "internet", "điện thoại", "hóa đơn", "tiền"],
  health: ["bác sĩ", "thuốc", "viện", "y tế", "khám", "chích", "bệnh", "gym", "fitness"],
  other: ["khác", "tạp", "chi phí"],
};

//string to number
function parseAmount(amountStr: string): number {
  // Remove spaces
  let cleaned = amountStr.trim().replace(/\s/g, "");
  
  const commaCount = (cleaned.match(/,/g) || []).length;
  const dotCount = (cleaned.match(/\./g) || []).length;
  
  // If there are multiple dots, European format (1.000.000,00)
  if (dotCount >= 2) {
    // Check if all dot-separated groups have 3 digits
    const groups = cleaned.split('.');
    const isEuropeanFormat = groups.slice(1, -1).every(g => g.length === 3);
    if (isEuropeanFormat) {
      cleaned = cleaned.replace(/\./g, "");
    } else {
      // Mixed or ambiguous
      cleaned = cleaned.replace(/\./g, ",");
    }
  } else if (commaCount >= 2) {
    // Multiple commas likely indicate thousands separator - remove all commas
    cleaned = cleaned.replace(/,/g, "");
  } else if (commaCount === 1 || dotCount === 1) {
    // Single comma/dot - could be thousands or decimal separator
    // Check what comes after the separator
    const parts = cleaned.replace(",", ".").split(".");
    if (parts[1] && parts[1].length > 2) {
      // More than 2 digits after separator = thousands separator
      cleaned = cleaned.replace(/,/g, "").replace(/\./g, "");
    } else {
      // 1-2 digits after separator = decimal
      cleaned = cleaned.replace(",", ".");
    }
  }
  
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

//Extract amount from text using defined patterns
function extractAmount(text: string): { amount: number; matched: string } | null {
  if (/\d{1,2}\/\d{1,2}/.test(text)) {
    for (const { pattern, multiply } of AMOUNT_PATTERNS) {
      if (pattern.source.includes("d+)(?")) continue;
      
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

//suggest category based on keywords
function suggestCategory(text: string): { category: string; confidence: number } | null {
  const lowerText = text.toLowerCase();
  let bestMatch: { category: string; confidence: number; keywordLength: number } | null = null;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        let confidence = 0.7;
        if (keyword.length > 5) confidence = 0.9;
        else if (keyword.length > 3) confidence = 0.8;

        if (!bestMatch || keyword.length > bestMatch.keywordLength || 
            (keyword.length === bestMatch.keywordLength && confidence > bestMatch.confidence)) {
          bestMatch = { category, confidence, keywordLength: keyword.length };
        }

        if (keyword.length > 5) {
          return { category, confidence };
        }
      }
    }
  }

  return bestMatch ? { category: bestMatch.category, confidence: bestMatch.confidence } : null;
}

//Main parsing function
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


export function isValidParsedTransaction(parsed: ParsedTransaction): boolean {
  return parsed.amount > 0 && parsed.confidence >= 0.7;
}


export function getAvailableCategories(): string[] {
  return Object.keys(CATEGORY_KEYWORDS);
}
