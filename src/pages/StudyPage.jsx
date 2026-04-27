import { useState } from 'react';
import vocabSC1 from '../../data/socap1/tuvungsocap1.json';
import grammarSC1 from '../../data/socap1/nguphapsc1.json';
import './StudyPage.css';

const StudyPage = () => {
  const vocabData = vocabSC1?.data ?? vocabSC1;
  const vocabLegend = vocabSC1?.legend ?? {};

  const [level, setLevel] = useState('sc1');
  const [lessonKey, setLessonKey] = useState(Object.keys(vocabData)[0]);
  const [tab, setTab] = useState('vocab'); // 'vocab' | 'grammar'

  // Extract lesson name (e.g. "Bài 01") for grammar matching
  const extractLessonName = (key) => key.split(' ')[0] + ' ' + key.split(' ')[1];
  
  const currentVocab = vocabData[lessonKey] || [];
  
  const currentLessonName = extractLessonName(lessonKey);
  const grammarObj = grammarSC1.grammar_list.find(g => g.lesson === currentLessonName);
  const currentGrammarPoints = grammarObj?.grammar_points || [];
  const currentGrammarFallback = grammarObj?.grammar || [];

  return (
    <div className="study-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">학습 (Study)</h1>
        <p className="page-subtitle">어휘와 문법을 과별로 학습하세요</p>
      </div>

      <div className="controls-section glass-card">
        <div className="select-group">
          <label>급 (Level)</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="sc1">초급 1 (Sơ cấp 1)</option>
            <option value="sc2" disabled>초급 2 (Sơ cấp 2 - 준비 중)</option>
          </select>
        </div>
        <div className="select-group">
          <label>과 (Lesson)</label>
          <select value={lessonKey} onChange={(e) => setLessonKey(e.target.value)}>
            {Object.keys(vocabData).map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab-btn ${tab === 'vocab' ? 'active' : ''}`}
          onClick={() => setTab('vocab')}
        >
          어휘 (Vocabulary)
        </button>
        <button 
          className={`tab-btn ${tab === 'grammar' ? 'active' : ''}`}
          onClick={() => setTab('grammar')}
        >
          문법 (Grammar)
        </button>
      </div>

      <div className="content-section">
        {tab === 'vocab' && (
          <div className="vocab-grid">
            {currentVocab.map((item, i) => {
              const isObj = item && typeof item === 'object';
              const w = isObj ? item.w : item;
              const t = isObj ? item.t : null;
              const m = isObj ? item.m : null;
              const a = isObj ? item.a : null;
              const typeLabel = t ? (vocabLegend[t] ?? t) : null;

              return (
                <div key={`${w ?? 'w'}-${i}`} className="vocab-card glass-card">
                  <div className="vocab-head">
                    <span className="word">{w}</span>
                    {typeLabel && <span className="vocab-type">{typeLabel}</span>}
                  </div>
                  {m && <div className="vocab-meaning">{m}</div>}
                  {a && <div className="vocab-antonym">Trái nghĩa: {a}</div>}
                </div>
              );
            })}
            {currentVocab.length === 0 && <p className="empty-msg">단어가 없습니다.</p>}
          </div>
        )}

        {tab === 'grammar' && (
          <div className="grammar-list">
            {currentGrammarPoints.map((g, i) => (
              <div key={`${g.grammar ?? 'g'}-${i}`} className="grammar-card glass-card">
                <div className="grammar-head">
                  <span className="grammar-point">{g.grammar}</span>
                  {g.meaning && <span className="grammar-meaning">{g.meaning}</span>}
                </div>
                {g.explanation && <div className="grammar-explanation">{g.explanation}</div>}
                {(g.example_kr || g.example_vn) && (
                  <div className="grammar-examples">
                    {g.example_kr && <div className="ex-kr">{g.example_kr}</div>}
                    {g.example_vn && <div className="ex-vn">{g.example_vn}</div>}
                  </div>
                )}
              </div>
            ))}

            {currentGrammarPoints.length === 0 && currentGrammarFallback.length > 0 && (
              <>
                {currentGrammarFallback.map((g, i) => (
                  <div key={`${g}-${i}`} className="grammar-card glass-card">
                    <div className="grammar-head">
                      <span className="grammar-point">{g}</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {currentGrammarPoints.length === 0 && currentGrammarFallback.length === 0 && (
              <p className="empty-msg">문법이 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPage;
