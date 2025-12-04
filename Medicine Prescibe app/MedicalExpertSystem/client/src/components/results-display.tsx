import { 
  AlertTriangle, 
  Stethoscope, 
  Pill, 
  Leaf, 
  HelpCircle, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Activity
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MedicalDisclaimer } from "./medical-disclaimer";
import type { SymptomAnalysisResult, Condition, OTCCategory, HomeRemedy, FollowUpQuestion, RedFlag } from "@shared/schema";

interface ResultsDisplayProps {
  result: SymptomAnalysisResult;
  onAnswerQuestion?: (questionId: string, answer: string) => void;
}

function RedFlagAlert({ redFlags }: { redFlags: RedFlag[] }) {
  if (redFlags.length === 0) return null;

  const hasEmergency = redFlags.some((rf) => rf.severity === "emergency");

  return (
    <Card 
      className={`border-2 ${
        hasEmergency 
          ? "border-red-500 bg-red-50 dark:bg-red-950/30" 
          : "border-orange-400 bg-orange-50 dark:bg-orange-950/30"
      }`}
      data-testid="red-flags-alert"
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${
            hasEmergency 
              ? "bg-red-100 dark:bg-red-900/50" 
              : "bg-orange-100 dark:bg-orange-900/50"
          }`}>
            <AlertTriangle className={`h-6 w-6 ${
              hasEmergency 
                ? "text-red-600 dark:text-red-400" 
                : "text-orange-600 dark:text-orange-400"
            }`} />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className={`font-bold text-lg ${
                hasEmergency 
                  ? "text-red-800 dark:text-red-200" 
                  : "text-orange-800 dark:text-orange-200"
              }`}>
                {hasEmergency ? "SEEK IMMEDIATE MEDICAL ATTENTION" : "Warning Signs Detected"}
              </h3>
              {hasEmergency && (
                <Badge variant="destructive" className="uppercase text-xs">
                  Emergency
                </Badge>
              )}
            </div>
            
            <div className="space-y-3">
              {redFlags.map((flag, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-md ${
                    flag.severity === "emergency"
                      ? "bg-red-100 dark:bg-red-900/30"
                      : "bg-orange-100 dark:bg-orange-900/30"
                  }`}
                >
                  <p className={`font-medium ${
                    flag.severity === "emergency"
                      ? "text-red-800 dark:text-red-200"
                      : "text-orange-800 dark:text-orange-200"
                  }`}>
                    {flag.warning}
                  </p>
                  <p className={`text-sm mt-1 ${
                    flag.severity === "emergency"
                      ? "text-red-700 dark:text-red-300"
                      : "text-orange-700 dark:text-orange-300"
                  }`}>
                    {flag.action}
                  </p>
                </div>
              ))}
            </div>

            {hasEmergency && (
              <div className="flex flex-wrap gap-3 pt-2">
                <Button 
                  variant="destructive" 
                  size="lg"
                  onClick={() => window.open("tel:911")}
                  data-testid="button-call-emergency"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Emergency (911)
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ConditionCard({ condition }: { condition: Condition }) {
  const [expanded, setExpanded] = useState(false);

  const likelihoodColor = {
    probable: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
    possible: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
    "less likely": "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200",
  };

  return (
    <Card 
      className="hover-elevate cursor-pointer transition-all duration-200"
      onClick={() => setExpanded(!expanded)}
      data-testid={`condition-card-${condition.name.toLowerCase().replace(/\s/g, "-")}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-full bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="font-semibold text-base">{condition.name}</h4>
                <Badge 
                  variant="secondary" 
                  className={likelihoodColor[condition.likelihood]}
                >
                  {condition.likelihood === "probable" ? "May indicate" : 
                   condition.likelihood === "possible" ? "Possibly" : "Less likely"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {condition.description}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {expanded && (
          <div className="mt-4 pt-4 border-t">
            <h5 className="text-sm font-medium mb-2">Reasoning:</h5>
            <p className="text-sm text-muted-foreground">{condition.reasoning}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OTCSection({ categories }: { categories: OTCCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <Card data-testid="otc-section">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Pill className="h-5 w-5 text-muted-foreground" />
          OTC Categories That May Help
        </CardTitle>
        <CardDescription>
          General categories only. Always read labels and consult a pharmacist.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{category.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{category.description}</p>
            <p className="text-sm"><span className="font-medium">When to use:</span> {category.whenToUse}</p>
            {category.warnings.length > 0 && (
              <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-md">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 dark:text-amber-200">
                  {category.warnings.map((w, i) => (
                    <p key={i}>{w}</p>
                  ))}
                </div>
              </div>
            )}
            {index < categories.length - 1 && <Separator className="mt-3" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function HomeRemediesSection({ remedies }: { remedies: HomeRemedy[] }) {
  if (remedies.length === 0) return null;

  return (
    <Card data-testid="home-remedies-section">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Leaf className="h-5 w-5 text-muted-foreground" />
          Home Remedies
        </CardTitle>
        <CardDescription>
          Natural approaches that may provide relief
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {remedies.map((remedy, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">{remedy.name}</p>
                <p className="text-sm text-muted-foreground">{remedy.instructions}</p>
                <p className="text-xs text-muted-foreground italic mt-1">
                  Effectiveness: {remedy.effectiveness}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function FollowUpSection({ 
  questions, 
  onAnswer 
}: { 
  questions: FollowUpQuestion[];
  onAnswer?: (questionId: string, answer: string) => void;
}) {
  if (questions.length === 0) return null;

  const importanceColor = {
    critical: "border-l-red-500",
    helpful: "border-l-blue-500",
    optional: "border-l-gray-300",
  };

  return (
    <Card data-testid="followup-section">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
          Additional Questions
        </CardTitle>
        <CardDescription>
          Answering these can help provide more accurate information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {questions.map((question) => (
          <div 
            key={question.id}
            className={`p-4 border-l-4 bg-muted/30 rounded-r-md ${importanceColor[question.importance]}`}
          >
            <p className="font-medium mb-2">{question.question}</p>
            {question.type === "boolean" && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onAnswer?.(question.id, "yes")}
                  data-testid={`button-answer-${question.id}-yes`}
                >
                  Yes
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onAnswer?.(question.id, "no")}
                  data-testid={`button-answer-${question.id}-no`}
                >
                  No
                </Button>
              </div>
            )}
            {question.type === "select" && question.options && (
              <div className="flex flex-wrap gap-2">
                {question.options.map((option) => (
                  <Button 
                    key={option}
                    variant="outline" 
                    size="sm"
                    onClick={() => onAnswer?.(question.id, option)}
                    data-testid={`button-answer-${question.id}-${option.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ResultsDisplay({ result, onAnswerQuestion }: ResultsDisplayProps) {
  const redFlags = result?.redFlags ?? [];
  const conditions = result?.conditions ?? [];
  const otcCategories = result?.otcCategories ?? [];
  const homeRemedies = result?.homeRemedies ?? [];
  const followUpQuestions = result?.followUpQuestions ?? [];
  const reasoning = result?.reasoning ?? [];

  return (
    <div className="space-y-6" data-testid="results-display">
      {redFlags.length > 0 && (
        <RedFlagAlert redFlags={redFlags} />
      )}

      <MedicalDisclaimer variant="card" />

      <Card data-testid="conditions-section">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-muted-foreground" />
            Possible Conditions
          </CardTitle>
          <CardDescription>
            Based on your symptoms, these conditions may be relevant. This is not a diagnosis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {conditions.length > 0 ? (
            conditions.map((condition, index) => (
              <ConditionCard key={index} condition={condition} />
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Unable to identify specific conditions. Please provide more details about your symptoms.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OTCSection categories={otcCategories} />
        <HomeRemediesSection remedies={homeRemedies} />
      </div>

      <FollowUpSection 
        questions={followUpQuestions} 
        onAnswer={onAnswerQuestion}
      />

      <Card className="bg-muted/30" data-testid="reasoning-section">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {reasoning.map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary font-medium">{index + 1}.</span>
                {reason}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
