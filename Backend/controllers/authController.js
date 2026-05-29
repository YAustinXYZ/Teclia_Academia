import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { getDb, saveDatabase } from '../db/init.js';

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

const createMailTransport = () => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, ''),
      },
      requireTLS: true,
    });
  }

  return {
    sendMail: async (mailOptions) => {
      console.log('Simulated email send:', mailOptions);
      return Promise.resolve();
    },
  };
};

  return {
    sendMail: async (mailOptions) => {
      console.log('Simulated email send:', mailOptions);
      return Promise.resolve();
    },
  };
};

const sendResetPinEmail = async (email, pin) => {
  const transport = createMailTransport();

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@teclia.com',
    to: email,
    subject: 'Tu código para recuperar contraseña de Teclia',
    text: `Tu código para restablecer la contraseña es: ${pin}. Este código expira en 15 minutos.`,
    html: `<p>Tu código para restablecer la contraseña es: <strong>${pin}</strong>.</p><p>Este código expira en 15 minutos.</p>`,
  };

  console.log('📨 Sending email to:', email);

  try {
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  await sendResetPinEmail(email, pin);
} else {
  console.log("SMTP no configurado");
}
    console.log('✅ Email sent successfully');
  } catch (error) {
    console.error('❌ Email error:', error);
    throw error;
  }
};

export const signup = (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const db = getDb();

    // Check if user exists
    const existingUser = db.exec('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0 && existingUser[0].values.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    db.run(
      'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, 'student']
    );

    saveDatabase();

    // Get the last inserted user ID
    const result = db.exec('SELECT last_insert_rowid() as id');
    const userId = result[0].values[0][0];

    const token = generateToken(userId, 'student');
    res.json({
      message: 'User created successfully',
      token,
      user: { id: userId, email, name, role: 'student' }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDb();
    const result = db.exec(
      'SELECT id, email, name, password_hash, role FROM users WHERE email = ?',
      [email]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const columns = result[0].columns;
    const values = result[0].values[0];
    const user = {};
    columns.forEach((col, idx) => {
      user[col] = values[idx];
    });

    const passwordMatch = bcryptjs.compareSync(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMe = (req, res) => {
  try {
    const db = getDb();
    const result = db.exec('SELECT id, email, name, role, avatar_url FROM users WHERE id = ?', [req.user.id]);
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cols = result[0].columns;
    const vals = result[0].values[0];
    const user = {};
    cols.forEach((c, i) => (user[c] = vals[i]));

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = (req, res) => {
  try {
    const { name, avatarUrl } = req.body;
    const avatarFile = req.file;
    if (!name && !avatarUrl && !avatarFile) {
      return res.status(400).json({ error: 'No profile information provided' });
    }

    const db = getDb();
    const result = db.exec('SELECT id, email, name, role, avatar_url FROM users WHERE id = ?', [req.user.id]);
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updates = [];
    const params = [];
    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (avatarFile) {
      const publicPath = `/uploads/avatars/${avatarFile.filename}`;
      updates.push('avatar_url = ?');
      params.push(publicPath);
    } else if (avatarUrl) {
      updates.push('avatar_url = ?');
      params.push(avatarUrl);
    }
    params.push(req.user.id);

    db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
    saveDatabase();

    const updatedResult = db.exec('SELECT id, email, name, role, avatar_url FROM users WHERE id = ?', [req.user.id]);
    const cols = updatedResult[0].columns;
    const vals = updatedResult[0].values[0];
    const user = {};
    cols.forEach((c, i) => (user[c] = vals[i]));

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changePassword = (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    const db = getDb();
    const result = db.exec('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const storedHash = result[0].values[0][0];
    if (!bcryptjs.compareSync(currentPassword, storedHash)) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    const hashedPassword = bcryptjs.hashSync(newPassword, 10);
    db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, req.user.id]);
    saveDatabase();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const db = getDb();
    const result = db.exec('SELECT id FROM users WHERE email = ?', [email]);
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(200).json({ message: 'If that email exists, a reset PIN was sent.' });
    }

    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    db.run('UPDATE users SET reset_pin = ?, reset_pin_expires_at = ? WHERE email = ?', [pin, expiresAt, email]);
    saveDatabase();

    const emailEnabled = process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS;
    await sendResetPinEmail(email, pin);

    const response = {
      message: 'Se ha enviado un PIN de recuperación al correo electrónico',
    };

    if (!emailEnabled) {
      response.message = 'Email no configurado. Por favor, configura SMTP real para enviar el PIN a tu correo.';
    }

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const resetPassword = (req, res) => {
  try {
    const { email, pin, newPassword } = req.body;
    if (!email || !pin || !newPassword) {
      return res.status(400).json({ error: 'Email, PIN y nueva contraseña son requeridos' });
    }

    const db = getDb();
    const result = db.exec(
      'SELECT reset_pin, reset_pin_expires_at FROM users WHERE email = ?',
      [email]
    );
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'Email no registrado' });
    }

    const storedPin = result[0].values[0][0];
    const expiresAt = result[0].values[0][1];
    if (!storedPin || storedPin !== pin) {
      return res.status(401).json({ error: 'PIN inválido' });
    }

    if (expiresAt && new Date(expiresAt) < new Date()) {
      return res.status(401).json({ error: 'El PIN ha expirado' });
    }

    const hashedPassword = bcryptjs.hashSync(newPassword, 10);
    db.run(
      'UPDATE users SET password_hash = ?, reset_pin = NULL, reset_pin_expires_at = NULL WHERE email = ?',
      [hashedPassword, email]
    );
    saveDatabase();

    res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};

