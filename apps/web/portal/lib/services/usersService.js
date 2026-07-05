import { getDbConnection } from '../db';

/**
 * Servicio de Usuarios (Users Service)
 * 
 * Gestiona la autenticacion y perfiles de los usuarios de SyncEdu.
 */

export async function authenticateUser(username, password) {
  // --- INTEGRACIÓN BASE DE DATOS ---
  // const db = await getDbConnection();
  // const sql = 'SELECT * FROM USERS WHERE username = ? LIMIT 1';
  // const rows = await db.query(sql, [username]);
  // if (rows.length === 0) return null;
  // const user = rows[0];
  // const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
  // if (!isPasswordMatch) return null;
  // return user;

  const users = {
    estudiante: {
      role: 'student',
      username: 'estudiante',
      name: 'Maria Fernanda Lopez',
      shortName: 'Maria',
      label: 'Estudiante - 6to grado',
      avatar: 'MF'
    },
    profesor: {
      role: 'teacher',
      username: 'profesor',
      name: 'Karen Rivas',
      shortName: 'Karen',
      label: 'Profesora de Ciencias',
      avatar: 'KR'
    },
    admin: {
      role: 'admin',
      username: 'admin',
      name: 'Roberto Lopez',
      shortName: 'Roberto',
      label: 'Administrador academico',
      avatar: 'AD'
    }
  };

  const user = users[username.trim().toLowerCase()];
  if (user && password === '1234') {
    return user;
  }
  return null;
}
