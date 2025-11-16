# VAPI Quick Start - 5 Minute Setup

## Step 1: Get Your FREE VAPI Key (2 minutes)

1. Visit https://vapi.ai
2. Click "Sign Up" (free trial included!)
3. Go to your Dashboard
4. Copy your **Public API Key**

## Step 2: Add Key to Environment (30 seconds)

Create or edit `.env.local`:

```bash
NEXT_PUBLIC_VAPI_PUBLIC_KEY="pk_your_actual_key_here"
```

## Step 3: Restart Your Dev Server (30 seconds)

```bash
# Kill the current server (Ctrl+C)
# Then restart:
npm run dev -- -H 0.0.0.0
```

## Step 4: Test It! (1 minute)

1. Open http://localhost:3000/pillbox
2. Click the microphone button 🎤
3. Allow microphone access when prompted
4. Say: **"What medications are in my pill box?"**
5. Listen to the AI response! 🎉

## What You Can Ask

### On Pillbox Page:
- "What medications do I have?"
- "Tell me about my Tylenol"
- "What are the warnings for Advil?"
- "When is my next dose?"

### On Medicine Page (e.g., /medicine/tylenol):
- "What is the dosage?"
- "What are the side effects?"
- "Can I take this with food?"
- "What's the active ingredient?"

## Safety Features

✅ Agent only knows about YOUR medications
✅ Cannot hallucinate or make up information
✅ Will say "I can only answer based on..." if asked about other drugs
✅ Recommends consulting doctors for medical advice

## Free Tier Info

- **FREE trial credits** on signup
- Approximately **$0.05-0.10 per conversation**
- Perfect for development and personal use
- Only pay for what you use (no monthly fees)

## Troubleshooting

**"VAPI public key not found"**
→ Did you add `NEXT_PUBLIC_VAPI_PUBLIC_KEY` to `.env.local`?
→ Did you restart the server?

**Mic not working**
→ Check browser permissions (should prompt automatically)
→ Try Chrome/Edge (best supported)
→ Make sure you're on HTTPS or localhost

**No audio playing**
→ Check your speakers/headphones
→ Look in browser console for errors
→ Verify VAPI key is valid

## Next Steps

- Read the full guide: `docs/VAPI_INTEGRATION.md`
- Customize the voice and model settings
- Add transcript display to your UI
- Deploy to production!

---

**Need help?** Check the [VAPI docs](https://docs.vapi.ai) or [join their Discord](https://discord.gg/vapi)
