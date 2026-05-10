// sidebar.jsx
import './sidebar.css';

function SideBar() {
  return (
    <div className="sidebar">

      {/* Logo */}
      <div id="titulo">
        <div className="logo-icon">🧠</div>
        <div>
          <h3>PsicologiaGestao</h3>
          <p>Consultoria digital</p>
        </div>
      </div>

      {/* Navegação */}
      <div id="principal">

        <h5 className="nav-label">PRINCIPAL</h5>

        <ul>
          <li className="nav-item">Dashboard</li>
          <li className="nav-item">Clientes</li>
          <li className="nav-item">Agenda</li>
          <li className="nav-item">Arquivo Anual</li>
          <li className="nav-item">Plano de saúde</li>
        </ul>

        <h5 className="nav-label">CADASTRO</h5>

        <ul>
          <li className="nav-item">Novo cliente</li>
          <li className="nav-item">Nova sessão</li>
          <li className="nav-item">Adicionar ano</li>
        </ul>

      </div>

      {/* Rodapé */}
      <footer className="baixo">
        <div className="avatar">DP</div>
        <div>
          <div className="foot-name">Dra. Olga</div>
          <div className="foot-role">CRP 03/xxxx</div>
        </div>
      </footer>

    </div>
  );
}

export default SideBar;