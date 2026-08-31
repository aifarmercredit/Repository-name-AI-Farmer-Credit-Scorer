/* =========================================================
AI FARMER CREDIT SCORER
COMPLETE SCRIPT.JS
========================================================= */

/* =========================================================
DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

```
/* =====================================================
   LOADER
===================================================== */

const loader = document.querySelector(".loader");

window.addEventListener("load", () => {
    setTimeout(() => {
        if (loader) {
            loader.classList.add("hide");
        }
    }, 500);
});


/* =====================================================
   NAVBAR SCROLL
===================================================== */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (!navbar) return;

    if (window.scrollY > 30) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});


/* =====================================================
   MOBILE MENU
===================================================== */

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("open");

        const icon = menuToggle.querySelector("i");

        if (icon) {

            if (navMenu.classList.contains("open")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-times");
            } else {
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }

        }

    });


    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("open");

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }

        });

    });

}


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 140;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
            sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("id");
        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            "#" + currentSection
        ) {
            link.classList.add("active");
        }

    });

});


/* =====================================================
   SMOOTH SCROLL
===================================================== */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const targetId =
            this.getAttribute("href");

        if (
            targetId === "#" ||
            !targetId
        ) {
            return;
        }

        const target =
            document.querySelector(targetId);

        if (target) {

            e.preventDefault();

            const navHeight =
                navbar ?
                navbar.offsetHeight :
                0;

            const position =
                target.offsetTop -
                navHeight;

            window.scrollTo({
                top: position,
                behavior: "smooth"
            });

        }

    });

});


/* =====================================================
   AUTH MODAL ELEMENTS
===================================================== */

const authModal =
    document.querySelector(".auth-modal");

const openAuthButtons =
    document.querySelectorAll(
        ".open-auth"
    );

const closeModal =
    document.querySelector(
        ".close-modal"
    );

const authTitle =
    document.querySelector(
        ".auth-header h2"
    );

const authDescription =
    document.querySelector(
        ".auth-header p"
    );

const authSubmit =
    document.querySelector(
        ".auth-submit"
    );

const authSwitchText =
    document.querySelector(
        ".auth-switch span"
    );

const authSwitchButton =
    document.querySelector(
        ".auth-switch button"
    );

const authForm =
    document.querySelector(
        "#authForm"
    );

const authStatus =
    document.querySelector(
        ".auth-status"
    );

const googleButton =
    document.querySelector(
        ".google-btn"
    );


/* =====================================================
   AUTH MODE
===================================================== */

let authMode = "login";


function updateAuthMode() {

    if (
        !authTitle ||
        !authDescription ||
        !authSubmit ||
        !authSwitchText ||
        !authSwitchButton
    ) {
        return;
    }


    if (authMode === "login") {

        authTitle.textContent =
            "Welcome Back";

        authDescription.textContent =
            "Sign in to access your AI credit assessment.";

        authSubmit.textContent =
            "Sign In";

        authSwitchText.textContent =
            "Don't have an account?";

        authSwitchButton.textContent =
            "Create Account";

    } else {

        authTitle.textContent =
            "Create Account";

        authDescription.textContent =
            "Create your account and start using AI-powered credit assessment.";

        authSubmit.textContent =
            "Create Account";

        authSwitchText.textContent =
            "Already have an account?";

        authSwitchButton.textContent =
            "Sign In";

    }


    if (authStatus) {
        authStatus.textContent = "";
    }

}


/* =====================================================
   OPEN AUTH MODAL
===================================================== */

openAuthButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (authModal) {

            const requestedMode =
                button.dataset.mode;

            authMode =
                requestedMode === "signup"
                    ? "signup"
                    : "login";

            updateAuthMode();

            authModal.classList.add(
                "active"
            );

            document.body.style.overflow =
                "hidden";

        }

    });

});


/* =====================================================
   CLOSE AUTH MODAL
===================================================== */

function closeAuthModal() {

    if (!authModal) return;

    authModal.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeAuthModal
    );

}


if (authModal) {

    authModal.addEventListener(
        "click",
        (e) => {

            if (e.target === authModal) {
                closeAuthModal();
            }

        }
    );

}


document.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key === "Escape" &&
            authModal &&
            authModal.classList.contains(
                "active"
            )
        ) {
            closeAuthModal();
        }

    }
);


/* =====================================================
   SWITCH LOGIN / SIGNUP
===================================================== */

if (authSwitchButton) {

    authSwitchButton.addEventListener(
        "click",
        () => {

            authMode =
                authMode === "login"
                    ? "signup"
                    : "login";

            updateAuthMode();

        }
    );

}


/* =====================================================
   SUPABASE CONFIGURATION
   IMPORTANT:
   Add your Supabase URL and Anon Key here.
===================================================== */

const SUPABASE_URL =
    "https://rronyxeiruuaizjinsvz.supabase.co";

const SUPABASE_ANON_KEY =
    "YOUR_SUPABASE_ANON_KEY_HERE";


/* =====================================================
   INITIALIZE SUPABASE
===================================================== */

let supabaseClient = null;


if (
    typeof supabase !== "undefined" &&
    SUPABASE_URL &&
    SUPABASE_ANON_KEY !==
    "YOUR_SUPABASE_ANON_KEY_HERE"
) {

    supabaseClient =
        supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

}


/* =====================================================
   GET FORM VALUES
===================================================== */

function getAuthEmail() {

    const emailInput =
        document.querySelector(
            "#authEmail"
        );

    return emailInput
        ? emailInput.value.trim()
        : "";

}


function getAuthPassword() {

    const passwordInput =
        document.querySelector(
            "#authPassword"
        );

    return passwordInput
        ? passwordInput.value
        : "";

}


/* =====================================================
   AUTH STATUS
===================================================== */

