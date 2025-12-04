import { AlertTriangle, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MedicalDisclaimerProps {
  variant?: "banner" | "card" | "compact";
}

export function MedicalDisclaimer({ variant = "card" }: MedicalDisclaimerProps) {
  if (variant === "banner") {
    return (
      <div 
        className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-3"
        role="alert"
        data-testid="disclaimer-banner"
      >
        <div className="max-w-4xl mx-auto flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <span className="font-semibold">Medical Disclaimer:</span> This tool provides general health information only and is{" "}
            <span className="font-semibold">not a substitute for professional medical diagnosis, advice, or treatment</span>. 
            Always consult a qualified healthcare provider for medical concerns.
          </p>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div 
        className="flex items-center gap-2 text-muted-foreground"
        data-testid="disclaimer-compact"
      >
        <Info className="h-4 w-4 flex-shrink-0" />
        <p className="text-xs">
          Not a substitute for professional medical advice. Always consult a healthcare provider.
        </p>
      </div>
    );
  }

  return (
    <Card 
      className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20"
      data-testid="disclaimer-card"
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200">
              Important Medical Disclaimer
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
              This symptom checker provides <span className="font-medium">general health information only</span>. 
              It does not provide medical diagnoses and is not a substitute for professional medical advice, 
              diagnosis, or treatment. Always seek the advice of your physician or other qualified health 
              provider with any questions you may have regarding a medical condition.
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300 font-medium pt-1">
              If you think you may have a medical emergency, call your doctor or emergency services immediately.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
