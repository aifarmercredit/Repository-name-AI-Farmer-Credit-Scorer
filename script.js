/* =========================================================
   AI FARMER CREDIT SCORER
   MAIN JAVASCRIPT
   Login + Register + Google + Dashboard + Profile
========================================================= */

"use strict";

/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL =
    "https://xcevtpkrasvevwyvvdjq.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_C_WZDTvi8dZwZAgKQh6ANA_vJDd6LKH";

let supabaseClient = null;

if (window.supabase) {
    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
}

/* =========================================================
   ELEMENTS
========================================================= */

const loader = document.getElementById("loader");

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const dashboardSection = document.getElementById("dashboardSection");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerConfirm = document.getElementById("registerConfirm");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

const googleLogin = document.getElementById("googleLogin");
const googleRegister = document.getElementById("googleRegister");

const logoutButton = document.getElementById("logoutButton");

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileAvatar = document.getElementById("profileAvatar");

/* =========================================================
   PAGE LOADER
========================================================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        if (loader) {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
        }

        checkCurrentUser();

    }, 700);

});


/* =========================================================
   MESSAGE HELPER
========================================================= */

function showMessage(element, message, type = "success") {

    if (!element) return;

    element.textContent = message;

    element.className = "form-message";

    element.classList.add(type);

}


/* =========================================================
   SHOW LOGIN
========================================================= */

function showLogin() {

    if (loginSection) {
        loginSection.style.display = "block";
    }

    if (registerSection) {
        registerSection.style.display = "none";
    }

    if (dashboardSection) {
        dashboardSection.style.display = "none";
    }

}


/* =========================================================
   SHOW REGISTER
========================================================= */

function showRegister() {

    if (loginSection) {
        loginSection.style.display = "none";
    }

    if (registerSection) {
        registerSection.style.display = "block";
    }

    if (dashboardSection) {
        dashboardSection.style.display = "none";
    }

}


/* =========================================================
   SHOW DASHBOARD
========================================================= */

function showDashboard(user) {

    if (loginSection) {
        loginSection.style.display = "none";
    }

    if (registerSection) {
        registerSection.style.display = "none";
    }

    if (dashboardSection) {
        dashboardSection.style.display = "block";
    }

    updateProfile(user);

}


/* =========================================================
   UPDATE PROFILE
========================================================= */

function updateProfile(user) {

    if (!user) return;

    const metadata = user.user_metadata || {};

    const name =
        metadata.full_name ||
        metadata.name ||
        metadata.display_name ||
        "Farmer";

    const email =
        user.email ||
        "No email";

    if (profileName) {
        profileName.textContent = name;
    }

    if (profileEmail) {
        profileEmail.textContent = email;
    }

    if (profileAvatar) {

        if (metadata.avatar_url) {

            profileAvatar.src = metadata.avatar_url;

        } else {

            profileAvatar.src =
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(name) +
                "&background=1f8f5f&color=ffffff";

        }

    }

}


/* =========================================================
   CHECK CURRENT USER
========================================================= */

async function checkCurrentUser() {

    if (!supabaseClient) {

        console.error("Supabase is not initialized.");

        showLogin();

        return;
    }

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();

        if (error) {

            console.error(error);

            showLogin();

            return;
        }

        const session = data.session;

        if (session && session.user) {

            showDashboard(session.user);

        } else {

            showLogin();

        }

    } catch (error) {

        console.error(
            "Session error:",
            error
        );

        showLogin();

    }

}


/* =========================================================
   LOGIN WITH EMAIL + PASSWORD
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            if (!supabaseClient) {

                showMessage(
                    loginMessage,
                    "Authentication system is not connected.",
                    "error"
                );

                return;
            }

            const email =
                loginEmail.value.trim();

            const password =
                loginPassword.value;

            if (!email || !password) {

                showMessage(
                    loginMessage,
                    "Please enter your email and password.",
                    "error"
                );

                return;
            }

            showMessage(
                loginMessage,
                "Signing in...",
                "loading"
            );

            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth.signInWithPassword({
                        email: email,
                        password: password
                    });

                if (error) {

                    showMessage(
                        loginMessage,
                        error.message,
                        "error"
                    );

                    return;
                }

                showMessage(
                    loginMessage,
                    "Login successful!",
                    "success"
                );

                setTimeout(() => {

                    showDashboard(data.user);

                }, 700);

            } catch (error) {

                console.error(error);

                showMessage(
                    loginMessage,
                    "Something went wrong. Please try again.",
                    "error"
                );

            }

        }
    );

}


/* =========================================================
   REGISTER
========================================================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            if (!supabaseClient) {

                showMessage(
                    registerMessage,
                    "Authentication system is not connected.",
                    "error"
                );

                return;
            }

            const name =
                registerName.value.trim();

            const email =
                registerEmail.value.trim();

            const password =
                registerPassword.value;

            const confirmPassword =
                registerConfirm.value;

            if (!name || !email || !password || !confirmPassword) {

                showMessage(
                    registerMessage,
                    "Please complete all fields.",
                    "error"
                );

                return;
            }

            if (password.length < 6) {

                showMessage(
                    registerMessage,
                    "Password must be at least 6 characters.",
                    "error"
                );

                return;
            }

            if (password !== confirmPassword) {

                showMessage(
                    registerMessage,
                    "Passwords do not match.",
                    "error"
                );

                return;
            }

            showMessage(
                registerMessage,
                "Creating your account...",
                "loading"
            );

            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth.signUp({

                        email: email,

                        password: password,

                        options: {

                            data: {
                                full_name: name
                            }

                        }

                    });

                if (error) {

                    showMessage(
                        registerMessage,
                        error.message,
                        "error"
                    );

                    return;
                }

                /*
                 * Supabase may require email confirmation.
                 */

                if (
                    data.user &&
                    !data.session
                ) {

                    showMessage(
                        registerMessage,
                        "Account created. Please check your email to confirm your account.",
                        "success"
                    );

                    return;
                }

                if (data.user) {

                    showMessage(
                        registerMessage,
                        "Account created successfully!",
                        "success"
                    );

                    setTimeout(() => {

                        showDashboard(data.user);

                    }, 800);

                }

            } catch (error) {

                console.error(error);

                showMessage(
                    registerMessage,
                    "Registration failed. Please try again.",
                    "error"
                );

            }

        }
    );

}


