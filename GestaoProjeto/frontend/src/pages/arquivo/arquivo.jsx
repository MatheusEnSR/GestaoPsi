// pages/arquivo/arquivo.jsx
import { useState } from 'react';
import './arquivo.css';

// ── Dados mockup ──────────────────────────────────────────
const NOMES_MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

const ANOS_MOCK = [
  {
    ano: 2025,
    meses: [0,1,2,3,4],
    stats: { faturamento: 'R$ 18.400', sessoes: 92, clientes: 5, saidas: 0 },
    detalhesMes: {
      0: { faturamento: 'R$ 3.200', sessoes: 16, semanas: ['R$ 800','R$ 800','R$ 800','R$ 800'], clientes: [{ nome:'Ana Paula F.', sessoes: 4, total:'R$ 720', dias:['02/01','09/01','16/01','23/01'], status:['confirmada','realizada','realizada','realizada'] },{ nome:'Carlos E. S.', sessoes: 4, total:'R$ 880', dias:['03/01','10/01','17/01','24/01'], status:['realizada','realizada','falta','realizada'] }] },
      1: { faturamento: 'R$ 3.600', sessoes: 18, semanas: ['R$ 900','R$ 900','R$ 900','R$ 900'], clientes: [{ nome:'Ana Paula F.', sessoes: 4, total:'R$ 720', dias:['06/02','13/02','20/02','27/02'], status:['realizada','realizada','realizada','confirmada'] },{ nome:'Fernanda S. R.', sessoes: 6, total:'R$ 1.500', dias:['04/02','06/02','11/02','13/02','18/02','20/02'], status:['realizada','realizada','realizada','realizada','falta','realizada'] }] },
      2: { faturamento: 'R$ 3.800', sessoes: 19, semanas: ['R$ 950','R$ 950','R$ 950','R$ 950'], clientes: [{ nome:'Rafael M. O.', sessoes: 5, total:'R$ 1.000', dias:['03/03','10/03','17/03','24/03','31/03'], status:['realizada','realizada','realizada','realizada','cancelada'] }] },
      3: { faturamento: 'R$ 3.900', sessoes: 20, semanas: ['R$ 975','R$ 975','R$ 975','R$ 975'], clientes: [] },
      4: { faturamento: 'R$ 3.900', sessoes: 19, semanas: ['R$ 975','R$ 975','R$ 975','R$ 975'], clientes: [] },
    },
  },
  {
    ano: 2024,
    meses: [0,1,2,3,4,5,6,7,8,9,10,11],
    stats: { faturamento: 'R$ 42.800', sessoes: 214, clientes: 4, saidas: 1 },
    detalhesMes: {
      0: { faturamento: 'R$ 3.200', sessoes: 16, semanas: ['R$ 800','R$ 800','R$ 800','R$ 800'], clientes: [] },
    },
  },
];

const STATUS_COR = {
  confirmada: { bg: '#EEEDFE', cor: '#3C3489' },
  realizada:  { bg: '#EAF3DE', cor: '#3B6D11' },
  cancelada:  { bg: '#FCEBEB', cor: '#791F1F' },
  falta:      { bg: '#FAEEDA', cor: '#633806' },
};

