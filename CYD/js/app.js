const chat = document.querySelector(".chat");
const chatHead = document.querySelector(".chat-head");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const messages = document.querySelector("#messages");

chatHead.addEventListener("click", () => {
  chat.classList.toggle("minimized");
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = chatInput.value.trim();
  if (!text) return;

  messages.insertAdjacentHTML("beforeend", `<div class="msg user">${text}</div>`);
  messages.insertAdjacentHTML(
    "beforeend",
    `<div class="msg bot">Entendido. Para el portal del estudiante consultaria tus notas, cursos y actividades antes de responder.</div>`
  );

  chatInput.value = "";
  messages.scrollTop = messages.scrollHeight;
});
