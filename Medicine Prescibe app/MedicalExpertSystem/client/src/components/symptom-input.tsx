import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { commonSymptoms } from "@shared/schema";

interface SymptomInputProps {
  onAnalyze: (symptoms: string) => void;
  isLoading: boolean;
  onClear: () => void;
}

export function SymptomInput({ onAnalyze, isLoading, onClear }: SymptomInputProps) {
  const [symptoms, setSymptoms] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSymptoms, setFilteredSymptoms] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const words = symptoms.toLowerCase().split(/[\s,]+/);
    const lastWord = words[words.length - 1];
    
    if (lastWord && lastWord.length >= 2) {
      const filtered = commonSymptoms.filter(
        (symptom) =>
          symptom.toLowerCase().includes(lastWord) &&
          !symptoms.toLowerCase().includes(symptom.toLowerCase())
      );
      setFilteredSymptoms(filtered.slice(0, 6));
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [symptoms]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.trim() && !isLoading) {
      onAnalyze(symptoms.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const words = symptoms.split(/[\s,]+/);
    words.pop();
    const newSymptoms = words.length > 0 
      ? words.join(", ") + ", " + suggestion 
      : suggestion;
    setSymptoms(newSymptoms);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const handleClear = () => {
    setSymptoms("");
    setShowSuggestions(false);
    onClear();
  };

  const handleQuickSymptom = (symptom: string) => {
    if (symptoms.trim()) {
      setSymptoms(symptoms + ", " + symptom);
    } else {
      setSymptoms(symptom);
    }
  };

  const quickSymptoms = ["Headache", "Fever", "Cough", "Fatigue", "Nausea", "Sore throat"];

  return (
    <Card className="w-full" data-testid="symptom-input-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold flex items-center gap-2">
          <Search className="h-6 w-6 text-muted-foreground" />
          Describe Your Symptoms
        </CardTitle>
        <CardDescription className="text-base">
          Enter your symptoms below. Be as specific as possible about what you're experiencing, 
          including duration and severity if known.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., I have a headache that started yesterday, mild fever, and feel tired..."
              className="min-h-32 text-base resize-none"
              data-testid="input-symptoms"
              disabled={isLoading}
            />
            {showSuggestions && filteredSymptoms.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-popover border border-popover-border rounded-md shadow-lg"
                data-testid="symptom-suggestions"
              >
                <div className="p-2">
                  <p className="text-xs text-muted-foreground px-2 pb-2">Suggested symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {filteredSymptoms.map((suggestion) => (
                      <Badge
                        key={suggestion}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                        data-testid={`suggestion-${suggestion.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quick add common symptoms:</p>
            <div className="flex flex-wrap gap-2">
              {quickSymptoms.map((symptom) => (
                <Badge
                  key={symptom}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => handleQuickSymptom(symptom)}
                  data-testid={`quick-symptom-${symptom.toLowerCase().replace(/\s/g, "-")}`}
                >
                  + {symptom}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="submit"
              size="lg"
              className="flex-1 sm:flex-none"
              disabled={!symptoms.trim() || isLoading}
              data-testid="button-analyze"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze Symptoms
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleClear}
              disabled={isLoading}
              data-testid="button-clear"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
