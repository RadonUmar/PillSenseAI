# VAPI Voice Agent Integration Guide

This guide explains how to integrate and use the VAPI voice agents in the PillSense medication assistant app.

## Overview

The app uses VAPI (Voice AI Platform) to provide real-time voice interactions with your medications and pill box. The voice agent can answer questions about:
- Medication details (dosage, frequency, warnings, ingredients)
- Your pill box contents
- Upcoming doses and schedules

**Important**: The agent is context-aware and will ONLY answer based on the current page's data. It cannot hallucinate or provide medical advice beyond what's in your medication records.

## Setup Instructions

### 1. Get Your VAPI API Key (FREE)

1. Go to [https://vapi.ai](https://vapi.ai)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your **Public API Key** (safe to use in frontend)

### 2. Configure Environment Variables

Add your VAPI key to `.env.local`:

```bash
NEXT_PUBLIC_VAPI_PUBLIC_KEY="your_vapi_public_key_here"
```

**Note**: The `NEXT_PUBLIC_` prefix makes this available to the frontend. The public key is safe to expose.

### 3. Install Dependencies (Already Done)

The VAPI SDK is already installed:
```bash
npm install @vapi-ai/web
```

## Architecture

### Components

1. **useVapiAgent Hook** (`hooks/useVapiAgent.ts`)
   - Manages VAPI client lifecycle
   - Handles microphone permissions
   - Streams bidirectional audio
   - Provides transcript updates
   - Error handling and cleanup

2. **Context Builders** (`lib/vapi-context.ts`)
   - `buildMedicationContext()` - For individual pill pages
   - `buildPillBoxContext()` - For pillbox page with all meds
   - `buildUpcomingDosesContext()` - For schedule information

3. **MicButton Component** (`components/MicButton.tsx`)
   - Visual feedback (listening/idle/loading states)
   - Pulsing animation when active
   - Spinner during initialization

## Usage Examples

### Example 1: Pillbox Page Integration

```typescript
'use client'

import { useVapiAgent } from '@/hooks/useVapiAgent'
import { buildPillBoxContext, buildUpcomingDosesContext } from '@/lib/vapi-context'
import { MicButton } from '@/components/MicButton'

export default function PillBoxPage() {
  const [medications, setMedications] = useState([])
  const [upcomingDoses, setUpcomingDoses] = useState([])

  // Build context from current page data
  const context = useMemo(() => {
    const pillBoxContext = buildPillBoxContext({
      medications,
      totalMedications: medications.length
    })
    const dosesContext = buildUpcomingDosesContext(upcomingDoses)
    return pillBoxContext + dosesContext
  }, [medications, upcomingDoses])

  // Initialize VAPI agent with context
  const {
    isActive,
    isSpeaking,
    isRequestingPermission,
    toggleSession,
    transcript,
    error
  } = useVapiAgent({
    context,
    onTranscriptUpdate: (transcript) => {
      console.log(`${transcript.role}: ${transcript.text}`)
    },
    onError: (error) => {
      console.error('VAPI error:', error)
    }
  })

  return (
    <div>
      {/* Your page content */}

      {/* Voice Agent Section */}
      <div className="text-center">
        <p>Talk to your Pill Box</p>
        <MicButton
          onClick={toggleSession}
          isListening={isActive}
          isLoading={isRequestingPermission}
        />

        {/* Optional: Show error */}
        {error && <p className="text-red-500">{error.message}</p>}

        {/* Optional: Show transcript */}
        {transcript.length > 0 && (
          <div className="mt-4">
            {transcript.map((t, i) => (
              <p key={i} className={t.role === 'user' ? 'font-bold' : ''}>
                {t.role}: {t.text}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

### Example 2: Individual Medicine Page Integration

```typescript
'use client'

import { useVapiAgent } from '@/hooks/useVapiAgent'
import { buildMedicationContext } from '@/lib/vapi-context'
import { MicButton } from '@/components/MicButton'

export default function MedicinePage({ medicine }) {
  // Build context for this specific medication
  const context = useMemo(() => {
    return buildMedicationContext(medicine)
  }, [medicine])

  // Initialize VAPI agent
  const { isActive, toggleSession, isRequestingPermission } = useVapiAgent({
    context
  })

  return (
    <div>
      <h1>{medicine.name}</h1>

      <div className="text-center">
        <p>Ask your medicine anything</p>
        <MicButton
          onClick={toggleSession}
          isListening={isActive}
          isLoading={isRequestingPermission}
        />
      </div>
    </div>
  )
}
```

## API Reference

### `useVapiAgent(options)`

React hook for managing VAPI voice sessions.

**Parameters:**
- `context` (string, required): The medication data context for the agent
- `publicKey` (string, optional): VAPI public key (defaults to env variable)
- `onSpeechStart` (function, optional): Callback when agent starts speaking
- `onSpeechEnd` (function, optional): Callback when agent stops speaking
- `onTranscriptUpdate` (function, optional): Callback for transcript updates
- `onError` (function, optional): Callback for errors

**Returns:**
- `isActive` (boolean): Whether the session is active
- `isSpeaking` (boolean): Whether the agent is speaking
- `isRequestingPermission` (boolean): Whether requesting mic permission
- `transcript` (array): Conversation transcript
- `error` (Error | null): Any error that occurred
- `startSession()`: Start the voice session
- `stopSession()`: Stop the voice session
- `toggleSession()`: Toggle session on/off
- `clearTranscript()`: Clear the transcript

### Context Builder Functions

#### `buildMedicationContext(medication)`
Creates context for a single medication.

**Parameters:**
- `medication` (object): Medication data with name, dosage, warnings, etc.

**Returns:** (string) Formatted context for VAPI

#### `buildPillBoxContext(pillBoxData)`
Creates context for entire pill box.

**Parameters:**
- `pillBoxData` (object): `{ medications: [], totalMedications: number }`

**Returns:** (string) Formatted context for VAPI

#### `buildUpcomingDosesContext(upcomingDoses)`
Creates context for upcoming dose schedule.

**Parameters:**
- `upcomingDoses` (array): Array of scheduled doses

**Returns:** (string) Formatted context for VAPI

## How It Works

### 1. Context Building
When you open a page, the app serializes the medication data into a structured context string:

```
You are a helpful medication assistant. You can ONLY answer questions about...

MEDICATION INFORMATION:
- Name: Tylenol
- Active Ingredient: Acetaminophen
- Dosage: 500mg
...
```

### 2. Session Initialization
When you click the mic button:
1. Requests microphone permission
2. Initializes VAPI client with your public key
3. Starts a transient assistant (not saved to VAPI dashboard - FREE)
4. Passes the context as a system message
5. Begins streaming audio

### 3. Conversation Flow
- User speaks → Deepgram transcribes → GPT-3.5 generates response → PlayHT synthesizes voice → Browser plays audio
- All happens in real-time with low latency
- Transcripts are available for display

### 4. Safety & Constraints
The system prompt ensures the agent:
- Only answers based on provided data
- Refuses questions about unlisted medications
- Recommends consulting healthcare professionals for medical advice
- Never hallucinates information

## Pricing (Free Tier Available!)

VAPI offers a **free tier** perfect for development and testing:
- Free trial credits on signup
- Pay-as-you-go after trial
- Uses:
  - Deepgram Nova-2 for transcription (~$0.0043/min)
  - OpenAI GPT-3.5-turbo for responses (~$0.001/1k tokens)
  - PlayHT for voice synthesis (~$0.06/1k characters)

**Estimated cost per conversation**: ~$0.05-0.10 for a 2-3 minute interaction

## Troubleshooting

### "VAPI public key not found"
- Make sure `NEXT_PUBLIC_VAPI_PUBLIC_KEY` is set in `.env.local`
- Restart your dev server after adding env variables

### Microphone permission denied
- Check browser settings to allow microphone access
- Try HTTPS instead of HTTP (required for mic on some browsers)

### Agent not responding
- Check browser console for errors
- Verify your VAPI key is valid
- Ensure you have credits/active subscription in VAPI dashboard

### Audio not playing
- Check browser audio permissions
- Verify speakers/headphones are working
- Try a different browser (Chrome recommended)

## Best Practices

1. **Always provide context**: Never start a session without building context first
2. **Handle errors gracefully**: Display user-friendly error messages
3. **Show visual feedback**: Use the MicButton's loading/active states
4. **Cleanup on unmount**: The hook handles this automatically
5. **Test locally first**: Use the free tier to test before deploying
6. **Monitor costs**: Track usage in VAPI dashboard

## Security Notes

- The public key is safe to expose in frontend code
- No sensitive patient data should be in medication records
- All audio is processed by VAPI's secure infrastructure
- Consider implementing rate limiting for production

## Support

For VAPI-specific issues:
- [VAPI Documentation](https://docs.vapi.ai)
- [VAPI Discord](https://discord.gg/vapi)
- [VAPI Support](https://vapi.ai/support)

For app-specific issues:
- Check the console for detailed error logs
- Review the hook implementation in `hooks/useVapiAgent.ts`
- Verify context builders in `lib/vapi-context.ts`
