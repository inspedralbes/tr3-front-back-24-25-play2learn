# API Documentation

Aquest fitxer README proporciona una descripció detallada dels endpoints de l'API, què fa cadascun, quins paràmetres
necessiten i quines respostes poden retornar.

## Rutas de Autenticación y Gestión de Usuario

### `/auth/register` [POST]

**Descripción:** Registra un nou usuari a la base de dades.

- **Parametros**:
    - `name` (string): El nom de l'usuari.
    - `username`(string): El seudònim de l'usuari.
    - `email` (string): El correu electrònic de l'usuari.
    - `password` (string): La contrasenya de l'usuari.
- **Respuesta:**
    - **200 JSON**
        - **`Status`:** success
        - **`User`:** Informació de l'usuari registrat
        - **`Token`:** Token creat un cop registrat correctament a la base de dades
        - **`message`:** Missatge informatiu
    - **400 Bad Request:** Si les dades proporcionades són incorrectes o el correu ja està en ús.
        - **`Status`:** error
        - **`Errors`:** Especificació de l'error que ha ocorregut.

### `/auth/login` [POST]

**Descripción:** Inicia sessió amb les credencials de l'usuari.

- **Parametros**:
    - `user` (string): El seudònim de l'usuari.
    - `password` (string): La contrasenya de l'usuari.
- **Respuesta:**
    - **200 OK:**
        - **`Status`:** success
        - **`User`:** Informació de l'usuari registrat
        - **`Token`:** Token creat un cop registrat correctament a la base de dades
        - **`message`:** Missatge informatiu
    - **401 Unauthorized:** Credenciales incorrectas.
        - **`Status`:** error
        - **`Errors`:** Especificació de l'error que ha ocorregut.

### `/auth/logout` [POST]

**Descripción:** Tanca la sessió de l'usuari

- **Parametros:**
    - **`Token`** (string): Token de l'usuari loguejat
- **Respuesta:**
    - **200 OK:**
    - **`message`** Usuari desconnectat correctament

### `/auth/google/redirect` [GET]

**Descripción:** Redirigir a l'usuari a Google per l'autentificació

- **Parametros:** No requereix paràmetres addicionals.
- **Respuesta:**
    - **200 OK:** Redirecció a la pàgina d'autenticació de Google.

### `/auth/google/callback` [GET]

**Descripción:** Endpoint que es diu després que l'usuari s'autentiqui amb Google.

- **Parametros:** Els paràmetres arriben des de Google quan posen la nostra conta..
- **Respuesta:**
    - **200 OK:** L'usuari es dona d'alta a la nostra base de dades i envien la informació necessària al front, però que
      guardi les nostres credencials.
        - **`User`**: Informació de l'usuari
    - **400 Bad Request:**
        - **`status`**: error
        - **`errors`**: Especificació de l'error que ha ocorregut.

### `/auth/change-password` [POST]

**Descripción:** Permet canvia la contrasenya de la base de dades

- **Parametros:**
    - `uuid` (string): El uuid de l'usuari
    - `new_password` (string): La nova contrasenya
- **Respuesta:**
    - **200 OK:** L'usuari canvia la contrasenya i envien la informació necessària al front, però que
      guardi les nostres credencials.
    - **400 Bad Request:**
        - **`status`**: error
        - **`errors`**: Especificació de l'error que ha ocorregut.

## Rutas de Traducción

### `/lara/translate` [POST]

**Descripción:** Tradueix una paraula a l'idioma que hem especificat.

- **Parametros:**
    - `word` (string): El texto que se va a traducir.
    - `target` (string): El idioma de origen.
    - `source` (string): El idioma al que se va a traducir.
- **Respuesta:**
    - **200 OK:** Resposta de l'api.
        - **`status`**: success
        - **`result`**: Resposta de l'api
    - **400 Bad Request:** Error en traduir la paraula.
        - **`status`**: error
        - **`message`**: Missatge especificant l'error.

### `/checkAuth` [GET] (con middleware `auth:sanctum`)

**Descripción:** Verifica si l'usuari està autenticat.

- **Parametros:** No requereix paràmetres.
- **Respuesta:**
    - **200 OK:** Usuari autenticat.
        - **`status`**: success
        - **`user`**: Informació de l'usuari autentificat
    - **401 Unauthorized:** Usuario no auntenticat.
        - **`status`**: error
        - **`message`**: Missatge especificant l'error.

## Rutas de Idiomas

### `/user/languages` [GET] (con middleware `auth:sanctum`)

**Descripción:** Obté una llista dels idiomes disponibles.

- **Parametros:** No requereix paràmetres.
- **Respuesta:**
    - **200 OK:** Lista de idiomas disponibles.
        - **`status`**: success
        - **`statsLanguages`**: Llistat d'idiomes
    - **401 Unauthorized:** Error al obtenir la llista.
        - **`status`**: error
        - **`message`**: Missatge especificant l'error.

