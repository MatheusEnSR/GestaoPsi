// pages/agenda/agenda.jsx
import { useState } from 'react';
import './agenda.css';

const HORARIOS = [
  '07:00','08:00','09:00','10:00','11:00',
  '12:00','13:00','14:00','15:00','16:00',
  '17:00','18:00','19:00',
];

const DIAS_SEMANA = ['Seg','Ter','Qua','Qui','Sex'];

const SESSOES_MOCK = [
  { id: 1, dia: 'Seg', horario: '09:00', nome: 'Ana Paula F.',   plano: 'Unimed',     status: 'confirmada' },
  { id: 2, dia: 'Seg', horario: '14:00', nome: 'Rafael M. O.',   plano: 'SulAmérica', status: 'confirmada' },
  { id: 3, dia: 'Ter', horario: '10:00', nome: 'Carlos E. S.',   plano: 'Particular', status: 'realizada'  },
  { id: 4, dia: 'Qua', horario: '09:00', nome: 'Ana Paula F.',   plano: 'Unimed',     status: 'confirmada' },
  { id: 5, dia: 'Qua', horario: '11:00', nome: 'Mariana C. L.',  plano: 'Bradesco',   status: 'falta'      },
  { id: 6, dia: 'Qui', horario: '14:00', nome: 'Rafael M. O.',   plano: 'SulAmérica', status: 'cancelada'  },
  { id: 7, dia: 'Sex', horario: '09:00', nome: 'Fernanda S. R.', plano: 'Particular', status: 'confirmada' },
  { id: 8, dia: 'Sex', horario: '10:00', nome: 'Fernanda S. R.', plano: 'Particular', status: 'confirmada' },
  { id: 9, dia: 'Sex', horario: '15:00', nome: 'Fernanda S. R.', plano: 'Particular', status: 'confirmada' },
];

const CLIENTES_MOCK = [
  'Ana Paula Ferreira',
  'Carlos Eduardo Souza',
  'Mariana Costa Lima',
  'Rafael Mendes Oliveira',
  'Fernanda Santos Reis',
];

const HORARIOS_MODAL = [
  '07:00','07:30','08:00','08:30','09:00','09:30',
  '10:00','10:30','11:00','11:30','12:00','12:30',
  '13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30','19:00',
];

const STATUS_COR = {
  confirmada: { bg: '#EEEDFE', cor: '#3C3489', borda: '#534AB7' },
  realizada:  { bg: '#EAF3DE', cor: '#3B6D11', borda: '#639922' },
  cancelada:  { bg: '#FCEBEB', cor: '#791F1F', borda: '#E24B4A' },
  falta:      { bg: '#FAEEDA', cor: '#633806', borda: '#EF9F27' },
};

function StatusIcon({ status }) {
  if (status === 'confirmada') return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 6l1.5 1.5L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (status === 'realizada') return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <path d="M2 6.5l2.5 2.5 5.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (status === 'cancelada') return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
  if (status === 'falta') return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <path d="M6 2v4M6 8.5v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
  return null;
}

