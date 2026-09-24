const DEFAULT_ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const buildPrompt = ({ task, input }) => `You are an e-commerce recommendation engine for ShopEZ.\nTask: ${task}\nInput: ${input}\nReturn strict JSON only with this shape: {\"description\":string,\"keywords\":string[],\"categories\":string[],\"brands\":string[]}. Keep arrays short and relevant.`;

const cleanWords = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);

const fallbackInsights = (text = "") => {
  const keywords = [...new Set(cleanWords(text))].slice(0, 8);
  return {
    description: text || "General shopping request",
    keywords,
    categories: [],
    brands: [],
  };
};

const parseJSONFromText = (text = "") => {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
};

const normalizeInsights = (insights, fallbackText) => {
  if (!insights || typeof insights !== "object") return fallbackInsights(fallbackText);

  const toArray = (value) =>
    Array.isArray(value)
      ? [...new Set(value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim()))]
      : [];

  return {
    description:
      typeof insights.description === "string" && insights.description.trim()
        ? insights.description.trim()
        : fallbackText || "General shopping request",
    keywords: toArray(insights.keywords).slice(0, 10),
    categories: toArray(insights.categories).slice(0, 6),
    brands: toArray(insights.brands).slice(0, 6),
  };
};

const callClaude = async (task, input) => {
  const apiKey = process.env.CLAUDE_API_KEY;
  const apiUrl = process.env.ANTHROPIC_API_URL || DEFAULT_ANTHROPIC_API_URL;

  if (!apiKey) return fallbackInsights(input);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-latest",
        max_tokens: 400,
        temperature: 0.2,
        messages: [{ role: "user", content: buildPrompt({ task, input }) }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const text = data?.content?.find((part) => part.type === "text")?.text || "";
    return normalizeInsights(parseJSONFromText(text), input);
  } catch (error) {
    console.error("Claude AI fallback used:", error.message);
    return fallbackInsights(input);
  }
};

const analyzeImageQuery = async ({ imageUrl, fileName = "" }) => {
  const input = `Image URL: ${imageUrl || "not available"}. File name: ${fileName || "unknown"}. Describe likely product attributes for catalog search.`;
  return callClaude("Visual search extraction", input);
};

const analyzePurchaseHistory = async (historySummary) =>
  callClaude("Generate personalized recommendations from purchase history", historySummary);

const analyzeMood = async (moodText) =>
  callClaude("Mood based shopping intent understanding", moodText);

module.exports = {
  analyzeImageQuery,
  analyzePurchaseHistory,
  analyzeMood,
};
