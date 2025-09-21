// frontend/src/socket.ts
import { io } from 'socket.io-client';

// The URL of your backend server
const URL = 'https://live-polling-system-backend-tjix.onrender.com';

export const socket = io(URL);