<?php

namespace App\Http\Controllers;

use App\Models\Language;
use Illuminate\Http\Request;
use Lara\Translator;
use Lara\LaraCredentials;


class Translation extends Controller
{

    /**
     * @group Translation
     *
     * Traduce una palabra o frase de un idioma a otro utilizando el servicio de Lara.
     *
     * Este endpoint toma una palabra o frase y la traduce de un idioma a otro. El idioma de origen es opcional y, si no se proporciona, Google puede detectarlo automáticamente.
     *
     * @bodyParam word string required La palabra o frase a traducir. Ejemplo: "Hello"
     * @bodyParam target string required El código ISO de 2 letras del idioma de destino (es, en, fr, etc.). Ejemplo: "es"
     * @bodyParam source string Opcional El código ISO de 2 letras del idioma de origen (en, fr, etc.). Ejemplo: "en". Si no se proporciona, se detectará automáticamente.
     *
     * @response 200 {
     *     "status": "success",
     *     "result": "Hola"
     * }
     *
     * @response 422 {
     *     "status": "error",
     *     "message": "La palabra o idioma de destino no puede estar vacío"
     * }
     *
     * @response 500 {
     *     "error": "Error al traducir: Error en la API de Lara"
     * }
     */
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
     * @group Translation
     *
     * Obtiene la lista de idiomas soportados por el servicio de Lara.
     *
     * Este endpoint devuelve todos los idiomas soportados para traducción. También permite obtener los nombres de los idiomas en un idioma específico.
     *
     * @queryParam display_language string El idioma en el que se mostrarán los nombres de los idiomas soportados. Por defecto, es 'es' (español). Ejemplo: "es"
     *
     * @response 200 {
     *     "languages": [
     *         {
     *             "code": "en",
     *             "name": "Inglés"
     *         },
     *         {
     *             "code": "es",
     *             "name": "Español"
     *         }
     *     ]
     * }
     *
     * @response 500 {
     *     "error": "Error al obtener idiomas: Error en la API de Lara"
     * }
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
