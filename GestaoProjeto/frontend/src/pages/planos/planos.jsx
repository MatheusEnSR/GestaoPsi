// pages/planos/planos.jsx
import { useState } from 'react';
import './planos.css';

// ── Dados mockup ──────────────────────────────────────────
const CORES = [
  '#3C3489','#3B6D11','#0C447C','#633806',
  '#791F1F','#085041','#72243E','#555370',
];

const PLANOS_MOCK = [
  { id: 1, nome: 'Particular',     cor: '#3C3489', repasse: 0,   clientes: 2 },
  { id: 2, nome: 'Unimed',         cor: '#3B6D11', repasse: 150, clientes: 1 },
  { id: 3, nome: 'Bradesco Saúde', cor: '#0C447C', repasse: 130, clientes: 1 },
  { id: 4, nome: 'SulAmérica',     cor: '#633806', repasse: 120, clientes: 1 },
  { id: 5, nome: 'Amil',           cor: '#085041', repasse: 110, clientes: 0 },
  { id: 6, nome: 'Hapvida',        cor: '#555370', repasse: 100, clientes: 0 },
  { id: 7, nome: 'Porto Seguro',   cor: '#72243E', repasse: 120, clientes: 0 },
];

// ── Modal plano ───────────────────────────────────────────
function ModalPlano({ open, onClose, onSalvar, plano }) {
  const [nome,    setNome]    = useState(plano?.nome    ?? '');
  const [repasse, setRepasse] = useState(plano?.repasse ?? '');
  const [cor,     setCor]     = useState(plano?.cor     ?? CORES[0]);

  // reseta quando abre
  useState(() => {
    if (open) {
      setNome(plano?.nome    ?? '');
      setRepasse(plano?.repasse ?? '');
      setCor(plano?.cor     ?? CORES[0]);
    }
  }, [open, plano]);

  function handleSalvar() {
    if (!nome.trim()) return;
    onSalvar({ nome: nome.trim(), repasse: parseFloat(repasse) || 0, cor });
    onClose();
  }

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">

        <div className="modal-head">
          <span className="modal-titulo">{plano ? 'Editar plano' : 'Novo plano'}</span>
          <button className="modal-fechar" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-col">

            <div>
              <label className="f-label">Nome do plano *</label>
              <input
                className="f-input"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: Unimed"
              />
            </div>

            <div>
              <label className="f-label">Valor de repasse por sessão (R$)</label>
              <input
                className="f-input"
                type="number"
                min="0"
                step="0.01"
                value={repasse}
                onChange={e => setRepasse(e.target.value)}
                placeholder="0,00"
              />
            </div>

            <div>
              <label className="f-label">Cor</label>
              <div className="swatches">
                {CORES.map(c => (
                  <div
                    key={c}
                    className={`swatch ${cor === c ? 'swatch-ativo' : ''}`}
                    style={{ background: c }}
                    onClick={() => setCor(c)}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-salvar" onClick={handleSalvar}>Salvar plano</button>
        </div>

      </div>
    </div>
  );
}

// ── Confirm delete ────────────────────────────────────────
function ModalConfirm({ open, nome, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="confirm-box">
        <div className="confirm-titulo">Excluir plano</div>
        <div className="confirm-msg">
          Tem certeza que deseja excluir <strong>{nome}</strong>?
          Clientes vinculados ficarão sem plano associado.
        </div>
        <div className="confirm-acoes">
          <button className="btn-cancelar" onClick={onCancel}>Cancelar</button>
          <button className="btn-excluir" onClick={onConfirm}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────
function Planos() {
  const [planos,     setPlanos]     = useState(PLANOS_MOCK);
  const [modal,      setModal]      = useState(false);
  const [editPlano,  setEditPlano]  = useState(null);
  const [confirmId,  setConfirmId]  = useState(null);

  function abrirNovo()  { setEditPlano(null); setModal(true); }
  function abrirEditar(p){ setEditPlano(p);   setModal(true); }
  function fecharModal() { setModal(false);   setEditPlano(null); }

  function salvarPlano(dados) {
    if (editPlano) {
      setPlanos(prev => prev.map(p => p.id === editPlano.id ? { ...p, ...dados } : p));
    } else {
      setPlanos(prev => [...prev, { id: Date.now(), clientes: 0, ...dados }]);
    }
  }

  function excluirPlano() {
    setPlanos(prev => prev.filter(p => p.id !== confirmId));
    setConfirmId(null);
  }

  const confirmPlano = planos.find(p => p.id === confirmId);

  return (
    <div className="planos-page">

      {/* Topo */}
      <div className="planos-topo">
        <div>
          <h2 className="planos-titulo">Planos de saúde</h2>
          <p className="planos-sub">{planos.length} plano{planos.length !== 1 ? 's' : ''} cadastrados</p>
        </div>
        <button className="btn-novo" onClick={abrirNovo}>+ Novo plano</button>
      </div>

      {/* Lista */}
      <div className="card">
        {!planos.length ? (
          <div className="vazio">Nenhum plano cadastrado.</div>
        ) : (
          planos.map(p => (
            <div key={p.id} className="plano-row">

              {/* Cor */}
              <div className="plano-cor" style={{ background: p.cor }} />

              {/* Nome */}
              <div className="plano-nome">{p.nome}</div>

              {/* Repasse */}
              <div className="plano-repasse">
                {p.repasse > 0
                  ? `Repasse: R$ ${p.repasse}/sessão`
                  : 'Sem repasse definido'
                }
              </div>

              {/* Badge clientes */}
              <span className="plano-badge">
                {p.clientes} cliente{p.clientes !== 1 ? 's' : ''}
              </span>

              {/* Ações */}
              <div className="plano-acoes">
                <button className="icon-btn" title="Editar" onClick={() => abrirEditar(p)}>
                  <svg viewBox="0 0 14 14" width="13" height="13" fill="#6b6887">
                    <path d="M10.3 1.7a1 1 0 011.4 1.4L4 10.8l-2 .5.5-2 7.8-7.6z"/>
                  </svg>
                </button>
                <button className="icon-btn danger" title="Excluir" onClick={() => setConfirmId(p.id)}>
                  <svg viewBox="0 0 14 14" width="13" height="13" fill="#6b6887">
                    <path d="M2 4h10M5 4V2h4v2M6 6v5M8 6v5M3 4l1 8h6l1-8"/>
                  </svg>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Modais */}
      <ModalPlano
        open={modal}
        onClose={fecharModal}
        onSalvar={salvarPlano}
        plano={editPlano}
      />

      <ModalConfirm
        open={!!confirmId}
        nome={confirmPlano?.nome}
        onConfirm={excluirPlano}
        onCancel={() => setConfirmId(null)}
      />

    </div>
  );
}

export default Planos;