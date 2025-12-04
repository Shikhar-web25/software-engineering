import { z } from "zod";

export const symptomAnalysisRequestSchema = z.object({
  symptoms: z.string().min(1, "Please describe your symptoms"),
  age: z.number().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  duration: z.string().optional(),
  severity: z.enum(["mild", "moderate", "severe"]).optional(),
  additionalInfo: z.string().optional(),
});

export type SymptomAnalysisRequest = z.infer<typeof symptomAnalysisRequestSchema>;

export interface Condition {
  name: string;
  likelihood: "possible" | "probable" | "less likely";
  description: string;
  reasoning: string;
}

export interface OTCCategory {
  category: string;
  description: string;
  whenToUse: string;
  warnings: string[];
}

export interface HomeRemedy {
  name: string;
  instructions: string;
  effectiveness: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  type: "text" | "select" | "boolean";
  options?: string[];
  importance: "critical" | "helpful" | "optional";
}

export interface RedFlag {
  warning: string;
  severity: "urgent" | "emergency";
  action: string;
}

export interface SymptomAnalysisResult {
  id: string;
  timestamp: string;
  inputSymptoms: string;
  conditions: Condition[];
  reasoning: string[];
  otcCategories: OTCCategory[];
  homeRemedies: HomeRemedy[];
  followUpQuestions: FollowUpQuestion[];
  redFlags: RedFlag[];
  disclaimer: string;
}

export interface SymptomHistoryItem {
  id: string;
  timestamp: string;
  symptoms: string;
  conditionCount: number;
  hasRedFlags: boolean;
}

export const commonSymptoms = [
  "Headache",
  "Fever",
  "Cough",
  "Sore throat",
  "Fatigue",
  "Nausea",
  "Stomach pain",
  "Back pain",
  "Joint pain",
  "Muscle aches",
  "Dizziness",
  "Shortness of breath",
  "Chest pain",
  "Runny nose",
  "Congestion",
  "Sneezing",
  "Itchy eyes",
  "Skin rash",
  "Insomnia",
  "Anxiety",
  "Loss of appetite",
  "Diarrhea",
  "Constipation",
  "Bloating",
  "Heartburn",
  "Vomiting",
  "Chills",
  "Night sweats",
  "Swollen lymph nodes",
  "Ear pain",
];
