<?php

namespace App\Http\Controllers;
use App\Models\StatsUserLanguage;
use Illuminate\Http\Request;

class StatsUserLanguageController extends Controller
{
    public function index()
    {
        try {
            $languages = StatsUserLanguage::select('id', 'name')->get();
            return response()->json($languages);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()]);
        }
    }
}
