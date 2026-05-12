// sidebar.jsx
import './sidebar.css';

function SideBar({ onNavClick, paginaAtual }) {

  const navPrincipal = [
    { id: 'dashboard',  label: 'Dashboard'     },
    { id: 'clientes',   label: 'Clientes'      },
    { id: 'agenda',     label: 'Agenda'        },
    { id: 'arquivo',    label: 'Arquivo Anual' },
    { id: 'planos',     label: 'Plano de saúde'},
  ];

  const navCadastro = [
    { id: 'novo-cliente', label: 'Novo cliente'  },
    { id: 'nova-sessao',  label: 'Nova sessão'   },
    { id: 'novo-ano',     label: 'Adicionar ano' },
  ];

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
          {navPrincipal.map(item => (
            <li
              key={item.id}
              className={`nav-item ${paginaAtual === item.id ? 'active' : ''}`}
              onClick={() => onNavClick(item.id)}
            >
              {item.label}
            </li>
          ))}
        </ul>

        <h5 className="nav-label">CADASTRO</h5>
        <ul>
          {navCadastro.map(item => (
            <li
              key={item.id}
              className={`nav-item ${paginaAtual === item.id ? 'active' : ''}`}
              onClick={() => onNavClick(item.id)}
            >
              {item.label}
            </li>
          ))}
        </ul>

      </div>

      {/* Rodapé */}
      <footer className="baixo">
        <div className="avatar">DO</div>
        <div>
          <div className="foot-name">Dra. Olga</div>
          <div className="foot-role">CRP 03/xxxx</div>
        </div>
      </footer>

    </div>
  );
}

export default SideBar;