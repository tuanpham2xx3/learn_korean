import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const features = [
    {
      title: '학습 (Study)',
      desc: '초급 어휘와 문법을 과별로 학습합니다.',
      path: '/study',
      icon: '📚'
    },
    {
      title: '시험 만들기 (Quiz)',
      desc: '원하는 진도까지의 맞춤형 종합 시험을 생성합니다.',
      path: '/quiz',
      icon: '📝'
    },
    {
      title: 'TOPIK 연습 (TOPIK)',
      desc: '실전 TOPIK 읽기 문제를 풀고 채점해 봅니다.',
      path: '/topik',
      icon: '🎓'
    }
  ];

  return (
    <div className="home-page animate-fade-in">
      <section className="hero">
        <h1 className="hero-title">한국어 실력을 키워보세요</h1>
        <p className="hero-subtitle">체계적인 학습과 실전 테스트로 TOPIK을 준비하세요</p>
      </section>

      <section className="features-grid">
        {features.map((f, i) => (
          <Link to={f.path} key={i} className="feature-card glass-card">
            <div className="feature-icon">{f.icon}</div>
            <h2 className="feature-title">{f.title}</h2>
            <p className="feature-desc">{f.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
