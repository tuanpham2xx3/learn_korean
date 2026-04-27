import { useState, useEffect } from 'react';
import topikData from '../../data/cautrucdetopik.json';
import de1Data from '../../data/de1.json';
import de1Answers from '../../data/dapan1.json';
import de2Data from '../../data/de2.json';
import de2Answers from '../../data/dapan2.json';
import './TopikPage.css';

const TopikPage = () => {
  const [view, setView] = useState('structure'); // 'structure' | 'exam'
  const [selectedExam, setSelectedExam] = useState(null);
  
  // Interactive states
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const exams = [
    { id: 'de1', name: '제96회 TOPIK II (읽기)', data: de1Data, answers: de1Answers },
    { id: 'de2', name: '제91회 TOPIK II (읽기)', data: de2Data, answers: de2Answers }
  ];

  const startExam = (examObj) => {
    setSelectedExam(examObj);
    setUserAnswers({});
    setIsSubmitted(false);
    setTotalScore(0);
    setView('exam');
    window.scrollTo(0, 0);
  };

  const handleSelectOption = (qId, optionIndex) => {
    if (isSubmitted) return; // Prevent changing answers after submit
    setUserAnswers({ ...userAnswers, [qId]: optionIndex + 1 });
  };

  const handleSubmit = () => {
    let score = 0;
    selectedExam.data.questions.forEach((q) => {
      const answerObj = selectedExam.answers.answers.find(a => a.question === q.id);
      if (answerObj && userAnswers[q.id] === answerObj.answer) {
        score += answerObj.score || 2; // Default to 2 if not provided
      }
    });
    setTotalScore(score);
    setIsSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (view === 'structure') {
    return (
      <div className="topik-structure animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">TOPIK 연습 (Practice)</h1>
          <p className="page-subtitle">실전 TOPIK 읽기 문제를 풀어보세요</p>
        </div>

        <div className="exam-selection glass-card">
          <h2>모의고사 선택 (Select Exam)</h2>
          <div className="exam-list">
            {exams.map(ex => (
              <button key={ex.id} className="btn" onClick={() => startExam(ex)}>
                {ex.name} 시작하기
              </button>
            ))}
          </div>
        </div>

        <h2 className="structure-title">{topikData.title}</h2>
        <div className="structure-grid">
          {topikData.structure.map((item, i) => (
            <div key={i} className="structure-card glass-card">
              <div className="s-qnum">문제 {item.questions}</div>
              <div className="s-type">{item.task_type}</div>
              <div className="s-time">예상 시간: {item.max_time_minutes}분</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'exam' && selectedExam) {
    const maxScore = selectedExam.answers.answers.reduce((acc, curr) => acc + (curr.score || 2), 0);
    
    return (
      <div className="topik-exam animate-fade-in">
        <div className="exam-header glass-card">
          <div className="exam-info">
            <h2>{selectedExam.name}</h2>
            {isSubmitted && (
              <div className="exam-score">
                총점: <span className="score-highlight">{totalScore}</span> / {maxScore} 점
              </div>
            )}
          </div>
          <button className="btn btn-secondary" onClick={() => setView('structure')}>종료 (Exit)</button>
        </div>

        <div className="exam-questions">
          {selectedExam.data.questions.map((q) => {
            const answerObj = selectedExam.answers.answers.find(a => a.question === q.id);
            const isCorrect = isSubmitted && userAnswers[q.id] === answerObj?.answer;
            const isWrong = isSubmitted && userAnswers[q.id] && userAnswers[q.id] !== answerObj?.answer;
            
            return (
              <div key={q.id} className={`t-question-card glass-card ${isSubmitted ? (isCorrect ? 'q-correct' : 'q-wrong') : ''}`}>
                <div className="t-q-header">
                  <span className="t-q-num">{q.id}.</span>
                  {q.instruction && <span className="t-q-inst">{q.instruction}</span>}
                  {isSubmitted && (
                    <span className={`status-badge ${isCorrect ? 'badge-correct' : 'badge-wrong'}`}>
                      {isCorrect ? '정답' : '오답'}
                    </span>
                  )}
                </div>
                
                {q.passage && <div className="t-passage">{q.passage}</div>}
                <div className="t-q-text">{q.question}</div>
                
                {q.options && (
                  <div className="t-options">
                    {q.options.map((opt, i) => {
                      const isSelected = userAnswers[q.id] === i + 1;
                      const isActuallyCorrect = isSubmitted && answerObj?.answer === i + 1;
                      
                      let optionClass = 't-option';
                      if (isSelected) optionClass += ' selected';
                      if (isSubmitted && isActuallyCorrect) optionClass += ' actual-correct';
                      if (isSubmitted && isSelected && !isActuallyCorrect) optionClass += ' selected-wrong';
                      if (isSubmitted) optionClass += ' disabled';

                      return (
                        <div 
                          key={i} 
                          className={optionClass}
                          onClick={() => handleSelectOption(q.id, i)}
                        >
                          <span className="opt-num">{['①', '②', '③', '④'][i] || `(${i+1})`}</span> {opt}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {isSubmitted && answerObj && answerObj.answer && (
                  <div className="t-correct-info">
                    <strong>정답:</strong> {['①', '②', '③', '④'][answerObj.answer - 1] || answerObj.answer} 
                    <span className="t-score-info"> (배점: {answerObj.score}점)</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="exam-footer">
          {!isSubmitted ? (
            <button className="btn submit-btn btn-large" onClick={handleSubmit}>
              답안 제출 (Submit Answers)
            </button>
          ) : (
            <button className="btn btn-secondary btn-large" onClick={() => window.scrollTo(0, 0)}>
              위로 이동 (Scroll to Top)
            </button>
          )}
        </div>
      </div>
    );
  }
};

export default TopikPage;
