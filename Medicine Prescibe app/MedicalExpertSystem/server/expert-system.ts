import type { SymptomAnalysisResult, Condition, OTCCategory, HomeRemedy, FollowUpQuestion, RedFlag } from "@shared/schema";

interface SymptomRule {
  symptoms: string[];
  conditions: Condition[];
  otcCategories: OTCCategory[];
  homeRemedies: HomeRemedy[];
  redFlags: RedFlag[];
}

const symptomRules: SymptomRule[] = [
  {
    symptoms: ["headache", "head pain", "migraine"],
    conditions: [
      {
        name: "Tension Headache",
        likelihood: "probable",
        description: "Common headache caused by muscle tension or stress",
        reasoning: "Tension headaches are the most common type, often triggered by stress, poor posture, or lack of sleep",
      },
      {
        name: "Migraine",
        likelihood: "possible",
        description: "Recurring headaches with additional symptoms",
        reasoning: "May indicate migraine if accompanied by sensitivity to light, nausea, or throbbing pain",
      },
    ],
    otcCategories: [
      {
        category: "Pain reliever (like paracetamol/acetaminophen)",
        description: "May help reduce headache pain",
        whenToUse: "For mild to moderate headache pain",
        warnings: ["Do not exceed recommended dose", "Consult pharmacist if taking other medications"],
      },
    ],
    homeRemedies: [
      { name: "Rest in a dark, quiet room", instructions: "Reduce light and noise stimulation", effectiveness: "Often helpful for tension headaches" },
      { name: "Apply cold compress", instructions: "Apply to forehead for 15-20 minutes", effectiveness: "May provide relief" },
      { name: "Stay hydrated", instructions: "Drink plenty of water", effectiveness: "Dehydration can cause headaches" },
    ],
    redFlags: [],
  },
  {
    symptoms: ["fever", "high temperature", "chills"],
    conditions: [
      {
        name: "Viral Infection",
        likelihood: "probable",
        description: "Common cause of fever, often self-limiting",
        reasoning: "Viral infections are a frequent cause of fever and typically resolve on their own",
      },
      {
        name: "Bacterial Infection",
        likelihood: "possible",
        description: "May require medical treatment",
        reasoning: "If fever persists or is high, bacterial infection should be considered",
      },
    ],
    otcCategories: [
      {
        category: "Fever reducer (like paracetamol/acetaminophen)",
        description: "May help reduce fever and discomfort",
        whenToUse: "For fever over 38°C (100.4°F) with discomfort",
        warnings: ["Follow dosage instructions carefully", "Seek medical advice for fever over 39.4°C (103°F)"],
      },
    ],
    homeRemedies: [
      { name: "Rest", instructions: "Get plenty of rest to help your body fight infection", effectiveness: "Essential for recovery" },
      { name: "Stay hydrated", instructions: "Drink water, clear broths, or electrolyte drinks", effectiveness: "Prevents dehydration" },
      { name: "Cool compress", instructions: "Apply to forehead and neck", effectiveness: "May provide comfort" },
    ],
    redFlags: [
      { warning: "Fever over 39.4°C (103°F) in adults", severity: "urgent", action: "Contact a healthcare provider" },
      { warning: "Fever lasting more than 3 days", severity: "urgent", action: "Seek medical evaluation" },
    ],
  },
  {
    symptoms: ["cough", "coughing"],
    conditions: [
      {
        name: "Common Cold",
        likelihood: "probable",
        description: "Upper respiratory viral infection",
        reasoning: "Cough is a common symptom of viral respiratory infections",
      },
      {
        name: "Bronchitis",
        likelihood: "possible",
        description: "Inflammation of the bronchial tubes",
        reasoning: "May develop if cough persists or produces mucus",
      },
    ],
    otcCategories: [
      {
        category: "Cough suppressant",
        description: "May help reduce dry cough frequency",
        whenToUse: "For dry, non-productive cough disrupting sleep",
        warnings: ["Not recommended for productive coughs", "Check with pharmacist if you have asthma"],
      },
      {
        category: "Throat lozenges",
        description: "May soothe irritated throat",
        whenToUse: "For throat irritation from coughing",
        warnings: ["May contain sugar", "Keep away from young children"],
      },
    ],
    homeRemedies: [
      { name: "Honey", instructions: "Take 1-2 teaspoons of honey (not for children under 1)", effectiveness: "May help soothe cough" },
      { name: "Steam inhalation", instructions: "Breathe steam from hot water for 10-15 minutes", effectiveness: "May loosen congestion" },
      { name: "Stay hydrated", instructions: "Warm liquids can soothe throat", effectiveness: "Helps thin mucus" },
    ],
    redFlags: [
      { warning: "Coughing up blood", severity: "emergency", action: "Seek immediate medical attention" },
      { warning: "Severe difficulty breathing", severity: "emergency", action: "Call emergency services immediately" },
    ],
  },
  {
    symptoms: ["sore throat", "throat pain", "difficulty swallowing"],
    conditions: [
      {
        name: "Viral Pharyngitis",
        likelihood: "probable",
        description: "Viral throat infection",
        reasoning: "Most sore throats are caused by viral infections",
      },
      {
        name: "Strep Throat",
        likelihood: "possible",
        description: "Bacterial throat infection",
        reasoning: "May be strep if fever is present and no cough; requires medical diagnosis",
      },
    ],
    otcCategories: [
      {
        category: "Pain reliever (like paracetamol)",
        description: "May reduce throat pain and fever",
        whenToUse: "For pain and discomfort",
        warnings: ["Follow dosage instructions"],
      },
      {
        category: "Throat spray or lozenges",
        description: "May provide temporary relief",
        whenToUse: "For localized throat pain",
        warnings: ["Temporary relief only"],
      },
    ],
    homeRemedies: [
      { name: "Salt water gargle", instructions: "Gargle with 1/2 teaspoon salt in warm water", effectiveness: "May reduce swelling" },
      { name: "Warm liquids", instructions: "Drink warm tea, broth, or water with honey", effectiveness: "Soothes throat" },
      { name: "Rest your voice", instructions: "Minimize talking to rest vocal cords", effectiveness: "Helps healing" },
    ],
    redFlags: [
      { warning: "Difficulty breathing or swallowing", severity: "emergency", action: "Seek immediate medical care" },
      { warning: "Severe pain or inability to open mouth", severity: "urgent", action: "Contact healthcare provider" },
    ],
  },
  {
    symptoms: ["nausea", "vomiting", "upset stomach"],
    conditions: [
      {
        name: "Viral Gastroenteritis",
        likelihood: "probable",
        description: "Stomach flu caused by viral infection",
        reasoning: "Common cause of nausea and vomiting, usually self-limiting",
      },
      {
        name: "Food Poisoning",
        likelihood: "possible",
        description: "Illness from contaminated food",
        reasoning: "Consider if symptoms started after eating suspicious food",
      },
    ],
    otcCategories: [
      {
        category: "Oral rehydration solution",
        description: "Replaces lost fluids and electrolytes",
        whenToUse: "During and after vomiting episodes",
        warnings: ["Essential to prevent dehydration"],
      },
      {
        category: "Anti-nausea medication",
        description: "May reduce nausea symptoms",
        whenToUse: "For persistent nausea",
        warnings: ["Consult pharmacist for appropriate type", "May cause drowsiness"],
      },
    ],
    homeRemedies: [
      { name: "BRAT diet", instructions: "Eat bananas, rice, applesauce, toast when able", effectiveness: "Easy to digest foods" },
      { name: "Ginger", instructions: "Ginger tea or ginger ale may help", effectiveness: "Traditional nausea remedy" },
      { name: "Small sips", instructions: "Sip clear fluids slowly", effectiveness: "Prevents dehydration" },
    ],
    redFlags: [
      { warning: "Vomiting blood or black material", severity: "emergency", action: "Seek emergency care immediately" },
      { warning: "Signs of severe dehydration (no urination, extreme thirst, confusion)", severity: "emergency", action: "Call emergency services" },
      { warning: "Persistent vomiting for more than 24 hours", severity: "urgent", action: "Contact healthcare provider" },
    ],
  },
  {
    symptoms: ["fatigue", "tired", "exhausted", "no energy"],
    conditions: [
      {
        name: "Sleep Deprivation",
        likelihood: "probable",
        description: "Lack of adequate sleep",
        reasoning: "Most common cause of fatigue in otherwise healthy individuals",
      },
      {
        name: "Viral Illness",
        likelihood: "possible",
        description: "Fighting an infection",
        reasoning: "Fatigue often accompanies viral infections as body fights illness",
      },
      {
        name: "Anemia",
        likelihood: "less likely",
        description: "Low red blood cell count",
        reasoning: "Should be considered if fatigue is persistent; requires blood test",
      },
    ],
    otcCategories: [],
    homeRemedies: [
      { name: "Prioritize sleep", instructions: "Aim for 7-9 hours per night, consistent schedule", effectiveness: "Essential for energy" },
      { name: "Regular exercise", instructions: "Moderate activity can boost energy", effectiveness: "Improves long-term energy" },
      { name: "Balanced diet", instructions: "Eat regular, nutritious meals", effectiveness: "Provides sustained energy" },
    ],
    redFlags: [
      { warning: "Unexplained fatigue lasting more than 2 weeks", severity: "urgent", action: "See a healthcare provider for evaluation" },
      { warning: "Fatigue with shortness of breath or chest pain", severity: "emergency", action: "Seek immediate medical attention" },
    ],
  },
  {
    symptoms: ["chest pain", "chest discomfort", "chest pressure"],
    conditions: [
      {
        name: "Muscle Strain",
        likelihood: "possible",
        description: "Chest wall muscle pain",
        reasoning: "Can occur from physical activity or coughing",
      },
      {
        name: "Gastroesophageal Issue",
        likelihood: "possible",
        description: "Acid reflux or heartburn",
        reasoning: "Can cause chest discomfort similar to other conditions",
      },
    ],
    otcCategories: [],
    homeRemedies: [],
    redFlags: [
      { warning: "Chest pain with shortness of breath, sweating, or arm/jaw pain", severity: "emergency", action: "CALL 911 IMMEDIATELY - possible heart attack" },
      { warning: "Sudden severe chest pain", severity: "emergency", action: "Seek emergency medical care immediately" },
      { warning: "Chest pain that worsens with exertion", severity: "urgent", action: "Contact healthcare provider today" },
    ],
  },
  {
    symptoms: ["dizziness", "lightheaded", "vertigo", "spinning"],
    conditions: [
      {
        name: "Orthostatic Hypotension",
        likelihood: "possible",
        description: "Blood pressure drop when standing",
        reasoning: "Common cause of brief dizziness when changing positions",
      },
      {
        name: "Dehydration",
        likelihood: "possible",
        description: "Insufficient fluid intake",
        reasoning: "Can cause dizziness, especially in warm weather or with illness",
      },
      {
        name: "Inner Ear Issue",
        likelihood: "possible",
        description: "Vestibular problem causing balance issues",
        reasoning: "May cause spinning sensation (vertigo)",
      },
    ],
    otcCategories: [],
    homeRemedies: [
      { name: "Sit or lie down", instructions: "Rest in a safe position until dizziness passes", effectiveness: "Prevents falls" },
      { name: "Hydrate", instructions: "Drink water or electrolyte drinks", effectiveness: "Addresses dehydration" },
      { name: "Rise slowly", instructions: "Move from lying to sitting to standing slowly", effectiveness: "Prevents blood pressure drops" },
    ],
    redFlags: [
      { warning: "Dizziness with slurred speech, vision changes, or weakness", severity: "emergency", action: "CALL 911 - possible stroke" },
      { warning: "Severe vertigo with hearing loss", severity: "urgent", action: "Seek medical evaluation promptly" },
      { warning: "Fainting or near-fainting", severity: "urgent", action: "Contact healthcare provider" },
    ],
  },
];

