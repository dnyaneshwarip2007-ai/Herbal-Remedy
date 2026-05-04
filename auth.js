function register() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (!user || !pass) {
        alert("❌ Please enter username and password");
        return;
    }

    // Check if user already exists
    if (localStorage.getItem("user_" + user)) {
        alert("⚠️ User already exists!");
        return;
    }

    // Save user (separate key)
    localStorage.setItem("user_" + user, pass);

    alert("✅ Registered successfully!");
}

function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    const storedPass = localStorage.getItem("user_" + user);

    if (storedPass === pass) {
        localStorage.setItem("currentUser", user);
        window.location.href = "index.html";
    } else {
        alert("❌ Invalid username or password");
    }
}

function registerUser() {
    const user = document.getElementById("regUser").value.trim();
    const pass = document.getElementById("regPass").value.trim();
     const confirm = document.getElementById("confirmPass").value.trim();

    if (!user || !pass || !confirm) {
        alert("❌ Fill all fields");
        return;
    }

    if (pass !== confirm) {
        alert("❌ Passwords do not match");
        return;
    }

    if (localStorage.getItem("user_" + user)) {
        alert("⚠️ User already exists!");
        return;
    }

    localStorage.setItem("user_" + user, pass);

    alert("✅ Registered successfully!");
    window.location.href = "login.html";
}

function goToLogin() {
    window.location.href = "login.html";
}

function goToRegister() {
    window.location.href = "register.html";
}