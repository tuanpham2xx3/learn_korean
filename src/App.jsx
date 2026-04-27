import { Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import HomePage from './pages/HomePage';
import StudyPage from './pages/StudyPage';
import QuizPage from './pages/QuizPage';
import TopikPage from './pages/TopikPage';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/topik" element={<TopikPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
