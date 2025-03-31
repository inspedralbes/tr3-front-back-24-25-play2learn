// src/plugins/socket.js
import { io } from 'socket.io-client';

const URL = "https://play2learn.pro/socket.io/";

const socket = io(URL, {
  transports: ['websocket'], // Usa WebSocket como transporte principal
  reconnection: true,        // Intenta reconectar automáticamente
  reconnectionAttempts: 5    // Número máximo de intentos
});

export default socket;