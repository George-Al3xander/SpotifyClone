import Login from './components/main/Login'
import Dashboard from './components/main/Dashboard';
import { useState } from 'react';


function App() {
  const [code, setCode] =  useState(new URLSearchParams(window.location.search).get("code"));
  return code != null ? <Dashboard setCode={setCode} code={code} /> : <Login />
}

export default App
