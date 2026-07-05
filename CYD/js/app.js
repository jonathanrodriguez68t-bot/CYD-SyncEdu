const users = {
  estudiante: {
    password: "1234",
    role: "student",
    name: "Maria Fernanda Lopez",
    shortName: "Maria",
    label: "Estudiante - 6to grado",
    avatar: "MF"
  },
  profesor: {
    password: "1234",
    role: "teacher",
    name: "Karen Rivas",
    shortName: "Karen",
    label: "Profesora de Ciencias",
    avatar: "KR"
  },
  admin: {
    password: "1234",
    role: "admin",
    name: "Roberto Lopez",
    shortName: "Roberto",
    label: "Administrador academico",
    avatar: "AD"
  }
};

const subjects = ["Matematicas", "Ciencias", "Lenguaje", "Ingles", "Artes visuales", "Consejeria"];

const sharedState = {
  activities: [
    { id: 1, date: "2026-07-07", title: "Exposicion de ciencias", course: "Ciencias", detail: "Tema: sostenibilidad. Aula 4, 8:00 AM.", group: "6to grado" },
    { id: 2, date: "2026-07-08", title: "Entrega de cartulina", course: "Artes visuales", detail: "Llevar materiales y boceto del proyecto.", group: "6to grado" },
    { id: 3, date: "2026-07-12", title: "Orientacion academica", course: "Consejeria", detail: "Auditorio principal. Llevar cuaderno de seguimiento.", group: "6to grado" }
  ],
  grades: [
    ["M", "Matematicas", "Examen Unidad 2", "9.0", "Aprobado"],
    ["C", "Ciencias", "Laboratorio de quimica", "8.5", "Aprobado"],
    ["L", "Lenguaje", "Ensayo literario", "8.0", "Aprobado"],
    ["I", "Ingles", "Conversacion guiada", "8.7", "Aprobado"]
  ],
  notices: [
    ["Feria de ciencias 2026", "Revisar criterios de exposicion y horario asignado."],
    ["Biblioteca", "La devolucion de libros vence el viernes."],
    ["Uniforme", "El lunes se usara uniforme diario completo."]
  ],
  requests: [
    ["Cambio de encargado", "Pendiente", "Revision administrativa"],
    ["Justificacion de ausencia", "Aprobado", "Registrado en asistencia"],
    ["Actualizacion de telefono", "Pendiente", "Falta confirmacion"]
  ]
};

const navByRole = {
  student: [
    ["home", "IN", "Inicio"],
    ["records", "EX", "Expedientes"],
    ["grades", "NT", "Notas"],
    ["courses", "CR", "Cursos"],
    ["calendar", "AC", "Actividades"],
    ["notices", "AV", "Avisos"]
  ],
  teacher: [
    ["home", "IN", "Inicio"],
    ["groups", "GR", "Grupos"],
    ["gradebook", "NT", "Calificar"],
    ["calendar", "AC", "Calendario"],
    ["messages", "MS", "Mensajes"],
    ["reports", "RP", "Reportes"]
  ],
  admin: [
    ["home", "IN", "Inicio"],
    ["students", "AL", "Alumnos"],
    ["teachers", "PR", "Profesores"],
    ["requests", "SL", "Solicitudes"],
    ["calendar", "AC", "Calendario"],
    ["reports", "RP", "Reportes"]
  ]
};

const roleCopy = {
  student: {
    portal: "Portal Estudiante",
    support: "SyncIA puede resumir tus notas, avisos y tareas pendientes.",
    hero: (user) => [`Bienvenida de nuevo, ${user.shortName}`, "Este es tu resumen academico de 6to grado. Hay una actividad proxima y una materia que conviene repasar esta semana."]
  },
  teacher: {
    portal: "Portal Profesor",
    support: "SyncIA puede ayudarte a preparar avisos, revisar entregas y detectar pendientes.",
    hero: (user) => [`Hola, profesora ${user.shortName}`, "Gestiona actividades, calificaciones y mensajes para tus grupos desde un solo lugar."]
  },
  admin: {
    portal: "Portal Admin",
    support: "SyncIA puede resumir solicitudes, expedientes y alertas institucionales.",
    hero: (user) => [`Panel administrativo, ${user.shortName}`, "Supervisa expedientes, docentes, solicitudes y operacion academica general."]
  }
};

let currentUser = null;
let currentView = "home";
let currentCalendarDate = "2026-07-01";

