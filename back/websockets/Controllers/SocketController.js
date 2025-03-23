const apiRequest = require("../apiRequest");

class SocketController {
  static initialize(io) {
    let users = [];
    let confGame = [];

    const WORDS = [
      "apple",
      "banana",
      "cherry",
      "date",
      "elderberry",
      "fig",
      "grape",
    ];

    function getTurnGame(roomUUID) {
      const game = confGame.find((game) => game.room === roomUUID);
      if (!game) return null;

      return game.players[(game.turn - 1) % game.players.length];
    }

    io.on("connection", (socket) => {
      console.log("A user connected");
      users.push({ id: socket.id, room: null });
      socket.on("startGame", async ({ token, roomUUID }) => {
        const response = await apiRequest("/games/start", token, "POST", {
          roomUUID,
        });
        const sortedTurns = response.data.participants.sort(
          () => Math.random() - 0.5
        );
        confGame.push({ room: roomUUID, turn: 1, players: sortedTurns });

        io.to(roomUUID).emit("gameStarted", response);
      });

      socket.on("setLobbies", async ({ token, game }) => {
        const response = await apiRequest("/games/store", token, "POST", game);
        console.log(response);
        // Crear y unirse a la sala con el UUID del juego
        const roomUUID = response.gameCreated.uuid;
        socket.join(roomUUID);
        users.find((user) => user.id === socket.id).room = roomUUID;
        // Emitir a todos los demás clientes
        socket.broadcast.emit("getLobbies", response);
        // Emitir al socket actual con datos personalizados
        socket.emit("lobbieCreated", response);
      });

      socket.on("joinRoom", async ({ token, roomUUID }) => {
        socket.join(roomUUID);
        users.find((user) => user.id === socket.id).room = roomUUID;
        const response = await apiRequest(
          "/games/join/" + roomUUID,
          token,
          "GET"
        );
        console.log(response);
        io.to(roomUUID).emit("playerJoined", response);
        io.emit("getLobbies", response);
      });

      socket.on("getGame", async ({ token, roomUUID }) => {
        socket.join(roomUUID);
        users.find((user) => user.id === socket.id).room = roomUUID;

        const response = await apiRequest("/games/" + roomUUID, token, "GET");
        console.log(response);
        io.to(roomUUID).emit("playerJoined", response);
      });

      socket.on("lobbie", async ({ token }) => {
        const response = await apiRequest("/games", token);
        socket.emit("getLobbies", response);
      });

      socket.on("getWordHangman", async ({ roomUUID }) => {
        const game = confGame.find((game) => game.room === roomUUID);
        if (!game) {
          console.error("Room not found");
          return;
        }

        if (!game.historyWords) {
          game.historyWords = [];
        }

        let word;
        do {
          word = WORDS[Math.floor(Math.random() * WORDS.length)];
        } while (game.historyWords.includes(word));

        game.historyWords.push(word);
        io.to(roomUUID).emit("wordHangman", word);
      });

      socket.on("getTurn", ({ roomUUID }) => {
        const turn = getTurnGame(roomUUID);
        socket.emit("turn", turn);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
        const user = users.find((user) => user.id === socket.id);
        if (user.room) {
          io.to(user.room).emit("playerLeft", { id: socket.id });
          socket.leave(user.room);
        }
      });
    });
  }
}

module.exports = SocketController;
