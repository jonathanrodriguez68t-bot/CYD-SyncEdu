import { getDbConnection } from '../db';
import { logAction } from './auditService';

/**
 * Servicio de Usuarios (Users Service)
 * 
 * Gestiona la autenticacion, perfiles y expedientes de estudiantes y profesores.
 */

// Mock de base de datos de estudiantes
let mockStudentsDb = [
  {
    carnet: 'estudiante',
    pin: '1234',
    name: 'Maria Fernanda Lopez',
    shortName: 'Maria',
    role: 'student',
    label: 'Estudiante - 6to Grado B',
    avatar: 'MF',
    expediente: 'EXP-2026-001',
    status: 'Activo'
  },
  {
    carnet: 'est002',
    pin: '5678',
    name: 'Carlos Mejia',
    shortName: 'Carlos',
    role: 'student',
    label: 'Estudiante - 7mo Grado A',
    avatar: 'CM',
    expediente: 'EXP-2026-002',
    status: 'Activo'
  },
  {
    carnet: 'est003',
    pin: '1111',
    name: 'Ana Martinez',
    shortName: 'Ana',
    role: 'student',
    label: 'Estudiante - 6to Grado B',
    avatar: 'AM',
    expediente: 'EXP-2026-003',
    status: 'Activo'
  }
];

// Mock de base de datos de profesores
let mockTeachersDb = [
  {
    codigo: 'profesor',
    pin: '1234',
    name: 'Karen Rivas',
    shortName: 'Karen',
    role: 'teacher',
    label: 'Profesora de Ciencias',
    avatar: 'KR',
    especialidad: 'Ciencias Naturales y Quimica',
    estado: 'Activo',
    grados: '6to B, 7mo A'
  },
  {
    codigo: 'doc002',
    pin: '4321',
    name: 'Jose Martinez',
    shortName: 'Jose',
    role: 'teacher',
    label: 'Profesor de Matematicas',
    avatar: 'JM',
    especialidad: 'Algebra y Geometria',
    estado: 'Activo',
    grados: '6to B'
  }
];

// Mock de administradores
let mockAdminsDb = [
  {
    username: 'admin',
    pin: '1234',
    name: 'Roberto Lopez',
    shortName: 'Roberto',
    role: 'admin',
    label: 'Administrador academico',
    avatar: 'AD'
  }
];

if (typeof window !== 'undefined') {
  const storedStud = localStorage.getItem('mockStudentsDb');
  if (storedStud) {
    mockStudentsDb = JSON.parse(storedStud);
  } else {
    localStorage.setItem('mockStudentsDb', JSON.stringify(mockStudentsDb));
  }

  const storedTch = localStorage.getItem('mockTeachersDb');
  if (storedTch) {
    mockTeachersDb = JSON.parse(storedTch);
  } else {
    localStorage.setItem('mockTeachersDb', JSON.stringify(mockTeachersDb));
  }
}

export async function authenticateUser(username, password) {
  const cleanUser = username.trim().toLowerCase();

  // Buscar en Admins
  const admin = mockAdminsDb.find(a => a.username.toLowerCase() === cleanUser);
  if (admin && password === admin.pin) {
    await logAction(admin.name, 'admin', 'Inicio de sesion exitoso.');
    return { ...admin, username: admin.username };
  }

  // Buscar en Estudiantes (por Carnet)
  const student = mockStudentsDb.find(s => s.carnet.toLowerCase() === cleanUser);
  if (student && password === student.pin) {
    await logAction(student.name, 'student', 'Inicio de sesion exitoso.');
    return { ...student, username: student.carnet };
  }

  // Buscar en Profesores (por Codigo)
  const teacher = mockTeachersDb.find(t => t.codigo.toLowerCase() === cleanUser);
  if (teacher && password === teacher.pin) {
    await logAction(teacher.name, 'teacher', 'Inicio de sesion exitoso.');
    return { ...teacher, username: teacher.codigo };
  }

  return null;
}

export async function fetchStudents() {
  return [...mockStudentsDb];
}

export async function fetchTeachers() {
  return [...mockTeachersDb];
}

export async function createStudent(studentData) {
  const newStudent = {
    carnet: studentData.carnet.trim().toLowerCase(),
    pin: studentData.pin.trim(),
    name: studentData.name.trim(),
    shortName: studentData.name.trim().split(' ')[0],
    role: 'student',
    label: `Estudiante - ${studentData.grade || '6to Grado B'}`,
    avatar: studentData.name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    expediente: `EXP-2026-${Math.floor(100 + Math.random() * 900)}`,
    status: studentData.status || 'Activo'
  };

  mockStudentsDb.push(newStudent);
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockStudentsDb', JSON.stringify(mockStudentsDb));
  }
  await logAction('Administrador', 'admin', `Registro un nuevo estudiante: ${newStudent.name} (Carnet: ${newStudent.carnet}).`);
  return newStudent;
}

export async function createTeacher(teacherData) {
  const newTeacher = {
    codigo: teacherData.codigo.trim().toLowerCase(),
    pin: teacherData.pin.trim(),
    name: teacherData.name.trim(),
    shortName: teacherData.name.trim().split(' ')[0],
    role: 'teacher',
    label: `Profesor de ${teacherData.especialidad || 'General'}`,
    avatar: teacherData.name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    especialidad: teacherData.especialidad.trim(),
    grados: teacherData.grados || 'Sin grados',
    estado: teacherData.estado || 'Activo'
  };

  mockTeachersDb.push(newTeacher);
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockTeachersDb', JSON.stringify(mockTeachersDb));
  }
  await logAction('Administrador', 'admin', `Registro un nuevo profesor: ${newTeacher.name} (Codigo: ${newTeacher.codigo}).`);
  return newTeacher;
}
