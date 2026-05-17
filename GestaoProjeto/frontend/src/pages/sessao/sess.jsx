// pages/novaSessao/novaSessao.jsx
import { useState } from 'react';
import './sess.css';

// ── Dados mockup ──────────────────────────────────────────
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

const DIAS_SEMANA = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];

function hoje() {
  return new Date().toISOString().split('T')[0];
}

function emptyForm() {
  return {
    clienteId: '',
    data:      hoje(),
    horario:   '09:00',
    status:    'confirmada',
    obs:       '',
  };
}

function NovaSessao({ onSalvar, onCancelar }) {
  const [form,   setForm]   = useState(emptyForm());
  const [errors, setErrors] = useState({});

  const set = (campo, val) => {
    setForm(f => ({ ...f, [campo]: val }));
    setErrors(e => ({ ...e, [campo]: '' }));
  };

  const clienteSel = CLIENTES_MOCK.find(c => c.id === parseInt(form.clienteId));
  const statusSel  = STATUS_OPTIONS.find(s => s.value === form.status);

  function validar() {
    const errs = {};
    if (!form.clienteId) errs.clienteId = 'Selecione um cliente.';
    if (!form.data)      errs.data      = 'Informe a data.';
    return errs;
  }

  function handleSalvar() {
    const errs = validar();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSalvar?.({
      clienteId: parseInt(form.clienteId),
      data:      form.data,
      horario:   form.horario,
      status:    form.status,
      obs:       form.obs.trim(),
    });
    setForm(emptyForm());
    setErrors({});
  }

  function handleCancelar() {
    setForm(emptyForm());
    setErrors({});
    onCancelar?.();
  }

  // Formata data para exibição no preview
  function fmtData(iso) {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  // Dia da semana
  function diaSemana(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    return DIAS_SEMANA[new Date(y, m - 1, d).getDay()];
  }

  // Iniciais do cliente
  function iniciais(nome) {
    return nome.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }

  return (
    <div className="ns-page">

      {/* Topo */}
      <div className="ns-topo">
        <div>
          <h2 className="ns-titulo">Nova sessão</h2>
          <p className="ns-sub">Agende uma sessão para um cliente</p>
        </div>
      </div>

      <div className="ns-layout">

        {/* ── Formulário ── */}
        <div className="card ns-form-card">
          <div className="card-head">
            <span className="card-title">Dados da sessão</span>
          </div>

          <div className="ns-form">

            {/* Cliente */}
            <div className="ns-field form-full">
              <label className="f-label">Cliente *</label>
              <select
                className={`f-select ${errors.clienteId ? 'f-input-error' : ''}`}
                value={form.clienteId}
                onChange={e => set('clienteId', e.target.value)}
              >
                <option value="">Selecione um cliente...</option>
                {CLIENTES_MOCK.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
              {errors.clienteId && <span className="f-error">{errors.clienteId}</span>}
            </div>

            {/* Data */}
            <div className="ns-field">
              <label className="f-label">Data *</label>
              <input
                className={`f-input ${errors.data ? 'f-input-error' : ''}`}
                type="date"
                value={form.data}
                onChange={e => set('data', e.target.value)}
              />
              {errors.data && <span className="f-error">{errors.data}</span>}
            </div>

            {/* Horário */}
            <div className="ns-field">
              <label className="f-label">Horário *</label>
              <select
                className="f-select"
                value={form.horario}
                onChange={e => set('horario', e.target.value)}
              >
                {HORARIOS.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="ns-field form-full">
              <label className="f-label">Status</label>
              <div className="status-options">
                {STATUS_OPTIONS.map(s => (
                  <button
                    key={s.value}
                    className={`status-opt ${form.status === s.value ? 'ativo' : ''}`}
                    style={form.status === s.value
                      ? { background: s.bg, color: s.cor, borderColor: s.cor }
                      : {}
                    }
                    onClick={() => set('status', s.value)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Observações */}
            <div className="ns-field form-full">
              <label className="f-label">Observações</label>
              <textarea
                className="f-textarea"
                value={form.obs}
                onChange={e => set('obs', e.target.value)}
                placeholder="Anotações sobre esta sessão (opcional)..."
                rows={4}
              />
            </div>

          </div>

          {/* Ações */}
          <div className="ns-acoes">
            <button className="btn-cancelar" onClick={handleCancelar}>Cancelar</button>
            <button className="btn-salvar"   onClick={handleSalvar}>Agendar sessão</button>
          </div>
        </div>

        {/* ── Preview ── */}
        <div className="ns-preview-col">

          <div className="card ns-preview-card">
            <div className="card-head">
              <span className="card-title">Preview</span>
            </div>
            <div className="ns-preview">

              {/* Cliente */}
              {clienteSel ? (
                <div className="ns-prev-cliente">
                  <div className="ns-avatar">{iniciais(clienteSel.nome)}</div>
                  <div>
                    <div className="ns-prev-nome">{clienteSel.nome}</div>
                    <div className="ns-prev-plano">{clienteSel.plano}</div>
                  </div>
                </div>
              ) : (
                <div className="ns-prev-vazio">
                  <div className="ns-avatar">?</div>
                  <div className="ns-prev-nome" style={{ color: '#a09ebb' }}>
                    Nenhum cliente selecionado
                  </div>
                </div>
              )}

              <div className="ns-prev-divider" />

              {/* Infos */}
              <div className="ns-prev-info">

                <div className="ns-info-row">
                  <span className="ns-info-lbl">Data</span>
                  <span className="ns-info-val">
                    {fmtData(form.data)}
                    {form.data && (
                      <span className="ns-dia-semana"> · {diaSemana(form.data)}</span>
                    )}
                  </span>
                </div>

                <div className="ns-info-row">
                  <span className="ns-info-lbl">Horário</span>
                  <span className="ns-info-val">{form.horario}</span>
                </div>

                <div className="ns-info-row">
                  <span className="ns-info-lbl">Duração</span>
                  <span className="ns-info-val">60 min</span>
                </div>

                <div className="ns-info-row">
                  <span className="ns-info-lbl">Valor</span>
                  <span className="ns-info-val">
                    {clienteSel ? `R$ ${clienteSel.valor}` : '—'}
                  </span>
                </div>

                <div className="ns-info-row">
                  <span className="ns-info-lbl">Status</span>
                  {statusSel && (
                    <span
                      className="ns-status-badge"
                      style={{ background: statusSel.bg, color: statusSel.cor }}
                    >
                      {statusSel.label}
                    </span>
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* Dica */}
          <div className="ns-dica">
            <div className="ns-dica-icon">💡</div>
            <p>
              Sessões confirmadas aparecem na agenda e no resumo semanal do dashboard.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default NovaSessao;