const signupSection = document.getElementById("signup-section");
const loginSection = document.getElementById("login-section");
const logoutBtn = document.getElementById("logout-btn");

const linkToLogin = document.getElementById("link-to-login");
const linkToSignup = document.getElementById("link-to-signup");

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

// -------------------------- Event Listeners --------------------------
window.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem("user");

  if (savedUser) {
    const user = JSON.parse(savedUser);
    showWelcomePage(user.firstName);
  }
});

linkToLogin.addEventListener("click", (event) => {
  event.preventDefault();

  signupSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
});

linkToSignup.addEventListener("click", (event) => {
  event.preventDefault();

  loginSection.classList.add("hidden");
  signupSection.classList.remove("hidden");
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");

  document.getElementById("welcome-section").classList.add("hidden");
  loginSection.classList.remove("hidden");
});

if (signupForm) {
  signupForm.addEventListener("submit", handleSignup);
}

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
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
    const response = await fetch("/user/signup", {
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

    localStorage.setItem("user", JSON.stringify(result));
    showWelcomePage(result.firstName);
    form.reset();
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
    const response = await fetch("/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      showErrors(formType, result);
      return;
    }

    localStorage.setItem("user", JSON.stringify(result.user));

    showWelcomePage(result.user.firstName);
  } catch (error) {
    console.error("Network Error:", error);
    alert("Something went wrong. Please try again later.");
  }
}

// -------------------------- Show Welcome Page --------------------------
function showWelcomePage(userName) {
  loginSection.classList.add("hidden");
  signupSection.classList.add("hidden");
  document.getElementById("welcome-section").classList.remove("hidden");
  document.getElementById("Welcome-message").textContent = ` ${userName}!`;
}

// -------------------------- Show Errors --------------------------
function showErrors(formType, result) {
  const errorSpan = document.getElementById(
    `${formType}-${result.field}-error`
  );
  errorSpan.classList.add("active");
  errorSpan.textContent = result.message;
}
