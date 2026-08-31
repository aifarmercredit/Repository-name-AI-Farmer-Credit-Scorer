/* =========================================================
   AI FARMER CREDIT SCORER
   PROFILE JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://xcevtpkrasvevwyvvdjq.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_C_WZDTvi8dZwZAgKQh6ANA_vJDd6LKH";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


console.log(
    "Profile Supabase initialized successfully."
);


/* =========================================================
   DOM ELEMENTS
========================================================= */

const loader =
    document.getElementById("loader");


const profileAvatar =
    document.getElementById("profileAvatar");


const userFullName =
    document.getElementById("userFullName");


const userEmail =
    document.getElementById("userEmail");


const infoFullName =
    document.getElementById("infoFullName");


const infoEmail =
    document.getElementById("infoEmail");


const userId =
    document.getElementById("userId");


const memberSince =
    document.getElementById("memberSince");


const verificationStatus =
    document.getElementById("verificationStatus");


const emailVerificationText =
    document.getElementById(
        "emailVerificationText"
    );


const emailVerificationBadge =
    document.getElementById(
        "emailVerificationBadge"
    );


const authProvider =
    document.getElementById(
        "authProvider"
    );


const identityCheck =
    document.getElementById(
        "identityCheck"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


const startDashboardBtn =
    document.getElementById(
        "startDashboardBtn"
    );


const toast =
    document.getElementById(
        "toast"
    );


const toastText =
    document.getElementById(
        "toastText"
    );


const toastClose =
    document.getElementById(
        "toastClose"
    );


/* =========================================================
   PAGE LOADER
========================================================= */

function hideLoader() {

    if (!loader) return;


    setTimeout(() => {

        loader.style.opacity = "0";

        loader.style.visibility = "hidden";

    }, 600);

}


/* =========================================================
   GET USER INITIALS
========================================================= */

function getInitials(name, email) {

    if (name && name.trim()) {

        const names =
            name.trim().split(" ");


        if (names.length >= 2) {

            return (
                names[0][0] +
                names[names.length - 1][0]
            ).toUpperCase();

        }


        return names[0][0].toUpperCase();

    }


    if (email) {

        return email[0].toUpperCase();

    }


    return "U";

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatMemberDate(dateString) {

    if (!dateString) {

        return "Member";

    }


    const date =
        new Date(dateString);


    return (
        "Member since " +

        date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        )
    );

}


/* =========================================================
   SHORT USER ID
========================================================= */

function formatUserId(id) {

    if (!id) {

        return "Not available";

    }


    if (id.length <= 18) {

        return id;

    }


    return (
        id.substring(0, 9) +
        "..." +
        id.substring(
            id.length - 6
        )
    );

}


/* =========================================================
   SHOW TOAST MESSAGE
========================================================= */

function showToast(message) {

    if (!toast) {

        console.log(message);

        return;

    }


    if (toastText) {

        toastText.textContent =
            message;

    }


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 4000);

}


/* =========================================================
   CLOSE TOAST
========================================================= */

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


/* =========================================================
   GET AUTH PROVIDER
========================================================= */

function getProvider(user) {

    if (
        !user ||
        !user.app_metadata ||
        !user.app_metadata.provider
    ) {

        return "Email";

    }


    const provider =
        user.app_metadata.provider;


    if (provider === "google") {

        return "Google";

    }


    if (provider === "email") {

        return "Email & Password";

    }


    return (
        provider.charAt(0)
            .toUpperCase() +

        provider.slice(1)
    );

}


/* =========================================================
   GET USER FULL NAME
========================================================= */

function getUserName(user) {

    if (!user) {

        return "AI Farmer User";

    }


    if (
        user.user_metadata &&
        user.user_metadata.full_name
    ) {

        return user.user_metadata.full_name;

    }


    if (
        user.user_metadata &&
        user.user_metadata.name
    ) {

        return user.user_metadata.name;

    }


    if (
        user.user_metadata &&
        user.user_metadata.user_name
    ) {

        return user.user_metadata.user_name;

    }


    if (user.email) {

        return user.email
            .split("@")[0]
            .replace(/[._-]/g, " ");

    }


    return "AI Farmer User";

}


