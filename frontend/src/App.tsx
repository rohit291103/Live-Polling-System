import { useState, useEffect } from 'react';
import { socket } from './socket';
import Join from './components/Join';
import TeacherView from './components/TeacherView';
import TeacherResultsView from './components/TeacherResultsView';
import StudentNameEntry from './components/StudentNameEntry';
import StudentPollView from './components/StudentPollView';
import StudentResultsView from './components/StudentResultView';
import './App.css';

interface PollData {
  question: string;
  options: { text: string; isCorrect: boolean }[];
  timeLimit: number;
  timeLeft: number;
  questionNumber: number;
}
interface PollResults {
  question: string;
  options: { text: string; votes: number }[];
  totalVotes: number;
  timeLeft: number;
  questionNumber: number;
}

function App() {
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [activePoll, setActivePoll] = useState<PollData | null>(null);
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const handleNewPoll = (poll: PollData) => {
      setActivePoll(poll);
      const initialResults: PollResults = {
        question: poll.question,
        questionNumber: poll.questionNumber,
        timeLeft: poll.timeLeft,
        totalVotes: 0,
        options: poll.options.map(opt => ({ text: opt.text, votes: 0 })),
      };
      setPollResults(initialResults);
      setHasVoted(false);
    };

    const handlePollUpdate = (results: PollResults) => {
      setPollResults(results);
    };

    const handleTimerUpdate = ({ timeLeft }: { timeLeft: number }) => {
      setActivePoll(prev => (prev ? { ...prev, timeLeft } : null));
      setPollResults(prev => (prev ? { ...prev, timeLeft } : null));
    };

    const handlePollReset = () => {
      setActivePoll(null);
      setPollResults(null);
      setHasVoted(false);
    };
    
    socket.on('new_poll', handleNewPoll);
    socket.on('poll_update', handlePollUpdate);
    socket.on('timer_update', handleTimerUpdate);
    socket.on('poll_reset', handlePollReset);

    return () => {
      socket.off('new_poll', handleNewPoll);
      socket.off('poll_update', handlePollUpdate);
      socket.off('timer_update', handleTimerUpdate);
      socket.off('poll_reset', handlePollReset);
    };
  }, []);

  const handleJoin = (role: 'student' | 'teacher') => setUserRole(role);

  const handleNameSubmit = (name: string) => {
    socket.emit('student_join', { name });
    setStudentName(name);
  };

  const handleAnswerSubmit = (answer: string) => {
    socket.emit('submit_answer', { name: studentName, answer });
    setHasVoted(true);
  };

  const handleAskNewQuestion = () => {
    socket.emit('reset_poll');
  };
  
  const renderView = () => {
    if (userRole === 'teacher') {
      return pollResults 
        ? <TeacherResultsView 
            pollResults={pollResults} 
            onAskNewQuestion={handleAskNewQuestion} 
          /> 
        : <TeacherView />;
    }
    if (userRole === 'student') {
      if (!studentName) return <StudentNameEntry onNameSubmit={handleNameSubmit} />;
      if (activePoll && !hasVoted) {
        return <StudentPollView 
                  pollData={activePoll} 
                  onSubmitAnswer={handleAnswerSubmit} 
               />;
      }
      if (pollResults) {
        return <StudentResultsView 
                  pollResults={pollResults} 
               />;
      }
      return <div><h1>Welcome, {studentName}!</h1><p>Waiting for the teacher to ask a question...</p></div>;
    }
    return <Join onJoin={handleJoin} />;
  };

  return (
    <div>
      {renderView()}
    </div>
  );
}

export default App;