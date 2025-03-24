import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const word = searchParams.get("word");
    const language = searchParams.get("language");


    if (!word || !language) {
        return NextResponse.json({ error: "Falta el parámetro 'word' o 'language'" }, { status: 400 });
    }

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${word}&langpair=${language}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                q: word,
                source: "auto",     // Detecta automáticamente el idioma de origen
                target: language,   // Utiliza el idioma recibido en la solicitud
            }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error("Error en la API de traducción:", errorMessage);
            return NextResponse.json({ error: "Error en la traducción", more: errorMessage }, { status: 500 });
        }

        const data = await response.json();

        return NextResponse.json({ word_translate: data.translatedText });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
