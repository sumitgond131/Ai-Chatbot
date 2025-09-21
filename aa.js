document.addEventListener("DOMContentLoaded", () => {
    let prompt = document.querySelector("#prompt");
    let chatContainer = document.querySelector("#chat-container");

    const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBVhOsd2RBjqy2MJC_bvYvCiLrFDrJCOGY";
    let user = {
        data: null,
    };

    function createChatBox(html, classes) {
        let div = document.createElement("div");
        div.innerHTML = html;
        div.classList.add(classes);
        return div;
    }

    function handlechatResponse(message) {
        if (!message.trim()) return; // ignore empty input

        let html = `<img src="User.jpg" alt="" id="userImage" width="50">
                <div class="user-chat-area">
                    ${message}
                </div>`;
        prompt.value = "";
        let userChatBox = createChatBox(html, "user-chat-box");
        chatContainer.appendChild(user-chat-box);

        // auto-scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;

        setTimeout(() => {
            let html = `<img src="Ai.jpg" alt="aiImage" id="aiImage" width="70">
                <div class="ai-chat-area">
                    <img src="loading.gif" alt="" class="load" width="50px">
                </div>`;
            let aiChatBox = createChatBox(html, "ai-chat-box");
            chatContainer.appendChild(aiChatBox);

            // auto-scroll again
            chatContainer.scrollTop = chatContainer.scrollHeight;

            generateResponse(aiChatBox);
        }, 600);
    }

    // ✅ Handle Enter key to send message
    prompt.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handlechatResponse(prompt.value);
        }
    });
});
