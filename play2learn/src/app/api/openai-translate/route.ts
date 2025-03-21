import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Configurar OpenAI en el backend
const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Asegúrate de tener esta variable en .env.local
});

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const word = searchParams.get("word");
    const language = searchParams.get("language");

    if (!word || !language) {
        return NextResponse.json({ error: "Falta el parámetro 'word' o 'language'" }, { status: 400 });
    }

    const prompt = `Dime si la palabra "${word}" existe en ${language}. Responde solo en formato JSON: {"exists": true} o {"exists": false}.`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 10,
            response_format: "json",
        });

        const output = response.choices[0].message.content;
        return NextResponse.json(JSON.parse(output));
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

