const apiRequest  = require("../apiRequest");

class SocketController {
    static initialize(io) {
        let users = [];

        io.on('connection', (socket) => {
            console.log('A user connected');
            users.push({ id: socket.id, room: null });
            socket.on('startGame', async ({token, roomUUID}) => {
                const response = await apiRequest('/games/start', token, "POST", {roomUUID});
                io.to(roomUUID).emit('gameStarted', response);
            });

            socket.on('setLobbies', async ({token, game})=>{
                const response = await apiRequest('/games/store', token, "POST", game);
                console.log(response);
                // Crear y unirse a la sala con el UUID del juego
                const roomUUID = response.gameCreated.uuid;
                socket.join(roomUUID);
                users.find(user => user.id === socket.id).room = roomUUID;
                // Emitir a todos los demás clientes
                socket.broadcast.emit('getLobbies', response);
                // Emitir al socket actual con datos personalizados
                socket.emit('loobbieCreated', response);

            });

            socket.on('joinRoom', async ({token, roomUUID}) => {
                socket.join(roomUUID);
                users.find(user => user.id === socket.id).room = roomUUID;
                const response = await apiRequest('/games/join/' + roomUUID, token, "GET");
                console.log(response);
                io.to(roomUUID).emit('playerJoined', response);
                io.emit('getLobbies', response)
            });

            socket.on('getGame', async ({token, roomUUID}) => {
                socket.join(roomUUID);
                users.find(user => user.id === socket.id).room = roomUUID;

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
                const user = users.find(user => user.id === socket.id);
                if (user.room) {
                    io.to(user.room).emit('playerLeft', { id: socket.id });
                    socket.leave(user.room);
                }
            });
        });
    }
}

module.exports = SocketController;