/* =========================================================
   GOOGLE LOGIN
========================================================= */

async function loginWithGoogle() {

    if (!supabaseClient) {

        alert(
            "Supabase authentication is not connected."
        );

        return;
    }

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithOAuth({

                provider: "google",

                options: {

                    redirectTo:
                        window.location.origin +
                        window.location.pathname

                }

            });

        if (error) {

            console.error(
                "Google login error:",
                error
            );

            alert(error.message);

        }

    } catch (error) {

        console.error(error);

        alert(
            "Google login could not be started."
        );

    }

}


/* =========================================================
   GOOGLE LOGIN BUTTONS
========================================================= */

if (googleLogin) {

    googleLogin.addEventListener(
        "click",
        loginWithGoogle
    );

}

if (googleRegister) {

    googleRegister.addEventListener(
        "click",
        loginWithGoogle
    );

}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            if (!supabaseClient) return;

            try {

                const {
                    error
                } =
                    await supabaseClient.auth.signOut();

                if (error) {

                    console.error(error);

                    return;
                }

                showLogin();

                if (loginForm) {
                    loginForm.reset();
                }

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}


/* =========================================================
   AUTH STATE LISTENER
========================================================= */

if (supabaseClient) {

    supabaseClient.auth.onAuthStateChange(
        (event, session) => {

            console.log(
                "Auth event:",
                event
            );

            if (
                session &&
                session.user
            ) {

                showDashboard(session.user);

            } else {

                showLogin();

            }

        }
    );

}


/* =========================================================
   PASSWORD VISIBILITY
========================================================= */

document.querySelectorAll(
    "[data-password-toggle]"
).forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const targetID =
                button.getAttribute(
                    "data-password-toggle"
                );

            const input =
                document.getElementById(targetID);

            if (!input) return;

            if (
                input.type === "password"
            ) {

                input.type = "text";

                button.textContent = "🙈";

            } else {

                input.type = "password";

                button.textContent = "👁️";

            }

        }
    );

});


/* =========================================================
   LOGIN / REGISTER SWITCH
========================================================= */

document.querySelectorAll(
    "[data-show-login]"
).forEach((button) => {

    button.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            showLogin();

        }
    );

});


document.querySelectorAll(
    "[data-show-register]"
).forEach((button) => {

    button.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            showRegister();

        }
    );

});


/* =========================================================
   FORGOT PASSWORD
========================================================= */

const forgotPassword =
    document.getElementById(
        "forgotPassword"
    );

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();

            if (!supabaseClient) return;

            const email =
                loginEmail
                    ? loginEmail.value.trim()
                    : "";

            if (!email) {

                showMessage(
                    loginMessage,
                    "Enter your email first.",
                    "error"
                );

                return;
            }

            try {

                const {
                    error
                } =
                    await supabaseClient.auth
                        .resetPasswordForEmail(
                            email,
                            {
                                redirectTo:
                                    window.location.origin +
                                    window.location.pathname
                            }
                        );

                if (error) {

                    showMessage(
                        loginMessage,
                        error.message,
                        "error"
                    );

                    return;
                }

                showMessage(
                    loginMessage,
                    "Password reset email sent. Check your inbox.",
                    "success"
                );

            } catch (error) {

                console.error(error);

                showMessage(
                    loginMessage,
                    "Unable to send reset email.",
                    "error"
                );

            }

        }
    );

}


/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm =
    document.getElementById(
        "contactForm"
    );

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            alert(
                "Thank you! Your message has been received."
            );

            contactForm.reset();

        }
    );

}


/* =========================================================
   MOBILE MENU
========================================================= */

const menuBtn =
    document.getElementById(
        "menuBtn"
    );

const navMenu =
    document.getElementById(
        "navMenu"
    );

if (menuBtn && navMenu) {

    menuBtn.addEventListener(
        "click",
        () => {

            navMenu.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================================
   SMOOTH SCROLL
========================================================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach((link) => {

    link.addEventListener(
        "click",
        (event) => {

            const targetID =
                link.getAttribute("href");

            if (
                !targetID ||
                targetID === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(
                    targetID
                );

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                if (navMenu) {

                    navMenu.classList.remove(
                        "active"
                    );

                }

            }

        }
    );

});


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal, .feature-card, .step-card"
    );

function revealOnScroll() {

    const height =
        window.innerHeight;

    revealElements.forEach(
        (element) => {

            const top =
                element.getBoundingClientRect()
                    .top;

            if (
                top <
                height - 80
            ) {

                element.classList.add(
                    "visible"
                );

            }

        }
    );

}

window.addEventListener(
    "scroll",
    revealOnScroll
);

revealOnScroll();


/* =========================================================
   CONSOLE
========================================================= */

console.log(
    "%c🌾 AI Farmer Credit Scorer",
    "color:#57e39b;font-size:20px;font-weight:bold;"
);

console.log(
    "Authentication system initialized."
);
