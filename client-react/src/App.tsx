import { useState } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import './App.css'

axios.defaults.withCredentials = true;

function App() {
  const [status, setStatus] = useState('Status: Tidak ada session');
  const [clientCookieStatus, setClientCookieStatus] = useState('Client Cookie: Tidak ada');

  const checkServerCookie = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-cookie');
      if (response.data.sessionId) {
        setStatus(`Status: Valid (Session ID: ${response.data.sessionId})`);
      } else {
        setStatus('Status: Tidak valid');
      }
    } catch (error) {
      setStatus('Status: Error memeriksa cookie');
      console.error(error);
    }
  };

  const checkClientCookie = () => {
    const cookie = Cookies.get('client_cookie');
    if (cookie) {
      setClientCookieStatus(`Client Cookie: Ada (${cookie})`);
    } else {
      setClientCookieStatus('Client Cookie: Tidak ada');
    }
  };

  const setServerCookie = async () => {
    try {
      await axios.get('http://localhost:5000/set-cookie');
      setStatus('Status: Cookie berhasil di-set');
      checkServerCookie();
    } catch (error) {
      setStatus('Status: Gagal set cookie');
      console.error(error);
    }
  };

  const setClientCookie = () => {
    Cookies.set('client_cookie', 'nilai_cookie_client', { expires: 1 });
    checkClientCookie();
  };

  const clearServerCookie = async () => {
    try {
      await axios.get('http://localhost:5000/clear-cookie');
      setStatus('Status: Cookie server dihapus');
      checkServerCookie();
    } catch (error) {
      setStatus('Status: Gagal menghapus cookie');
      console.error(error);
    }
  };

  const clearClientCookie = () => {
    Cookies.remove('client_cookie');
    checkClientCookie();
  };

  const loginDemo = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username: 'user1',
        password: 'pass1'
      });
      if (response.data.success) {
        setStatus(`Status: Login berhasil (User: ${response.data.user.username})`);
      } else {
        setStatus('Status: Login gagal');
      }
    } catch (error) {
      setStatus('Status: Error saat login');
      console.error(error);
    }
  };

  const logoutDemo = async () => {
    try {
      await axios.post('http://localhost:5000/logout');
      setStatus('Status: Logout berhasil');
    } catch (error) {
      setStatus('Status: Gagal logout');
      console.error(error);
    }
  };

  return (
    <div className="app">
      <h1>Demo Cookies</h1>
      
      <div className="status-box">
        <p>{status}</p>
        <p>{clientCookieStatus}</p>
      </div>
      
      <div className="button-group">
        <h2>Server Cookies</h2>
        <button onClick={setServerCookie}>Set Server Cookie</button>
        <button onClick={checkServerCookie}>Check Server Cookie</button>
        <button onClick={clearServerCookie}>Clear Server Cookie</button>
        
        <h2>Client Cookies</h2>
        <button onClick={setClientCookie}>Set Client Cookie</button>
        <button onClick={checkClientCookie}>Check Client Cookie</button>
        <button onClick={clearClientCookie}>Clear Client Cookie</button>
        
        <h2>Demo Login</h2>
        <button onClick={loginDemo}>Login (user1/pass1)</button>
        <button onClick={logoutDemo}>Logout</button>
      </div>
    </div>
  );
}

export default App
