import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles, Briefcase, Code2, MessagesSquare } from "lucide-react";

export function AboutDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center shadow-glow mb-2">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl">DevMentor AI</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Your personal AI mentor for the CS journey — career guidance, code reviews, and interview prep, powered by Llama 3.3 70B on Groq.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {[
            { icon: Briefcase, title: "Career Advisor", desc: "Roadmaps, internships, resumes." },
            { icon: Code2, title: "Code Reviewer", desc: "Bugs, style, performance, best practices." },
            { icon: MessagesSquare, title: "Interview Coach", desc: "DSA, system design, behavioral." },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3 rounded-lg border border-border bg-background/40 p-3">
              <div className="h-9 w-9 shrink-0 rounded-md bg-muted grid place-items-center">
                <f.icon className="h-4 w-4 text-primary-glow" />
              </div>
              <div>
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground pt-2">
          Crafted with care by <span className="text-foreground font-semibold">Raunak Pandey</span>
        </p>
      </DialogContent>
    </Dialog>
  );
}