const loginScreen = document.querySelector("#login-screen");
const app = document.querySelector("#app");
const avatarPortal = document.querySelector("#avatar-portal");
const avatarWorkspace = document.querySelector("#avatar-workspace");
const assistantResult = document.querySelector("#assistant-result");
const avatarInput = document.querySelector("#avatar-input");
const avatarComposer = document.querySelector("#avatar-composer");
const flowAgent = document.querySelector("#flow-agent");
const loginForm = document.querySelector("#login-form");
const loginError = document.querySelector("#login-error");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const nav = document.querySelector("#nav");
const content = document.querySelector("#content");
const modal = document.querySelector("#modal");
const modalTitle = document.querySelector("#modal-title");
const modalBody = document.querySelector("#modal-body");
const chat = document.querySelector("#chat");
const messages = document.querySelector("#messages");
const toastStack = document.querySelector("#toast-stack");
const brandToggle = document.querySelector("#brand-toggle");

function signIn(username, password) {
  const user = users[username];
  if (!user || user.password !== password) {
    loginError.textContent = "Usuario o contrasena incorrectos.";
    loginForm.classList.remove("shake");
    void loginForm.offsetWidth;
    loginForm.classList.add("shake");
    showToast("No se pudo iniciar sesion", "Revisa tu usuario y contrasena.", "error");
    return;
  }

  currentUser = user;
  currentView = "home";
  loginError.textContent = "";
  showToast("Ingreso correcto", `Bienvenido a ${roleCopy[user.role].portal}.`, "success");
  loginScreen.classList.add("leaving");

  setTimeout(() => {
    loginScreen.classList.add("hidden");
    loginScreen.classList.remove("leaving");
    if (user.role === "admin") {
      app.classList.remove("hidden");
      app.classList.add("app-enter");
      chat.classList.remove("hidden");
      renderShell();
      renderView("home");
      seedChat();
      setTimeout(() => app.classList.remove("app-enter"), 520);
      return;
    }

    avatarPortal.classList.remove("hidden");
    avatarPortal.classList.add("app-enter");
    renderAvatarPortal();
    setTimeout(() => avatarPortal.classList.remove("app-enter"), 520);
  }, 360);
}

function renderAvatarPortal() {
  document.querySelector("#avatar-role-label").textContent = roleCopy[currentUser.role].portal;
  document.querySelector("#avatar-profile-name").textContent = currentUser.name;
  document.querySelector("#avatar-profile-role").textContent = currentUser.label;
  document.querySelector("#avatar-profile-badge").textContent = currentUser.avatar;
  document.querySelector("#flow-title").textContent = `Hola, ${currentUser.shortName}`;
  const intro = currentUser.role === "teacher"
    ? "Puedo ayudarte a mostrar calendario, grupos, actividades por calificar, mensajes o reportes."
    : "Puedo ayudarte a mostrar calendario, notas, cursos, actividades o avisos.";
  typeAvatarText(intro);
  avatarWorkspace.classList.remove("avatar-active");
  flowAgent.classList.remove("thinking");
  assistantResult.classList.add("hidden");
  assistantResult.innerHTML = "";
  avatarInput.value = "";
  bindContentActions();
}

function renderShell() {
  document.querySelector("#portal-label").textContent = roleCopy[currentUser.role].portal;
  document.querySelector("#topbar-portal-label").textContent = roleCopy[currentUser.role].portal;
  document.querySelector("#support-copy").textContent = roleCopy[currentUser.role].support;
  document.querySelector("#profile-name").textContent = currentUser.name;
  document.querySelector("#profile-role").textContent = currentUser.label;
  document.querySelector("#profile-avatar").textContent = currentUser.avatar;

  nav.innerHTML = navByRole[currentUser.role].map(([view, icon, label]) => `
    <button class="${view === currentView ? "active" : ""}" data-view="${view}">
      <span class="icon">${icon}</span><span>${label}</span>
    </button>
  `).join("");

  nav.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => renderView(button.dataset.view));
  });

  const [title, copy] = roleCopy[currentUser.role].hero(currentUser);
  document.querySelector("#hero-title").textContent = title;
  document.querySelector("#hero-copy").textContent = copy;
  document.querySelector("#hero-actions").innerHTML = getHeroActions();
}

