// pages/clientes/clientes.jsx
import './cliente.css';

function Clientes() {

  // ── Dados mockup ──────────────────────────────────────
  const clientes = [
    { id: 1, nome: 'Ana Paula Ferreira',     plano: 'Unimed',     freq: 2, valor: 180, tel: '(71) 98765-4321', semana: 'R$ 360'  },
    { id: 2, nome: 'Carlos Eduardo Souza',   plano: 'Particular', freq: 1, valor: 220, tel: '(71) 91234-5678', semana: 'R$ 220'  },
    { id: 3, nome: 'Mariana Costa Lima',     plano: 'Bradesco',   freq: 1, valor: 150, tel: '(71) 99887-6543', semana: 'R$ 150'  },
    { id: 4, nome: 'Rafael Mendes Oliveira', plano: 'SulAmérica', freq: 2, valor: 200, tel: '(71) 97654-3210', semana: 'R$ 400'  },
    { id: 5, nome: 'Fernanda Santos Reis',   plano: 'Particular', freq: 3, valor: 250, tel: '(71) 95432-1098', semana: 'R$ 750'  },
  ];

  // Gera iniciais do nome
  function iniciais(nome) {
    return nome.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }

  return (
    <div className="clientes-page">

      {/* ── Topo ── */}
      <div className="clientes-topo">
        <div>
          <h2 className="clientes-titulo">Clientes</h2>
          <p className="clientes-sub">{clientes.length} cadastrados</p>
        </div>
        <div className="clientes-acoes">
          <input className="clientes-busca" type="text" placeholder="Buscar cliente..." />
          <button className="btn-novo">+ Novo cliente</button>
        </div>
      </div>

      {/* ── Lista ── */}
      <div className="clientes-lista card">
        {clientes.map(c => (
          <div key={c.id} className="cliente-row">

            {/* Avatar */}
            <div className="cliente-avatar">
              {iniciais(c.nome)}
            </div>

            {/* Info */}
            <div className="cliente-info">
              <div className="cliente-nome">{c.nome}</div>
              <div className="cliente-meta">
                <span className="badge">{c.plano}</span>
                {' '}· {c.freq}x/sem · R$ {c.valor}/sessão · {c.tel}
              </div>
            </div>

            {/* Valor da semana */}
            <div className="cliente-semana">
              <div className="cliente-val">{c.semana}</div>
              <div className="cliente-hint">esta semana</div>
            </div>

            {/* Ações */}
            <div className="cliente-btns">
              <button className="icon-btn" title="Editar">
                <svg viewBox="0 0 14 14" width="13" height="13" fill="#6B6887">
                  <path d="M10.3 1.7a1 1 0 011.4 1.4L4 10.8l-2 .5.5-2 7.8-7.6z"/>
                </svg>
              </button>
              <button className="icon-btn danger" title="Excluir">
                <svg viewBox="0 0 14 14" width="13" height="13" fill="#6B6887">
                  <path d="M2 4h10M5 4V2h4v2M6 6v5M8 6v5M3 4l1 8h6l1-8"/>
                </svg>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ── Total ── */}
      <div className="total-bar">
        <span className="total-label">Total previsto esta semana</span>
        <strong className="total-valor">R$ 1.880</strong>
      </div>

    </div>
  );
}

export default Clientes;