### `/user/getUserStatsLanguage/{languageId}` [GET] (con middleware `auth:sanctum`)

**Descripción:** Obté informació sobre les estadístiques d'un usuari per a un idioma específic.

- **Parametros:** Necessitem l'ID de l'idioma.
- **Respuesta:**
    - **200 OK:** Lista de idiomas disponibles.
        - **`status`**: success
        - **`statsLanguage`**: Llistat d'idiomes.
        - **`achievements`**: Obtenir els assoliments de l'usuari.
        - **`gameHistoryUser`**: Llista de les 3 últimes partides jugades de l'usuari
    - **401 Unauthorized:** Error en obtenir la informació.
        - **`status`**: error
        - **`message`**: Missatge especificant l'error.

## Rutas de Juegos

### `/game/store/stats` [POST]

**Descripción:** Actualitzar els punts de cada jugador en la partida.

- **Parametros:**
    - `players` (Objecto): Són els jugadors que estan en aquell lobby.
- **Respuesta:**
    - **200 OK:** Actualitza't els punts de cada jugador.
        - **`status`**: success
    - **400 Bad Request:** Error al actualitzar els punts de cada jugador.
        - **`status`**: error
        - **`message`**: Missatge especificant l'error.

### `/games/` [GET] (con middleware `auth:sanctum`)

**Descripción:** Obtenir la llista de lobbies disponibles.

- **Parametros:** No requereix paràmetres addicionals.
- **Respuesta:**
    - **200 OK:** Llista de lobbies disponibles.
        - **`status`**: success
        - **`message`**: Missatge personalitzat.
        - **`games`**: Llista de lobbies.
    - **400 Bad Request:** Error en obtenir la llista de lobbies.
        - **`status`**: error
        - **`message`**: Missatge especificant l'error.

### `/games/store` [POST] (con middleware `auth:sanctum`)

**Descripción:** Crea un nuevo juego.

- **Parametros:**
    - `id_level_language` (number): L'ID de l'usuari.
    - `password` (string): La contrasenya de la lobby.
    - `name` (string): El pseudònim de l'usuari.
    - `n_rounds` (number): Número de rondes de la partida.
    - `max_clues` (number): Número maxim de pistas.
    - `max_time` (number): Temps maxim de cada ronda.
    - `max_players` (number): Número màxim de jugadors.
- **Respuesta:**
    - **200 OK:** El juego fue creado correctamente.

### `/games/{gameUUID}` [GET] (con middleware `auth:sanctum`)

**Descripción:** Obtiene información sobre un juego específico.

- **Parametros:**
    - `gameUUID` (string): El identificador único del juego.
- **Respuesta:**
    - **200 OK:** Información sobre el juego.

### `/games/join/{gameUUID}` [GET] (con middleware `auth:sanctum`)

**Descripción:** Permite unirse a un juego.

- **Parametros:**
    - `gameUUID` (string): El identificador único del juego.
- **Respuesta:**
    - **200 OK:** El jugador se unió al juego.

### `/games/leave/{gameUUID}` [GET] (con middleware `auth:sanctum`)

**Descripción:** Permite salir de un juego.

- **Parametros:**
    - `gameUUID` (string): El identificador único del juego.
- **Respuesta:**
    - **200 OK:** El jugador dejó el juego.

### `/games/start` [POST] (con middleware `auth:sanctum`)

**Descripción:** Inicia un juego.

- **Parametros:**
    - `game_id` (string): El identificador del juego.
- **Respuesta:**
    - **200 OK:** El juego se ha iniciado correctamente.

## Rutas de Estadísticas del Usuario

### `/user/languages` [GET] (con middleware `auth:sanctum`)

**Descripción:** Obtiene las estadísticas de los idiomas del usuario.

- **Parametros:** No requiere parámetros adicionales.
- **Respuesta:**
    - **200 OK:** Las estadísticas de los idiomas del usuario.

### `/user/getUserStatsLanguage/{languageId}` [GET] (con middleware `auth:sanctum`)

**Descripción:** Obtiene las estadísticas del usuario para un idioma específico.

- **Parametros:**
    - `languageId` (int): El identificador del idioma.
- **Respuesta:**
    - **200 OK:** Estadísticas del usuario para el idioma especificado.

## Rutas de Pruebas

### `/test` [GET]

**Descripción:** Ruta de prueba para verificar si la API está funcionando.

- **Parametros:** No requiere parámetros adicionales.
- **Respuesta:**
    - **200 OK:** Mensaje que indica que la ruta de prueba está funcionando correctamente.

---

**Notas generales:**

- Los endpoints protegidos requieren que el usuario esté autenticado utilizando un token `sanctum` en la cabecera de la
  solicitud.
- Todos los endpoints que requieren autenticación deben devolver un error `401 Unauthorized` si el token no es válido o
  ha expirado.
