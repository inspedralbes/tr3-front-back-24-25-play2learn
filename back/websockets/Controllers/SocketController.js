const apiRequest = require("../apiRequest");

class SocketController {
    static initialize(io) {
        let users = [];
        let confGame = [];
        let words = [
            "hallo",
            "bitte",
            "danke",
            "entschuldigung",
            "ja",
            "nein",
            "freund",
            "liebe",
            "essen",
            "trinken"
        ]

        function getTurnGame(roomUUID) {
            const game = confGame.find((game) => game.room === roomUUID);
            if (!game) return null;

            return game.players[(game.turn - 1) % game.players.length];
        }

        function startTurnTimer(roomUUID, maxTime) {
            const game = confGame.find((game) => game.room === roomUUID);
            if (!game) {
                console.error("Room not found");
                return;
            }

            // Si existe un timer anterior, lo detenemos
            if (game.timer) {
                clearInterval(game.timer);
                game.timer = null;
            }

            let remainingTime = maxTime;
            // Notificar el tiempo inicial
            io.to(roomUUID).emit("timerTick", remainingTime);

            game.timer = setInterval(() => {
                remainingTime--;

                if (remainingTime <= 0) {
                    clearInterval(game.timer);
                    game.timer = null;
                    io.to(roomUUID).emit("timerEnded");

                    // Avanza al siguiente turno
                    game.turn++;
                    io.to(roomUUID).emit("turn", {
                        turn: getTurnGame(roomUUID),
                        errors: game.guessesErrors,
                    });

                    // Reiniciamos el timer para el nuevo turno
                    startTurnTimer(roomUUID, maxTime);
                } else {
                    io.to(roomUUID).emit("timerTick", remainingTime);
                }
            }, 1000);
        }

        io.on('connection', (socket) => {
            console.log('A user connected');

            socket.on('setLobbies', async ({token, game}) => {
                const response = await apiRequest('/games/store', token, "POST", game);
                // Crear y unirse a la sala con el UUID del juego
                const roomUUID = response.gameCreated.uuid;
                // Emitir a todos los demás clientes
                socket.broadcast.emit('getLobbies', response);
                // Emitir al socket actual con datos personalizados
                socket.emit('loobbieCreated', response);
            });

            socket.on('startGame', async ({token, roomUUID}) => {
                console.log("Token", token);
                console.log("Sala UUID", roomUUID)
                const response = await apiRequest('/games/start', token, "POST", {roomUUID});
                console.log("LARAVEL", response);

                const sortedTurns = response.game.participants.sort(
                    () => Math.random() - 0.5
                );
                confGame.push({
                    room: roomUUID,
                    turn: 1,
                    players: sortedTurns,
                    guessesErrors: 0,
                });
                io.to(roomUUID).emit('gameStarted', response);
            });

            socket.on('joinRoom', async ({token, roomUUID}) => {
                socket.join(roomUUID);
                const response = await apiRequest('/games/join/' + roomUUID, token, "GET");
                io.to(roomUUID).emit('playerJoined', response);
                io.emit('getLobbies', response)
            });

            socket.on('randomWord', async (data) => {
                let game = confGame.find((game) => game.room === data.uuid);
                if (!game) {
                    console.log("Game not found");
                    return;
                }

                const randomIndex = Math.floor(Math.random() * words.length);
                const word = words[randomIndex];

                // Guarda la palabra en la configuración de la partida
                game.currentWord = word;

                console.log(`Nueva palabra para la sala ${data.uuid}: ${word}`);

                io.to(data.uuid).emit('wordRoom', { word });
            });

            socket.on('getCurrentWord', async (data) => {
                let game = confGame.find((game) => game.room === data.uuid);
                if (!game || !game.currentWord) {
                    console.log("No hay palabra actual en la sala:", data.uuid);
                    return;
                }

                console.log(`Enviando palabra actual a ${data.uuid}: ${game.currentWord}`);

                io.to(data.uuid).emit('wordRoom', { word: game.currentWord });
            });

            socket.on('chatTranslate', (data) => {
                console.log("Mensaje del chat", data);
                io.to(data.uuid).emit('translateClient', data);
            });

            socket.on("getTurn", ({roomUUID}) => {
                const game = confGame.find((game) => game.room === roomUUID);
                if (!game) {
                    console.error("Room not found");
                    return;
                }

                io.to(roomUUID).emit("turn", {
                    turn: getTurnGame(roomUUID),
                    errors: game.guessesErrors,
                });
            });

            socket.on("nextTurn", ({roomUUID, acierto, guessedWord}) => {
                const game = confGame.find((game) => game.room === roomUUID);
                if (!game) {
                    console.error("Room not found");
                    return;
                }

                console.log("Next turn:", acierto, guessedWord);
                if (!acierto) {
                    console.log("Sumando errores ------------------");
                    game.guessesErrors++;
                }

                if (game.timer) {
                    clearInterval(game.timer);
                    game.timer = null;
                }

                socket.broadcast.to(roomUUID).emit("newGuessedWord", {guessedWord});

                game.turn++;
                io.to(roomUUID).emit("turn", {
                    turn: getTurnGame(roomUUID),
                    errors: game.guessesErrors,
                });

                startTurnTimer(roomUUID, game.time);
            });

            socket.on("startTimer", ({roomUUID, maxTime}) => {
                const game = confGame.find((game) => game.room === roomUUID);
                if (!game) {
                    console.error("Room not found");
                    return;
                }
                // Guarda el tiempo máximo en el juego para usarlo luego
                game.time = maxTime;
                startTurnTimer(roomUUID, maxTime);
            });

            socket.on('leaveGame', async ({token, roomUUID}) => {
                socket.leave(roomUUID);
                const response = await apiRequest('/games/leave/' + roomUUID, token, "GET");
                console.log(response);
                if (response.game) {
                    io.to(roomUUID).emit('playerJoined', response);
                    io.emit('getLobbies', response)
                } else {
                    io.to(roomUUID).emit('gameDeleted', {game: null});
                    io.emit('getLobbies', response)
                }
            });

            socket.on('getGame', async ({token, roomUUID}) => {
                socket.join(roomUUID);
                const response = await apiRequest('/games/' + roomUUID, token, "GET");
                console.log(response);
                io.to(roomUUID).emit('playerJoined', response);
            })

            socket.on('lobbie', async ({token}) => {
                const response = await apiRequest('/games', token);
                socket.emit('getLobbies', response)
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }
}

module.exports = SocketController;