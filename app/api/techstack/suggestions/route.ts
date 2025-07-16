import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role')?.trim();
  const level = searchParams.get('level')?.trim();
  const search = searchParams.get('search')?.trim().toLowerCase();

  if (!role || !level) {
    return NextResponse.json({
      success: false,
      message: 'Role and level are required for AI suggestions.',
      data: [],
    }, { status: 400 });
  }

  try {
    // Compose the prompt for Gemini
    let prompt = `You are an expert technical recruiter. Given the job role "${role}" and experience level "${level}", suggest a list of the most relevant and up-to-date technologies, frameworks, tools, and programming languages that should be included in the tech stack for this position. Return only a JSON array of technology names, no explanations or extra text. Example: ["React", "TypeScript", "Node.js", "AWS"]`;
    if (search) {
      prompt += `\nThe user is searching for: "${search}". Prioritize technologies that match or are related to this search term.`;
    }

    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt,
    });

    // Log Gemini's raw response for debugging
    console.log('Gemini raw response:', text);

    let suggestions: string[] = [];
    let parsed = false;
    // Try to parse the AI's response as a JSON array directly
    try {
      suggestions = JSON.parse(text);
      if (Array.isArray(suggestions)) {
        suggestions = suggestions.filter((item) => typeof item === 'string');
        parsed = true;
      }
    } catch {}

    // If direct parse fails, try to extract the first JSON array from the text
    if (!parsed) {
      const match = text.match(/\[([^\]]*)\]/s);
      if (match) {
        try {
          // Add brackets back and parse
          const arr = JSON.parse(`[${match[1]}]`);
          if (Array.isArray(arr)) {
            suggestions = arr.filter((item) => typeof item === 'string');
            parsed = true;
          }
        } catch {}
      }
    }

    if (!parsed) {
      return NextResponse.json({
        success: false,
        message: 'AI did not return a valid list. Please try again.',
        data: [],
      }, { status: 500 });
    }

    // Remove duplicates and trim
    suggestions = [...new Set(suggestions.map((s) => s.trim()))];

    // Optionally filter by search term
    if (search) {
      suggestions = suggestions.filter((tech) => tech.toLowerCase().includes(search));
    }

    // Sort alphabetically
    suggestions.sort();

    return NextResponse.json({
      success: true,
      data: suggestions.slice(0, 50),
    });
  } catch (error) {
    console.error('Error generating AI tech stack suggestions:', error);
    return NextResponse.json({
      success: false,
      message: 'Error generating AI suggestions',
      data: [],
    }, { status: 500 });
  }
} 