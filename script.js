/* =========================================================
   AI FARMER CREDIT SCORER
   MAIN JAVASCRIPT + SUPABASE AUTHENTICATION
========================================================= */

"use strict";


/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL = "https://xcevtpkrasvevwyvvdjq.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_C_WZDTvi8dZwZAgKQh6ANA_vJDd6LKH";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


console.log("Supabase initialized successfully.");


/* =========================================================
   PAGE LOADER
========================================================= */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (loader) {

        setTimeout(() => {

            loader.style.opacity = "0";
            loader.style.visibility = "hidden";

        }, 600);

    }

});


/* =========================================================
   NAVBAR
========================================================= */

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {

    if (!navbar) return;

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =========================================================
   MOBILE MENU
========================================================= */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");


if (menuBtn && navMenu) {

    menuBtn.addEventListener("click", () => {

        navMenu.classList.toggle("active");

    });

}


document.querySelectorAll("#navMenu a").forEach((link) => {

    link.addEventListener("click", () => {

        if (navMenu) {

            navMenu.classList.remove("active");

        }

    });

});


/* =========================================================
   SMOOTH SCROLL
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {

    anchor.addEventListener("click", function (event) {

        const targetID = this.getAttribute("href");

        if (!targetID || targetID === "#") return;

        const target = document.querySelector(targetID);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({

                behavior: "smooth",
                block: "start"

            });

        }

    });

});


/* =========================================================
   TOAST MESSAGE
========================================================= */

function showToast(message) {

    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toastText");

    if (!toast) {

        alert(message);
        return;

    }


    if (toastText) {

        toastText.textContent = message;

    }


    toast.classList.add("show");

    toast.style.display = "flex";


    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.style.display = "none";

        }, 300);

    }, 4000);

}


/* =========================================================
   CLOSE TOAST
========================================================= */

function closeMessage() {

    const toast = document.getElementById("toast");

    if (toast) {

        toast.classList.remove("show");

        toast.style.display = "none";

    }

}


/* =========================================================
   GOOGLE LOGIN WITH SUPABASE
========================================================= */

async function signInWithGoogle() {

    try {

        const {

            data,
            error

        } = await supabaseClient.auth.signInWithOAuth({

            provider: "google",

            options: {

                redirectTo:
                    window.location.origin +
                    window.location.pathname.replace(
                        "index.html",
                        "profile.html"
                    )

            }

        });


        if (error) {

            console.error(error);

            showToast(
                "Google sign in failed: " +
                error.message
            );

            return;

        }


        console.log(
            "Redirecting to Google login...",
            data
        );


    } catch (error) {

        console.error(error);

        showToast(
            "Something went wrong. Please try again."
        );

    }

}


/* =========================================================
   EMAIL + PASSWORD REGISTER
========================================================= */

async function registerUser(event) {

    event.preventDefault();


    const nameInput =
        document.getElementById("registerName");

    const emailInput =
        document.getElementById("registerEmail");

    const passwordInput =
        document.getElementById("registerPassword");


    if (
        !nameInput ||
        !emailInput ||
        !passwordInput
    ) {

        console.error(
            "Register form elements not found."
        );

        return;

    }


    const fullName =
        nameInput.value.trim();

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    if (!fullName || !email || !password) {

        showToast(
            "Please fill in all fields."
        );

        return;

    }


    try {

        const {

            data,
            error

        } = await supabaseClient.auth.signUp({

            email: email,

            password: password,

            options: {

                data: {

                    full_name: fullName

                }

            }

        });


        if (error) {

            showToast(error.message);

            return;

        }


        console.log(
            "Registration successful:",
            data
        );


        showToast(
            "Registration successful! Please check your email to verify your account."
        );


    } catch (error) {

        console.error(error);

        showToast(
            "Registration failed. Please try again."
        );

    }

}


/* =========================================================
   EMAIL + PASSWORD LOGIN
========================================================= */

async function loginUser(event) {

    event.preventDefault();


    const emailInput =
        document.getElementById("loginEmail");

    const passwordInput =
        document.getElementById("loginPassword");


    if (
        !emailInput ||
        !passwordInput
    ) {

        console.error(
            "Login form elements not found."
        );

        return;

    }


    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    if (!email || !password) {

        showToast(
            "Please enter your email and password."
        );

        return;

    }


    try {

        const {

            data,
            error

        } = await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


        if (error) {

            showToast(error.message);

            return;

        }


        console.log(
            "Login successful:",
            data
        );


        showToast(
            "Login successful! Redirecting..."
        );


        setTimeout(() => {

            window.location.href =
                "profile.html";

        }, 1000);


    } catch (error) {

        console.error(error);

        showToast(
            "Login failed. Please try again."
        );

    }

}


/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    ?.value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    ?.value
                    .trim();


            const message =
                document
                    .getElementById("message")
                    ?.value
                    .trim();


            if (!name || !email || !message) {

                showToast(
                    "Please complete all contact fields."
                );

                return;

            }


            /*
             * Currently this is a frontend demo.
             *
             * Later you can connect:
             *
             * - Supabase Database
             * - EmailJS
             * - Your Python API
             *
             * to save/send messages.
             */


            showToast(
                "Thank you! Your message has been received."
            );


            contactForm.reset();

        }

    );

}


/* =========================================================
   HERO VIDEO
========================================================= */

const heroVideo =
    document.getElementById("heroVideo");


if (heroVideo) {

    heroVideo.muted = true;

    heroVideo.loop = true;

    heroVideo.playsInline = true;


    heroVideo.play().catch(() => {

        console.log(
            "Video autoplay was blocked."
        );

    });

}


/* =========================================================
   AUTH STATE CHECK
========================================================= */

async function checkLoggedInUser() {

    try {

        const {

            data,
            error

        } = await supabaseClient.auth.getSession();


        if (error) {

            console.error(error);

            return;

        }


        const session =
            data.session;


        /*
         * If user is already logged in
         * and currently visiting index.html,
         * you may later redirect them
         * automatically to profile.html.
         */


        if (session) {

            console.log(
                "User already logged in:",
                session.user.email
            );

        }


    } catch (error) {

        console.error(
            "Session check error:",
            error
        );

    }

}


/* =========================================================
   INITIALIZE
========================================================= */

checkLoggedInUser();


/* =========================================================
   SUPABASE AUTH STATE LISTENER
========================================================= */

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "Auth event:",
            event
        );


        if (session) {

            console.log(
                "Authenticated user:",
                session.user.email
            );

        }

    }
);


/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(
    "%cAI Farmer Credit Scorer",
    "color:#55d6a7; font-size:20px; font-weight:bold;"
);


console.log(
    "Supabase Authentication System Ready."
);