function getHeroActions() {
  if (currentUser.role === "teacher") {
    return `<button class="secondary" data-action="open-calendar">Ver calendario</button><button class="primary" data-action="new-activity">Agregar actividad</button>`;
  }
  if (currentUser.role === "admin") {
    return `<button class="secondary" data-action="open-reports">Ver reportes</button><button class="primary" data-action="new-student">Nuevo alumno</button>`;
  }
  return `<button class="secondary" data-action="open-calendar">Ver calendario</button><button class="primary" data-action="open-chat">Consultar SyncIA</button>`;
}

function renderView(view) {
  currentView = view;
  renderShell();

  const renderer = views[currentUser.role][view] || views[currentUser.role].home;
  content.innerHTML = renderer();
  content.classList.remove("view-enter");
  void content.offsetWidth;
  content.classList.add("view-enter");
  bindContentActions();
}

const views = {
  student: {
    home: renderStudentHome,
    records: () => renderSimpleList("Expediente academico", [
      ["Codigo", "AL-2026-0048"],
      ["Grado", "6to grado"],
      ["Seccion", "B"],
      ["Estado", "Activo"],
      ["Encargado registrado", "Roberto Lopez"]
    ]),
    grades: renderGradesView,
    courses: () => renderCards("Cursos inscritos", [
      ["Matematicas", "Unidad 2: fracciones y problemas aplicados."],
      ["Ciencias", "Proyecto de sostenibilidad y laboratorio."],
      ["Lenguaje", "Ensayo literario y comprension lectora."],
      ["Ingles", "Conversacion guiada nivel intermedio."]
    ]),
    calendar: renderCalendarView,
    notices: () => renderCards("Avisos", sharedState.notices)
  },
  teacher: {
    home: renderTeacherHome,
    groups: () => renderCards("Grupos asignados", [
      ["Ciencias 6B", "24 estudiantes. 3 entregas pendientes."],
      ["Ciencias 6A", "22 estudiantes. Rendimiento estable."],
      ["Laboratorio 7A", "25 estudiantes. Practica programada."]
    ]),
    gradebook: renderTeacherGradebook,
    calendar: renderTeacherCalendar,
    messages: () => renderCards("Mensajes enviados", [
      ["Recordatorio 6B", "Entrega de informe antes del viernes."],
      ["Aviso general", "Traer materiales para laboratorio."],
      ["Retroalimentacion", "Comentarios enviados a alumnos pendientes."]
    ]),
    reports: () => renderCards("Reportes docentes", [
      ["Riesgo academico", "2 estudiantes requieren seguimiento."],
      ["Entregas", "85% de cumplimiento semanal."],
      ["Participacion", "Grupo 6B con alta participacion."]
    ])
  },
  admin: {
    home: renderAdminHome,
    students: () => renderTableSection("Alumnos", ["Alumno", "Grado", "Estado", "Accion"], [
      ["Maria Fernanda Lopez", "6B", "Activo", buttonHtml("Ver expediente", "student-file")],
      ["Carlos Mejia", "6A", "Activo", buttonHtml("Ver expediente", "student-file")],
      ["Ana Martinez", "7A", "Pendiente", buttonHtml("Validar", "validate-file")]
    ]),
    teachers: () => renderTableSection("Profesores", ["Profesor", "Materia", "Grupos", "Accion"], [
      ["Karen Rivas", "Ciencias", "6A, 6B, 7A", buttonHtml("Ver carga", "teacher-load")],
      ["Luis Gomez", "Matematicas", "6B, 7B", buttonHtml("Ver carga", "teacher-load")]
    ]),
    requests: () => renderTableSection("Solicitudes", ["Solicitud", "Estado", "Detalle", "Accion"], sharedState.requests.map((row) => [...row, buttonHtml("Gestionar", "manage-request")])),
    calendar: renderCalendarView,
    reports: () => renderCards("Reportes administrativos", [
      ["Expedientes activos", "428 registros actualizados."],
      ["Solicitudes abiertas", "9 requieren respuesta administrativa."],
      ["Asistencia global", "97% de asistencia institucional."]
    ])
  }
};

