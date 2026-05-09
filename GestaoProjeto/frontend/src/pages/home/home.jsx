import './home.css';
import Header from "../../components/header/header.jsx"; 


function Home() {
  return (
    <div className="home">
      
       <Header/>


      <header className="header">
        <h1>Sistema da Psicóloga</h1>
        <p>Gerencie clientes, sessões e faturamento.</p>
      </header>

      <main className="cards">
        <div className="card">
          <h2>Clientes</h2>
          <p>Visualize e gerencie os clientes cadastrados.</p>
          <button>Acessar</button>
        </div>

        <div className="card">
          <h2>Calendário</h2>
          <p>Veja sessões organizadas por dia e horário.</p>
          <button>Acessar</button>
        </div>

        <div className="card">
          <h2>Faturamento</h2>
          <p>Acompanhe pagamentos e relatórios mensais.</p>
          <button>Acessar</button>
        </div>
      </main>
    </div>
  );
}

export default Home;