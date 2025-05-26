import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mini Wallet</h1>
      </header>
      <main>
        <div className="card">
          <button onClick={() => setCount(count + 1)}>count is {count}</button>
        </div>
      </main>
    </div>
  );
}

export default App;
