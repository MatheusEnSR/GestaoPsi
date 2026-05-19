// pages/arquivo/arquivo.jsx
import { useState } from 'react';
import './arquivo.css';

// ── Dados mockup ──────────────────────────────────────────
const NOMES_MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

const CLIENTES_MOCK = [
  { id: 1, nome: 'Ana Paula Ferreira',     plano: 'Unimed',     valor: 180 },
  { id: 2, nome: 'Carlos Eduardo Souza',   plano: 'Particular', valor: 220 },
  { id: 3, nome: 'Mariana Costa Lima',     plano: 'Bradesco',   valor: 150 },
  { id: 4, nome: 'Rafael Mendes Oliveira', plano: 'SulAmérica', valor: 200 },
  { id: 5, nome: 'Fernanda Santos Reis',   plano: 'Particular', valor: 250 },
];

const HORARIOS = [
  '07:00','07:30','08:00','08:30','09:00','09:30',
  '10:00','10:30','11:00','11:30','12:00','12:30',
  '13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30','19:00',
];

const STATUS_OPTIONS = [
  { value: 'confirmada', label: 'Confirmada', bg: '#EEEDFE', cor: '#3C3489' },
  { value: 'realizada',  label: 'Realizada',  bg: '#EAF3DE', cor: '#3B6D11' },
  { value: 'cancelada',  label: 'Cancelada',  bg: '#FCEBEB', cor: '#791F1F' },
  { value: 'falta',      label: 'Falta',      bg: '#FAEEDA', cor: '#633806' },
];

const STATUS_COR = {
  confirmada: { bg: '#EEEDFE', cor: '#3C3489', borda: '#534AB7' },
  realizada:  { bg: '#EAF3DE', cor: '#3B6D11', borda: '#639922' },
  cancelada:  { bg: '#FCEBEB', cor: '#791F1F', borda: '#E24B4A' },
  falta:      { bg: '#FAEEDA', cor: '#633806', borda: '#EF9F27' },
};

const ANOS_MOCK = [
  {
    ano: 2025,
    meses: [0,1,2,3,4],
    stats: { faturamento: 'R$ 18.400', sessoes: 92, clientes: 5, saidas: 0 },
    sessoesMes: {
      0: [
        { id: 1, dia: 2,  clienteId: 1, horario: '09:00', status: 'realizada'  },
        { id: 2, dia: 2,  clienteId: 2, horario: '10:00', status: 'realizada'  },
        { id: 3, dia: 9,  clienteId: 1, horario: '09:00', status: 'realizada'  },
        { id: 4, dia: 16, clienteId: 3, horario: '11:00', status: 'falta'      },
        { id: 5, dia: 23, clienteId: 1, horario: '09:00', status: 'realizada'  },
      ],
      1: [
        { id: 6, dia: 6,  clienteId: 1, horario: '09:00', status: 'realizada'  },
        { id: 7, dia: 6,  clienteId: 5, horario: '14:00', status: 'realizada'  },
        { id: 8, dia: 13, clienteId: 5, horario: '14:00', status: 'falta'      },
        { id: 9, dia: 20, clienteId: 1, horario: '09:00', status: 'realizada'  },
      ],
    },
  },
  {
    ano: 2024,
    meses: [0,1,2,3,4,5,6,7,8,9,10,11],
    stats: { faturamento: 'R$ 42.800', sessoes: 214, clientes: 4, saidas: 1 },
    sessoesMes: {},
  },
];

// ── Helpers ───────────────────────────────────────────────
function getCliente(id) {
  return CLIENTES_MOCK.find(c => c.id === id);
}

function iniciais(nome) {
  return nome.split(' ').filter(Boolean).slice(0,2).map(p => p[0].toUpperCase()).join('');
}

function calcStats(sessoesMes) {
  let total = 0, fat = 0;
  Object.values(sessoesMes || {}).forEach(lista => {
    lista.forEach(s => {
      total++;
      const c = getCliente(s.clienteId);
      if (c && s.status !== 'cancelada' && s.status !== 'falta') fat += c.valor;
    });
  });
  return { total, fat };
}

function calcStatsMes(sessoes) {
  let fat = 0;
  const ids = new Set();
  sessoes.forEach(s => {
    const c = getCliente(s.clienteId);
    if (c) {
      ids.add(c.id);
      if (s.status !== 'cancelada' && s.status !== 'falta') fat += c.valor;
    }
  });
  return { fat, total: sessoes.length, clientes: ids.size };
}

