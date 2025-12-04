import { Stethoscope, Info } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { HistoryPanel } from "./history-panel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MedicalDisclaimer } from "./medical-disclaimer";

interface HeaderProps {
  onSelectHistory: (id: string) => void;
}

export function Header({ onSelectHistory }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              MedCheck
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Safe Symptom Checker
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                data-testid="button-disclaimer-info"
              >
                <Info className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>About MedCheck</DialogTitle>
                <DialogDescription>
                  Important information about this symptom checker
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <MedicalDisclaimer variant="card" />
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    MedCheck uses AI-powered analysis to help you understand your symptoms.
                    It provides:
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Possible conditions based on symptoms (not diagnoses)</li>
                    <li>General OTC categories (no specific drug recommendations)</li>
                    <li>Home remedy suggestions</li>
                    <li>Important warning signs to watch for</li>
                    <li>Follow-up questions to gather more information</li>
                  </ul>
                  <p className="font-medium pt-2">
                    This tool is designed for informational purposes only and should never 
                    replace professional medical advice.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <HistoryPanel onSelectHistory={onSelectHistory} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
