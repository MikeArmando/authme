const signupSection = document.getElementById("signup-section");
const loginSection = document.getElementById("login-section");
const logoutBtn = document.getElementById("logout-btn");

const linkToLogin = document.getElementById("link-to-login");
const linkToSignup = document.getElementById("link-to-signup");

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

const confirmPasswordInput = document.getElementById("signup-confirm-password");
const PasswordInput = document.getElementById("signup-password");

const loadingIndicator = document.getElementById("app-loading-section");

const passwordErrorDisplay = document.getElementById(
  "signup-confirm-password-error",
);

// -------------------------- Event Listeners --------------------------
window.addEventListener("DOMContentLoaded", checkLoginStatus);

linkToSignup.addEventListener("click", (event) => {
  event.preventDefault();

  history.pushState({ view: "signup" }, "", "/signup");

  loginSection.classList.add("hidden");
  signupSection.classList.remove("hidden");
});

linkToLogin.addEventListener("click", (event) => {
  event.preventDefault();

  history.pushState({ view: "login" }, "", "/login");

  signupSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
});

logoutBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/user/logout", {
      method: "POST",
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById("dashboard-section").classList.add("hidden");
      loginSection.classList.remove("hidden");

      history.pushState({ view: "login" }, "", "/login");
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
});

if (signupForm) {
  signupForm.addEventListener("submit", handleSignup);
}

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

// -------------------------- Inicial Validation Check --------------------------
async function checkLoginStatus() {
  const path = window.location.pathname;

  try {
    const response = await fetch("/api/user/dashboard");
    const data = await response.json();

    if (loadingIndicator) {
      loadingIndicator.style.display = "none";
    }

    if (data.isAuthenticated) {
      showDashboard(data.user.firstName, data.user.email);
    } else {
      if (path === "/signup") {
        loginSection.classList.add("hidden");
        signupSection.classList.remove("hidden");
      } else {
        signupSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
        if (path !== "/login")
          history.replaceState({ view: "login" }, "", "/login");
      }
    }
  } catch (error) {
    if (loadingIndicator) {
      loadingIndicator.style.display = "none";
    }

    loginSection.classList.remove("hidden");
  }
}

// -------------------------- Sign Up --------------------------
async function handleSignup(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const userData = Object.fromEntries(formData);
  const formType = "signup";

  if (userData.password !== userData["confirm-password"]) {
    const resultObject = {
      field: "confirm-password",
      message: "Passwords don't match.",
    };

    showErrors(formType, resultObject);
    return;
  }

  try {
    const response = await fetch("/api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      showErrors(formType, result);
      return;
    }

    form.reset();

    showDashboard(result.firstName, result.email);
  } catch (error) {
    console.error("Network Error:", error);
    alert("Something went wrong. Please try again later.");
  }
}

// -------------------------- Log In --------------------------
async function handleLogin(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const userData = Object.fromEntries(formData);
  const formType = "login";

  try {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      showErrors(formType, result);
      return;
    }

    showDashboard(result.user.firstName, result.user.email);
  } catch (error) {
    console.error("Network Error:", error);
    alert("Something went wrong. Please try again later.");
  }
}

// -------------------------- Show Welcome Page --------------------------
function showDashboard(userName, userEmail) {
  history.pushState({ view: "dashboard" }, "", "/dashboard");

  loginSection.classList.add("hidden");
  signupSection.classList.add("hidden");
  document.getElementById("dashboard-section").classList.remove("hidden");
  document.getElementById("dashboard-welcome-message").textContent =
    ` ${userName}!`;
  document.getElementById("dashboard-email-message").textContent = userEmail;
}

// -------------------------- Show Errors --------------------------
function showErrors(formType, result) {
  const errorSpan = document.getElementById(
    `${formType}-${result.field}-error`,
  );

  if (errorSpan) {
    errorSpan.classList.add("active");
    errorSpan.textContent = result.message;
  } else {
    console.error("Unknown error field:", result.field);
    alert(result.message);
  }
}

// -------------------------- Clear Error Messages --------------------------
PasswordInput.addEventListener("input", () => {
  passwordErrorDisplay.textContent = "";
});

confirmPasswordInput.addEventListener("input", () => {
  passwordErrorDisplay.textContent = "";
});

// -------------------------- Back/Forward --------------------------
window.addEventListener("popstate", (event) => {
  const path = window.location.pathname;

  if (path === "/signup") {
    loginSection.classList.add("hidden");
    signupSection.classList.remove("hidden");
    document.getElementById("dashboard-section").classList.add("hidden");
  }
  if (path === "/login") {
    signupSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
    document.getElementById("dashboard-section").classList.add("hidden");
  }
  if (path === "/dashboard") {
    checkLoginStatus();
  }
});