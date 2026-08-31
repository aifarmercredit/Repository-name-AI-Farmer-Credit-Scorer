/* =========================================================
   AI FARMER CREDIT SCORER
   SCRIPT.JS
========================================================= */


/* =========================================================
   1. SUPABASE CONFIGURATION
========================================================= */

/*
   Supabase Dashboard → Project Settings → API

   SUPABASE_URL:
   Project URL

   SUPABASE_ANON_KEY:
   anon public key

   IMPORTANT:
   Service Role Key ykn Secret Key website keessatti hin galchin.
*/

const SUPABASE_URL = "PASTE_YOUR_SUPABASE_PROJECT_URL_HERE";

const SUPABASE_ANON_KEY =
    "PASTE_YOUR_SUPABASE_ANON_PUBLIC_KEY_HERE";


let supabaseClient = null;

try {
    if (
        SUPABASE_URL.startsWith("http") &&
        SUPABASE_ANON_KEY.length > 30
    ) {
        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

        console.log("Supabase connected.");
    } else {
        console.warn(
            "Supabase configuration is not complete yet."
        );
    }
} catch (error) {
    console.error("Supabase initialization error:", error);
}


/* =========================================================
   2. DOM ELEMENTS
========================================================= */

const navbar = document.querySelector(".navbar");

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");

const authModal =
    document.getElementById("authModal");

const authBox =
    document.querySelector(".auth-box");

const closeModal =
    document.querySelector(".close-modal");

const openAuthButtons =
    document.querySelectorAll(".open-auth");

const authForm =
    document.getElementById("authForm");

const authEmail =
    document.getElementById("authEmail");

const authPassword =
    document.getElementById("authPassword");

const googleButton =
    document.querySelector(".google-btn");

const authStatus =
    document.querySelector(".auth-status");

const authSwitchButton =
    document.querySelector(".auth-switch button");

const authTitle =
    document.querySelector(".auth-header h2");

const authDescription =
    document.querySelector(".auth-header p");

const authSubmit =
    document.querySelector(".auth-submit");

const toast =
    document.querySelector(".toast");

const toastMessage =
    document.querySelector(".toast span");

const toastClose =
    document.querySelector(".toast button");

const contactForm =
    document.querySelector(".contact-form");


/* =========================================================
   3. APPLICATION STATE
========================================================= */

let authMode = "login";

let toastTimer;


/* =========================================================
   4. TOAST NOTIFICATION
========================================================= */

function showToast(message) {

    if (!toast || !toastMessage) return;

    clearTimeout(toastTimer);

    toastMessage.textContent = message;

    toast.classList.add("show");

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 4500);
}


if (toastClose) {

    toastClose.addEventListener("click", () => {

        toast.classList.remove("show");

    });
}


/* =========================================================
   5. NAVBAR SCROLL
========================================================= */

window.addEventListener("scroll", () => {

    if (window.scrollY > 20) {

        navbar?.classList.add("scrolled");

    } else {

        navbar?.classList.remove("scrolled");

    }

});


/* =========================================================
   6. MOBILE MENU
========================================================= */

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("open");

        const icon =
            menuToggle.querySelector("i");

        if (navMenu.classList.contains("open")) {

            icon.className =
                "fa-solid fa-xmark";

        } else {

            icon.className =
                "fa-solid fa-bars";

        }

    });

}


/* Close mobile menu after clicking a link */

document.querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener("click", () => {

            navMenu?.classList.remove("open");

            const icon =
                menuToggle?.querySelector("i");

            if (icon) {

                icon.className =
                    "fa-solid fa-bars";

            }

        });

    });


/* =========================================================
   7. AUTH MODAL FUNCTIONS
========================================================= */

function openAuthModal(mode = "login") {

    if (!authModal) return;

    authMode = mode;

    updateAuthMode();

    authModal.classList.add("active");

    document.body.style.overflow = "hidden";

    setTimeout(() => {

        authEmail?.focus();

    }, 200);

}


function closeAuthModal() {

    if (!authModal) return;

    authModal.classList.remove("active");

    document.body.style.overflow = "";

    clearAuthStatus();

}


/* =========================================================
   8. CHANGE LOGIN / SIGNUP MODE
========================================================= */

