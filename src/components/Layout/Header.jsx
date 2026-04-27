import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '홈 (Home)' },
    { path: '/study', label: '학습 (Study)' },
    { path: '/quiz', label: '시험 만들기 (Quiz)' },
    { path: '/topik', label: 'TOPIK 연습 (TOPIK)' },
  ];

  return (
    <header className="site-header">
      <div className="header-container container">
        <div className="logo">
          <Link to="/">한국어<span>학습</span></Link>
        </div>
        <nav className="main-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