function renderStudentHome() {
  return `
    <div class="layout">
      <div>
        ${renderKpis([
          ["Promedio general", "8.6", "+0.3 vs mes pasado", ""],
          ["Asistencia", "96%", "2 faltas justificadas", ""],
          ["Pendientes", "2", "Requiere atencion", "warn"]
        ])}
        ${renderGradesView(true)}
        ${renderInsight("Analisis de SyncIA", "Maria Fernanda mantiene buen rendimiento. Se recomienda revisar Matematicas dos veces por semana porque el siguiente examen concentra el 30% del periodo.")}
      </div>
      <aside class="side">
        ${renderUpcoming()}
        <section class="notice"><strong>Feria de ciencias 2026</strong><small>Revise fechas, criterios y recordatorios oficiales.</small></section>
      </aside>
    </div>
  `;
}

function renderTeacherHome() {
  return `
    ${renderKpis([
      ["Entregas recibidas", "34", "11 pendientes por calificar", "warn"],
      ["Grupos activos", "5", "Ciencias y laboratorio", ""],
      ["Avisos enviados", "8", "3 programados esta semana", ""]
    ])}
    <div class="grid-2">
      ${renderTeacherGradebook()}
      ${renderTeacherCalendar()}
    </div>
  `;
}

function renderAdminHome() {
  return `
    ${renderKpis([
      ["Expedientes", "428", "3 requieren validacion", "warn"],
      ["Asistencia global", "97%", "Estable esta semana", ""],
      ["Solicitudes", "9", "Pendientes de respuesta", "warn"]
    ])}
    <div class="grid-2">
      ${views.admin.requests()}
      ${views.admin.reports()}
    </div>
  `;
}

function renderKpis(items) {
  return `<section class="kpis">${items.map(([label, value, note, risk]) => `
    <article class="card kpi">
      <div class="label">${label}<span class="icon">${risk ? "!" : "OK"}</span></div>
      <strong>${value}</strong>
      <span class="delta ${risk}">${note}</span>
    </article>
  `).join("")}</section>`;
}

function renderGradesView(compact = false) {
  return renderTableSection("Notas recientes", ["Materia", "Actividad", "Nota", "Estado"], sharedState.grades.map(([abbr, subject, activity, score, status]) => [
    `<span class="subject"><span class="chip-icon">${abbr}</span>${subject}</span>`,
    activity,
    `<strong>${score}</strong>`,
    `<span class="badge">${status}</span>`
  ]), compact ? buttonHtml("Ver todas", "all-grades", "link") : "");
}

function renderTeacherGradebook() {
  return renderTableSection("Actividades por calificar", ["Grupo", "Actividad", "Entregas", "Accion"], [
    ["6B", "Laboratorio de quimica", "18/22", buttonHtml("Calificar", "grade-activity")],
    ["7A", "Quiz semanal", "21/25", buttonHtml("Calificar", "grade-activity")],
    ["6A", "Ensayo cientifico", "24/24", buttonHtml("Revisar", "grade-activity")]
  ], buttonHtml("Nueva nota", "new-grade", "link"));
}

function renderTeacherCalendar() {
  return `
    <section class="card section">
      <div class="section-head">
        <h2>Calendario docente</h2>
        ${buttonHtml("Agregar actividad", "new-activity", "link")}
      </div>
      ${renderActivityList()}
    </section>
  `;
}

function renderCalendarView() {
  const month = buildMonthCalendar(currentCalendarDate);
  return `
    <section class="card section">
      <div class="section-head">
        <div>
          <h2>Calendario academico</h2>
          <p class="muted">${formatMonthTitle(currentCalendarDate)}</p>
        </div>
        <div class="calendar-actions">
          <button class="secondary compact" data-action="calendar-prev">Anterior</button>
          <button class="secondary compact" data-action="calendar-next">Siguiente</button>
          ${currentUser.role === "teacher" ? buttonHtml("Agregar actividad", "new-activity", "primary compact") : ""}
        </div>
      </div>
      <div class="month-grid">
        ${["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"].map((day) => `<div class="weekday">${day}</div>`).join("")}
        ${month.map((date) => {
          const events = sharedState.activities.filter((item) => item.date === date.iso);
          return `<div class="month-day ${date.inMonth ? "" : "muted-day"}">
            <strong>${date.day}</strong>
            ${events.map((event) => `<span class="day-event">${event.title}<small>${event.course}</small></span>`).join("")}
          </div>`;
        }).join("")}
      </div>
    </section>
    ${renderUpcoming()}
  `;
}

function renderUpcoming() {
  return `
    <section class="card section">
      <div class="section-head">
        <h2>Proximas actividades</h2>
        ${buttonHtml("Calendario", "open-calendar", "link")}
      </div>
      ${renderActivityList()}
    </section>
  `;
}

