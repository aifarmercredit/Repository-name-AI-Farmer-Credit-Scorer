/* =========================================================
   AI FARMER CREDIT SCORER
   script.js
========================================================= */

"use strict";

/* =========================================================
   PAGE LOADING
========================================================= */

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    if (loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
        }, 700);
    }
});


/* =========================================================
   GOOGLE LOGIN
========================================================= */

function handleGoogleLogin(response) {

    if (!response || !response.credential) {
        showToast("Google login failed. Please try again.");
        return;
    }

    console.log("Google login successful.");

    showToast("Google login successful!");

    setTimeout(() => {
        window.location.href = "#analysis";
    }, 1000);
}


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
        menuBtn.classList.toggle("active");

    });

}


/* =========================================================
   CLOSE MOBILE MENU
========================================================= */

document.querySelectorAll("#navMenu a").forEach((link) => {

    link.addEventListener("click", () => {

        if (navMenu) {
            navMenu.classList.remove("active");
        }

        if (menuBtn) {
            menuBtn.classList.remove("active");
        }

    });

});


/* =========================================================
   SMOOTH SCROLL
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", function (event) {

        const targetID = this.getAttribute("href");

        if (!targetID || targetID === "#") {
            return;
        }

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
   HERO VIDEO
========================================================= */

const heroVideo = document.getElementById("heroVideo");

if (heroVideo) {

    heroVideo.muted = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true;

    heroVideo.play().catch(() => {

        console.log(
            "Video autoplay was blocked by the browser."
        );

    });

}


/* =========================================================
   VIDEO ERROR
========================================================= */

if (heroVideo) {

    heroVideo.addEventListener("error", () => {

        console.log(
            "Video could not be loaded. Check assets/farmer-video.mp4"
        );

    });

}


/* =========================================================
   START AI ANALYSIS
========================================================= */

const startAnalysisButton =
    document.getElementById("startAnalysis");

if (startAnalysisButton) {

    startAnalysisButton.addEventListener("click", () => {

        const analysisSection =
            document.getElementById("analysis");

        if (analysisSection) {

            analysisSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

}


/* =========================================================
   HOW IT WORKS
========================================================= */

const howItWorksButton =
    document.getElementById("howItWorks");

if (howItWorksButton) {

    howItWorksButton.addEventListener("click", () => {

        const howSection =
            document.getElementById("how-it-works");

        if (howSection) {

            howSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll("#navMenu a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop - 150;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            current = section.getAttribute("id");

        }

    });


    navLinks.forEach((link) => {

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href === "#" + current) {
            link.classList.add("active");
        }

    });

});


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".feature-card, .step-card, .login-card, .contact-container"
    );


function revealOnScroll() {

    const windowHeight =
        window.innerHeight;

    revealElements.forEach((element) => {

        const elementTop =
            element.getBoundingClientRect().top;

        if (elementTop < windowHeight - 80) {

            element.classList.add("visible");

        }

    });

}


window.addEventListener(
    "scroll",
    revealOnScroll
);

revealOnScroll();


/* =========================================================
   COUNTER ANIMATION
========================================================= */

function animateCounter(element, target) {

    let current = 0;

    const increment =
        Math.max(1, Math.ceil(target / 100));

    const timer =
        setInterval(() => {

            current += increment;

            if (current >= target) {

                current = target;

                clearInterval(timer);

            }

            element.textContent =
                current.toLocaleString();

        }, 20);

}


const counters =
    document.querySelectorAll("[data-count]");

let countersStarted = false;


function startCounters() {

    if (countersStarted) return;

    counters.forEach((counter) => {

        const target =
            parseInt(
                counter.getAttribute("data-count"),
                10
            );

        if (!isNaN(target)) {

            animateCounter(
                counter,
                target
            );

        }

    });

    countersStarted = true;

}


const statsSection =
    document.querySelector(".hero-stats");


if (statsSection) {

    const counterObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        startCounters();

                        counterObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.3
            }
        );

    counterObserver.observe(statsSection);

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    const toastText =
        document.getElementById("toastText");

    if (!toast) {

        console.log(message);

        return;

    }

    if (toastText) {

        toastText.textContent =
            message;

    } else {

        toast.textContent =
            message;

    }

    toast.style.display = "flex";

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

        toast.style.display = "none";

    }, 4000);

}


/* =========================================================
   CLOSE TOAST
========================================================= */

function closeMessage() {

    const toast =
        document.getElementById("toast");

    if (toast) {

        toast.classList.remove("show");

        toast.style.display = "none";

    }

}


/* =========================================================
   DEMO DASHBOARD BUTTON
========================================================= */

function showLoginMessage() {

    showToast(
        "Please sign in with Google first to continue."
    );

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
                document.getElementById("name")?.value.trim();

            const email =
                document.getElementById("email")?.value.trim();

            const message =
                document.getElementById("message")?.value.trim();


            if (!name || !email || !message) {

                showToast(
                    "Please complete all contact fields."
                );

                return;

            }


            showToast(
                "Thank you! Your message is ready to be sent."
            );


            contactForm.reset();

        }
    );

}


/* =========================================================
   ANALYSIS FORM
========================================================= */

const analysisForm =
    document.getElementById("analysisForm");


if (analysisForm) {

    analysisForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            showToast(
                "Your agricultural data is ready for AI analysis."
            );

            console.log(
                "Analysis form submitted."
            );

        }
    );

}


/* =========================================================
   GOOGLE IDENTITY SERVICES CHECK
========================================================= */

window.addEventListener("load", () => {

    const googleButton =
        document.querySelector(".g_id_signin");

    if (!googleButton) {

        console.log(
            "Google Sign-In button was not found."
        );

        return;

    }

    console.log(
        "Google Sign-In component detected."
    );

});


/* =========================================================
   SECURITY NOTE
========================================================= */

/*
IMPORTANT:

Do NOT put:

- Google Client Secret
- Database password
- API secret key
- Private key

inside this JavaScript file.

Only public configuration such as
Google Client ID / Supabase publishable key
can be used on the frontend when appropriate.

Never store user passwords in localStorage.
*/


/* =========================================================
   SYSTEM MESSAGE
========================================================= */

console.log(
    "%cAI Farmer Credit Scorer",
    "font-size:20px;font-weight:bold;"
);

console.log(
    "Agricultural AI system initialized successfully."
);
