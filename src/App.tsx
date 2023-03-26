import "./App.css";
import Connect2Phantom from "./assets/components/Connect2Phantom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Solana Faucet</h1>
        <hr className="fullWidth" />

        <p>Airdrop Solana to your devnet.</p>
        <Connect2Phantom />
      </header>
    </div>
  );
}

export default App;
