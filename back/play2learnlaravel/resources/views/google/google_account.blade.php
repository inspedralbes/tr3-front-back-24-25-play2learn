<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a Play2Learn</title>
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

        a {
            background-color: #3498db;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            text-decoration: none;
        }

        a:hover {
            background-color: #2980b9;
        }
    </style>
    <script src="{{ asset('js/google.js') }}"></script>
</head>
<body>
<div class="container">
    <h1>Bienvenido {{ $name  }} a Play2Learn</h1>
    <p>¡Hola! Gracias por unirte a nuestra aplicación.</p>
    <p>Como has iniciado sesión con tu cuenta de Google, hemos creado automáticamente una contraseña para ti.</p>
    <p>Si deseas cambiarla, haz clic en el botón de abajo:</p>
{{--    <a href="http://localhost:8000/password/change?{{ $id }}">Cambiar contraseña</a>--}}
    <a href="{{ url('password/change?id=' . $id) }}" style="color: #ffffff">Cambiar contraseña</a>

</div>
</body>
</html>
