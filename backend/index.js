const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://live-polling-system-backend-tjix.onrender.com",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;

let currentPoll = null;
let questionCounter = 0;
let pollTimer = null;

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('create_poll', (pollData) => {
    if (pollTimer) clearInterval(pollTimer);
    questionCounter++;
    currentPoll = {
      questionNumber: questionCounter,
      question: pollData.question,
      options: pollData.options.map(opt => ({ text: opt.text, votes: 0 })),
      participants: {},
      totalVotes: 0,
      timeLeft: pollData.timeLimit,
    };
    io.emit('new_poll', currentPoll);
    console.log('New poll created and sent:', currentPoll.question);

    pollTimer = setInterval(() => {
      if (currentPoll && currentPoll.timeLeft > 0) {
        currentPoll.timeLeft--;
        io.emit('timer_update', { timeLeft: currentPoll.timeLeft });
      } else {
        clearInterval(pollTimer);
        io.emit('poll_ended');
        console.log('Poll ended.');
      }
    }, 1000);
  });
  
  socket.on('student_join', (data) => {
    console.log(`Student '${data.name}' joined with socket ID: ${socket.id}`);
  });

  socket.on('submit_answer', (data) => {
    const studentName = data.name;
    const answerText = data.answer;

    if (currentPoll && !currentPoll.participants[studentName]) {
      currentPoll.participants[studentName] = answerText;
      currentPoll.totalVotes += 1;
      
      const optionToUpdate = currentPoll.options.find(opt => opt.text === answerText);
      if (optionToUpdate) {
        optionToUpdate.votes += 1;
      }
      io.emit('poll_update', currentPoll);
      console.log(`Answer from ${studentName}: ${answerText}. Updated results sent.`);
    }
  });

  socket.on('reset_poll', () => {
    if (pollTimer) clearInterval(pollTimer);
    currentPoll = null;
    console.log('Poll has been reset by the teacher.');
    io.emit('poll_reset');
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});