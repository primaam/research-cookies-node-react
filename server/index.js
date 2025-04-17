const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const users = [
    { id: '1', username: 'user1', password: 'pass1' },
    { id: '2', username: 'user2', password: 'pass2' }
];

// Route untuk set cookie
app.get('/set-cookie', (req, res) => {
    // Set cookie dengan nama 'session_id'
    res.cookie('session_id', uuidv4(), {
      maxAge: 1000, // 1 hari
      httpOnly: true,
      secure: false, // true jika menggunakan HTTPS
      sameSite: 'lax'
    });
    
    res.json({ message: 'Cookie telah di-set' });
});

// Route untuk membaca cookie
app.get('/get-cookie', (req, res) => {
    const sessionId = req.cookies.session_id;
    
    if (sessionId) {
      res.json({ 
        message: 'Cookie ditemukan', 
        sessionId 
      });
    } else {
      res.status(404).json({ message: 'Cookie tidak ditemukan' });
    }
});

// Route untuk menghapus cookie
app.get('/clear-cookie', (req, res) => {
    res.clearCookie('session_id');
    res.json({ message: 'Cookie telah dihapus' });
});

// Route login dengan cookie
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => 
      u.username === username && u.password === password
    );
    
    if (user) {
      // Set cookie session
      res.cookie('user_session', user.id, {
        maxAge: 24 * 60 * 60 * 1000, // 1 hari
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
      });
      
      res.json({ 
        success: true, 
        message: 'Login berhasil', 
        user: { id: user.id, username: user.username } 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Username atau password salah' 
      });
    }
  });
  
  // Route untuk mendapatkan data user berdasarkan session
  app.get('/profile', (req, res) => {
    const userId = req.cookies.user_session;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Tidak ada session aktif' 
      });
    }
    
    const user = users.find(u => u.id === userId);
    
    if (user) {
      res.json({ 
        success: true, 
        user: { id: user.id, username: user.username } 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'User tidak ditemukan' 
      });
    }
  });
  
  // Route logout
  app.post('/logout', (req, res) => {
    res.clearCookie('user_session');
    res.json({ success: true, message: 'Logout berhasil' });
  });
  
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