const defaultFollowUpQuestions: FollowUpQuestion[] = [
  { id: "age", question: "What is your age range?", type: "select", options: ["Under 18", "18-40", "41-60", "Over 60"], importance: "helpful" },
  { id: "duration", question: "How long have you had these symptoms?", type: "select", options: ["Less than 24 hours", "1-3 days", "4-7 days", "More than a week"], importance: "critical" },
  { id: "severity", question: "How would you rate the severity?", type: "select", options: ["Mild", "Moderate", "Severe"], importance: "critical" },
  { id: "medications", question: "Are you currently taking any medications?", type: "boolean", importance: "helpful" },
];

export function analyzeWithRules(symptoms: string): Omit<SymptomAnalysisResult, "id" | "timestamp" | "inputSymptoms" | "disclaimer"> {
  const lowerSymptoms = symptoms.toLowerCase();
  
  const matchedRules: SymptomRule[] = [];
  for (const rule of symptomRules) {
    for (const symptom of rule.symptoms) {
      if (lowerSymptoms.includes(symptom)) {
        matchedRules.push(rule);
        break;
      }
    }
  }

  const conditions: Condition[] = [];
  const otcCategories: OTCCategory[] = [];
  const homeRemedies: HomeRemedy[] = [];
  const redFlags: RedFlag[] = [];
  const reasoning: string[] = [];

  const seenConditions = new Set<string>();
  const seenOTC = new Set<string>();
  const seenRemedies = new Set<string>();
  const seenFlags = new Set<string>();

  for (const rule of matchedRules) {
    for (const condition of rule.conditions) {
      if (!seenConditions.has(condition.name)) {
        conditions.push(condition);
        seenConditions.add(condition.name);
      }
    }
    for (const otc of rule.otcCategories) {
      if (!seenOTC.has(otc.category)) {
        otcCategories.push(otc);
        seenOTC.add(otc.category);
      }
    }
    for (const remedy of rule.homeRemedies) {
      if (!seenRemedies.has(remedy.name)) {
        homeRemedies.push(remedy);
        seenRemedies.add(remedy.name);
      }
    }
    for (const flag of rule.redFlags) {
      if (!seenFlags.has(flag.warning)) {
        redFlags.push(flag);
        seenFlags.add(flag.warning);
      }
    }
  }

  if (matchedRules.length > 0) {
    reasoning.push(`Identified ${matchedRules.length} symptom pattern(s) matching your description`);
    reasoning.push("Analysis based on common medical knowledge patterns");
    reasoning.push("Results are suggestions only and require professional medical evaluation");
  } else {
    reasoning.push("Could not match specific symptom patterns");
    reasoning.push("Please provide more detail about your symptoms");
    reasoning.push("Consider consulting a healthcare provider for proper evaluation");
  }

  return {
    conditions: conditions.slice(0, 5),
    reasoning,
    otcCategories: otcCategories.slice(0, 4),
    homeRemedies: homeRemedies.slice(0, 5),
    followUpQuestions: defaultFollowUpQuestions.slice(0, 4),
    redFlags,
  };
}
