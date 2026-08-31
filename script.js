/* =========================================================
   AI FARMER CREDIT SCORER
   PROFILE JAVASCRIPT
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


/* =========================================================
   DOM ELEMENTS
========================================================= */

const profileName = document.getElementById("profileName");

const profileEmail = document.getElementById("profileEmail");

const profileAvatar = document.getElementById("profileAvatar");

const welcomeName = document.getElementById("welcomeName");

const userFullName = document.getElementById("userFullName");

const userEmail = document.getElementById("userEmail");

const userProvider = document.getElementById("userProvider");

const userId = document.getElementById("userId");

const logoutButton = document.getElementById("logoutBtn");

const dashboardButton =
    document.getElementById("dashboardBtn");

const loader = document.getElementById("profileLoader");


/* =========================================================
   SHOW LOADER
========================================================= */

function showLoader() {

    if (loader) {

        loader.style.display = "flex";

    }

}


/* =========================================================
   HIDE LOADER
========================================================= */

function hideLoader() {

    if (loader) {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        }, 400);

    }

}


/* =========================================================
   GET USER INITIALS
========================================================= */

function getInitials(name) {

    if (!name) {
        return "U";
    }

    const words = name.trim().split(" ");

    if (words.length === 1) {

        return words[0]
            .charAt(0)
            .toUpperCase();

    }

    return (
        words[0].charAt(0) +
        words[1].charAt(0)
    ).toUpperCase();

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "Not available";
    }

    const date = new Date(dateValue);

    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


/* =========================================================
   LOAD USER PROFILE
========================================================= */

async function loadUserProfile() {

    showLoader();

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getUser();


        if (error) {

            console.error(
                "Authentication error:",
                error.message
            );

            window.location.href = "index.html";

            return;

        }


        const user = data.user;


        /* =================================================
           NO USER LOGGED IN
        ================================================= */

        if (!user) {

            console.log(
                "No user session found."
            );

            window.location.href = "index.html";

            return;

        }


        console.log(
            "Logged in user:",
            user
        );


        /* =================================================
           USER INFORMATION
        ================================================= */

        const metadata =
            user.user_metadata || {};


        const fullName =
            metadata.full_name ||
            metadata.name ||
            user.email
                ?.split("@")[0] ||
            "Farmer";


        const email =
            user.email ||
            "No email available";


        const avatarUrl =
            metadata.avatar_url ||
            metadata.picture ||
            "";


        const provider =
            user.app_metadata?.provider ||
            "Email";


        /* =================================================
           HEADER PROFILE
        ================================================= */

        if (profileName) {

            profileName.textContent =
                fullName;

        }


        if (profileEmail) {

            profileEmail.textContent =
                email;

        }


        if (welcomeName) {

            welcomeName.textContent =
                fullName.split(" ")[0];

        }


        /* =================================================
           PROFILE DETAILS
        ================================================= */

        if (userFullName) {

            userFullName.textContent =
                fullName;

        }


        if (userEmail) {

            userEmail.textContent =
                email;

        }


        if (userProvider) {

            userProvider.textContent =
                provider
                    .charAt(0)
                    .toUpperCase() +
                provider.slice(1);

        }


        if (userId) {

            userId.textContent =
                user.id;

        }


        /* =================================================
           PROFILE AVATAR
        ================================================= */

        if (profileAvatar) {

            if (avatarUrl) {

                profileAvatar.innerHTML = `
                    <img
                        src="${avatarUrl}"
                        alt="${fullName}"
                        referrerpolicy="no-referrer"
                    >
                `;

            } else {

                profileAvatar.textContent =
                    getInitials(fullName);

            }

        }


        /* =================================================
           OPTIONAL: ACCOUNT CREATED DATE
        ================================================= */

        const accountCreated =
            document.getElementById(
                "accountCreated"
            );


        if (accountCreated) {

            accountCreated.textContent =
                formatDate(
                    user.created_at
                );

        }


        /* =================================================
           OPTIONAL: LAST LOGIN
        ================================================= */

        const lastLogin =
            document.getElementById(
                "lastLogin"
            );


        if (lastLogin) {

            lastLogin.textContent =
                formatDate(
                    user.last_sign_in_at
                );

        }


        hideLoader();


    } catch (error) {

        console.error(
            "Unexpected profile error:",
            error
        );

        hideLoader();

        alert(
            "Unable to load your profile. Please sign in again."
        );

        window.location.href =
            "index.html";

    }

}


/* =========================================================
   LOGOUT
========================================================= */

async function logoutUser() {

    const confirmed = confirm(
        "Are you sure you want to sign out?"
    );


    if (!confirmed) {

        return;

    }


    try {

        if (logoutButton) {

            logoutButton.disabled = true;

            logoutButton.textContent =
                "Signing out...";

        }


        const {
            error
        } = await supabaseClient.auth.signOut();


        if (error) {

            throw error;

        }


        console.log(
            "User signed out successfully."
        );


        window.location.href =
            "index.html";


    } catch (error) {

        console.error(
            "Logout error:",
            error.message
        );


        alert(
            "Unable to sign out. Please try again."
        );


        if (logoutButton) {

            logoutButton.disabled = false;

            logoutButton.textContent =
                "Sign Out";

        }

    }

}


/* =========================================================
   LOGOUT BUTTON EVENT
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logoutUser
    );

}


/* =========================================================
   DASHBOARD BUTTON
========================================================= */

if (dashboardButton) {

    dashboardButton.addEventListener(
        "click",
        () => {

            /*
            You can change dashboard.html
            to your actual dashboard page.
            */

            window.location.href =
                "dashboard.html";

        }
    );

}


/* =========================================================
   AUTH STATE CHANGE
========================================================= */

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "Auth event:",
            event
        );


        /*
        If user signs out,
        return to login page.
        */

        if (
            event === "SIGNED_OUT" ||
            !session
        ) {

            console.log(
                "Session ended."
            );

        }

    }
);


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "AI Farmer Credit Scorer Profile Loaded"
        );


        loadUserProfile();

    }
);