function updateAuthMode() {

    clearAuthStatus();

    if (authMode === "signup") {

        if (authTitle) {

            authTitle.textContent =
                "Create Your Account";

        }

        if (authDescription) {

            authDescription.textContent =
                "Start exploring AI-powered agricultural credit insights.";

        }

        if (authSubmit) {

            authSubmit.textContent =
                "Create Account";

        }

        if (authPassword) {

            authPassword.autocomplete =
                "new-password";

        }

        if (authSwitchButton) {

            authSwitchButton.textContent =
                "Sign In";

            const switchText =
                authSwitchButton
                    .previousElementSibling;

            if (switchText) {

                switchText.textContent =
                    "Already have an account?";

            }

        }

    } else {

        if (authTitle) {

            authTitle.textContent =
                "Welcome Back";

        }

        if (authDescription) {

            authDescription.textContent =
                "Sign in to access your AI credit assessment.";

        }

        if (authSubmit) {

            authSubmit.textContent =
                "Sign In";

        }

        if (authPassword) {

            authPassword.autocomplete =
                "current-password";

        }

        if (authSwitchButton) {

            authSwitchButton.textContent =
                "Create Account";

            const switchText =
                authSwitchButton
                    .previousElementSibling;

            if (switchText) {

                switchText.textContent =
                    "Don't have an account?";

            }

        }

    }

}


/* =========================================================
   9. OPEN AUTH BUTTONS
========================================================= */

openAuthButtons.forEach(button => {

    button.addEventListener("click", () => {

        const mode =
            button.dataset.mode || "login";

        openAuthModal(mode);

    });

});


/* =========================================================
   10. CLOSE MODAL
========================================================= */

closeModal?.addEventListener("click", () => {

    closeAuthModal();

});


/* Click outside modal */

authModal?.addEventListener("click", event => {

    if (event.target === authModal) {

        closeAuthModal();

    }

});


/* Escape key */

document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        authModal?.classList.contains("active")
    ) {

        closeAuthModal();

    }

});


/* =========================================================
   11. SWITCH LOGIN / SIGNUP
========================================================= */

authSwitchButton?.addEventListener("click", () => {

    if (authMode === "login") {

        authMode = "signup";

    } else {

        authMode = "login";

    }

    updateAuthMode();

});


/* =========================================================
   12. AUTH STATUS
========================================================= */

function setAuthStatus(
    message,
    type = "error"
) {

    if (!authStatus) return;

    authStatus.textContent = message;

    if (type === "success") {

        authStatus.style.color =
            "#167a45";

    } else if (type === "loading") {

        authStatus.style.color =
            "#718077";

    } else {

        authStatus.style.color =
            "#c0392b";

    }

}


function clearAuthStatus() {

    if (!authStatus) return;

    authStatus.textContent = "";

}


/* =========================================================
   13. BUTTON LOADING STATE
========================================================= */

