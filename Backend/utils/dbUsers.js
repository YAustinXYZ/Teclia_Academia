export const getUserTableColumns = (db) => {
  const info = db.exec('PRAGMA table_info(users)');
  if (!info.length || !info[0].values.length) return [];
  return info[0].values.map((row) => row[1]);
};

export const ensureUserColumn = (db, column, definition) => {
  const columns = getUserTableColumns(db);
  if (!columns.includes(column)) {
    db.run(`ALTER TABLE users ADD COLUMN ${definition}`);
  }
};

export const normalizeLegacyUsers = (db) => {
  ensureUserColumn(db, 'plan_tier', 'plan_tier TEXT DEFAULT NULL');
  ensureUserColumn(db, 'avatar_url', 'avatar_url TEXT DEFAULT NULL');
  ensureUserColumn(db, 'created_at', 'created_at DATETIME DEFAULT CURRENT_TIMESTAMP');

  db.run("UPDATE users SET role = 'student' WHERE role IS NULL OR TRIM(role) = ''");
  db.run("UPDATE users SET plan_tier = NULL WHERE plan_tier = ''");
};

export const mapUserRows = (result, formatUser) => {
  if (!result.length || !result[0].values.length) return [];

  const cols = result[0].columns;
  return result[0].values.map((row) => {
    const user = {};
    cols.forEach((col, i) => {
      user[col] = row[i];
    });
    return {
      ...formatUser(user),
      created_at: user.created_at || null,
    };
  });
};

export const listNonAdminUsers = (db) => {
  normalizeLegacyUsers(db);

  const columns = getUserTableColumns(db);
  const hasPlanTier = columns.includes('plan_tier');
  const hasAvatar = columns.includes('avatar_url');
  const hasCreatedAt = columns.includes('created_at');

  const selectParts = [
    'id',
    'name',
    'email',
    'role',
    hasPlanTier ? 'plan_tier' : "NULL AS plan_tier",
    hasAvatar ? 'avatar_url' : "NULL AS avatar_url",
    hasCreatedAt ? 'created_at' : "NULL AS created_at",
  ];

  return db.exec(`
    SELECT ${selectParts.join(', ')}
    FROM users
    WHERE LOWER(COALESCE(role, 'student')) != 'admin'
    ORDER BY id DESC
  `);
};
