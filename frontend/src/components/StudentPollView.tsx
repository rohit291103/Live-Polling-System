import { useState } from 'react';
import styles from './StudentPollView.module.css';

interface PollData {
  question: string;
  options: { text: string; isCorrect: boolean }[];
  timeLimit: number;
  timeLeft: number;
  questionNumber: number;
}

interface StudentPollViewProps {
  pollData: PollData;
  onSubmitAnswer: (answer: string) => void;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
};

const StudentPollView = ({ pollData, onSubmitAnswer }: StudentPollViewProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selectedOption) {
      onSubmitAnswer(selectedOption);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pollCard}>
        <div className={styles.header}>
          <h2>Question {pollData.questionNumber}</h2>
          <div className={styles.timer}>{formatTime(pollData.timeLeft)}</div>
        </div>
        <p className={styles.question}>{pollData.question}</p>
        <div className={styles.optionsContainer}>
          {pollData.options.map((option, index) => (
            <button
              key={index}
              className={`${styles.optionButton} ${selectedOption === option.text ? styles.selected : ''}`}
              onClick={() => setSelectedOption(option.text)}
            >
              <span className={styles.optionLetter}>{String.fromCharCode(65 + index)}</span>
              {option.text}
            </button>
          ))}
        </div>
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={!selectedOption || pollData.timeLeft <= 0}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default StudentPollView;