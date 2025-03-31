// src/plugins/socket.js
import { io } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://play2learn/socket/";

const socket = io(URL, {
  transports: ['websocket'], // Usa WebSocket como transporte principal
  reconnection: true,        // Intenta reconectar automáticamente
  reconnectionAttempts: 5    // Número máximo de intentos
});

export default socket;