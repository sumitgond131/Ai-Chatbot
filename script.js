// DOM Elements
const prompt = document.querySelector("#prompt");
const submitBtn = document.querySelector("#submit");
const chatContainer = document.querySelector(".chat-container");
const imageBtn = document.querySelector("#image");
const imageInput = document.querySelector("#image input");

// API Config
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBVhOsd2RBjqy2MJC_bvYvCiLrFDrJCOGY";

let user = { message: "", file: { mime_type: null, data: null } };

// Generate AI Response
async function generateResponse(aiChatBox) {
  const textEl = aiChatBox.querySelector(".ai-chat-area");
  const body = {
    contents: [{
      parts: [
        { text: user.message },
        ...(user.file.data ? [{ inline_data: user.file }] : [])
      ]
    }]
  };

  try {
    const res = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    typeWriter(textEl, reply || "Sorry, I couldn't process your request.");
  } catch {
    textEl.textContent = "Error: could not connect to AI service.";
  } finally {
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    resetImageUpload();
  }
}

// Typing Effect
function typeWriter(el, text, speed = 30) {
  el.textContent = "";
  [...text].forEach((ch, i) => setTimeout(() => {
    el.textContent += ch;
    chatContainer.scrollTo({ top: chatContainer.scrollHeight });
  }, i * speed));
}

// Create chat box
function createChatBox(html, cls) {
  const div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(cls);
  return div;
}

// Handle Chat
function handleChatResponse(msg) {
  if (!msg.trim() && !user.file.data) return;
  user.message = msg || "";
  prompt.value = "";

  const userHtml = `
    <div class="user-chat-area">
      ${user.message}
      ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>` : ""}
    </div><div class="user-avatar"><i class="fas fa-user"></i></div>`;
  chatContainer.appendChild(createChatBox(userHtml, "user-chat-box"));
  chatContainer.scrollTo({ top: chatContainer.scrollHeight });

  setTimeout(() => {
    const aiHtml = `<div class="ai-avatar-small"><i class="fas fa-robot"></i></div><div class="ai-chat-area"><div class="loading-dots"><span></span><span></span><span></span></div></div>`;
    const aiBox = createChatBox(aiHtml, "ai-chat-box");
    chatContainer.appendChild(aiBox);
    generateResponse(aiBox);
  }, 500);
}

// Reset image state
function resetImageUpload() {
  imageBtn.classList.remove("has-image");
  user.file = { mime_type: null, data: null };
  imageInput.value = "";
}

// Events
prompt.addEventListener("keydown", e => (e.key === "Enter" && !e.shiftKey) && (e.preventDefault(), handleChatResponse(prompt.value)));
submitBtn.addEventListener("click", () => handleChatResponse(prompt.value));
imageBtn.addEventListener("click", () => imageInput.click());
imageInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return alert("Invalid image. Max 5MB.");
  const reader = new FileReader();
  reader.onload = ev => {
    user.file = { mime_type: file.type, data: ev.target.result.split(",")[1] };
    imageBtn.classList.add("has-image");
  };
  reader.readAsDataURL(file);
});
prompt.addEventListener("input", function () { this.style.height = "auto"; this.style.height = Math.min(this.scrollHeight, 120) + "px"; });
window.addEventListener("load", () => prompt.focus());

// Loading dots CSS
const style = document.createElement("style");
style.textContent = `.loading-dots{display:flex;gap:4px}.loading-dots span{width:8px;height:8px;border-radius:50%;background:#666;animation:loading 1.4s infinite}.loading-dots span:nth-child(1){animation-delay:-.32s}.loading-dots span:nth-child(2){animation-delay:-.16s}@keyframes loading{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`;
document.head.appendChild(style);
