const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
    window.location.href = "login.html";
}

let data = [];
let isDataLoaded = false;

fetch('remedies.json')
    .then(res => res.json())
    .then(json => {
        data = json;
        isDataLoaded = true;
        console.log("✅ Data loaded");
    });


// Send message
function sendMessage() {
    if (!isDataLoaded) {
        alert("⏳ Please wait, data is still loading...");
        return;
    }
    const input = document.getElementById("userInput");
    const text = input.value.toLowerCase();
    
    if (text.trim() === "") return;

    addMessage(text, "user");

    let matches = [];

    data.forEach(item => {
        item.symptoms.forEach(keyword => {
            if (text.includes(keyword)) {
                matches.push(item);
            }
        });
    });

    let reply;

    if (matches.length > 0) {
        reply = "";
        matches.forEach(item => {
            reply += `
            <div class="card">
                <b>🌿 ${item.remedy}</b><br>
                <img src="${item.image}">
                <p><b>Uses:</b> ${item.uses}</p>
                <p><b>Part Used:</b> ${item.part}</p>
                <p><b>How to use: </b> ${item.how}</p>
            </div><br>
            `;
        });
    } else {
        reply = "❌ Sorry, I couldn't find a remedy.";
    }

    typingEffect(reply);

    input.value = "";

    let userText = input.value.toLowerCase();
    if (
        text.includes("near") ||
        text.includes("location") ||
        text.includes("center") ||
        text.includes("hospital") ||
        text.includes("ayurvedic")
    ) {
        findCentersFromChat();
        return;
    }
}

// Add message
function addMessage(text, type) {
    const chatbox = document.getElementById("chatbox");

    const msg = document.createElement("div");
    msg.className = "message " + type;
    msg.innerText = text;

    chatbox.appendChild(msg);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Typing effect
function typingEffect(html) {
    const chatbox = document.getElementById("chatbox");

    const msg = document.createElement("div");
    msg.className = "message bot";
    chatbox.appendChild(msg);

    let i = 0;
    let speed = 15;

    function type() {
        msg.innerHTML = html.substring(0, i);
        i++;
        if (i <= html.length) {
            setTimeout(type, speed);
        }
    }

    type();
    chatbox.scrollTop = chatbox.scrollHeight;
}

function saveHistory(text, type) {
    let history = JSON.parse(localStorage.getItem(currentUser+ "_history")) || [];

    history.push({ text, type });

    localStorage.setItem(currentUser+ "_history", JSON.stringify(history));
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem(currentUser+ "_history")) || [];

    history.forEach(msg => {
        addMessage(msg.text, msg.type);
    });
}

window.onload = loadHistory;
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

function startVoice() {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-IN";

    recognition.onresult = function(event) {
        const text = event.results[0][0].transcript;
        document.getElementById("userInput").value = text;
        sendMessage();
    };

    recognition.start();
}

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.rate = 1;

    window.speechSynthesis.speak(speech);
}

function toggleDark() {
    document.body.classList.toggle("dark");
}

function downloadHistory() {
    const chatbox = document.getElementById("chatbox").innerHTML;

    const htmlContent = `
    <html>
    <head><title>Chat History</title></head>
    <body>${chatbox}</body>
    </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "chat_history.html";
    a.click();
}

function findCenters() {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            console.log("Location:", position.coords);

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url = `https://www.google.com/maps/search/ayurvedic+center+near+me/@${lat},${lon},15z`;

            window.open(url, "_blank");
        },
        function(error) {
            console.log("Error code:", error.code);

            if (error.code === 1) {
                alert("❌ Permission denied. Allow location access.");
            } else if (error.code === 2) {
                alert("❌ Location unavailable.");
            } else if (error.code === 3) {
                alert("❌ Request timeout.");
            }
        }
    );
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url = `https://www.google.com/maps/search/ayurvedic+center+near+me/@${lat},${lon},15z`;

    window.open(url, "_blank");
}

function showError(error) {
    alert("❌ Unable to fetch location. Please allow location access.");
}

function findCentersFromChat() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url = `https://www.google.com/maps/search/ayurvedic+center+near+me/@${lat},${lon},15z`;

            let reply = `
            📍 <b>Nearby AYUSH Centers:</b><br>
            <a href="${url}" target="_blank">👉 Click here to view on Google Maps</a>
            `;

            addMessage(reply, "bot");
        }, () => {
            addMessage("❌ Please allow location access to find nearby centers.", "bot");
        });
    } else {
        addMessage("❌ Geolocation not supported in your browser.", "bot");
    }
}

function askCity() {
    let city = prompt("Enter your city:");
    if (city) {
        let url = `https://www.google.com/maps/search/ayurvedic+center+in+${city}`;
        window.open(url, "_blank");
    }
}