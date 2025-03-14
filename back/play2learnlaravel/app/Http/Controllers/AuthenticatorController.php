<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthenticatorController extends Controller
{
    //
    protected $userService;

    public function __construct()
    {
        $this->userService = new UserService();
    }

    public function login(Request $request)
    {
        $rules = [
            'user' => 'required',
            'password' => 'required|string',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            Log::error('Errores de validación:', $validator->errors()->toArray());

            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->input('user');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $email = User::where('username', $request->input('user'))->value('email');
        }

        if (!Auth::attempt(['email' => $email, 'password' => $request->password])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Credenciales incorrectas.'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'token' => $token,
            'message' => 'Usuario logeado exitosamente.'
        ], 201);
    }


    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Usuario deslogeado exitosamente.'
        ], 200);
    }

    public function register(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            Log::error('Errores de validación:', $validator->errors()->toArray());

            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        Log::info('Datos de la solicitud:', $request->all());

        // Lógica para registrar al usuario
        $newUser = $this->userService->createUser($request->all());

        try {
            if(Auth::attempt(['email'=>$newUser->email, 'password'=>$request->password])){
                $user = Auth::user();
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'user' => $user,
                'token' => $token,
                'message' => 'Usuario registrado exitosamente.'
            ], 201);
        }catch (\Exception $e){
            return response()->json([
                'status' => 'error',
                'errors' => $e->getMessage()
            ]);
        }

    }
}