// ── Modal sessão do dia ───────────────────────────────────
function ModalDia({ open, dia, mes, ano, sessoesDia, onClose, onSalvar, onExcluir }) {
  const [form, setForm] = useState({ clienteId: '', horario: '09:00', status: 'realizada' });
  const [adicionando, setAdicionando] = useState(false);

  const set = (campo, val) => setForm(f => ({ ...f, [campo]: val }));

  function handleAdicionar() {
    if (!form.clienteId) return;
    onSalvar({
      id:        Date.now(),
      dia,
      clienteId: parseInt(form.clienteId),
      horario:   form.horario,
      status:    form.status,
    });
    setForm({ clienteId: '', horario: '09:00', status: 'realizada' });
    setAdicionando(false);
  }

  function handleStatusChange(sessaoId, novoStatus) {
    onSalvar({ id: sessaoId, update: true, status: novoStatus });
  }

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) { onClose(); setAdicionando(false); } }}>
      <div className="modal-box">

        <div className="modal-head">
          <span className="modal-titulo">
            {dia} de {NOMES_MESES[mes]} · {ano}
          </span>
          <button className="modal-fechar" onClick={() => { onClose(); setAdicionando(false); }}>×</button>
        </div>

        <div className="modal-body">

          {/* Lista de sessões do dia */}
          {!sessoesDia.length && !adicionando && (
            <div className="dia-vazio">Nenhuma sessão neste dia.</div>
          )}

          {sessoesDia.map(s => {
            const c = getCliente(s.clienteId);
            if (!c) return null;
            const st = STATUS_COR[s.status] || STATUS_COR.confirmada;
            return (
              <div key={s.id} className="dia-sessao-row">

                {/* Avatar + info */}
                <div className="dia-sess-av" style={{ background: st.bg, color: st.cor }}>
                  {iniciais(c.nome)}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="dia-sess-nome">{c.nome}</div>
                  <div className="dia-sess-meta">{s.horario} · {c.plano}</div>
                </div>

                {/* Seletor de status inline */}
                <select
                  className="dia-status-sel"
                  value={s.status}
                  style={{ borderColor: st.borda, color: st.cor, background: st.bg }}
                  onChange={e => handleStatusChange(s.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                {/* Excluir */}
                <button
                  className="dia-del-btn"
                  onClick={() => onExcluir(s.id)}
                  title="Remover sessão"
                >×</button>

              </div>
            );
          })}

          {/* Formulário de adicionar */}
          {adicionando && (
            <div className="dia-add-form">
              <div className="dia-add-row">
                <div style={{ flex: 1 }}>
                  <label className="f-label">Cliente *</label>
                  <select className="f-select" value={form.clienteId} onChange={e => set('clienteId', e.target.value)}>
                    <option value="">Selecione...</option>
                    {CLIENTES_MOCK.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="f-label">Horário</label>
                  <select className="f-select" value={form.horario} onChange={e => set('horario', e.target.value)}>
                    {HORARIOS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <label className="f-label">Status</label>
                <div className="status-options">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s.value}
                      className={`status-opt ${form.status === s.value ? 'ativo' : ''}`}
                      style={form.status === s.value ? { background: s.bg, color: s.cor, borderColor: s.cor } : {}}
                      onClick={() => set('status', s.value)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="dia-add-acoes">
                <button className="btn-cancelar" onClick={() => setAdicionando(false)}>Cancelar</button>
                <button className="btn-salvar" onClick={handleAdicionar}>Adicionar</button>
              </div>
            </div>
          )}

          {/* Botão adicionar */}
          {!adicionando && (
            <button className="dia-add-btn" onClick={() => setAdicionando(true)}>
              + Adicionar sessão neste dia
            </button>
          )}

        </div>

        <div className="modal-footer">
          <button className="btn-salvar" onClick={() => { onClose(); setAdicionando(false); }}>
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}

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
    if (!anoNum || !mesesSel.size) return;
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
            <input className="f-input" type="number" min="2000" max="2100"
              value={anoNum} onChange={e => setAnoNum(e.target.value)} placeholder="Ex: 2025" />
          </div>
          <div>
            <label className="f-label">Meses</label>
            <div className="meses-check">
              {NOMES_MESES.map((n, i) => (
                <label key={i} className="check-label">
                  <input type="checkbox" checked={mesesSel.has(i)}
                    onChange={() => toggleMes(i)} style={{ accentColor: '#3c3489' }} />
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
                  <input type="checkbox" checked={mesesSel.has(i)}
                    onChange={() => toggleMes(i)} disabled={existe}
                    style={{ accentColor: '#3c3489' }} />
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

// ── Calendário do mês ─────────────────────────────────────
function CalendarioMes({ ano, mes, sessoes, onClickDia }) {
  const diasSemana = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
  const diasMes    = new Date(ano, mes + 1, 0).getDate();
  const pDow       = new Date(ano, mes, 1).getDay();
  const vazios     = pDow === 0 ? 6 : pDow - 1;
  const hoje       = new Date();
  const isHoje     = (d) => hoje.getFullYear() === ano && hoje.getMonth() === mes && hoje.getDate() === d;

  // Agrupa sessões por dia
  const porDia = {};
  sessoes.forEach(s => {
    if (!porDia[s.dia]) porDia[s.dia] = [];
    porDia[s.dia].push(s);
  });

  return (
    <div className="cal-edit-wrap">
      <div className="cal-edit-grid">
        {diasSemana.map(d => (
          <div key={d} className="cal-dlbl">{d}</div>
        ))}
        {Array.from({ length: vazios }, (_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: diasMes }, (_, i) => {
          const d = i + 1;
          const dSess = porDia[d] || [];
          return (
            <div
              key={d}
              className={`cal-edit-day ${isHoje(d) ? 'today-d' : ''}`}
              onClick={() => onClickDia(d)}
            >
              <div className="cal-edit-num">{d}</div>
              {dSess.map(s => {
                const c  = getCliente(s.clienteId);
                const st = STATUS_COR[s.status] || STATUS_COR.confirmada;
                return (
                  <div
                    key={s.id}
                    className="cal-edit-sess"
                    style={{ background: st.bg, color: st.cor, borderLeftColor: st.borda }}
                  >
                    <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>
                      {c?.nome.split(' ')[0] ?? '?'}
                    </span>
                    <span style={{ fontSize:8, opacity:.7 }}>{s.horario}</span>
                  </div>
                );
              })}
              <div className="cal-edit-add">+ add</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Resumo de clientes do mês ─────────────────────────────
function ResumoClientes({ sessoes, mes }) {
  const cliMap = {};
  sessoes.forEach(s => {
    if (!cliMap[s.clienteId]) cliMap[s.clienteId] = { sessoes: [], fat: 0 };
    const c = getCliente(s.clienteId);
    cliMap[s.clienteId].sessoes.push(s);
    if (c && s.status !== 'cancelada' && s.status !== 'falta') {
      cliMap[s.clienteId].fat += c.valor;
    }
  });

  const lista = Object.entries(cliMap).sort((a,b) => b[1].sessoes.length - a[1].sessoes.length);

  if (!lista.length) return (
    <div style={{ fontSize:12, color:'#a09ebb', padding:'8px 0' }}>Sem sessões neste mês.</div>
  );

  return lista.map(([cid, data]) => {
    const c = getCliente(parseInt(cid)); if (!c) return null;
    return (
      <div key={cid} className="cli-mes-row">
        <div className="cli-mes-avatar">{iniciais(c.nome)}</div>
        <div style={{ flex:1 }}>
          <div className="cli-mes-nome">{c.nome}</div>
          <div className="chips-wrap">
            {data.sessoes.map((s, i) => {
              const st = STATUS_COR[s.status] || STATUS_COR.confirmada;
              return (
                <span key={i} className="chip-dia" style={{ background: st.bg, color: st.cor }}>
                  {String(s.dia).padStart(2,'0')}/{String(mes+1).padStart(2,'0')}
                </span>
              );
            })}
          </div>
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div className="cli-mes-sessoes">{data.sessoes.length}x</div>
          <div className="cli-mes-total">R$ {data.fat}</div>
        </div>
      </div>
    );
  });
}

// ── Detalhe do mês ────────────────────────────────────────
function DetalhesMes({ ano, mes, sessoes, onSessaoChange }) {
  const [diaSel,     setDiaSel]     = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  const stats     = calcStatsMes(sessoes);
  const sessoesDia = diaSel !== null ? sessoes.filter(s => s.dia === diaSel) : [];

  function handleSalvar(dados) {
    if (dados.update) {
      // Atualiza status
      onSessaoChange(mes, sessoes.map(s => s.id === dados.id ? { ...s, status: dados.status } : s));
    } else {
      // Adiciona nova
      onSessaoChange(mes, [...sessoes, dados]);
    }
  }

  function handleExcluir(id) {
    onSessaoChange(mes, sessoes.filter(s => s.id !== id));
  }

  function handleClickDia(d) {
    setDiaSel(d);
    setModalAberto(true);
  }

  return (
    <div className="mes-detalhe">

      {/* Título */}
      <div style={{ fontSize:14, fontWeight:600, color:'#1a1a2e' }}>
        {NOMES_MESES[mes]} · {ano}
      </div>

      {/* Métricas */}
      <div className="mes-metricas">
        <div className="mes-metric">
          <div className="mes-metric-lbl">Faturamento</div>
          <div className="mes-metric-val">R$ {stats.fat}</div>
        </div>
        <div className="mes-metric">
          <div className="mes-metric-lbl">Sessões</div>
          <div className="mes-metric-val">{stats.total}</div>
        </div>
        <div className="mes-metric">
          <div className="mes-metric-lbl">Clientes</div>
          <div className="mes-metric-val">{stats.clientes}</div>
        </div>
      </div>

      {/* Instrução */}
      <div className="cal-instrucao">
        📅 Clique em qualquer dia para adicionar ou editar sessões
      </div>

      {/* Calendário editável */}
      <CalendarioMes
        ano={ano}
        mes={mes}
        sessoes={sessoes}
        onClickDia={handleClickDia}
      />

      {/* Resumo por cliente */}
      <div>
        <div className="sec-label">Sessões por cliente</div>
        <div className="card" style={{ boxShadow:'none' }}>
          <ResumoClientes sessoes={sessoes} mes={mes} />
        </div>
      </div>

      {/* Modal do dia */}
      <ModalDia
        key={`${ano}-${mes}-${diaSel}`}
        open={modalAberto}
        dia={diaSel}
        mes={mes}
        ano={ano}
        sessoesDia={sessoesDia}
        onClose={() => setModalAberto(false)}
        onSalvar={handleSalvar}
        onExcluir={handleExcluir}
      />
    </div>
  );
}

// ── Vista de um ano ───────────────────────────────────────
function VistaAno({ anoObj, onVoltar, onAddMes, onSessaoChange }) {
  const [mesSel, setMesSel] = useState(null);

  const sessoesMes = anoObj.sessoesMes ?? {};

  return (
    <div className="arquivo-page">
      <div className="arquivo-topo">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button className="btn-voltar" onClick={onVoltar}>← Voltar</button>
          <h2 className="arquivo-titulo">{anoObj.ano}</h2>
        </div>
        <button className="btn-novo" onClick={onAddMes}>+ Adicionar mês</button>
      </div>

      {/* Métricas */}
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
            const sess  = sessoesMes[m] || [];
            const stats = calcStatsMes(sess);
            return (
              <button
                key={m}
                className={`mes-btn ${mesSel === m ? 'ativo' : ''}`}
                onClick={() => setMesSel(prev => prev === m ? null : m)}
              >
                <div className="mes-btn-nome">{NOMES_MESES[m]}</div>
                <div className="mes-btn-fat">R$ {stats.fat}</div>
              </button>
            );
          })}
        </div>

        {mesSel !== null && (
          <DetalhesMes
            key={`${anoObj.ano}-${mesSel}`}
            ano={anoObj.ano}
            mes={mesSel}
            sessoes={sessoesMes[mesSel] || []}
            onSessaoChange={(m, novasSessoes) => onSessaoChange(anoObj.ano, m, novasSessoes)}
          />
        )}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────
function Arquivo() {
  const [anos,     setAnos]     = useState(ANOS_MOCK);
  const [anoSel,   setAnoSel]   = useState(null);
  const [modalAno, setModalAno] = useState(false);
  const [modalMes, setModalMes] = useState(false);

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
        sessoesMes: {},
      }].sort((a,b) => b.ano - a.ano);
    });
  }

  function adicionarMes(meses) {
    setAnos(prev => prev.map(a => a.ano === anoSel
      ? { ...a, meses: [...new Set([...a.meses, ...meses])].sort((x,y) => x-y) }
      : a
    ));
  }

  function atualizarSessoes(ano, mes, novasSessoes) {
    setAnos(prev => prev.map(a => a.ano === ano
      ? { ...a, sessoesMes: { ...a.sessoesMes, [mes]: novasSessoes } }
      : a
    ));
  }

  if (anoSel && anoObj) {
    return (
      <>
        <VistaAno
          anoObj={anoObj}
          onVoltar={() => setAnoSel(null)}
          onAddMes={() => setModalMes(true)}
          onSessaoChange={atualizarSessoes}
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
        <div className="card" style={{ padding:48, textAlign:'center', color:'#a09ebb', fontSize:13 }}>
          Nenhum ano cadastrado.
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
                <div className="ano-stat"><div className="ano-stat-lbl">Faturamento</div><div className="ano-stat-val">{a.stats.faturamento}</div></div>
                <div className="ano-stat"><div className="ano-stat-lbl">Sessões</div><div className="ano-stat-val">{a.stats.sessoes}</div></div>
                <div className="ano-stat"><div className="ano-stat-lbl">Clientes ativos</div><div className="ano-stat-val">{a.stats.clientes}</div></div>
                <div className="ano-stat"><div className="ano-stat-lbl">Saídas</div><div className="ano-stat-val">{a.stats.saidas}</div></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalAno open={modalAno} onClose={() => setModalAno(false)} onSalvar={adicionarAno} />
    </div>
  );
}

export default Arquivo;