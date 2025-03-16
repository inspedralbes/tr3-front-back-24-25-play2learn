class SocketController {
    static initialize(io) {
        let users = [];

        io.on('connection', (socket) => {
            console.log('A user connected');
            
        });
    }
}

module.exports = SocketController;