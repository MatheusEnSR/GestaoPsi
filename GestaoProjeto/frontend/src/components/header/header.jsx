// header.jsx
import './header.css';

function Header() {
  return (
    <header>
      <nav className="navag">

        {/* Esquerda — título da página atual */}
        <div className="nav-left">
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Visão geral semanal</div>
        </div>

        {/* Direita — ações */}
        <div className="nav-right">

          {/* Busca */}
          <div className="search-box">
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14" stroke="#A09EBB" strokeWidth="1.5">
              <circle cx="6.5" cy="6.5" r="4.5"/>
              <path d="M10 10l3 3" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Buscar..." />
          </div>

          {/* Notificações */}
          <button className="icon-btn">
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16" stroke="#6B6887" strokeWidth="1.5">
              <path d="M8 2a4 4 0 00-4 4v3l-1 1v1h10v-1l-1-1V6a4 4 0 00-4-4z"/>
              <path d="M6.5 13a1.5 1.5 0 003 0" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Avatar */}
          <div className="header-avatar">DP</div>

        </div>
      </nav>
    </header>
  );
}

export default Header;