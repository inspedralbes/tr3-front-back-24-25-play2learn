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
        console.log(sortedTurns);
        confGame.push({
          room: roomUUID,
          turn: 1,
          players: sortedTurns,
          guessesErrors: 0,
          game_num_random: Math.floor(Math.random() * 10),
          game_num_rounds: 1,
          game: response.data,
        });

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
        const filterGame = confGame.find((game) => game.room === roomUUID);
        if (filterGame) {
          response.game_num_random = filterGame.game_num_random;
        }
        io.to(roomUUID).emit("playerJoined", response);
        io.to(roomUUID).emit("inGame", response);
    });

      socket.on("lobbie", async ({ token }) => {
        const response = await apiRequest("/games", token);
        socket.emit("getLobbies", response);
      });

      socket.on("leaveGame", async ({ token, roomUUID }) => {
        socket.leave(roomUUID);
        const response = await apiRequest(
          "/games/leave/" + roomUUID,
          token,
          "GET"
        );
        console.log(response);
        if (response.game) {
          io.to(roomUUID).emit("playerJoined", response);
          io.emit("getLobbies", response);
        } else {
          io.to(roomUUID).emit("gameDeleted", { game: null });
          io.emit("getLobbies", response);
        }
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

      socket.on("nextTurnGeneral", ({ roomUUID, user_id, points }) => {
        const game = confGame.find((game) => game.room === roomUUID);

        if (!game) {
          console.error("Room not found");
          return;
        }

        game.turn++;
        game.players.find((player) => player.user_id === user_id).points += points;

        io.to(roomUUID).emit("turn", {
          turn: getTurnGame(roomUUID),
          errors: game.guessesErrors,
        });

        startTurnTimer(roomUUID, game.max_time);
      });

      socket.on('nextGame', ({ roomUUID }) => {
        const game = confGame.find((game) => game.room === roomUUID);
        if (!game) {
          console.error("Room not found");
          return;
        }

        if(game.game_num_rounds === game.game.n_rounds){
          //logic for update and insert result games


          game.game_num_random = null;
          io.to(roomUUID).emit("chargeGame", game);
          return;
        }
        let num = Math.floor(Math.random() * 10);
        if(num === game.game_num_random){
          if(num === 10){
            num = 0;
          }else{
            num++;
          }
        }

        game.game_num_random = num;

        io.to(roomUUID).emit("chargeGame", game);
      });

      socket.on('showLeader', ({ roomUUID }) => {
        const game = confGame.find((game) => game.room === roomUUID);
        if (!game) {
          console.error("Room not found");
          return;
        }
        console.log("showLeader")

        io.to(roomUUID).emit("leader", game );
      });

      socket.on("nextTurn", ({ roomUUID, acierto, letter }) => {
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

        socket.broadcast.to(roomUUID).emit("letter", letter);

        game.turn++;
        io.to(roomUUID).emit("turn", {
          turn: getTurnGame(roomUUID),
          errors: game.guessesErrors,
        });

        startTurnTimer(roomUUID, game.time);
      });

      //game sockets
      socket.on('lastWord', ({ roomUUID, word }) => {
        const game = confGame.find((game) => game.room === roomUUID);
        if (!game) {
          console.error("Room not found");
          return;
        }

        io.to(roomUUID).emit('word', { word });
      })

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
