// frontend/src/components/StudentNameEntry.tsx
import { useState } from 'react';
import styles from './StudentNameEntry.module.css';

interface StudentNameEntryProps {
  onNameSubmit: (name: string) => void;
}

const StudentNameEntry = ({ onNameSubmit }: StudentNameEntryProps) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>✨ Intervue Poll</div>
        <h1 className={styles.title}>Let's Get Started</h1>
        <p className={styles.subtitle}>
          If you're a student, you'll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates
        </p>

        <div className={styles.formGroup}>
          <label htmlFor="name-input" className={styles.label}>Enter your Name</label>
          <input
            id="name-input"
            type="text"
            className={styles.inputField}
            placeholder="Rahul Bajaj"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button
          className={styles.continueButton}
          onClick={handleSubmit}
          disabled={!name.trim()}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StudentNameEntry;