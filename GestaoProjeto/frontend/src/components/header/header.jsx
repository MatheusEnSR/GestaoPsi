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

        
        </div>
      </nav>
    </header>
  );
}

export default Header;