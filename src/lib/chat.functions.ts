import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GROQ_ENV = "GROQ_API_KEY";

/** Local dev: `process.env` (from `.env.local`). Production Worker: `cloudflare:workers` `env` + populated `process.env`. */
async function groqApiKey(): Promise<string | undefined> {
  const fromProcess = process.env[GROQ_ENV];
  if (typeof fromProcess === "string" && fromProcess.length > 0) return fromProcess;
  try {
    const { env } = await import(/* @vite-ignore */ "cloudflare:workers");
    const fromCf = (env as Record<string, unknown>)[GROQ_ENV];
    if (typeof fromCf === "string" && fromCf.length > 0) return fromCf;
  } catch {
    /* not running under workerd / vite dependency scan */
  }
  return undefined;
}

const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().min(1).max(8000),
});

const InputSchema = z.object({
  systemPrompt: z.string().min(1).max(2000),
  messages: z.array(MessageSchema).min(1).max(40),
});

export const chatWithGroq = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = await groqApiKey();
    if (!apiKey) {
      return { error: "GROQ_API_KEY is not configured.", reply: null };
    }

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          messages: [
            { role: "system", content: data.systemPrompt },
            ...data.messages,
          ],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Groq error", res.status, text);
        return { error: `Groq API error (${res.status})`, reply: null };
      }

      const json = await res.json();
      const reply: string = json.choices?.[0]?.message?.content ?? "";
      return { error: null, reply };
    } catch (e) {
      console.error("chat handler failed", e);
      return { error: "Request failed. Please try again.", reply: null };
    }
  });
