const apiRequest  = require("../apiRequest");

class SocketController {
    static initialize(io) {
        let users = [];

        io.on('connection', (socket) => {
            console.log('A user connected');
            
            socket.on('setLobbies', async ({token, game})=>{
                const response = await apiRequest('/games/store', token, "POST", game);
                console.log(response);
                // Crear y unirse a la sala con el UUID del juego
                const roomUUID = response.gameCreated.uuid;
                socket.join(roomUUID);
                // Emitir a todos los demás clientes
                socket.broadcast.emit('getLobbies', response);
                // Emitir al socket actual con datos personalizados
                socket.emit('loobbieCreated', response);

            });

            socket.on('joinRoom', async ({token, roomUUID}) => {
                socket.join(roomUUID);
                const response = await apiRequest('/games/join/' + roomUUID, token, "GET");
                console.log(response);
                io.to(roomUUID).emit('playerJoined', response);
                io.emit('getLobbies', response)
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