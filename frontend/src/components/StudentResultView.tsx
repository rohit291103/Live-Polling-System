import styles from './TeacherResultsView.module.css';

interface PollResults {
  question: string;
  options: { text: string; votes: number }[];
  totalVotes: number;
  questionNumber: number;
  timeLeft: number;
}

interface StudentResultsViewProps {
  pollResults: PollResults;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
};

const StudentResultsView = ({ pollResults }: StudentResultsViewProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.resultsCard}>
        <div className={styles.header}>
          <h2>Question {pollResults.questionNumber}</h2>
          <div className={styles.timer}>
            <span>&#x1F551;</span> {formatTime(pollResults.timeLeft)}
          </div>
        </div>
        <p className={styles.questionText}>{pollResults.question}</p>
        <div className={styles.optionsContainer}>
          {pollResults.options.map((option, index) => {
            const percentage = pollResults.totalVotes > 0 
              ? Math.round((option.votes / pollResults.totalVotes) * 100)
              : 0;
            return (
              <div key={index} className={styles.optionRow}>
                <div className={styles.progressFill} style={{ width: `${percentage}%` }}></div>
                <div className={styles.optionContent}>
                  <div className={styles.optionLabel}>
                    <span className={styles.optionNumber}>{index + 1}</span>
                    <span className={styles.optionText}>{option.text}</span>
                  </div>
                  <div className={styles.percentageBox}>
                    {percentage}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className={styles.votedMessage}>Thanks for voting! Here are the live results.</p>
      </div>
    </div>
  );
};

export default StudentResultsView;