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
        }, 600);
    }
});


/* =========================================================
   NAVBAR SCROLL EFFECT
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
   MOBILE NAVIGATION
========================================================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");
        menuToggle.classList.toggle("active");

    });

}


/* =========================================================
   CLOSE MOBILE MENU AFTER CLICK
========================================================= */

document.querySelectorAll("#navMenu a").forEach((link) => {

    link.addEventListener("click", () => {

        if (navMenu) {
            navMenu.classList.remove("active");
        }

        if (menuToggle) {
            menuToggle.classList.remove("active");
        }

    });

});


/* =========================================================
   SMOOTH SCROLL
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {

    anchor.addEventListener("click", function (event) {

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
   START AI ANALYSIS BUTTON
========================================================= */

const startAnalysisButton = document.getElementById("startAnalysis");

if (startAnalysisButton) {

    startAnalysisButton.addEventListener("click", () => {

        const analysisSection =
            document.getElementById("analysis") ||
            document.getElementById("ai-analysis") ||
            document.querySelector(".analysis-section");

        if (analysisSection) {

            analysisSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        } else {

            showToast(
                "AI Analysis section is ready. Connect your dataset and Python AI model next."
            );

        }

    });

}


/* =========================================================
   HOW IT WORKS BUTTON
========================================================= */

const howItWorksButton = document.getElementById("howItWorks");

if (howItWorksButton) {

    howItWorksButton.addEventListener("click", () => {

        const howSection =
            document.getElementById("how") ||
            document.getElementById("how-it-works") ||
            document.querySelector(".how-section");

        if (howSection) {

            howSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

}


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
            "Video autoplay was blocked. The website will continue normally."
        );

    });

}


/* =========================================================
   VIDEO ERROR CHECK
========================================================= */

if (heroVideo) {

    heroVideo.addEventListener("error", () => {

        console.log(
            "Hero video could not be loaded. Check assets/farmer-video.mp4"
        );

    });

}


/* =========================================================
   ACTIVE NAVIGATION LINK
========================================================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("#navMenu a");

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach((section) => {

        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop - 200 &&
            window.scrollY < sectionTop + sectionHeight - 200
        ) {

            currentSection = section.getAttribute("id");

        }

    });


    navLinks.forEach((link) => {

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href === "#" + currentSection) {
            link.classList.add("active");
        }

    });

});


/* =========================================================
   SCROLL REVEAL ANIMATION
========================================================= */

const revealElements = document.querySelectorAll(
    ".reveal, .feature-card, .step-card, .analysis-card"
);


function revealOnScroll() {

    const windowHeight = window.innerHeight;

    revealElements.forEach((element) => {

        const elementTop =
            element.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            element.classList.add("visible");
        }

    });

}


window.addEventListener("scroll", revealOnScroll);

revealOnScroll();


/* =========================================================
   COUNTER ANIMATION
========================================================= */

function animateCounter(element, target) {

    let current = 0;

    const increment = Math.ceil(target / 100);

    const timer = setInterval(() => {

        current += increment;

        if (current >= target) {

            current = target;

            clearInterval(timer);

        }

        element.textContent = current.toLocaleString();

    }, 20);

}


const counters = document.querySelectorAll("[data-count]");

let countersStarted = false;


function startCounters() {

    if (countersStarted) return;

    counters.forEach((counter) => {

        const target =
            parseInt(counter.getAttribute("data-count"));

        if (!isNaN(target)) {

            animateCounter(counter, target);

        }

    });

    countersStarted = true;

}


/* =========================================================
   OBSERVE COUNTER SECTION
========================================================= */

const statsSection =
    document.querySelector(".hero-stats") ||
    document.querySelector(".stats");

if (statsSection) {

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    startCounters();

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.3
        }
    );

    observer.observe(statsSection);

}


/* =========================================================
   TOAST MESSAGE
========================================================= */

function showToast(message) {

    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toastText");

    if (!toast) {

        console.log(message);
        return;

    }

    if (toastText) {
        toastText.textContent = message;
    } else {
        toast.textContent = message;
    }

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 4000);

}


/* =========================================================
   CLOSE TOAST
========================================================= */

function closeMessage() {

    const toast = document.getElementById("toast");

    if (toast) {
        toast.classList.remove("show");
    }

}


/* =========================================================
   ANALYSIS FORM
========================================================= */

const analysisForm =
    document.getElementById("analysisForm");


if (analysisForm) {

    analysisForm.addEventListener("submit", (event) => {

        event.preventDefault();

        showToast(
            "Your agricultural data is ready for AI analysis."
        );

        /*
        ====================================================
        LATER:
        This form will send data to your Python API.

        Example:

        fetch("https://your-python-api.com/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                farm_size: ...,
                income: ...,
                crop_type: ...
            })
        })

        Python Flask / FastAPI will return:
        Credit Score
        Risk Level
        Loan Recommendation
        ====================================================
        */

    });

}


/* =========================================================
   GOOGLE LOGIN PLACEHOLDER
========================================================= */

/*
IMPORTANT:

Google Login cannot be completed using only
index.html + style.css + script.js.

After your website is uploaded to GitHub and
deployed online, we will connect:

1. GitHub repository
2. Hosting website
3. Google Cloud Console
4. OAuth Client ID
5. Authorized JavaScript Origin
6. Authorized Redirect URI
7. Google Sign-In button

Then the Google login will work with a REAL
Google account.

Do NOT put a Google Client Secret inside this
script.js file.
*/


/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(
    "%cAI Farmer Credit Scorer",
    "color:#55d6a7; font-size:20px; font-weight:bold;"
);

console.log(
    "Agricultural AI system initialized successfully."
);