function renderActivityList() {
  const sorted = [...sharedState.activities].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.map((item) => `
    <div class="event">
      <div class="date">${formatDay(item.date)}<span>${formatMonth(item.date)}</span></div>
      <div><strong>${item.title}</strong><small>${item.course} - ${formatFullDate(item.date)}. ${item.detail}</small></div>
    </div>
  `).join("");
}

function renderInsight(title, copy) {
  return `
    <section class="card section insight">
      <div>
        <h2>${title}</h2>
        <p>${copy}</p>
        ${buttonHtml("Ver reporte completo de IA", "ia-report", "primary")}
      </div>
      <div class="brain">IA</div>
    </section>
  `;
}

function renderCards(title, items) {
  return `
    <section class="card section">
      <div class="section-head"><h2>${title}</h2></div>
      <div class="grid-2">
        ${items.map(([name, copy]) => `<article class="mini-panel"><h2>${name}</h2><p class="muted">${copy}</p></article>`).join("")}
      </div>
    </section>
  `;
}

function renderSimpleList(title, items) {
  return `
    <section class="card section">
      <div class="section-head"><h2>${title}</h2>${buttonHtml("Solicitar cambio", "request-change", "link")}</div>
      ${items.map(([label, value]) => `<div class="event"><div class="chip-icon">${label.slice(0, 2).toUpperCase()}</div><div><strong>${label}</strong><small>${value}</small></div></div>`).join("")}
    </section>
  `;
}

function renderTableSection(title, headers, rows, action = "") {
  return `
    <section class="card section">
      <div class="section-head"><h2>${title}</h2>${action}</div>
      <table>
        <thead><tr>${headers.map((head) => `<th>${head}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function buttonHtml(label, action, className = "secondary compact") {
  return `<button class="${className}" data-action="${action}">${label}</button>`;
}

function bindContentActions() {
  document.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", handleAction);
  });
}

function handleAction(event) {
  const action = event.currentTarget.dataset.action;
  if (action === "close-modal") return closeModal();
  if (action === "logout") return logout();
  if (action === "voice-demo") return showToast("Audio preparado", "Aqui conectaremos la entrada de voz del avatar de Flow.", "success");
  if (action === "attach-demo") return showToast("Adjuntos preparados", "Aqui podremos conectar archivos, fotos o evidencias.", "success");
  if (action === "open-chat") return openChat();
  if (action === "open-calendar") return renderView("calendar");
  if (action === "calendar-prev") return moveCalendar(-1);
  if (action === "calendar-next") return moveCalendar(1);
  if (action === "new-activity") return openActivityForm();
  if (action === "all-grades") return openModal("Todas las notas", renderGradesView(false));
  if (action === "ia-report") return openModal("Reporte de SyncIA", renderInsight("Resumen inteligente", "Fortalezas: ciencias y lenguaje. Area de mejora: practicar problemas matematicos antes del examen. Siguiente accion: estudiar 25 minutos lunes, miercoles y viernes."));
  if (action === "new-grade") return openModal("Registrar nota", renderGradeForm());
  if (action === "grade-activity") return openModal("Calificar actividad", renderGradeForm());
  if (action === "new-student") return openModal("Nuevo alumno", renderStudentForm());
  if (action === "open-reports") return renderView("reports");
  return openModal("Detalle", `<p class="muted">Esta accion ya esta conectada como prototipo. En la siguiente fase se enlazara con base de datos y permisos reales.</p>`);
}

function openActivityForm() {
  openModal("Agregar actividad al calendario", `
    <form id="activity-form">
      <div class="form-grid">
        <div class="field"><label>Titulo<input name="title" required placeholder="Ej. Quiz de ciencias" /></label></div>
        <div class="field"><label>Materia<select name="course" required>${subjects.map((subject) => `<option>${subject}</option>`).join("")}</select></label></div>
        <div class="field"><label>Fecha<input name="date" type="date" min="2026-01-01" max="2026-12-31" value="2026-07-13" required /></label></div>
        <div class="field"><label>Grupo<input name="group" value="6to grado" /></label></div>
        <div class="field full"><label>Detalle<textarea name="detail" required placeholder="Descripcion, aula, hora o materiales"></textarea></label></div>
      </div>
      <div class="form-actions"><button class="secondary" type="button" data-action="close-modal">Cancelar</button><button class="primary" type="submit">Guardar actividad</button></div>
    </form>
  `);

  document.querySelector("#activity-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    sharedState.activities.push({
      id: Date.now(),
      date: data.get("date"),
      title: data.get("title"),
      course: data.get("course"),
      detail: data.get("detail"),
      group: data.get("group")
    });
    closeModal();
    showToast("Actividad agregada", "Ya aparece en el calendario compartido.", "success");
    renderView("calendar");
  });
}

