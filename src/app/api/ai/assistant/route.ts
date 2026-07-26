import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/ai/gemini-client';
import { ASSISTANT_PROMPT } from '@/lib/ai/assistant-prompt';
import { fetchOpsContext } from '@/lib/ai/data-fetcher';

export async function POST(request: Request) {
  try {
    const { history, message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Fetch the latest context from the database
    const context = await fetchOpsContext();
    const contextString = JSON.stringify(context, null, 2);

    // Build the system prompt with context
    const fullPrompt = `${ASSISTANT_PROMPT}\n\nHere is the current restaurant context:\n${contextString}`;

    // Get a model instance with the system instruction
    const model = (await import('@/lib/ai/gemini-client')).genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: fullPrompt
    });

    // Start a chat session with the model
    const chat = model.startChat({
      history: history || [],
    });

    // Send the user's message
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error('AI Assistant Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
