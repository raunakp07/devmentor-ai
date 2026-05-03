# DevMentor AI

## Local development

Create `.env.local` or `.dev.vars` with:

```txt
GROQ_API_KEY=your_groq_key_here
```

Then run:

```sh
npm run dev
```

## Cloudflare deployment

`.env.local` and `.dev.vars` are local-only files. Cloudflare does not upload them during deploy, so the deployed Worker needs its own secret:

```sh
npm run cf:secret
npm run deploy
```

When prompted by Wrangler, paste the Groq API key. You can also set `GROQ_API_KEY` from the Cloudflare dashboard under the `devmentor-ai` Worker settings in Variables and Secrets.
