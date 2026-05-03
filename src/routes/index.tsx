import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Send, Menu, Sparkles } from "lucide-react";
import { PERSONAS, type PersonaId } from "@/lib/personas";
import { PersonaSidebar } from "@/components/PersonaSidebar";
import { ChatMessage, TypingIndicator, type ChatMsg } from "@/components/ChatMessage";
import { AboutDialog } from "@/components/AboutDialog";
import { chatWithGroq } from "@/server/chat.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "DevMentor AI — AI Mentor for CS Students" },
      { name: "description", content: "Chat with AI personas — Career Advisor, Code Reviewer, and Interview Coach. Built for computer science students." },
    ],
  }),
});

function Index() {
  const [activePersona, setActivePersona] = useState<PersonaId>("career");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatFn = useServerFn(chatWithGroq);

  const persona = useMemo(() => PERSONAS.find((p) => p.id === activePersona)!, [activePersona]);

  useEffect(() => {
    setMessages([]);
  }, [activePersona]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await chatFn({
        data: { systemPrompt: persona.systemPrompt, messages: next },
      });
      if (res.error || !res.reply) {
        toast.error(res.error ?? "No response");
      } else {
        setMessages([...next, { role: "assistant", content: res.reply }]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectPersona = (id: PersonaId) => {
    setActivePersona(id);
    setMobileNavOpen(false);
  };

  const PersonaIcon = persona.icon;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <PersonaSidebar
        active={activePersona}
        onSelect={selectPersona}
        onClear={() => setMessages([])}
        onAbout={() => setAboutOpen(true)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-border bg-background/60 backdrop-blur px-4 py-3">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden h-9 w-9 grid place-items-center rounded-md hover:bg-muted">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-sidebar border-sidebar-border">
              <PersonaSidebar
                active={activePersona}
                onSelect={selectPersona}
                onClear={() => { setMessages([]); setMobileNavOpen(false); }}
                onAbout={() => { setAboutOpen(true); setMobileNavOpen(false); }}
              />
            </SheetContent>
          </Sheet>

          <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
            <PersonaIcon className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold truncate">{persona.name}</h2>
            <p className="text-xs text-muted-foreground truncate">{persona.tagline}</p>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto max-w-3xl flex flex-col gap-5">
            {messages.length === 0 && (
              <div className="text-center py-16">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow mb-4">
                  <Sparkles className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-gradient-primary">{persona.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">{persona.greeting}</p>
              </div>
            )}
            {messages.map((m, i) => (
              <ChatMessage key={i} msg={m} />
            ))}
            {loading && <TypingIndicator />}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border bg-background/60 backdrop-blur px-4 py-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft focus-within:ring-2 focus-within:ring-primary/50 transition">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder={`Message ${persona.name}…`}
                className="flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground max-h-40"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="h-10 w-10 shrink-0 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center shadow-glow disabled:opacity-40 disabled:shadow-none transition hover:scale-105 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Powered by Llama 3.3 70B · Built by Raunak Pandey
            </p>
          </div>
        </div>
      </main>

      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
      <Toaster />
    </div>
  );
}
