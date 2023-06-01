import Login from './components/main/Login'
import Dashboard from './components/main/Dashboard';

const code = new URLSearchParams(window.location.search).get("code");
function App() {
  return code ? <Dashboard code={code} /> : <Login />
}

export default App
