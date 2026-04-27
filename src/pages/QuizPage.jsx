import { useMemo, useState } from 'react';
import testB07 from '../../data/test_quiz/generated_test_sc1_b07.json';
import testB07A from '../../data/test_quiz/generated_test_sc1_b07_v2.json';
import './QuizPage.css';

const QuizPage = () => {
  const [level, setLevel] = useState('sc1');
  const [lesson, setLesson] = useState('7');
  const [quizState, setQuizState] = useState('setup'); // 'setup' | 'playing' | 'result'
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  const availableTests = useMemo(
    () => [
      { id: '7', test: testB07 },
      { id: '7a', test: testB07A },
      // Add more tests here when you create them in data/test_quiz/
    ],
    [],
  );

  const selectedTest = useMemo(
    () => availableTests.find(t => t.id === lesson)?.test ?? availableTests[0]?.test,
    [availableTests, lesson],
  );

  const startQuiz = () => {
    if (!selectedTest) return;
    setQuestions(selectedTest.questions || []);
    setCurrentIndex(0);
    setAnswers({});
    setScore(0);
    setQuizState('playing');
  };

  const handleAnswer = (qId, optionIndex) => {
    setAnswers({ ...answers, [qId]: optionIndex + 1 });
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const submitQuiz = () => {
    let calculatedScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setQuizState('result');
  };

  if (quizState === 'setup') {
    return (
      <div className="quiz-setup animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">시험 만들기 (Create Quiz)</h1>
          <p className="page-subtitle">학습한 진도까지의 종합 시험을 생성합니다</p>
        </div>
        
        <div className="setup-card glass-card">
          <div className="form-group">
            <label>급 (Level)</label>
            <select value={level} onChange={e => setLevel(e.target.value)}>
              <option value="sc1">초급 1 (Sơ cấp 1)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>시험 (Test)</label>
            <select value={lesson} onChange={e => setLesson(e.target.value)}>
              {availableTests.map(t => (
                <option key={t.id} value={t.id}>{t.test?.test_name ?? `Test ${t.id}`}</option>
              ))}
            </select>
          </div>
          
          <button className="btn start-btn" onClick={startQuiz}>시험 시작 (Start)</button>
        </div>
      </div>
    );
  }

  if (quizState === 'playing') {
    const q = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;
    
    return (
      <div className="quiz-player animate-fade-in">
        <div className="quiz-header">
          <div className="progress-text">문제 {currentIndex + 1} / {questions.length}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>

        <div className="question-card glass-card">
          {q.type && <div className="q-type">{q.type}</div>}
          <div className="q-instruction">{q.instruction}</div>
          {q.passage && <div className="q-passage">{q.passage}</div>}
          <h2 className="q-text">{q.question}</h2>
          
          {q.context_words && (
            <div className="q-context">
              {q.context_words.join(', ')}
            </div>
          )}

          <div className="options-list">
            {q.options.map((opt, i) => (
              <label 
                key={i} 
                className={`option-item ${answers[q.id] === i + 1 ? 'selected' : ''}`}
              >
                <input 
                  type="radio" 
                  name={`q-${q.id}`} 
                  checked={answers[q.id] === i + 1}
                  onChange={() => handleAnswer(q.id, i)}
                />
                <span className="opt-num">{['①', '②', '③', '④', '⑤'][i]}</span> {opt}
              </label>
            ))}
          </div>
        </div>

        <div className="quiz-footer">
          <button className="btn btn-secondary" onClick={prevQuestion} disabled={currentIndex === 0}>
            이전 (Prev)
          </button>
          
          {isLast ? (
            <button className="btn submit-btn" onClick={submitQuiz}>제출 (Submit)</button>
          ) : (
            <button className="btn" onClick={nextQuestion}>다음 (Next)</button>
          )}
        </div>
      </div>
    );
  }

  if (quizState === 'result') {
    return (
      <div className="quiz-result animate-fade-in">
        <div className="result-header glass-card">
          <h2>시험 결과 (Result)</h2>
          <div className="score-circle">
            <span className="score-num">{score}</span>
            <span className="score-total">/ {questions.length}</span>
          </div>
          <button className="btn" onClick={() => setQuizState('setup')}>다시 만들기 (Create New)</button>
        </div>

        <div className="review-list">
          <h3 className="review-title">오답 노트 (Review)</h3>
          {questions.map((q, i) => {
            const isCorrect = answers[q.id] === q.correct_answer;
            return (
              <div key={q.id} className={`review-card glass-card ${isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="r-header">
                  <span className="r-num">Q{i + 1}.</span>
                  <span className="r-status">{isCorrect ? '정답' : '오답'}</span>
                </div>
                {q.passage && <div className="r-passage">{q.passage}</div>}
                <div className="r-question">{q.question}</div>
                <div className="r-your-ans">선택: {answers[q.id] ? q.options[answers[q.id]-1] : '선택 안 함'}</div>
                {!isCorrect && (
                  <div className="r-correct-ans">정답: {q.options[q.correct_answer-1]}</div>
                )}
                <div className="r-explanation">해설: {q.explanation}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default QuizPage;