// ── Modal adicionar ano ───────────────────────────────────
function ModalAno({ open, onClose, onSalvar }) {
  const [anoNum,   setAnoNum]   = useState(new Date().getFullYear());
  const [mesesSel, setMesesSel] = useState(new Set([0,1,2,3,4,5,6,7,8,9,10,11]));

  function toggleMes(m) {
    setMesesSel(prev => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });
  }

  function handleSalvar() {
    if (!anoNum || mesesSel.size === 0) return;
    onSalvar(parseInt(anoNum), [...mesesSel].sort((a,b) => a - b));
    onClose();
  }

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box modal-sm">
        <div className="modal-head">
          <span className="modal-titulo">Adicionar ano</span>
          <button className="modal-fechar" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: 14 }}>
            <label className="f-label">Ano *</label>
            <input
              className="f-input"
              type="number"
              min="2000" max="2100"
              value={anoNum}
              onChange={e => setAnoNum(e.target.value)}
              placeholder="Ex: 2025"
            />
          </div>
          <div>
            <label className="f-label">Meses</label>
            <div className="meses-check">
              {NOMES_MESES.map((n, i) => (
                <label key={i} className="check-label">
                  <input
                    type="checkbox"
                    checked={mesesSel.has(i)}
                    onChange={() => toggleMes(i)}
                    style={{ accentColor: '#3c3489' }}
                  />
                  {n}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-salvar" onClick={handleSalvar}>Adicionar</button>
        </div>
      </div>
    </div>
  );
}

// ── Modal adicionar mês ───────────────────────────────────
function ModalMes({ open, onClose, onSalvar, mesesExistentes }) {
  const [mesesSel, setMesesSel] = useState(new Set());

  function toggleMes(m) {
    if (mesesExistentes.includes(m)) return;
    setMesesSel(prev => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });
  }

  function handleSalvar() {
    if (!mesesSel.size) return;
    onSalvar([...mesesSel].sort((a,b) => a - b));
    setMesesSel(new Set());
    onClose();
  }

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box modal-sm">
        <div className="modal-head">
          <span className="modal-titulo">Adicionar mês</span>
          <button className="modal-fechar" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <label className="f-label">Selecione os meses</label>
          <div className="meses-check">
            {NOMES_MESES.map((n, i) => {
              const existe = mesesExistentes.includes(i);
              return (
                <label key={i} className={`check-label ${existe ? 'check-disabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={mesesSel.has(i)}
                    onChange={() => toggleMes(i)}
                    disabled={existe}
                    style={{ accentColor: '#3c3489' }}
                  />
                  {n}
                </label>
              );
            })}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-salvar" onClick={handleSalvar}>Adicionar</button>
        </div>
      </div>
    </div>
  );
}

// ── Detalhe do mês ────────────────────────────────────────
function DetalhesMes({ ano, mes, dados }) {
  if (!dados) return (
    <div style={{ padding: '16px', fontSize: 12, color: '#a09ebb' }}>
      Sem dados para este mês.
    </div>
  );

  return (
    <div className="mes-detalhe">

      {/* Métricas */}
      <div className="mes-metricas">
        <div className="mes-metric">
          <div className="mes-metric-lbl">Faturamento</div>
          <div className="mes-metric-val">{dados.faturamento}</div>
        </div>
        <div className="mes-metric">
          <div className="mes-metric-lbl">Sessões</div>
          <div className="mes-metric-val">{dados.sessoes}</div>
        </div>
      </div>

      <div className="mes-grid-bottom">

        {/* Faturamento por semana */}
        <div>
          <div className="sec-label">Faturamento por semana</div>
          <div className="semanas-lista">
            {dados.semanas.map((fat, i) => (
              <div key={i} className="semana-row">
                <span className="semana-lbl">Semana {i + 1}</span>
                <span className="semana-val">{fat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sessões por cliente */}
        <div>
          <div className="sec-label">Sessões por cliente</div>
          {!dados.clientes.length
            ? <div style={{ fontSize:12, color:'#a09ebb' }}>Sem registros.</div>
            : dados.clientes.map((c, i) => (
              <div key={i} className="cli-mes-row">
                <div className="cli-mes-avatar">
                  {c.nome.split(' ').slice(0,2).map(p => p[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="cli-mes-nome">{c.nome}</div>
                  <div className="chips-wrap">
                    {c.dias.map((dia, j) => {
                      const st = STATUS_COR[c.status[j]] || STATUS_COR.confirmada;
                      return (
                        <span
                          key={j}
                          className="chip-dia"
                          style={{ background: st.bg, color: st.cor }}
                        >
                          {dia}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div className="cli-mes-sessoes">{c.sessoes}x</div>
                  <div className="cli-mes-total">{c.total}</div>
                </div>
              </div>
            ))
          }
        </div>

      </div>
    </div>
  );
}

// ── Vista de um ano ───────────────────────────────────────
function VistaAno({ anoObj, onVoltar, onAddMes }) {
  const [mesSel, setMesSel] = useState(null);

  return (
    <div className="arquivo-page">

      {/* Topo */}
      <div className="arquivo-topo">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button className="btn-voltar" onClick={onVoltar}>← Voltar</button>
          <h2 className="arquivo-titulo">{anoObj.ano}</h2>
        </div>
        <button className="btn-novo" onClick={onAddMes}>+ Adicionar mês</button>
      </div>

      {/* Métricas do ano */}
      <div className="ano-metricas">
        <div className="metrica-card">
          <div className="metrica-label">Faturamento total</div>
          <div className="metrica-valor">{anoObj.stats.faturamento}</div>
          <div className="metrica-hint">ano de {anoObj.ano}</div>
        </div>
        <div className="metrica-card">
          <div className="metrica-label">Sessões realizadas</div>
          <div className="metrica-valor">{anoObj.stats.sessoes}</div>
          <div className="metrica-hint">no ano</div>
        </div>
        <div className="metrica-card">
          <div className="metrica-label">Clientes ativos</div>
          <div className="metrica-valor">{anoObj.stats.clientes}</div>
          <div className="metrica-hint">com sessão</div>
        </div>
        <div className="metrica-card">
          <div className="metrica-label">Saídas</div>
          <div className="metrica-valor">{anoObj.stats.saidas}</div>
          <div className="metrica-hint">vs ano anterior</div>
        </div>
      </div>

      {/* Meses */}
      <div className="card">
        <div className="card-head">
          <span className="card-title">Meses de {anoObj.ano}</span>
        </div>

        <div className="meses-grid">
          {anoObj.meses.map(m => {
            const det = anoObj.detalhesMes?.[m];
            return (
              <button
                key={m}
                className={`mes-btn ${mesSel === m ? 'ativo' : ''}`}
                onClick={() => setMesSel(prev => prev === m ? null : m)}
              >
                <div className="mes-btn-nome">{NOMES_MESES[m]}</div>
                <div className="mes-btn-fat">{det?.faturamento ?? 'R$ 0'}</div>
              </button>
            );
          })}
        </div>

        {/* Detalhe do mês selecionado */}
        {mesSel !== null && (
          <DetalhesMes
            ano={anoObj.ano}
            mes={mesSel}
            dados={anoObj.detalhesMes?.[mesSel]}
          />
        )}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────
function Arquivo() {
  const [anos,       setAnos]       = useState(ANOS_MOCK);
  const [anoSel,     setAnoSel]     = useState(null);
  const [modalAno,   setModalAno]   = useState(false);
  const [modalMes,   setModalMes]   = useState(false);

  const anoObj = anos.find(a => a.ano === anoSel);

  function adicionarAno(ano, meses) {
    setAnos(prev => {
      const exist = prev.find(a => a.ano === ano);
      if (exist) {
        return prev.map(a => a.ano === ano
          ? { ...a, meses: [...new Set([...a.meses, ...meses])].sort((x,y) => x-y) }
          : a
        );
      }
      return [...prev, {
        ano, meses,
        stats: { faturamento: 'R$ 0', sessoes: 0, clientes: 0, saidas: 0 },
        detalhesMes: {},
      }].sort((a,b) => b.ano - a.ano);
    });
  }

  function adicionarMes(meses) {
    setAnos(prev => prev.map(a => a.ano === anoSel
      ? { ...a, meses: [...new Set([...a.meses, ...meses])].sort((x,y) => x-y) }
      : a
    ));
  }

  // Vista de ano selecionado
  if (anoSel && anoObj) {
    return (
      <>
        <VistaAno
          anoObj={anoObj}
          onVoltar={() => setAnoSel(null)}
          onAddMes={() => setModalMes(true)}
        />
        <ModalMes
          open={modalMes}
          onClose={() => setModalMes(false)}
          onSalvar={adicionarMes}
          mesesExistentes={anoObj.meses}
        />
      </>
    );
  }

  // Lista de anos
  return (
    <div className="arquivo-page">

      <div className="arquivo-topo">
        <div>
          <h2 className="arquivo-titulo">Arquivo anual</h2>
          <p className="arquivo-sub">Histórico completo por ano e mês</p>
        </div>
        <button className="btn-novo" onClick={() => setModalAno(true)}>
          + Adicionar ano
        </button>
      </div>

      {!anos.length ? (
        <div className="card" style={{ padding: 48, textAlign:'center', color:'#a09ebb', fontSize:13 }}>
          Nenhum ano cadastrado. Clique em "+ Adicionar ano" para começar.
        </div>
      ) : (
        <div className="anos-grid">
          {anos.map(a => (
            <div key={a.ano} className="ano-card" onClick={() => setAnoSel(a.ano)}>
              <div className="ano-card-head">
                <span className="ano-numero">{a.ano}</span>
                <span className="ano-badge">{a.meses.length} meses</span>
              </div>
              <div className="ano-stats">
                <div className="ano-stat">
                  <div className="ano-stat-lbl">Faturamento</div>
                  <div className="ano-stat-val">{a.stats.faturamento}</div>
                </div>
                <div className="ano-stat">
                  <div className="ano-stat-lbl">Sessões</div>
                  <div className="ano-stat-val">{a.stats.sessoes}</div>
                </div>
                <div className="ano-stat">
                  <div className="ano-stat-lbl">Clientes ativos</div>
                  <div className="ano-stat-val">{a.stats.clientes}</div>
                </div>
                <div className="ano-stat">
                  <div className="ano-stat-lbl">Saídas</div>
                  <div className="ano-stat-val">{a.stats.saidas}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalAno
        open={modalAno}
        onClose={() => setModalAno(false)}
        onSalvar={adicionarAno}
      />
    </div>
  );
}

export default Arquivo;