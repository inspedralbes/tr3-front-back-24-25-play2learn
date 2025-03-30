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

    function shouldGenerateWordHangman(roomUUID) {
      const game = confGame.find((game) => game.room === roomUUID);
      if (!game) {
        console.error("Room not found");
        return;
      }

      return game.historyWords.length < game.players.length;
    }

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

      return word;
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

          io.to(roomUUID).emit("timeOut");

          // Avanza al siguiente turno
          game.turn++;
          io.to(roomUUID).emit("turn", {
            turn: getTurnGame(roomUUID),
            errors: game.guessesErrors,
          });

          // Reiniciamos el timer para el nuevo turno
          startTurnTimer(roomUUID, maxTime);
        } else {
          // console.log("Time remaining: " + remainingTime);
          io.to(roomUUID).emit("timerTick", {time: remainingTime});
        }
      }, 1000);
    }

    io.on("connection", (socket) => {
      console.log("A user connected");
      // console.log(socket);
      users.push({ id: socket.id, room: null });
      socket.on("startGame", async ({ token, roomUUID }) => {
        const response = await apiRequest("/games/start", token, "POST", {
          roomUUID,
        });
        const sortedTurns = response.data.participants.sort(
          () => Math.random() - 0.5
        );

        response.data.participants = sortedTurns;

        // console.log(sortedTurns);
        confGame.push({
          room: roomUUID,
          turn: 1,
          players: sortedTurns,
          guessesErrors: 0,
          game_num_random: Math.floor(Math.random() * 2) + 1,
          game_num_rounds: 1,
          game_time_max: response.data.max_time,
          game: response.data,
          showLeader: false
        });

        generateWordHangman(roomUUID);
        io.to(roomUUID).emit("gameStarted", response);
      });

      socket.on("setLobbies", async ({ token, game }) => {
        const response = await apiRequest("/games/store", token, "POST", game);
        // console.log(response);
        // Crear y unirse a la sala con el UUID del juego
        const roomUUID = response.gameCreated.uuid;

        if (!socket.rooms.has(roomUUID)) {
          socket.join(roomUUID);
          const user = users.find((user) => user.id === socket.id);
          user ? (user.room = roomUUID) : users.push({ id: socket.id, socket: socket, room: roomUUID });
        }

        // Emitir al socket actual con datos personalizados
        socket.emit("lobbieCreated", response);
        // Emitir a todos los demás clientes
        socket.broadcast.emit("getLobbies", response);
      });

      socket.on("joinRoom", async ({ token, roomUUID }) => {
        if (!socket.rooms.has(roomUUID)) {
          socket.join(roomUUID);
          const user = users.find((user) => user.id === socket.id);
          user ? (user.room = roomUUID) : users.push({ id: socket.id, socket: socket, room: roomUUID });
        }

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
        if (!socket.rooms.has(roomUUID)) {
          socket.join(roomUUID);
          const user = users.find((user) => user.id === socket.id);
          user ? (user.room = roomUUID) : users.push({ id: socket.id, socket: socket, room: roomUUID });
        }

        const response = await apiRequest("/games/" + roomUUID, token, "GET");
        // console.log(response);
        const filterGame = confGame.find((game) => game.room === roomUUID);
        if (filterGame) {
          response.game_num_random = filterGame.game_num_random;
          response.showLeader = filterGame.showLeader;
        }
        
        io.to(roomUUID).emit("playerJoined", response);
        io.to(roomUUID).emit("inGame", response);
      });

      socket.on("lobbie", async ({ token, language }) => {
        const response = await apiRequest("/games/"+language, token);
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
        if (!socket.rooms.has(roomUUID)) {
          socket.join(roomUUID);
          const user = users.find((user) => user.id === socket.id);
          user ? (user.room = roomUUID) : users.push({ id: socket.id, socket: socket, room: roomUUID });
        }

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
      });

      socket.on('nextGame', async({ roomUUID, language, token }) => {
        const game = confGame.find((game) => game.room === roomUUID);
        if (!game) {
          console.error("Room not found");
          return;
        }

        game.showLeader = false;

        if (game.game_num_rounds === game.game.n_rounds || game.game_num_rounds > game.game.n_rounds) {
          //logic for update and insert result games finish
          await apiRequest('/game/history/round', token, 'POST', {uuid: roomUUID, num_game: game.game_num_random})

          console.log("se termino la partida")
          game.game_num_random = null;
          game.game_num_rounds = null;

          const response = await apiRequest('/game/store/stats/finish', token, 'POST', {uuid: roomUUID, language: language});

          console.log(response)
          if(response.status === 'success')
          {

          }
          io.to(roomUUID).emit("chargeGame", game);

          return;
        }else{
          game.game_num_rounds++;
        }

        // let num = Math.floor(Math.random() * 10);
        let num = Math.floor(Math.random() * 2) + 1;

        if (num === game.game_num_random) {
          if (num === 10) {
            num = 0;
          } else {
            num++;
          }
        }

        game.game_num_random = num;

        io.to(roomUUID).emit("chargeGame", game);
      });

      socket.on('showLeader', async({ token, roomUUID }) => {
        const game = confGame.find((game) => game.room === roomUUID);
        if (!game) {
          console.error("Room not found");
          return;
        }
        console.log("showLeader")
        game.showLeader = true;

        const response = await apiRequest("/games" + roomUUID, token, "GET");
        await apiRequest('/game/history/round', token, 'POST', {uuid: roomUUID, num_game: game.game_num_random})
        
        io.to(roomUUID).emit("leader", game);
        io.to(roomUUID).emit("participantsLoaders", response);
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
        if (newGuessedWord == getWordHangman(roomUUID)) {
          if (shouldGenerateWordHangman(roomUUID)) {
            const word = generateWordHangman(roomUUID);
            io.to(roomUUID).emit("wordHangman", { newWord: word });
          }else{
            io.to(roomUUID).emit("gameOver");
            return;
          }
        }

        game.turn++;

        io.to(roomUUID).emit("turn", {
          turn: getTurnGame(roomUUID),
          errors: game.guessesErrors,
        });

        startTurnTimer(roomUUID, game.time);
      });

      //game sockets cadenas encadenas-------------------------------
      socket.on('lastWord', ({ roomUUID, word }) => {
        const game = confGame.find((game) => game.room === roomUUID);
        if (!game) {
          console.error("Room not found");
          return;
        }

        io.to(roomUUID).emit('word', { word });
      });

      socket.on("getTurnWordChain", ({ roomUUID }) => {
        const game = confGame.find((game) => game.room === roomUUID);
        if (!game) {
          console.error("Room not found");
          return;
        }

        const turnPlayer = getTurnGame(roomUUID);

        game.players = game.players.map(p => ({
          ...p,
          isActive: p.user_id === turnPlayer.user_id,
          word: '',
          localPoints: 0,
          time: game.game_time_max
        }));

        io.to(roomUUID).emit("turnWordChain", {
          turn: getTurnGame(roomUUID),
          players: game.players,
          errors: game.guessesErrors,
        });
      });

      socket.on("nextTurnWordChain", ({ roomUUID, points, timeRemaining, playerWord }) => {
        const game = confGame.find(game => game.room === roomUUID);
        if (!game) {
          console.error("Room not found");
          return;
        }

        const activePlayer = game.players.find(p => p.isActive);
        if (!activePlayer) {
          console.error("Active player not found");
          return;
        }

        //cambia los datos del player que estaba jugando con sus resultados
        game.players = game.players.map(p => {
          if (p.user_id === activePlayer.user_id) {
            return {
              ...p,
              word: playerWord,
              localPoints: p.localPoints + points,
              time: timeRemaining,
            };
          }
          return p;
        });

        //pasa al siguiente turno
        game.turn++;

        //seteamos de nuevo el turno
        const turnPlayer = getTurnGame(roomUUID);
        game.players = game.players.map(p => ({
          ...p,
          isActive: p.user_id === turnPlayer.user_id,
        }));


        io.to(roomUUID).emit("turnWordChain", {
          turn: getTurnGame(roomUUID),
          players: game.players,
          errors: game.guessesErrors,
        });
      });

      //game sockets cadenas encadenas--------------------------------

      socket.on("startTimer", ({ roomUUID, maxTime }) => {
        const game = confGame.find((game) => game.room === roomUUID);
        if (!game) {
          console.error("Room not found");
          return;
        }
        // Guarda el tiempo máximo en el juego para usarlo luego
        game.time = maxTime;
        if (!game.timer) {          
          startTurnTimer(roomUUID, maxTime);
        }
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
