<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cambiar Contraseña</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            text-align: center;
            padding: 50px;
        }

        .container {
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            margin: auto;
        }

        h1 {
            color: #3498db;
        }

        p {
            margin: 15px 0;
        }

        input[type="password"] {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }

        button {
            background-color: #3498db;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

        button:hover {
            background-color: #2980b9;
        }

    </style>
</head>
<body>
<div class="container">
    <h1>Cambiar Contraseña</h1>
    <p>Ingresa tu nueva contraseña para actualizarla.</p>
    <form action="{{ route('change.password') }}" method="POST">
        @csrf
        <input type="hidden" name="id" value="{{ request()->query('id') }}">
        <input type="password" name="new_password" placeholder="Nueva contraseña" required>
        <input type="password" name="confirm_password" placeholder="Confirmar contraseña" required>
        <button type="submit">Guardar Contraseña</button>
    </form>
</div>
</body>
</html>
