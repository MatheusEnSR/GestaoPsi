// home.jsx
import './home.css';
import { useState } from 'react';

import Side     from '../../components/sidebar/sidebar';
import Header   from '../../components/header/header';
import Clientes from '../cliente/cliente';
import Agenda from '../agenda/agenda';
import Arquivo from '../arquivo/arquivo';
import Planos from '../planos/planos';
import NovoCliente from '../novoCliente/novoCliente';
import NovaSessao from '../sessao/sess';

// ── páginas em breve ──
const EmBreve = ({ nome }) => (
  <div style={{ padding: 24, color: '#a09ebb', fontSize: 13 }}>
    {nome} (em breve)
  </div>
);

// ── conteúdo do dashboard (home) ──
function DashboardContent() {

  const metricas = [
    { label: 'Faturamento da semana', valor: 'R$ 1.940', hint: 'semana atual'         },
    { label: 'Sessões realizadas',    valor: '9',         hint: 'esta semana'          },
    { label: 'Clientes ativos',       valor: '5',         hint: 'com sessão na semana' },
    { label: 'Total de clientes',     valor: '5',         hint: 'cadastrados'          },
  ];

  const clientes = [
    { nome: 'Ana Paula F.',   plano: 'Unimed',     freq: 2, dias: ['Seg','Qua'],       total: 'R$ 360', status: ['ok','ok']      },
    { nome: 'Carlos E. S.',   plano: 'Particular', freq: 1, dias: ['Ter'],             total: 'R$ 220', status: ['ok']           },
    { nome: 'Mariana C. L.',  plano: 'Bradesco',   freq: 1, dias: ['Qua'],             total: 'R$ 150', status: ['ok']           },
    { nome: 'Rafael M. O.',   plano: 'SulAmérica', freq: 2, dias: ['Seg','Qui'],       total: 'R$ 400', status: ['ok','no']      },
    { nome: 'Fernanda S. R.', plano: 'Particular', freq: 3, dias: ['Seg','Qua','Sex'], total: 'R$ 750', status: ['ok','ok','ok'] },
  ];

  const sessoesHoje = [
    { hora: '09:00', nome: 'Ana Paula F.',   plano: 'Unimed',     cor: '#534AB7' },
    { hora: '10:00', nome: 'Carlos E. S.',   plano: 'Particular', cor: '#1D9E75' },
    { hora: '14:00', nome: 'Fernanda S. R.', plano: 'Particular', cor: '#185FA5' },
  ];

  const diasSemana    = ['S','T','Q','Q','S','S','D'];
  const diasMes       = Array.from({ length: 31 }, (_, i) => i + 1);
  const diasComSessao = [5,6,7,8,9,12,13,14,15,16];
  const hoje          = 9;
  const iniciaMes     = 3;

  return (
    <>
      {/* Métricas */}
      <div className="metricas-grid">
        {metricas.map((m, i) => (
          <div key={i} className="metrica-card">
            <div className="metrica-label">{m.label}</div>
            <div className="metrica-valor">{m.valor}</div>
            <div className="metrica-hint">{m.hint}</div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="dash-grid">

        {/* Tabela */}
        <div className="card">
          <div className="card-head">
            <span className="card-title">Resumo semanal por cliente</span>
            <button className="card-action">Ver todos →</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Plano</th>
                  <th>Freq.</th>
                  <th>Sessões</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c, i) => (
                  <tr key={i}>
                    <td className="bold">{c.nome}</td>
                    <td><span className="badge">{c.plano}</span></td>
                    <td>
                      <div className="freq-dots">
                        {Array.from({ length: 5 }, (_, j) => (
                          <div key={j} className={`fd ${j < c.freq ? 'fd-on' : 'fd-off'}`} />
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="chips">
                        {c.dias.map((d, j) => (
                          <span key={j} className={`chip ${c.status[j] === 'ok' ? 'chip-ok' : 'chip-no'}`}>
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="bold mono">{c.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coluna direita */}
        <div className="dash-right">

          {/* Mini calendário */}
          <div className="card">
            <div className="mini-cal">
              <div className="cal-head">
                <span className="cal-mes">Maio 2025</span>
                <div className="cal-nav">
                  <button>‹</button>
                  <button>›</button>
                </div>
              </div>
              <div className="cal-grid">
                {diasSemana.map((d, i) => (
                  <div key={i} className="cal-dlbl">{d}</div>
                ))}
                {Array.from({ length: iniciaMes }, (_, i) => (
                  <div key={`e${i}`} />
                ))}
                {diasMes.map(d => (
                  <div
                    key={d}
                    className={`cal-day ${d === hoje ? 'cal-hoje' : ''} ${diasComSessao.includes(d) ? 'cal-has' : ''}`}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sessões de hoje */}
          <div className="card">
            <div className="hoje-list">
              <div className="hoje-label">Hoje · 09/05</div>
              {sessoesHoje.map((s, i) => (
                <div key={i} className="sessao-item">
                  <div className="sessao-bar" style={{ background: s.cor }} />
                  <div>
                    <div className="sessao-nome">{s.hora} · {s.nome}</div>
                    <div className="sessao-info">{s.plano} · 60 min</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// ── Home principal ──
function Home() {
  const [paginaAtual, setPaginaAtual] = useState('dashboard');

  function renderPagina() {
    switch (paginaAtual) {
      case 'dashboard': return <DashboardContent />;
      case 'clientes':  return <Clientes />;
      case 'agenda': return <Agenda />;
      case 'arquivo': return <Arquivo />;
      case 'planos': return <Planos />;
      case 'novo-cliente': return <NovoCliente onCancelar={() => setPaginaAtual('clientes')} />;
      case 'nova-sessao': return <NovaSessao onCancelar={() => setPaginaAtual('agenda')} />;
      default:          return <DashboardContent />;
    }
  }

  return (
    <div className="home">
      <Side onNavClick={setPaginaAtual} paginaAtual={paginaAtual} />
      <div className="home-right">
        <Header />
        <main className="cards">
          {renderPagina()}
        </main>
      </div>
    </div>
  );
}

export default Home;