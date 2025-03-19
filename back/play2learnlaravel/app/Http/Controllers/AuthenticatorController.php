<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\MailService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;

class AuthenticatorController extends Controller
{
    //
    protected $userService, $mailService;

    public function __construct()
    {
        $this->userService = new UserService();
        $this->mailService = new MailService();
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
            ]);
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

        DB::beginTransaction();

        if ($validator->fails()) {
            Log::error('Errores de validación:', $validator->errors()->toArray());

            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        Log::info('Datos de la solicitud:', $request->all());

        // Lógica para registrar al usuario
        $newUser = $this->userService->createUser($request->all());

        try {
            if (Auth::attempt(['email' => $newUser->email, 'password' => $request->password])) {
                $user = Auth::user();
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            $this->mailService->sendMail($user->name, $user->email, 'people.welcome', ['name' => $user->name]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'user' => $user,
                'token' => $token,
                'message' => 'Usuario registrado exitosamente.'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'errors' => $e->getMessage()
            ]);
        }

    }

    public function googleLogin(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            //return response()->json(['status' => 'success', 'user' => $googleUser]);

            Log::info('Google login attempt', ['email' => $request->input('email')]);

            DB::beginTransaction();

            // Extreure el correu i el nom directament de l'objecte retornat
            $email = $googleUser->getEmail();

            if (!$email) {
                Log::error('Email no encontrado');
                DB::rollBack();
                return response()->json(['status' => 'error', 'message' => 'Email no encontrado']);
            }

            // Comprovar si l'usuari ja existeix
            $user = User::where('email', $email)->first();

            if (!$user) {
                Log::info('Creating new user from Google login', ['email' => $email]);

                // Dades del nou usuari
                $jsonUser = [
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'profile_pic' => $googleUser->getAvatar(),
                    'username' => $googleUser['given_name'],
                    'password' => bcrypt(uniqid() . time()),
                ];

                // Crear el nou usuari
                $user = $this->userService->createUser($jsonUser);
                $user->uuid = uuid_create();
                $user->save();

                $this->mailService->sendMail($user->name, $email, 'google.google_account', ['name' => $user->username, 'uuid' => $user->uuid]);

                if (!$user) {
                    DB::rollBack();
                    return response()->json(['status' => 'error', 'message' => 'Error al crear el usuario']);
                }
            }


            // Iniciar sessió amb l'usuari trobat o creat
            Auth::login($user);

            // Generar el token d'autenticació
            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('Google login successful', ['email' => $email]);

            // Crear l'objecte de dades d'usuari
            $userData = [
                'status' => 'success',
                'user' => $user,
                'token' => $token
            ];

            DB::commit();

            //return response()->json(['status' => 'success', 'userData' => $userData]);

            return redirect()->to('http://localhost:3000/contexts/AuthenticatorContext?data=' . urlencode(json_encode($userData)));

        } catch (\Exception $e) {
            Log::error('Google login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            DB::rollBack();
            return response()->json(['status' => 'error', 'errors' => $e->getMessage()]);
        }
    }


    public function googleRedirect()
    {
        try {

            return Socialite::driver('google')->stateless()->redirect();

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'errors' => $e->getMessage()]);
        }
    }

    public function changePassword(Request $request)
    {
        try {

            $user = User::where('uuid', $request->uuid)->first();

            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'Usuario no encontrado']);
            }

            $user->password = $request->new_password;
            $user->save();

            // Iniciar sessió amb l'usuari trobat o creat
            Auth::login($user);

            // Generar el token d'autenticació
            $token = $user->createToken('auth_token')->plainTextToken;

            // Crear l'objecte de dades d'usuari
            $userData = [
                'status' => 'success',
                'user' => $user,
                'token' => $token
            ];

//            DB::commit();

            //return response()->json(['status' => 'success', 'userData' => $userData]);

            return redirect()->to('http://localhost:3000/contexts/AuthenticatorContext?data=' . urlencode(json_encode($userData)));

//            return redirect()->to('http://localhost:3000/');

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'errors' => $e->getMessage()]);
        }
    }

    public function changePasswordView(Request $request)
    {

        // Verificar el token
        $user = User::where('uuid', $request->uuid)->first();

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Enlace inválido o caducado.']);
        }

        return view('password.change', ['user' => $user]);
    }
}
