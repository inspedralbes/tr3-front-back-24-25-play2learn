<?php

namespace App\Http\Controllers;

use App\Models\Language;
use Illuminate\Http\Request;
use Lara\Translator;
use Lara\LaraCredentials;


class Translation extends Controller
{

    public function translate(Request $request)
    {
        // Validar la solicitud
        $request->validate([
            'word' => 'required',
            'target' => 'required', // Código ISO de 2 letras (es, en, fr, etc.)
            'source' => 'nullable', // Opcional, Google puede detectar automáticamente
        ]);

        try {
            $code = Language::where('name', $request->target)->first()->code;

            $credentials = new LaraCredentials(env("LARA_API_ID"), env("LARA_API_KEY"));
            $lara = new Translator($credentials);

            // This translates your text from English ("en-US") to Italian ("it-IT").
            $result = $lara->translate($request->word, $request->source, $code);

            // Devolver el resultado
            return response()->json([
                'status' => 'success',
                'result' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al traducir: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener la lista de idiomas soportados
     */
    public function getLanguages(Request $request)
    {
        try {
            // Obtener todos los idiomas soportados
            $languages = $this->translate->languages();

            // Opcionalmente obtener los nombres de los idiomas en un idioma específico
            $targetLanguage = $request->query('display_language', 'es'); // Por defecto en español
            $languagesWithNames = $this->translate->localizedLanguages(['target' => $targetLanguage]);

            return response()->json([
                'languages' => $languagesWithNames
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener idiomas: ' . $e->getMessage()
            ], 500);
        }
    }
}
