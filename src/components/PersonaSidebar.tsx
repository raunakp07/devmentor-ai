import { Sparkles, Trash2, Info } from "lucide-react";
import { PERSONAS, type PersonaId } from "@/lib/personas";
import { cn } from "@/lib/utils";

interface Props {
  active: PersonaId;
  onSelect: (id: PersonaId) => void;
  onClear: () => void;
  onAbout: () => void;
}

export function PersonaSidebar({ active, onSelect, onClear, onAbout }: Props) {
  return (
    <aside className="hidden md:flex w-72 shrink-0 flex-col bg-sidebar border-r border-sidebar-border p-4 gap-2">
      <div className="flex items-center gap-2 px-2 py-3">
        <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight">DevMentor AI</h1>
          <p className="text-xs text-muted-foreground">For CS students</p>
        </div>
      </div>

      <div className="mt-2">
        <p className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Personas
        </p>
        <div className="flex flex-col gap-1">
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            const isActive = p.id === active;
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className={cn(
                  "flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
                  "hover:bg-sidebar-accent",
                  isActive && "bg-sidebar-accent shadow-soft ring-1 ring-primary/40",
                )}
              >
                <div
                  className={cn(
                    "h-9 w-9 shrink-0 rounded-md grid place-items-center transition-colors",
                    isActive ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium leading-tight">{p.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.tagline}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-1">
        <button
          onClick={onClear}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <Trash2 className="h-4 w-4" /> Clear chat
        </button>
        <button
          onClick={onAbout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <Info className="h-4 w-4" /> About
        </button>
        <p className="px-3 pt-3 text-[11px] text-muted-foreground">
          Built by <span className="text-foreground font-medium">Raunak Pandey</span>
        </p>
      </div>
    </aside>
  );
}