function buildCalendarDays() {
  const dates = new Set(sharedState.activities.map((item) => item.date));
  return [...dates].sort((a, b) => a.localeCompare(b));
}

function moveCalendar(delta) {
  const date = new Date(`${currentCalendarDate}T00:00:00`);
  date.setMonth(date.getMonth() + delta);
  currentCalendarDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
  renderView("calendar");
}

function buildMonthCalendar(monthDate) {
  const base = new Date(`${monthDate}T00:00:00`);
  const year = base.getFullYear();
  const month = base.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return {
      iso: toISODate(date),
      day: date.getDate(),
      inMonth: date.getMonth() === month
    };
  });
}

function toISODate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDay(date) {
  return date.slice(8, 10);
}

function formatMonth(date) {
  const month = new Date(`${date}T00:00:00`).toLocaleString("es-SV", { month: "short" });
  return month.replace(".", "").toUpperCase();
}

function formatCalendarDay(date) {
  return `${formatDay(date)} ${formatMonth(date)} ${date.slice(0, 4)}`;
}

function formatFullDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-SV", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function formatMonthTitle(date) {
  const formatted = new Date(`${date}T00:00:00`).toLocaleDateString("es-SV", {
    month: "long",
    year: "numeric"
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function renderGradeForm() {
  return `
    <form>
      <div class="form-grid">
        <div class="field"><label>Alumno<input value="Maria Fernanda Lopez" /></label></div>
        <div class="field"><label>Materia<select>${subjects.map((subject) => `<option ${subject === "Ciencias" ? "selected" : ""}>${subject}</option>`).join("")}</select></label></div>
        <div class="field"><label>Actividad<input value="Laboratorio de quimica" /></label></div>
        <div class="field"><label>Nota<input value="8.5" /></label></div>
        <div class="field full"><label>Retroalimentacion<textarea>Buen analisis. Mejorar conclusion final.</textarea></label></div>
      </div>
      <div class="form-actions"><button class="primary" type="button" data-action="close-modal">Guardar</button></div>
    </form>
  `;
}

function renderStudentForm() {
  return `
    <form>
      <div class="form-grid">
        <div class="field"><label>Nombre<input placeholder="Nombre completo" /></label></div>
        <div class="field"><label>Grado<select><option>6to grado</option><option>7mo grado</option><option>8vo grado</option></select></label></div>
        <div class="field"><label>Encargado<input placeholder="Nombre del encargado" /></label></div>
        <div class="field"><label>Telefono<input placeholder="0000-0000" /></label></div>
      </div>
      <div class="form-actions"><button class="primary" type="button" data-action="close-modal">Guardar alumno</button></div>
    </form>
  `;
}

function openModal(title, body) {
  modalTitle.textContent = title;
  modalBody.innerHTML = body;
  modal.classList.remove("hidden");
  modal.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", handleAction));
}

function closeModal() {
  modal.classList.add("hidden");
}

function openChat() {
  chat.classList.remove("minimized");
}

function seedChat() {
  messages.innerHTML = `
    <div class="msg bot">Hola ${currentUser.shortName}, soy SyncIA. Puedo ayudarte segun tu rol: ${roleCopy[currentUser.role].portal}.</div>
    <div class="msg user">Que debo atender hoy?</div>
    <div class="msg bot">${chatSuggestion()}</div>
  `;
}

function chatSuggestion() {
  if (currentUser.role === "teacher") return "Tienes 11 entregas por calificar y puedes agregar nuevas actividades al calendario.";
  if (currentUser.role === "admin") return "Hay 9 solicitudes abiertas y 3 expedientes pendientes de validacion.";
  return "Hay exposicion de ciencias el 7 de julio y entrega de cartulina el 8. Tambien conviene repasar Matematicas.";
}

function logout() {
  currentUser = null;
  app.classList.add("hidden");
  avatarPortal.classList.add("hidden");
  avatarWorkspace.classList.remove("avatar-active");
  assistantResult.classList.add("hidden");
  chat.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  usernameInput.value = "";
  passwordInput.value = "";
  showToast("Sesion cerrada", "Puedes ingresar con otro rol.", "success");
}

function handleAvatarPrompt(prompt) {
  flowAgent.classList.add("thinking");
  const text = prompt.toLowerCase();
  let title = "Respuesta del asistente";
  let body = "";

  if (currentUser.role === "teacher" && (text.includes("calificar") || text.includes("calificacion") || text.includes("nota"))) {
    title = "Actividades por calificar";
    body = renderTeacherGradebook();
  } else if (text.includes("calendario") || text.includes("actividad") || text.includes("actividades")) {
    title = "Calendario y proximas actividades";
    body = renderCalendarView();
  } else if (text.includes("nota") || text.includes("calificacion")) {
    title = currentUser.role === "teacher" ? "Actividades por calificar" : "Tus notas recientes";
    body = currentUser.role === "teacher" ? renderTeacherGradebook() : renderGradesView(false);
  } else if (text.includes("curso") || text.includes("materia") || text.includes("grupo")) {
    title = currentUser.role === "teacher" ? "Tus grupos asignados" : "Tus cursos";
    body = currentUser.role === "teacher"
      ? views.teacher.groups()
      : views.student.courses();
  } else if (text.includes("aviso") || text.includes("mensaje")) {
    title = currentUser.role === "teacher" ? "Mensajes docentes" : "Avisos";
    body = currentUser.role === "teacher"
      ? views.teacher.messages()
      : views.student.notices();
  } else {
    title = "Sugerencias";
    body = renderCards("Puedo mostrarte", [
      ["Calendario", "Escribe: muestrame el calendario de mis proximas actividades."],
      ["Notas", "Escribe: quiero ver mis notas recientes."],
      ["Cursos", "Escribe: muestrame mis cursos o grupos."],
      ["Avisos", "Escribe: que avisos tengo pendientes."]
    ]);
  }

  typeAvatarText(`Listo. Te muestro: ${title}.`);
  setTimeout(() => {
    avatarWorkspace.classList.add("avatar-active");
    assistantResult.classList.remove("hidden");
    assistantResult.innerHTML = `<div class="assistant-result-head"><span>Peticion</span><strong>${prompt}</strong></div>${body}`;
    assistantResult.classList.remove("view-enter");
    void assistantResult.offsetWidth;
    assistantResult.classList.add("view-enter");
    flowAgent.classList.remove("thinking");
    bindContentActions();
  }, 420);
}

function typeAvatarText(text) {
  const target = document.querySelector("#flow-response");
  target.textContent = "";
  let index = 0;
  const speed = 16;

  const timer = setInterval(() => {
    target.textContent += text.charAt(index);
    index += 1;
    if (index >= text.length) clearInterval(timer);
  }, speed);
}

function showToast(title, message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<div><strong>${title}</strong><span>${message}</span></div>`;
  toastStack.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("leaving");
    setTimeout(() => toast.remove(), 220);
  }, 3000);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  signIn(usernameInput.value.trim().toLowerCase(), passwordInput.value.trim());
});

avatarComposer.addEventListener("submit", (event) => {
  event.preventDefault();
  const prompt = avatarInput.value.trim();
  if (!prompt) {
    showToast("Escribe una peticion", "Por ejemplo: muestrame el calendario.", "error");
    return;
  }
  handleAvatarPrompt(prompt);
  avatarInput.value = "";
});

document.querySelectorAll("[data-login]").forEach((button) => {
  button.addEventListener("click", () => {
    usernameInput.value = button.dataset.login;
    passwordInput.value = "1234";
    signIn(button.dataset.login, "1234");
  });
});

document.querySelector(".chat-head").addEventListener("click", () => {
  chat.classList.toggle("minimized");
});

brandToggle.addEventListener("click", () => {
  app.classList.toggle("sidebar-collapsed");
});

document.querySelector("#chat-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#chat-input");
  const text = input.value.trim();
  if (!text) return;
  messages.insertAdjacentHTML("beforeend", `<div class="msg user">${text}</div>`);
  messages.insertAdjacentHTML("beforeend", `<div class="msg bot">${chatSuggestion()}</div>`);
  input.value = "";
  messages.scrollTop = messages.scrollHeight;
});

document.querySelector("[data-action='close-modal']").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