function ModalSessao({ open, diaInicial, horarioInicial, onClose, onSalvar }) {
  const [form, setForm] = useState({
    cliente: '',
    dia:     diaInicial    || 'Seg',
    horario: horarioInicial || '09:00',
    status:  'confirmada',
  });

  const set = (campo, val) => setForm(f => ({ ...f, [campo]: val }));

  function handleSalvar() {
    if (!form.cliente) return;
    onSalvar(form);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">

        <div className="modal-head">
          <span className="modal-titulo">Agendar sessão</span>
          <button className="modal-fechar" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-grid">

            <div className="form-full">
              <label className="f-label">Cliente *</label>
              <select className="f-select" value={form.cliente} onChange={e => set('cliente', e.target.value)}>
                <option value="">Selecione um cliente...</option>
                {CLIENTES_MOCK.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="f-label">Dia *</label>
              <select className="f-select" value={form.dia} onChange={e => set('dia', e.target.value)}>
                {DIAS_SEMANA.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="f-label">Horário *</label>
              <select className="f-select" value={form.horario} onChange={e => set('horario', e.target.value)}>
                {HORARIOS_MODAL.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            <div className="form-full">
              <label className="f-label">Status</label>
              <select className="f-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="confirmada">Confirmada</option>
                <option value="realizada">Realizada</option>
                <option value="cancelada">Cancelada</option>
                <option value="falta">Falta</option>
              </select>
            </div>

          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-salvar" onClick={handleSalvar}>Agendar sessão</button>
        </div>

      </div>
    </div>
  );
}

function VistaSemana({ sessoes, onClickCelula }) {
  return (
    <div className="semana-wrap">
      <div className="legenda">
        {Object.entries(STATUS_COR).map(([key, val]) => (
          <div key={key} className="leg-item">
            <div className="leg-dot" style={{ background: val.bg, border: `2px solid ${val.borda}` }} />
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </div>
        ))}
      </div>

      <div className="semana-grid">
        <div className="ag-head" />
        {DIAS_SEMANA.map(d => (
          <div key={d} className="ag-head">{d}</div>
        ))}

        {HORARIOS.map(hr => (
          <>
            <div key={`t-${hr}`} className="ag-time">{hr}</div>
            {DIAS_SEMANA.map(dia => {
              const ss = sessoes.filter(s => s.dia === dia && s.horario === hr);
              return (
                <div
                  key={`${dia}-${hr}`}
                  className="ag-cell"
                  onClick={() => onClickCelula(dia, hr)}
                >
                  {ss.map(s => {
                    const est = STATUS_COR[s.status] || STATUS_COR.confirmada;
                    return (
                      <div
                        key={s.id}
                        className="ag-evt"
                        style={{ background: est.bg, color: est.cor, borderLeftColor: est.borda }}
                        onClick={e => e.stopPropagation()}
                        title={`${s.nome} · ${s.status}`}
                      >
                        <StatusIcon status={s.status} />
                        <span>{s.nome.split(' ')[0]}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}

function VistaMes({ sessoes, onClickDia }) {
  const diasSemana = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
  const diasMes    = Array.from({ length: 31 }, (_, i) => i + 1);
  const iniciaMes  = 3;
  const hoje       = 9;

  return (
    <div className="mes-wrap">
      <div className="mes-grid">
        {diasSemana.map(d => (
          <div key={d} className="mes-dlbl">{d}</div>
        ))}
        {Array.from({ length: iniciaMes }, (_, i) => (
          <div key={`e${i}`} />
        ))}
        {diasMes.map(d => {
          const temSessao = d >= 5 && d <= 16;
          return (
            <div
              key={d}
              className={`mes-dia ${d === hoje ? 'mes-hoje' : ''} ${temSessao ? 'mes-has' : ''}`}
              onClick={() => temSessao && onClickDia()}
            >
              <span className="mes-num">{d}</span>
              {temSessao && (
                <div className="mes-dots">
                  {sessoes.slice(0, 3).map((s, i) => {
                    const est = STATUS_COR[s.status] || STATUS_COR.confirmada;
                    return <div key={i} className="mes-dot" style={{ background: est.borda }} />;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Agenda() {
  const [vista,    setVista]    = useState('semana');
  const [sessoes,  setSessoes]  = useState(SESSOES_MOCK);
  const [modal,    setModal]    = useState(false);
  const [diaAtual, setDiaAtual] = useState('Seg');
  const [hrAtual,  setHrAtual]  = useState('09:00');

  function abrirModal(dia, horario) {
    setDiaAtual(dia);
    setHrAtual(horario);
    setModal(true);
  }

  function salvarSessao(form) {
    const nova = {
      id:      sessoes.length + 1,
      dia:     form.dia,
      horario: form.horario,
      nome:    form.cliente.split(' ').slice(0, 2).join(' '),
      plano:   'Particular',
      status:  form.status,
    };
    setSessoes(prev => [...prev, nova]);
  }

  return (
    <div className="agenda-page">

      <div className="agenda-topo">
        <div>
          <h2 className="agenda-titulo">Agenda</h2>
          <p className="agenda-sub">Semana de 05/05 – 11/05</p>
        </div>
        <div className="agenda-acoes">
          <div className="vista-toggle">
            <button
              className={`vista-btn ${vista === 'semana' ? 'ativo' : ''}`}
              onClick={() => setVista('semana')}
            >
              Semana
            </button>
            <button
              className={`vista-btn ${vista === 'mes' ? 'ativo' : ''}`}
              onClick={() => setVista('mes')}
            >
              Mês
            </button>
          </div>
          <button className="btn-novo" onClick={() => abrirModal('Seg', '09:00')}>
            + Agendar
          </button>
        </div>
      </div>

      <div className="card agenda-card">
        {vista === 'semana'
          ? <VistaSemana sessoes={sessoes} onClickCelula={abrirModal} />
          : <VistaMes    sessoes={sessoes} onClickDia={() => abrirModal('Seg', '09:00')} />
        }
      </div>

      <ModalSessao
        open={modal}
        diaInicial={diaAtual}
        horarioInicial={hrAtual}
        onClose={() => setModal(false)}
        onSalvar={salvarSessao}
      />

    </div>
  );
}

export default Agenda;