import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './App.css';

axios.defaults.withCredentials = true;

interface User{
  id: string;
  username: string;
}

const initialUser:User = {
  id: '',
  username: ''
}

function App() {
  const [status, setStatus] = useState('Status: Tidak ada session');
  const [clientCookieStatus, setClientCookieStatus] = useState('Client Cookie: Tidak ada');
  const [userProfile, setUserProfile] = useState<User>(initialUser);

  // Fungsi untuk memeriksa dan load profile saat komponen mount
  useEffect(() => {
    checkServerCookie();
  }, []);

  const checkServerCookie = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-cookie');
      if (response.data.sessionId) {
        setStatus(`Status: Valid (Session ID: ${response.data.sessionId})`);
        fetchUserProfile(); // Otomatis fetch profile jika cookie valid
      } else {
        setStatus('Status: Tidak valid');
        setUserProfile(initialUser);
      }
    } catch (error) {
      setStatus('Status: Error memeriksa cookie');
      console.error(error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/profile');
      if (response.data.success) {
        setUserProfile(response.data.user);
      } else {
        setUserProfile(initialUser);
      }
    } catch (error) {
      console.error('Gagal mengambil profile:', error);
    }
  };

  const checkClientCookie = () => {
    const cookie = Cookies.get('client_cookie');
    setClientCookieStatus(cookie 
      ? `Client Cookie: Ada (${cookie})` 
      : 'Client Cookie: Tidak ada');
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
      setUserProfile(initialUser);
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
        setStatus(`Status: Login berhasil`);
        fetchUserProfile();
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
      setUserProfile(initialUser);
    } catch (error) {
      setStatus('Status: Gagal logout');
      console.error(error);
    }
  };

  return (
    <div className="app">
      <h1>Demo Cookies dengan Profile</h1>
      
      <div className="status-box">
        <p>{status}</p>
        <p>{clientCookieStatus}</p>
      </div>
      
      {userProfile && (
        <div className="profile-box">
          <h2>User Profile</h2>
          <p><strong>ID:</strong> {userProfile.id}</p>
          <p><strong>Username:</strong> {userProfile.username}</p>
        </div>
      )}
      
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

export default App;