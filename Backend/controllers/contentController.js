import { getDb, saveDatabase } from '../db/init.js';

export const getContent = (req, res) => {
  try {
    const db = getDb();

    const result = db.exec(`
      SELECT c.*, u.name as uploaded_by_name FROM content c
      LEFT JOIN users u ON c.uploaded_by = u.id
      ORDER BY c.created_at DESC
    `);

    let content = [];
    if (result.length > 0) {
      const columns = result[0].columns;
      content = result[0].values.map(row => {
        const obj = {};
        columns.forEach((col, idx) => {
          obj[col] = row[idx];
        });
        return obj;
      });
    }

    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getContentById = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const result = db.exec(
      `SELECT c.*, u.name as uploaded_by_name FROM content c
       LEFT JOIN users u ON c.uploaded_by = u.id
       WHERE c.id = ?`,
      [id]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    const columns = result[0].columns;
    const content = {};
    columns.forEach((col, idx) => {
      content[col] = result[0].values[0][idx];
    });

    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadContent = (req, res) => {
  try {
    const { title, description, type, url } = req.body;

    if (!title || !type || !url) {
      return res.status(400).json({ error: 'Title, type and url are required' });
    }

    const db = getDb();
    const uploaderId = req.user?.id;

    if (!uploaderId) {
      return res.status(401).json({ error: 'Uploader not identified' });
    }

    db.run(
      'INSERT INTO content (title, description, type, url, uploaded_by) VALUES (?, ?, ?, ?, ?)',
      [title, description || '', type, url, uploaderId]
    );

    saveDatabase();

    const resId = db.exec('SELECT last_insert_rowid() as id');
    const newId = resId[0].values[0][0];

    const content = {
      id: newId,
      title,
      description: description || '',
      type,
      url,
      uploaded_by: uploaderId,
      created_at: new Date().toISOString()
    };

    res.json({ message: 'Content uploaded', content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteContent = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();

    // Ensure content exists
    const found = db.exec('SELECT id FROM content WHERE id = ?', [id]);
    if (found.length === 0 || found[0].values.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    db.run('DELETE FROM content WHERE id = ?', [id]);
    saveDatabase();

    res.json({ message: 'Content deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