/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadProfile() {

    try {


        /* ---------------------------------------------
           GET CURRENT SESSION
        --------------------------------------------- */

        const {
            data: sessionData,
            error: sessionError
        } =
            await supabaseClient.auth.getSession();


        if (sessionError) {

            console.error(
                sessionError
            );

            showToast(
                "Unable to load your session."
            );

            hideLoader();

            return;

        }


        const session =
            sessionData.session;


        /* ---------------------------------------------
           USER NOT LOGGED IN
        --------------------------------------------- */

        if (!session) {

            console.log(
                "No active session found."
            );


            window.location.href =
                "index.html";

            return;

        }


        /* ---------------------------------------------
           GET USER
        --------------------------------------------- */

        const {
            data: userData,
            error: userError
        } =
            await supabaseClient.auth.getUser();


        if (userError) {

            console.error(
                userError
            );

            showToast(
                "Unable to verify user."
            );

            hideLoader();

            return;

        }


        const user =
            userData.user;


        if (!user) {

            window.location.href =
                "index.html";

            return;

        }


        console.log(
            "Profile user loaded:",
            user
        );


        /* ---------------------------------------------
           USER DATA
        --------------------------------------------- */

        const fullName =
            getUserName(user);


        const email =
            user.email ||
            "Email unavailable";


        const provider =
            getProvider(user);


        const verified =
            Boolean(
                user.email_confirmed_at ||
                user.confirmed_at
            );


        /* ---------------------------------------------
           PROFILE AVATAR
        --------------------------------------------- */

        if (profileAvatar) {

            profileAvatar.textContent =
                getInitials(
                    fullName,
                    email
                );

        }


        /* ---------------------------------------------
           MAIN PROFILE NAME
        --------------------------------------------- */

        if (userFullName) {

            userFullName.textContent =
                fullName;

        }


        /* ---------------------------------------------
           MAIN EMAIL
        --------------------------------------------- */

        if (userEmail) {

            userEmail.textContent =
                email;

        }


        /* ---------------------------------------------
           PERSONAL INFORMATION
        --------------------------------------------- */

        if (infoFullName) {

            infoFullName.textContent =
                fullName;

        }


        if (infoEmail) {

            infoEmail.textContent =
                email;

        }


        /* ---------------------------------------------
           USER ID
        --------------------------------------------- */

        if (userId) {

            userId.textContent =
                formatUserId(
                    user.id
                );

        }


        /* ---------------------------------------------
           MEMBER SINCE
        --------------------------------------------- */

        if (memberSince) {

            memberSince.textContent =
                formatMemberDate(
                    user.created_at
                );

        }


        /* ---------------------------------------------
           AUTH PROVIDER
        --------------------------------------------- */

        if (authProvider) {

            authProvider.textContent =
                provider;

        }


        /* ---------------------------------------------
           EMAIL VERIFICATION
        --------------------------------------------- */

        if (verified) {


            if (
                verificationStatus
            ) {

                verificationStatus.textContent =
                    "✓ Verified Account";

            }


            if (
                emailVerificationText
            ) {

                emailVerificationText.textContent =
                    "Your email is verified";

            }


            if (
                emailVerificationBadge
            ) {

                emailVerificationBadge.textContent =
                    "Verified";


                emailVerificationBadge.classList.add(
                    "active"
                );

            }


            if (
                identityCheck
            ) {

                identityCheck.textContent =
                    "✓ Verified";

            }


        } else {


            if (
                verificationStatus
            ) {

                verificationStatus.textContent =
                    "Email Verification Required";

            }


            if (
                emailVerificationText
            ) {

                emailVerificationText.textContent =
                    "Please verify your email";

            }


            if (
                emailVerificationBadge
            ) {

                emailVerificationBadge.textContent =
                    "Not Verified";


                emailVerificationBadge.classList.remove(
                    "active"
                );

            }


            if (
                identityCheck
            ) {

                identityCheck.textContent =
                    "Verification Required";

            }

        }


        /* ---------------------------------------------
           FINISH LOADING
        --------------------------------------------- */

        hideLoader();


    } catch (error) {


        console.error(
            "Profile loading error:",
            error
        );


        showToast(
            "An error occurred while loading your profile."
        );


        hideLoader();

    }

}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {


            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {

                return;

            }


            logoutBtn.disabled =
                true;


            logoutBtn.textContent =
                "Logging out...";


            try {


                const {
                    error
                } =
                    await supabaseClient.auth.signOut();


                if (error) {

                    throw error;

                }


                window.location.href =
                    "index.html";


            } catch (error) {


                console.error(
                    "Logout error:",
                    error
                );


                showToast(
                    "Unable to logout. Please try again."
                );


                logoutBtn.disabled =
                    false;


                logoutBtn.textContent =
                    "Logout";

            }


        }
    );

}


/* =========================================================
   START AI DASHBOARD
========================================================= */

if (startDashboardBtn) {

    startDashboardBtn.addEventListener(
        "click",
        () => {


            showToast(
                "AI Credit Analysis dashboard will be connected next."
            );


            /*
            =================================================

            NEXT STEP:

            Here we will connect this button
            to your AI Analysis Dashboard.

            Example:

            window.location.href =
                "dashboard.html";

            =================================================
            */

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


        if (
            event === "SIGNED_OUT"
        ) {

            window.location.href =
                "index.html";

        }


        if (
            event === "SIGNED_IN" &&
            session
        ) {

            console.log(
                "User signed in successfully."
            );

        }


    }
);


/* =========================================================
   START PROFILE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProfile();

    }
);


console.log(
    "%cAI Farmer Credit Scorer Profile",
    "color:#57e39b; font-size:18px; font-weight:bold;"
);

console.log(
    "Secure profile system initialized."
);
