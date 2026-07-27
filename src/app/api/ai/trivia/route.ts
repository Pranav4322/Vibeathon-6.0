import { NextResponse } from "next/server";
import { geminiModel } from "@/lib/ai/gemini-client";

export async function POST(request: Request) {
  try {
    const prompt = `
      You are a fun, engaging restaurant host. Generate a random, interesting food trivia question.
      It should be moderately difficult (not too easy, not impossible).
      
      Return a JSON object with exactly this structure:
      {
        "question": "The trivia question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 2, // The 0-based index of the correct option in the options array
        "funFact": "A short, fun fact explaining the answer to show if they get it right or wrong."
      }
    `;

    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    const parsedResponse = JSON.parse(responseText);

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("AI Trivia error:", error);
    return NextResponse.json(
      { error: "Failed to generate trivia" },
      { status: 500 }
    );
  }
}
