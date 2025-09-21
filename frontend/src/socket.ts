// frontend/src/socket.ts
import { io } from 'socket.io-client';

// The URL of your backend server
const URL = 'http://localhost:4000';

export const socket = io(URL);