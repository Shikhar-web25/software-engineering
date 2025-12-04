import { GoogleGenAI } from "@google/genai";
import type { SymptomAnalysisResult, Condition, OTCCategory, HomeRemedy, FollowUpQuestion, RedFlag } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "AIzaSyAiMqh7cFWp7ijgtKE2rqeb2OI3IeavHVs" });

const SYSTEM_PROMPT = `You are a safe medical symptom analysis assistant. Your role is to help users understand their symptoms while always prioritizing safety.

CRITICAL RULES:
1. NEVER diagnose conditions - only suggest possibilities
2. NEVER prescribe specific medications or dosages
3. ALWAYS recommend consulting a healthcare provider
4. ALWAYS identify and prominently display red-flag symptoms
5. Use probability language like "may indicate", "possibly", "could suggest"
6. Suggest OTC CATEGORIES only (e.g., "pain reliever like paracetamol", "antacid"), never specific brands or dosages
7. Include appropriate warnings with any OTC suggestions

When analyzing symptoms, provide:
1. Possible conditions with likelihood (probable, possible, less likely) and reasoning
2. OTC categories that may help (with warnings)
3. Home remedies with instructions
4. Follow-up questions to gather more information
5. Red flags that require immediate medical attention

Your response must be a valid JSON object with this exact structure:
{
  "conditions": [
    {
      "name": "Condition Name",
      "likelihood": "probable|possible|less likely",
      "description": "Brief description",
      "reasoning": "Why this condition may be relevant"
    }
  ],
  "reasoning": ["Step by step reasoning points"],
  "otcCategories": [
    {
      "category": "Category name (e.g., Pain reliever)",
      "description": "What it does",
      "whenToUse": "When to consider using",
      "warnings": ["Warning 1", "Warning 2"]
    }
  ],
  "homeRemedies": [
    {
      "name": "Remedy name",
      "instructions": "How to apply",
      "effectiveness": "Expected effectiveness"
    }
  ],
  "followUpQuestions": [
    {
      "id": "unique_id",
      "question": "The question",
      "type": "boolean|select|text",
      "options": ["Option 1", "Option 2"],
      "importance": "critical|helpful|optional"
    }
  ],
  "redFlags": [
    {
      "warning": "The warning",
      "severity": "urgent|emergency",
      "action": "What to do"
    }
  ]
}`;

export async function analyzeSymptoms(symptoms: string): Promise<Omit<SymptomAnalysisResult, "id" | "timestamp" | "inputSymptoms" | "disclaimer">> {
  try {
    const userPrompt = `Analyze these symptoms and provide structured health information:

SYMPTOMS: ${symptoms}

Remember:
- Do NOT diagnose, only suggest possibilities
- Do NOT prescribe specific medications or dosages
- ALWAYS check for red-flag symptoms that need immediate attention
- Use cautious, probability-based language
- Provide helpful but safe guidance

Respond with valid JSON only.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
      contents: userPrompt,
    });

    const rawJson = response.text;

    if (!rawJson) {
      throw new Error("Empty response from AI model");
    }

    const cleanedJson = rawJson.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleanedJson);

    return {
      conditions: validateConditions(parsed.conditions || []),
      reasoning: Array.isArray(parsed.reasoning) ? parsed.reasoning : [],
      otcCategories: validateOTCCategories(parsed.otcCategories || []),
      homeRemedies: validateHomeRemedies(parsed.homeRemedies || []),
      followUpQuestions: validateFollowUpQuestions(parsed.followUpQuestions || []),
      redFlags: validateRedFlags(parsed.redFlags || []),
    };
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw new Error("Failed to analyze symptoms. Please try again.");
  }
}

function validateConditions(conditions: any[]): Condition[] {
  return conditions.slice(0, 5).map((c, i) => ({
    name: String(c.name || `Condition ${i + 1}`),
    likelihood: ["probable", "possible", "less likely"].includes(c.likelihood) 
      ? c.likelihood 
      : "possible",
    description: String(c.description || ""),
    reasoning: String(c.reasoning || ""),
  }));
}

function validateOTCCategories(categories: any[]): OTCCategory[] {
  return categories.slice(0, 4).map((c) => ({
    category: String(c.category || ""),
    description: String(c.description || ""),
    whenToUse: String(c.whenToUse || ""),
    warnings: Array.isArray(c.warnings) ? c.warnings.map(String) : [],
  }));
}

function validateHomeRemedies(remedies: any[]): HomeRemedy[] {
  return remedies.slice(0, 5).map((r) => ({
    name: String(r.name || ""),
    instructions: String(r.instructions || ""),
    effectiveness: String(r.effectiveness || "May provide relief"),
  }));
}

function validateFollowUpQuestions(questions: any[]): FollowUpQuestion[] {
  return questions.slice(0, 4).map((q, i) => ({
    id: String(q.id || `q_${i}`),
    question: String(q.question || ""),
    type: ["boolean", "select", "text"].includes(q.type) ? q.type : "boolean",
    options: Array.isArray(q.options) ? q.options.map(String) : undefined,
    importance: ["critical", "helpful", "optional"].includes(q.importance) 
      ? q.importance 
      : "helpful",
  }));
}

function validateRedFlags(flags: any[]): RedFlag[] {
  return flags.map((f) => ({
    warning: String(f.warning || ""),
    severity: f.severity === "emergency" ? "emergency" : "urgent",
    action: String(f.action || "Consult a healthcare provider"),
  }));
}
