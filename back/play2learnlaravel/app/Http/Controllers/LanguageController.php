<?php

namespace App\Http\Controllers;

use App\Models\Language;

use Illuminate\Http\Request;

class LanguageController extends Controller
{
    public function index()
    {
        try{
            $languages = Language::all();

            return response()->json([
                'status' => 'success',
                'message' => 'Languages list',
                'languages' => $languages
            ]);
        }catch (\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }

    }
}
