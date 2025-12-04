import type { Express } from "express";
import { createServer, type Server } from "http";
import { randomUUID } from "crypto";
import { symptomAnalysisRequestSchema } from "@shared/schema";
import type { SymptomAnalysisResult } from "@shared/schema";
import { analyzeSymptoms } from "./gemini";
import { analyzeWithRules } from "./expert-system";

const MEDICAL_DISCLAIMER = "This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read here. If you think you may have a medical emergency, call your doctor or emergency services immediately.";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/analyze", async (req, res) => {
    try {
      const parsed = symptomAnalysisRequestSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: parsed.error.flatten() 
        });
      }

      const { symptoms } = parsed.data;
      const id = randomUUID();
      const timestamp = new Date().toISOString();

      let analysisResult: Omit<SymptomAnalysisResult, "id" | "timestamp" | "inputSymptoms" | "disclaimer">;

      if (process.env.GEMINI_API_KEY) {
        try {
          analysisResult = await analyzeSymptoms(symptoms);
        } catch (error) {
          console.error("Gemini API error, falling back to rule-based:", error);
          analysisResult = analyzeWithRules(symptoms);
        }
      } else {
        analysisResult = analyzeWithRules(symptoms);
      }

      const result: SymptomAnalysisResult = {
        id,
        timestamp,
        inputSymptoms: symptoms,
        disclaimer: MEDICAL_DISCLAIMER,
        ...analysisResult,
      };

      res.json(result);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ 
        error: "Failed to analyze symptoms",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "ok", 
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString()
    });
  });

  return httpServer;
}
