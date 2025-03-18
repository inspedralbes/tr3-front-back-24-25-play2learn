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
            color: #2ecc71;
        }

        p {
            margin: 15px 0;
        }

        button {
            background-color: #2ecc71;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

        button:hover {
            background-color: #27ae60;
        }
    </style>
</head>
<body>
<div class="container">
    <h1>¡Bienvenido {{ $name }} a Play2Learn!</h1>
    <p>Estamos muy contentos de que te hayas registrado en nuestra plataforma.</p>
    <p>Play2Learn te ofrece una experiencia de aprendizaje divertida y dinámica.</p>
    <p>¡Explora nuestros cursos, gana puntos y alcanza nuevas metas!</p>
    <!--
    <button onclick="location.href='/dashboard'">Ir al Dashboard</button>
    -->
</div>
</body>
</html>
