import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { SymptomInput } from "@/components/symptom-input";
import { ResultsDisplay } from "@/components/results-display";
import { MedicalDisclaimer } from "@/components/medical-disclaimer";
import { useSymptomHistory } from "@/components/history-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Stethoscope, Shield, Clock, Brain } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { SymptomAnalysisResult, SymptomHistoryItem } from "@shared/schema";

const RESULTS_STORAGE_KEY = "medcheck-results";

function LoadingSkeleton() {
  return (
    <div className="space-y-6" data-testid="loading-skeleton">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-48 rounded-lg" />
        <Skeleton className="h-48 rounded-lg" />
      </div>
      <Skeleton className="h-32 rounded-lg" />
    </div>
  );
}

function FeatureCards() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced symptom analysis using Gemini AI for intelligent health insights",
    },
    {
      icon: Shield,
      title: "Safe & Private",
      description: "No diagnosis provided. Your data stays on your device with local history",
    },
    {
      icon: Clock,
      title: "Quick Results",
      description: "Get possible conditions, remedies, and guidance in seconds",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {features.map((feature) => (
        <Card key={feature.title} className="bg-muted/30">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 rounded-md bg-primary/10">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {feature.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ErrorDisplay({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="border-destructive bg-destructive/5" data-testid="error-display">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-destructive mb-1">Analysis Failed</h3>
            <p className="text-sm text-muted-foreground mb-4">{message}</p>
            <button
              onClick={onRetry}
              className="text-sm text-primary underline-offset-4 hover:underline"
              data-testid="button-retry"
            >
              Try again
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [result, setResult] = useState<SymptomAnalysisResult | null>(null);
  const [lastSymptoms, setLastSymptoms] = useState("");
  const { addToHistory } = useSymptomHistory();

  useEffect(() => {
    const stored = localStorage.getItem(RESULTS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.results) {
          setResult(null);
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const analysisMutation = useMutation({
    mutationFn: async (symptoms: string) => {
      const response = await apiRequest("POST", "/api/analyze", { symptoms });
      const data = await response.json();
      return data as SymptomAnalysisResult;
    },
    onSuccess: (data) => {
      setResult(data);
      
      const historyItem: SymptomHistoryItem = {
        id: data.id,
        timestamp: data.timestamp,
        symptoms: data.inputSymptoms,
        conditionCount: data.conditions?.length ?? 0,
        hasRedFlags: (data.redFlags?.length ?? 0) > 0,
      };
      addToHistory(historyItem);

      const results = JSON.parse(localStorage.getItem(RESULTS_STORAGE_KEY) || "{}");
      results[data.id] = data;
      const keys = Object.keys(results);
      if (keys.length > 20) {
        delete results[keys[0]];
      }
      localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
    },
  });

  const handleAnalyze = (symptoms: string) => {
    setLastSymptoms(symptoms);
    analysisMutation.mutate(symptoms);
  };

  const handleClear = () => {
    setResult(null);
    setLastSymptoms("");
    analysisMutation.reset();
  };

  const handleSelectHistory = (id: string) => {
    const results = JSON.parse(localStorage.getItem(RESULTS_STORAGE_KEY) || "{}");
    if (results[id]) {
      setResult(results[id]);
      setLastSymptoms(results[id].inputSymptoms);
    }
  };

  const handleAnswerQuestion = (questionId: string, answer: string) => {
    if (result) {
      const additionalInfo = `${lastSymptoms}. Additional info: ${answer}`;
      analysisMutation.mutate(additionalInfo);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSelectHistory={handleSelectHistory} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <Stethoscope className="h-10 w-10 text-primary" />
          </div>
          <h1 
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Check Your Symptoms
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe what you're experiencing and get AI-powered insights about possible 
            conditions, home remedies, and when to seek medical care.
          </p>
        </div>

        <div className="space-y-8">
          <SymptomInput 
            onAnalyze={handleAnalyze} 
            isLoading={analysisMutation.isPending}
            onClear={handleClear}
          />

          {analysisMutation.isPending && <LoadingSkeleton />}

          {analysisMutation.isError && (
            <ErrorDisplay 
              message={analysisMutation.error?.message || "Unable to analyze symptoms. Please try again."} 
              onRetry={() => handleAnalyze(lastSymptoms)}
            />
          )}

          {result && !analysisMutation.isPending && (
            <ResultsDisplay 
              result={result} 
              onAnswerQuestion={handleAnswerQuestion}
            />
          )}

          {!result && !analysisMutation.isPending && !analysisMutation.isError && (
            <>
              <MedicalDisclaimer variant="compact" />
              <FeatureCards />
            </>
          )}
        </div>

        <footer className="mt-16 pt-8 border-t text-center">
          <MedicalDisclaimer variant="compact" />
          <p className="text-xs text-muted-foreground mt-4">
            MedCheck - Safe Symptom Checker. Built with care for your health.
          </p>
        </footer>
      </main>
    </div>
  );
}
