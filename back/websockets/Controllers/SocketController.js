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

    function generateWordHangman(roomUUID) {
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
    }

    function getWordHangman(roomUUID) {
      const game = confGame.find((game) => game.room === roomUUID);
      if (!game) {
        console.error("Room not found");
        return;
      }

      return game.historyWords[game.historyWords.length - 1];
    }

    function getTurnGame(roomUUID) {
      const game = confGame.find((game) => game.room === roomUUID);
      if (!game) return null;

      console.log("pleyeerTurn: ", game.players[(game.turn - 1) % game.players.length]);
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
      io.to(roomUUID).emit("timerTick", {time: remainingTime});

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
          console.log("Time remaining: " + remainingTime);
          io.to(roomUUID).emit("timerTick", {time: remainingTime});
        }
      }, 1000);
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
        confGame.push({
          room: roomUUID,
          turn: 1,
          players: sortedTurns,
          guessesErrors: 0,
        });

        generateWordHangman(roomUUID);
        io.to(roomUUID).emit("gameStarted", response);
      });

      socket.on("setLobbies", async ({ token, game }) => {
        const response = await apiRequest("/games/store", token, "POST", game);
        // console.log(response);
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
        // console.log(response);
        io.to(roomUUID).emit("playerJoined", response);
        io.emit("getLobbies", response);
      });

      socket.on("getGame", async ({ token, roomUUID }) => {
        socket.join(roomUUID);
        users.find((user) => user.id === socket.id).room = roomUUID;

        const response = await apiRequest("/games/" + roomUUID, token, "GET");
        // console.log(response);
        io.to(roomUUID).emit("playerJoined", response);
      });

      socket.on("lobbie", async ({ token }) => {
        const response = await apiRequest("/games", token);
        socket.emit("getLobbies", response);
      });

      socket.on("getWordHangman", async ({ roomUUID }) => {
        socket.join(roomUUID);

        const newWord = getWordHangman(roomUUID);
        io.to(roomUUID).emit("wordHangman", { newWord: newWord });
      });

      socket.on("getTurn", ({ roomUUID }) => {
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

      socket.on("nextTurn", ({ roomUUID, acierto, newGuessedWord }) => {
        const game = confGame.find((game) => game.room === roomUUID);
        if (!game) {
          console.error("Room not found");
          return;
        }

        if (!acierto) {
          game.guessesErrors++;
        }

        if (game.timer) {
          clearInterval(game.timer);
          game.timer = null;
        }

        if (newGuessedWord !== "") socket.broadcast.to(roomUUID).emit("newGuessedWord", { newGuessedWord: newGuessedWord });
        // socket.broadcast.to(roomUUID).emit("letter", { letter });

        game.turn++;
        console.log("Next turn", game.turn);
        io.to(roomUUID).emit("turn", {
          turn: getTurnGame(roomUUID),
          errors: game.guessesErrors,
        });

        startTurnTimer(roomUUID, game.time);
      });

      socket.on("startTimer", ({ roomUUID, maxTime }) => {
        const game = confGame.find((game) => game.room === roomUUID);
        if (!game) {
          console.error("Room not found");
          return;
        }
        // Guarda el tiempo máximo en el juego para usarlo luego
        game.time = maxTime;
        startTurnTimer(roomUUID, maxTime);
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