function showAuthStatus(
    message,
    type = "error"
) {

    if (!authStatus) return;

    authStatus.textContent =
        message;

    authStatus.style.color =
        type === "success"
            ? "#16804a"
            : "#d9534f";

}


/* =====================================================
   EMAIL LOGIN / SIGNUP
===================================================== */

if (authForm) {

    authForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const email =
                getAuthEmail();

            const password =
                getAuthPassword();


            if (!email || !password) {

                showAuthStatus(
                    "Please enter your email and password."
                );

                return;

            }


            if (
                !supabaseClient
            ) {

                showAuthStatus(
                    "Supabase is not configured yet. Please add your Anon Key."
                );

                return;

            }


            authSubmit.disabled =
                true;

            authSubmit.textContent =
                authMode === "login"
                    ? "Signing in..."
                    : "Creating account...";


            try {

                let result;


                if (
                    authMode === "login"
                ) {

                    result =
                        await supabaseClient
                            .auth
                            .signInWithPassword({
                                email,
                                password
                            });

                } else {

                    result =
                        await supabaseClient
                            .auth
                            .signUp({
                                email,
                                password,
                                options: {
                                    emailRedirectTo:
                                        window.location.origin
                                }
                            });

                }


                const {
                    data,
                    error
                } = result;


                if (error) {

                    showAuthStatus(
                        error.message
                    );

                    return;

                }


                if (
                    authMode ===
                    "signup"
                ) {

                    showAuthStatus(
                        "Account created successfully! Please check your email if confirmation is required.",
                        "success"
                    );

                } else {

                    showAuthStatus(
                        "Login successful! Welcome back.",
                        "success"
                    );


                    setTimeout(
                        () => {

                            closeAuthModal();

                            updateUserInterface(
                                data.user
                            );

                            showToast(
                                "Welcome back! You are now signed in."
                            );

                        },
                        900
                    );

                }


                if (
                    authForm
                ) {
                    authForm.reset();
                }


            } catch (
                error
            ) {

                showAuthStatus(
                    "Something went wrong. Please try again."
                );

                console.error(
                    error
                );

            } finally {

                authSubmit.disabled =
                    false;

                updateAuthMode();

            }

        }
    );

}


/* =====================================================
   GOOGLE LOGIN
===================================================== */

if (googleButton) {

    googleButton.addEventListener(
        "click",
        async () => {

            if (
                !supabaseClient
            ) {

                showAuthStatus(
                    "Supabase is not configured yet. Please add your Anon Key."
                );

                return;

            }


            try {

                googleButton.disabled =
                    true;


                const {
                    error
                } =
                    await supabaseClient
                        .auth
                        .signInWithOAuth({
                            provider:
                                "google",

                            options: {
                                redirectTo:
                                    window.location.origin
                            }
                        });


                if (error) {

                    showAuthStatus(
                        error.message
                    );

                }


            } catch (
                error
            ) {

                showAuthStatus(
                    "Google login failed. Please try again."
                );

                console.error(
                    error
                );

            } finally {

                setTimeout(
                    () => {

                        googleButton.disabled =
                            false;

                    },
                    1000
                );

            }

        }
    );

}


/* =====================================================
   CHECK CURRENT USER
===================================================== */

async function checkCurrentUser() {

    if (
        !supabaseClient
    ) {
        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getUser();


        if (
            !error &&
            data &&
            data.user
        ) {

            updateUserInterface(
                data.user
            );

        }


    } catch (
        error
    ) {

        console.error(
            "User check error:",
            error
        );

    }

}


/* =====================================================
   UPDATE USER INTERFACE
===================================================== */

function updateUserInterface(
    user
) {

    if (!user) return;


    const userButtons =
        document.querySelectorAll(
            ".user-action"
        );


    userButtons.forEach(
        button => {

            button.textContent =
                "My Dashboard";

            button.href =
                "#dashboard";

        }
    );


    const loginButtons =
        document.querySelectorAll(
            ".btn-login"
        );


    loginButtons.forEach(
        button => {

            button.textContent =
                "Logged In";

            button.classList.add(
                "logged-in"
            );

        }
    );

}


/* =====================================================
   TOAST
===================================================== */

const toast =
    document.querySelector(
        ".toast"
    );


function showToast(
    message
) {

    if (!toast) {

        alert(message);

        return;

    }


    const toastText =
        toast.querySelector(
            "span"
        );


    if (toastText) {
        toastText.textContent =
            message;
    }


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        4000
    );

}


const toastClose =
    document.querySelector(
        ".toast button"
    );


if (toastClose) {

    toastClose.addEventListener(
        "click",
        () => {

            toast.classList.remove(
                "show"
            );

        }
    );

}


/* =====================================================
   CONTACT FORM
===================================================== */

const contactForm =
    document.querySelector(
        ".contact-form"
    );


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        (e) => {

            e.preventDefault();


            const status =
                contactForm.querySelector(
                    ".form-status"
                );


            if (status) {

                status.textContent =
                    "Thank you! Your message has been received.";

                status.style.color =
                    "#16804a";

            }


            contactForm.reset();


            showToast(
                "Your message was sent successfully!"
            );

        }
    );

}


/* =====================================================
   REVEAL ANIMATION
===================================================== */

const animatedElements =
    document.querySelectorAll(
        ".feature-card, .step-card, .about-content, .contact-info-card"
    );


if (
    "IntersectionObserver" in window
) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold:
                    0.1
            }
        );


    animatedElements.forEach(
        element => {

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(25px)";

            element.style.transition =
                "opacity 0.6s ease, transform 0.6s ease";

            observer.observe(
                element
            );

        }
    );

}


/* =====================================================
   INITIAL CHECK
===================================================== */

updateAuthMode();

checkCurrentUser();
```

});
