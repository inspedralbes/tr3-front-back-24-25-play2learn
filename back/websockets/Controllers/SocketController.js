const { apiRequest } = require("../apiRequest");

class SocketController {
    static initialize(io) {
        let users = [];

        io.on('connection', (socket) => {
            console.log('A user connected');
            
            socket.on('setLobbies', ({token, game})=>{
                const response = apiRequest('/games/store', token, "POST", game);
                
                io.emit('getLobbies', response.games);
            });

            socket.on('lobbie', ({token}) => {
                
                const response = apiRequest('/games', token);

                socket.emit('getLoobies', response.games)
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }
}

module.exports = SocketController;