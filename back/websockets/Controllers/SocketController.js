const apiRequest = require("../apiRequest");

class SocketController {
    static initialize(io) {
        let users = [];

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
                io.to(roomUUID).emit('gameStarted', response);
            });

            socket.on('joinRoom', async ({token, roomUUID}) => {
                socket.join(roomUUID);
                const response = await apiRequest('/games/join/' + roomUUID, token, "GET");
                io.to(roomUUID).emit('playerJoined', response);
                io.emit('getLobbies', response)
            });

            socket.on('randomWord', async (data) => {
                console.log("Front", data);
                io.to(data.uuid).emit('wordRoom', data);
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