function setButtonLoading(
    button,
    loading,
    loadingText = "Please wait..."
) {

    if (!button) return;

    if (loading) {

        button.dataset.originalText =
            button.innerHTML;

        button.disabled = true;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            ${loadingText}
        `;

    } else {

        button.disabled = false;

        if (button.dataset.originalText) {

            button.innerHTML =
                button.dataset.originalText;

        }

    }

}


/* =========================================================
   14. EMAIL AUTH
========================================================= */

authForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const email =
            authEmail.value.trim();

        const password =
            authPassword.value;

        clearAuthStatus();


        if (!email || !password) {

            setAuthStatus(
                "Please enter your email and password."
            );

            return;

        }


        if (password.length < 6) {

            setAuthStatus(
                "Password must contain at least 6 characters."
            );

            return;

        }


        if (!supabaseClient) {

            setAuthStatus(
                "Supabase is not configured yet. Add your Project URL and anon public key in script.js."
            );

            return;

        }


        try {

            setButtonLoading(
                authSubmit,
                true,
                authMode === "signup"
                    ? "Creating account..."
                    : "Signing in..."
            );


            /* =========================
               CREATE ACCOUNT
            ========================= */

            if (authMode === "signup") {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth.signUp({

                        email: email,

                        password: password,

                        options: {

                            emailRedirectTo:
                                window.location.origin

                        }

                    });


                if (error) {

                    throw error;

                }


                if (
                    data.user &&
                    !data.session
                ) {

                    setAuthStatus(
                        "Account created successfully. Please check your email to confirm your account.",
                        "success"
                    );

                    showToast(
                        "Account created. Check your email."
                    );

                } else {

                    setAuthStatus(
                        "Account created successfully!",
                        "success"
                    );

                    showToast(
                        "Welcome to AI Farmer Credit Scorer!"
                    );


                    setTimeout(() => {

                        window.location.href =
                            "dashboard.html";

                    }, 1000);

                }

            }


            /* =========================
               SIGN IN
            ========================= */

            else {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth
                        .signInWithPassword({

                            email: email,

                            password: password

                        });


                if (error) {

                    throw error;

                }


                if (data.user) {

                    setAuthStatus(
                        "Signed in successfully!",
                        "success"
                    );

                    showToast(
                        "Welcome back!"
                    );


                    setTimeout(() => {

                        window.location.href =
                            "dashboard.html";

                    }, 700);

                }

            }

        } catch (error) {

            console.error(
                "Authentication error:",
                error
            );


            setAuthStatus(
                error.message ||
                "Something went wrong. Please try again."
            );

        } finally {

            setButtonLoading(
                authSubmit,
                false
            );

        }

    }
);


/* =========================================================
   15. GOOGLE LOGIN
========================================================= */

googleButton?.addEventListener(
    "click",
    async () => {

        if (!supabaseClient) {

            setAuthStatus(
                "Supabase is not configured yet."
            );

            return;

        }


        try {

            setButtonLoading(
                googleButton,
                true,
                "Connecting..."
            );


            /*
               Google OAuth

               Supabase Dashboard:
               Authentication
               → Providers
               → Google
               → Enable

               Also configure Redirect URLs.
            */

            const {
                data,
                error
            } =
                await supabaseClient.auth
                    .signInWithOAuth({

                        provider: "google",

                        options: {

                            redirectTo:
                                window.location.origin +
                                "/dashboard.html"

                        }

                    });


            if (error) {

                throw error;

            }


            console.log(
                "Redirecting to Google...",
                data
            );

        } catch (error) {

            console.error(
                "Google authentication error:",
                error
            );


            setAuthStatus(
                error.message ||
                "Google sign-in failed."
            );


            setButtonLoading(
                googleButton,
                false
            );

        }

    }
);


/* =========================================================
   16. CHECK AUTH SESSION
========================================================= */

async function checkUserSession() {

    if (!supabaseClient) return;

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

            return;

        }


        if (data.session) {

            console.log(
                "User signed in:",
                data.session.user.email
            );

        }

    } catch (error) {

        console.error(
            "Session check failed:",
            error
        );

    }

}


/* =========================================================
   17. AUTH STATE LISTENER
========================================================= */

if (supabaseClient) {

    supabaseClient.auth.onAuthStateChange(
        (event, session) => {

            console.log(
                "Auth event:",
                event
            );


            if (
                event === "SIGNED_IN" &&
                session
            ) {

                console.log(
                    "Authenticated user:",
                    session.user.email
                );

            }


            if (
                event === "SIGNED_OUT"
            ) {

                console.log(
                    "User signed out."
                );

            }

        }
    );

}


/* =========================================================
   18. CONTACT FORM
========================================================= */

contactForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const name =
            document
                .getElementById("contactName")
                ?.value
                .trim();

        const email =
            document
                .getElementById("contactEmail")
                ?.value
                .trim();

        const message =
            document
                .getElementById("contactMessage")
                ?.value
                .trim();


        if (
            !name ||
            !email ||
            !message
        ) {

            showToast(
                "Please complete all fields."
            );

            return;

        }


        /*
           Currently this is frontend only.

           Later you can connect this form to:
           - Supabase database
           - Supabase Edge Function
           - EmailJS
           - Your backend API
        */

        showToast(
            "Thank you! Your message has been received."
        );


        contactForm.reset();

    }
);


/* =========================================================
   19. ACTIVE NAVIGATION LINK
========================================================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );


const navigationLinks =
    document.querySelectorAll(
        ".nav-link"
    );


function updateActiveNavigation() {

    let currentSection =
        "home";


    sections.forEach(section => {

        const top =
            section.offsetTop - 150;

        const bottom =
            top + section.offsetHeight;


        if (
            window.scrollY >= top &&
            window.scrollY < bottom
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navigationLinks.forEach(link => {

        link.classList.remove("active");


        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveNavigation
);


/* =========================================================
   20. INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkUserSession();

        updateActiveNavigation();

        console.log(
            "AI Farmer Credit Scorer loaded successfully."
        );

    }
);
