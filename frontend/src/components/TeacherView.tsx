import { useState } from 'react';
import styles from './TeacherView.module.css';
import { socket } from '../socket';

interface PollOption {
  text: string;
  isCorrect: boolean;
}

const TeacherView = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
  ]);
  const [timeLimit, setTimeLimit] = useState<number>(60);

  const handleOptionTextChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCorrectOptionChange = (index: number) => {
    const newOptions = options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, { text: '', isCorrect: false }]);
    }
  };

  const handleAskQuestion = () => {
    const filledOptions = options.filter(opt => opt.text.trim() !== '');
    if (question.trim() === '' || filledOptions.length < 2) {
      alert('Please enter a question and at least two options.');
      return;
    }
    
    const pollData = {
      question,
      options: filledOptions,
      timeLimit,
    };
    
    socket.emit('create_poll', pollData);
  };

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <div className={styles.header}>✨ Intervue Poll</div>
        <h1 className={styles.title}>Let's Get Started</h1>
        <p className={styles.subtitle}>
          Create and manage polls, ask questions, and monitor your students' responses in real-time.
        </p>

        <div className={styles.formSection}>
          <label htmlFor="question" className={styles.label}>Enter your question</label>
          <div className={styles.questionContainer}>
            <textarea
              id="question"
              className={styles.textarea}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={100}
              placeholder="Start typing your question here..."
            />
            <span className={styles.charCount}>{question.length}/100</span>
          </div>
          <div className={styles.timeSelector}>
            <select value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))}>
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={90}>90 seconds</option>
            </select>
          </div>
        </div>

        <div className={styles.formSection}>
          <label className={styles.label}>Edit Options</label>
          <div className={styles.optionsList}>
            {options.map((option, index) => (
              <div key={index} className={styles.optionItem}>
                <span className={styles.optionNumber}>{index + 1}</span>
                <input
                  type="text"
                  className={styles.optionInput}
                  value={option.text}
                  onChange={(e) => handleOptionTextChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <div className={styles.correctSelector}>
                  <span>Correct?</span>
                  <input
                    type="radio"
                    name="correct-option"
                    checked={option.isCorrect}
                    onChange={() => handleCorrectOptionChange(index)}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className={styles.addOptionButton} onClick={handleAddOption}>
            + Add More option
          </button>
        </div>
      </main>

      <footer className={styles.footer}>
        <button className={styles.askButton} onClick={handleAskQuestion}>
          Ask Question
        </button>
      </footer>
    </div>
  );
};

export default TeacherView;