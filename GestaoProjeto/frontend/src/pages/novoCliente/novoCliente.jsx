// pages/novoCliente/novoCliente.jsx
import { useState } from 'react';
import './novoCliente.css';

const PLANOS = [
  'Particular', 'Unimed', 'Bradesco Saúde',
  'SulAmérica', 'Amil', 'Hapvida', 'Porto Seguro',
];

const FREQ_OPTIONS = [1, 2, 3, 4, 5];

function emptyForm() {
  return {
    nome:    '',
    plano:   '',
    valor:   '',
    freq:    '1',
    tel:     '',
    email:   '',
    obs:     '',
  };
}

function NovoCliente({ onSalvar, onCancelar }) {
  const [form,   setForm]   = useState(emptyForm());
  const [errors, setErrors] = useState({});

  const set = (campo, val) => {
    setForm(f => ({ ...f, [campo]: val }));
    setErrors(e => ({ ...e, [campo]: '' }));
  };

  function validar() {
    const errs = {};
    if (!form.nome.trim())  errs.nome  = 'Nome é obrigatório.';
    if (!form.plano)        errs.plano = 'Selecione um plano.';
    if (!form.valor || isNaN(parseFloat(form.valor)) || parseFloat(form.valor) < 0)
                            errs.valor = 'Informe um valor válido.';
    return errs;
  }

  function handleSalvar() {
    const errs = validar();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSalvar?.({
      nome:   form.nome.trim(),
      plano:  form.plano,
      valor:  parseFloat(form.valor),
      freq:   parseInt(form.freq),
      tel:    form.tel.trim(),
      email:  form.email.trim(),
      obs:    form.obs.trim(),
    });
    setForm(emptyForm());
    setErrors({});
  }

  function handleCancelar() {
    setForm(emptyForm());
    setErrors({});
    onCancelar?.();
  }

  // Gera iniciais para o preview do avatar
  const iniciais = form.nome
    .split(' ').filter(Boolean).slice(0, 2)
    .map(p => p[0].toUpperCase()).join('') || '?';

  return (
    <div className="nc-page">

      {/* Topo */}
      <div className="nc-topo">
        <div>
          <h2 className="nc-titulo">Novo cliente</h2>
          <p className="nc-sub">Preencha os dados do cliente</p>
        </div>
      </div>

      <div className="nc-layout">

        {/* ── Formulário ── */}
        <div className="card nc-form-card">
          <div className="card-head">
            <span className="card-title">Dados do cliente</span>
          </div>

          <div className="nc-form">

            {/* Nome */}
            <div className="nc-field form-full">
              <label className="f-label">Nome completo *</label>
              <input
                className={`f-input ${errors.nome ? 'f-input-error' : ''}`}
                value={form.nome}
                onChange={e => set('nome', e.target.value)}
                placeholder="Ex: Maria da Silva"
              />
              {errors.nome && <span className="f-error">{errors.nome}</span>}
            </div>

            {/* Plano */}
            <div className="nc-field">
              <label className="f-label">Plano de saúde *</label>
              <select
                className={`f-select ${errors.plano ? 'f-input-error' : ''}`}
                value={form.plano}
                onChange={e => set('plano', e.target.value)}
              >
                <option value="">Selecione...</option>
                {PLANOS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.plano && <span className="f-error">{errors.plano}</span>}
            </div>

            {/* Valor */}
            <div className="nc-field">
              <label className="f-label">Valor por sessão (R$) *</label>
              <input
                className={`f-input ${errors.valor ? 'f-input-error' : ''}`}
                type="number"
                min="0"
                step="0.01"
                value={form.valor}
                onChange={e => set('valor', e.target.value)}
                placeholder="0,00"
              />
              {errors.valor && <span className="f-error">{errors.valor}</span>}
            </div>

            {/* Frequência */}
            <div className="nc-field">
              <label className="f-label">Frequência semanal *</label>
              <select
                className="f-select"
                value={form.freq}
                onChange={e => set('freq', e.target.value)}
              >
                {FREQ_OPTIONS.map(n => (
                  <option key={n} value={n}>{n}x por semana</option>
                ))}
              </select>
            </div>

            {/* Telefone */}
            <div className="nc-field">
              <label className="f-label">Telefone</label>
              <input
                className="f-input"
                value={form.tel}
                onChange={e => set('tel', e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>

            {/* Email */}
            <div className="nc-field">
              <label className="f-label">E-mail</label>
              <input
                className="f-input"
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>

            {/* Observações */}
            <div className="nc-field form-full">
              <label className="f-label">Observações</label>
              <textarea
                className="f-textarea"
                value={form.obs}
                onChange={e => set('obs', e.target.value)}
                placeholder="Motivo do atendimento, histórico clínico..."
                rows={4}
              />
            </div>

          </div>

          {/* Ações */}
          <div className="nc-acoes">
            <button className="btn-cancelar" onClick={handleCancelar}>
              Cancelar
            </button>
            <button className="btn-salvar" onClick={handleSalvar}>
              Salvar cliente
            </button>
          </div>
        </div>

        {/* ── Preview ── */}
        <div className="nc-preview-col">

          {/* Card preview */}
          <div className="card nc-preview-card">
            <div className="card-head">
              <span className="card-title">Preview</span>
            </div>
            <div className="nc-preview">
              <div className="nc-avatar">{iniciais}</div>
              <div className="nc-preview-nome">
                {form.nome.trim() || 'Nome do cliente'}
              </div>
              <div className="nc-preview-plano">
                {form.plano || 'Plano não selecionado'}
              </div>

              <div className="nc-preview-info">
                <div className="nc-info-row">
                  <span className="nc-info-lbl">Valor/sessão</span>
                  <span className="nc-info-val">
                    {form.valor ? `R$ ${parseFloat(form.valor).toLocaleString('pt-BR')}` : '—'}
                  </span>
                </div>
                <div className="nc-info-row">
                  <span className="nc-info-lbl">Frequência</span>
                  <span className="nc-info-val">{form.freq}x por semana</span>
                </div>
                <div className="nc-info-row">
                  <span className="nc-info-lbl">Telefone</span>
                  <span className="nc-info-val">{form.tel || '—'}</span>
                </div>
                <div className="nc-info-row">
                  <span className="nc-info-lbl">E-mail</span>
                  <span className="nc-info-val">{form.email || '—'}</span>
                </div>
              </div>

              {/* Freq dots */}
              <div className="nc-freq-dots">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={`fd ${i < parseInt(form.freq) ? 'fd-on' : 'fd-off'}`}
                  />
                ))}
              </div>

            </div>
          </div>

          {/* Dica */}
          <div className="nc-dica">
            <div className="nc-dica-icon">💡</div>
            <p>
              O preview atualiza em tempo real conforme você preenche o formulário.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default NovoCliente;