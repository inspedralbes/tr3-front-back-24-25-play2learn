<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\MailService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Hash;

class AuthenticatorController extends Controller
{
    //
    protected $userService, $mailService;

    public function __construct()
    {
        $this->userService = new UserService();
        $this->mailService = new MailService();
    }

    /**
     * @group Authentication
     *
     * Inicia sesión con el usuario.
     *
     * @bodyParam user string required El correo electrónico o nombre de usuario del usuario. Ejemplo: johndoe@example.com
     * @bodyParam password string required La contraseña del usuario. Ejemplo: password123
     *
     * @response 201 {
     *     "status": "success",
     *     "user": { "id": 1, "name": "John Doe" },
     *     "token": "your-generated-token",
     *     "message": "Usuario logeado exitosamente."
     * }
     *
     * @response 422 {
     *     "status": "error",
     *     "errors": {
     *         "user": ["El correo electrónico o nombre de usuario no es válido."],
     *         "password": ["La contraseña es incorrecta."]
     *     }
     * }
     */
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

    /**
     * @group Authentication
     *
     * Verifica si el usuario está autenticado.
     *
     * @response 200 {
     *     "status": "success",
     *     "user": { "id": 1, "name": "John Doe" }
     * }
     *
     * @response 401 {
     *     "status": "error",
     *     "message": "Usuario no autenticado."
     * }
     */
    public function checkAuth()
    {
        if (Auth::check()) {
            return response()->json([
                'status' => 'success',
                'user' => Auth::user()
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuario no autenticado.'
            ]);
        }
    }

    /**
     * @group Authentication
     *
     * Cierra la sesión del usuario.
     *
     * @response 200 {
     *     "status": "success",
     *     "message": "Usuario deslogeado exitosamente."
     * }
     */
    public function logout(Request $request)
    {
        $user = Auth::user();
        $user->tokens()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Usuario deslogeado exitosamente.'
        ], 200);
    }

    /**
     * @group Authentication
     *
     * Registra un nuevo usuario.
     *
     * @bodyParam name string required El nombre del usuario. Ejemplo: John Doe
     * @bodyParam username string required El nombre de usuario. Ejemplo: johndoe
     * @bodyParam email string required El correo electrónico del usuario. Ejemplo: johndoe@example.com
     * @bodyParam password string required La contraseña del usuario. Ejemplo: password123
     *
     * @response 201 {
     *     "status": "success",
     *     "user": { "id": 1, "name": "John Doe" },
     *     "token": "your-generated-token"
     * }
     *
     * @response 422 {
     *     "status": "error",
     *     "errors": {
     *         "email": ["The email has already been taken."]
     *     }
     * }
     */
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
                'message' => 'Usuario registrado  exitosamente.'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'errors' => $e->getMessage()
            ]);
        }

    }

    /**
     * @group Authentication
     *
     * Inicia sesión con Google.
     *
     * Este endpoint permite a los usuarios iniciar sesión utilizando su cuenta de Google. Si el usuario no existe, se crea uno nuevo.
     *
     * @response 200 {
     *     "status": "success",
     *     "user": {
     *         "id": 1,
     *         "name": "John Doe",
     *         "email": "johndoe@example.com",
     *         "profile_pic": "http://profilepic.com/pic.jpg",
     *         "username": "johndoe"
     *     },
     *     "token": "your-generated-token"
     * }
     *
     * @response 422 {
     *     "status": "error",
     *     "message": "Email no encontrado"
     * }
     *
     * @response 500 {
     *     "status": "error",
     *     "message": "Error al crear el usuario"
     * }
     */
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

            return redirect()->to(env('NEXT_URL_REDIRECT') . '?data=' . urlencode(json_encode($userData)));

        } catch (\Exception $e) {
            Log::error('Google login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            DB::rollBack();
            return response()->json(['status' => 'error', 'errors' => $e->getMessage()]);
        }
    }

    /**
     * @group Authentication
     *
     * Redirige al usuario a la pantalla de login de Google.
     *
     * Este endpoint redirige al usuario a la pantalla de login de Google para la autenticación.
     *
     * @response 302 {
     *     "status": "success",
     *     "message": "Redirigiendo a Google para autenticación"
     * }
     *
     * @response 500 {
     *     "status": "error",
     *     "message": "Error al redirigir al login de Google"
     * }
     */
    public function googleRedirect()
    {
        try {

            return Socialite::driver('google')->stateless()->redirect();

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'errors' => $e->getMessage()]);
        }
    }

    /**
     * @group Authentication
     *
     * Cambia la contraseña del usuario.
     *
     * Este endpoint permite al usuario cambiar su contraseña utilizando un UUID para identificar al usuario.
     *
     * @bodyParam uuid string required El UUID del usuario. Ejemplo: 123e4567-e89b-12d3-a456-426614174000
     * @bodyParam new_password string required La nueva contraseña del usuario. Ejemplo: newpassword123
     *
     * @response 200 {
     *     "status": "success",
     *     "user": {
     *         "id": 1,
     *         "name": "John Doe",
     *         "email": "johndoe@example.com",
     *         "profile_pic": "http://profilepic.com/pic.jpg",
     *         "username": "johndoe"
     *     },
     *     "token": "your-generated-token"
     * }
     *
     * @response 404 {
     *     "status": "error",
     *     "message": "Usuario no encontrado"
     * }
     */
    public function changePassword(Request $request)
    {
        try {

            $user = User::where('uuid', $request->uuid)->first();

            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'Usuario no encontrado']);
            }

            $user->password = $request->new_password;
            $user->uuid = null;
            $user->save();

            // Iniciar sessió amb l'usuari trobat o creat
            Auth::login($user);

            $user->tokens()->delete();

            // Generar el token d'autenticació
            $token = $user->createToken('auth_token')->plainTextToken;

            // Crear l'objecte de dades d'usuari
            $userData = [
                'status' => 'success',
                'user' => $user,
                'token' => $token
            ];

//            DB::commit();

            return redirect()->to(env('NEXT_URL_REDIRECT') . '?data=' . urlencode(json_encode($userData)));

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

    public function update(Request $request)
    {
        $user = Auth::user();

        // Definimos las reglas de validación con "sometimes" para campos opcionales
        $rules = [
            'email' => 'sometimes|nullable|email',
            'name' => 'sometimes|nullable|string|max:255',
            'username' => 'sometimes|nullable|string|max:255|unique:users,username,' . $user->id,
            'profile_pic' => 'sometimes|nullable|url',
            // Si se quiere cambiar la contraseña, deben venir ambos campos
            'password.current' => 'sometimes|required_with:password.new|string|min:6',
            'password.new' => 'sometimes|required_with:password.current|string|min:6|different:password.current'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ]);
        }

        try {
            // Actualizar solo los campos que vienen en la solicitud
            if ($request->has('email')) {
                $user->email = $request->input('email');
            }
            if ($request->has('name')) {
                $user->name = $request->input('name');
            }
            if ($request->has('username')) {
                $user->username = $request->input('username');
            }
            if ($request->has('profile_pic')) {
                $user->profile_pic = $request->input('profile_pic')
                    ?: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
            }

            // Actualizar contraseña si se proporcionan ambos campos
            if ($request->filled('password.current') && $request->filled('password.new')) {
                if (Hash::check($request->input('password.current'), $user->password)) {
                    $user->password = Hash::make($request->input('password.new'));
                } else {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'La contraseña actual es incorrecta.'
                    ], 400);
                }
            }

            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Usuario actualizado exitosamente.',
                'user' => Auth::user()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'errors' => $e->getMessage()
            ]);
        }
    }

}
