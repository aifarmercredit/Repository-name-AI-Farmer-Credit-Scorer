/* =========================================================
AI FARMER CREDIT SCORER
COMPLETE SCRIPT.JS
========================================================= */

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

console.log("Supabase initialized successfully.");

/* =========================================================
DOM ELEMENTS
========================================================= */

const loader =
document.getElementById("loader");

const navbar =
document.getElementById("navbar");

const navMenu =
document.getElementById("navMenu");

const menuToggle =
document.getElementById("menuToggle");

const navLogin =
document.getElementById("navLogin");

const navRegister =
document.getElementById("navRegister");

const startAnalysis =
document.getElementById("startAnalysis");

const howItWorksBtn =
document.getElementById("howItWorksBtn");

const ctaButton =
document.getElementById("ctaButton");

const googleLoginBtn =
document.getElementById("googleLoginBtn");

const emailLoginBtn =
document.getElementById("emailLoginBtn");

const createAccountBtn =
document.getElementById("createAccountBtn");

const authModal =
document.getElementById("authModal");

const closeAuthModal =
document.getElementById("closeAuthModal");

const modalTitle =
document.getElementById("modalTitle");

const modalSubtitle =
document.getElementById("modalSubtitle");

const authForm =
document.getElementById("authForm");

const nameGroup =
document.getElementById("nameGroup");

const authName =
document.getElementById("authName");

const authEmail =
document.getElementById("authEmail");

const authPassword =
document.getElementById("authPassword");

const authSubmit =
document.getElementById("authSubmit");

const modalGoogleBtn =
document.getElementById("modalGoogleBtn");

const switchAuth =
document.getElementById("switchAuth");

const modalStatus =
document.getElementById("modalStatus");

const authMessage =
document.getElementById("authMessage");

const contactForm =
document.getElementById("contactForm");

const contactMessageStatus =
document.getElementById(
"contactMessageStatus"
);

const toast =
document.getElementById("toast");

const toastText =
document.getElementById("toastText");

const closeToast =
document.getElementById("closeToast");

/* =========================================================
STATE
========================================================= */

let authMode = "login";

/* =========================================================
LOADER
========================================================= */

window.addEventListener("load", () => {

```
setTimeout(() => {

    if (loader) {
        loader.classList.add("hide");
    }

}, 900);
```

});

/* =========================================================
NAVBAR SCROLL EFFECT
========================================================= */

window.addEventListener("scroll", () => {

```
if (!navbar) return;

if (window.scrollY > 30) {

    navbar.classList.add("scrolled");

} else {

    navbar.classList.remove("scrolled");

}
```

});

/* =========================================================
MOBILE MENU
========================================================= */

if (menuToggle) {

```
menuToggle.addEventListener(
    "click",
    () => {

        navMenu.classList.toggle("open");

        const isOpen =
            navMenu.classList.contains("open");

        menuToggle.textContent =
            isOpen ? "×" : "☰";

    }
);
```

}

/* Close mobile menu when link clicked */

document.querySelectorAll(
".nav-links a"
).forEach(link => {

```
link.addEventListener(
    "click",
    () => {

        if (navMenu) {
            navMenu.classList.remove("open");
        }

        if (menuToggle) {
            menuToggle.textContent = "☰";
        }

    }
);
```

});

/* =========================================================
SMOOTH NAVIGATION
========================================================= */

function scrollToSection(id) {

```
const section =
    document.getElementById(id);

if (!section) return;

section.scrollIntoView({
    behavior: "smooth",
    block: "start"
});
```

}

/* =========================================================
HERO BUTTONS
========================================================= */

if (startAnalysis) {

```
startAnalysis.addEventListener(
    "click",
    async () => {

        const {
            data: {
                session
            }
        } = await supabaseClient
            .auth
            .getSession();

        if (session) {

            window.location.href =
                "profile.html";

        } else {

            openAuthModal("login");

        }

    }
);
```

}

if (ctaButton) {

```
ctaButton.addEventListener(
    "click",
    async () => {

        const {
            data: {
                session
            }
        } = await supabaseClient
            .auth
            .getSession();

        if (session) {

            window.location.href =
                "profile.html";

        } else {

            openAuthModal("signup");

        }

    }
);
```

}

if (howItWorksBtn) {

```
howItWorksBtn.addEventListener(
    "click",
    () => {

        scrollToSection(
            "how-it-works"
        );

    }
);
```

}

/* =========================================================
AUTH MODAL
========================================================= */

function openAuthModal(mode = "login") {

```
authMode = mode;

clearAuthMessage();

if (!authModal) return;

authModal.classList.add("active");

document.body.style.overflow = "hidden";

updateAuthModal();
```

}

function closeModal() {

```
if (!authModal) return;

authModal.classList.remove("active");

document.body.style.overflow = "";

clearAuthMessage();

if (authForm) {
    authForm.reset();
}
```

}

function updateAuthModal() {

```
if (authMode === "signup") {

    modalTitle.textContent =
        "Create Your Account";

    modalSubtitle.textContent =
        "Join AI Farmer Credit Scorer";

    authSubmit.textContent =
        "Create Account";

    nameGroup.style.display =
        "block";

    switchAuth.innerHTML = `
        Already have an account?
        <button type="button">
            Sign In
        </button>
    `;

} else {

    modalTitle.textContent =
        "Welcome Back";

    modalSubtitle.textContent =
        "Sign in to continue";

    authSubmit.textContent =
        "Sign In";

    nameGroup.style.display =
        "none";

    switchAuth.innerHTML = `
        Don't have an account?
        <button type="button">
            Create Account
        </button>
    `;

}
```

}

if (navLogin) {

```
navLogin.addEventListener(
    "click",
    () => {

        openAuthModal("login");

    }
);
```

}

if (navRegister) {

```
navRegister.addEventListener(
    "click",
    () => {

        openAuthModal("signup");

    }
);
```

}

if (emailLoginBtn) {

```
emailLoginBtn.addEventListener(
    "click",
    () => {

        openAuthModal("login");

    }
);
```

}

if (createAccountBtn) {

```
createAccountBtn.addEventListener(
    "click",
    () => {

        openAuthModal("signup");

    }
);
```

}

if (closeAuthModal) {

```
closeAuthModal.addEventListener(
    "click",
    closeModal
);
```

}

/* Click outside modal */

if (authModal) {

```
authModal.addEventListener(
    "click",
    event => {

        if (
            event.target === authModal
        ) {

            closeModal();

        }

    }
);
```

}

/* Escape key */

document.addEventListener(
"keydown",
event => {

```
    if (
        event.key === "Escape" &&
        authModal &&
        authModal.classList.contains("active")
    ) {

        closeModal();

    }

}
```

);

/* =========================================================
SWITCH LOGIN / SIGNUP
========================================================= */

if (switchAuth) {

```
switchAuth.addEventListener(
    "click",
    event => {

        if (
            event.target.tagName ===
            "BUTTON"
        ) {

            authMode =
                authMode === "login"
                    ? "signup"
                    : "login";

            clearAuthMessage();

            updateAuthModal();

        }

    }
);
```

}

/* =========================================================
EMAIL AUTHENTICATION
========================================================= */

if (authForm) {

```
authForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        clearAuthMessage();

        const email =
            authEmail.value.trim();

        const password =
            authPassword.value;

        const fullName =
            authName.value.trim();


        if (!email || !password) {

            showAuthMessage(
                "Please enter your email and password.",
                true
            );

            return;

        }


        if (
            authMode === "signup" &&
            !fullName
        ) {

            showAuthMessage(
                "Please enter your full name.",
                true
            );

            return;

        }


        setAuthLoading(true);


        try {

            if (authMode === "signup") {

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .auth
                        .signUp({

                            email,
                            password,

                            options: {

                                data: {
                                    full_name:
                                        fullName
                                },

                                emailRedirectTo:
                                    window.location.origin +
                                    "/profile.html"

                            }

                        });


                if (error) {
                    throw error;
                }


                if (
                    data.session
                ) {

                    showAuthMessage(
                        "Account created successfully.",
                        false
                    );

                    showToast(
                        "Account created successfully."
                    );

                    setTimeout(() => {

                        window.location.href =
                            "profile.html";

                    }, 900);

                } else {

                    showAuthMessage(
                        "Account created. Please check your email to verify your account.",
                        false
                    );

                    showToast(
                        "Verification email sent."
                    );

                }


            } else {

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .auth
                        .signInWithPassword({

                            email,
                            password

                        });


                if (error) {
                    throw error;
                }


                if (data.session) {

                    showAuthMessage(
                        "Login successful. Redirecting...",
                        false
                    );

                    showToast(
                        "Welcome back!"
                    );

                    setTimeout(() => {

                        window.location.href =
                            "profile.html";

                    }, 700);

                }

            }

        } catch (error) {

            console.error(
                "Authentication error:",
                error
            );

            showAuthMessage(
                getFriendlyAuthError(
                    error
                ),
                true
            );

        } finally {

            setAuthLoading(false);

        }

    }
);
```

}

/* =========================================================
GOOGLE LOGIN
========================================================= */

async function signInWithGoogle() {

```
clearAuthMessage();

try {

    showAuthMessage(
        "Connecting to Google...",
        false
    );


    const {
        error
    } =
        await supabaseClient
            .auth
            .signInWithOAuth({

                provider: "google",

                options: {

                    redirectTo:
                        window.location.origin +
                        "/profile.html"

                }

            });


    if (error) {
        throw error;
    }

} catch (error) {

    console.error(
        "Google login error:",
        error
    );

    showAuthMessage(
        getFriendlyAuthError(
            error
        ),
        true
    );

}
```

}

if (googleLoginBtn) {

```
googleLoginBtn.addEventListener(
    "click",
    signInWithGoogle
);
```

}

if (modalGoogleBtn) {

```
modalGoogleBtn.addEventListener(
    "click",
    signInWithGoogle
);
```

}

/* =========================================================
AUTH LOADING
========================================================= */

function setAuthLoading(
loading
) {

```
if (!authSubmit) return;

if (loading) {

    authSubmit.disabled = true;

    authSubmit.textContent =
        authMode === "signup"
            ? "Creating Account..."
            : "Signing In...";

} else {

    authSubmit.disabled = false;

    authSubmit.textContent =
        authMode === "signup"
            ? "Create Account"
            : "Sign In";

}
```

}

/* =========================================================
AUTH MESSAGES
========================================================= */

function showAuthMessage(
message,
isError = false
) {

```
if (!modalStatus) return;

modalStatus.textContent =
    message;

modalStatus.style.color =
    isError
        ? "#c0392b"
        : "#21834d";

if (authMessage) {

    authMessage.textContent =
        message;

    authMessage.style.color =
        isError
            ? "#c0392b"
            : "#21834d";

}
```

}

function clearAuthMessage() {

```
if (modalStatus) {
    modalStatus.textContent = "";
}

if (authMessage) {
    authMessage.textContent = "";
}
```

}

/* =========================================================
FRIENDLY AUTH ERRORS
========================================================= */

function getFriendlyAuthError(
error
) {

```
const message =
    error?.message || "";

const lower =
    message.toLowerCase();


if (
    lower.includes(
        "invalid login credentials"
    )
) {

    return "Incorrect email or password.";

}


if (
    lower.includes(
        "email not confirmed"
    )
) {

    return "Please verify your email before signing in.";

}


if (
    lower.includes(
        "user already registered"
    )
) {

    return "This email is already registered. Please sign in.";

}


if (
    lower.includes(
        "password"
    ) &&
    lower.includes(
        "characters"
    )
) {

    return "Your password must meet Supabase's password requirements.";

}


if (
    lower.includes(
        "rate limit"
    )
) {

    return "Too many attempts. Please wait and try again.";

}


if (
    lower.includes(
        "network"
    )
) {

    return "Network error. Please check your internet connection.";

}


return message ||
    "Something went wrong. Please try again.";
```

}

/* =========================================================
AUTH SESSION CHECK
========================================================= */

async function checkUserSession() {

```
try {

    const {
        data: {
            session
        }
    } =
        await supabaseClient
            .auth
            .getSession();


    if (session) {

        console.log(
            "Logged in:",
            session.user.email
        );

        updateNavigationForUser(
            session.user
        );

    } else {

        console.log(
            "No active session."
        );

        updateNavigationForUser(
            null
        );

    }

} catch (error) {

    console.error(
        "Session check failed:",
        error
    );

}
```

}

function updateNavigationForUser(
user
) {

```
if (!navLogin || !navRegister) {
    return;
}


if (user) {

    navLogin.textContent =
        "Dashboard";

    navRegister.textContent =
        "Sign Out";


    navLogin.onclick =
        () => {

            window.location.href =
                "profile.html";

        };


    navRegister.onclick =
        async () => {

            await signOut();

        };

} else {

    navLogin.textContent =
        "Sign In";

    navRegister.textContent =
        "Create Account";


    navLogin.onclick =
        () => {

            openAuthModal(
                "login"
            );

        };


    navRegister.onclick =
        () => {

            openAuthModal(
                "signup"
            );

        };

}
```

}

/* =========================================================
AUTH STATE LISTENER
========================================================= */

supabaseClient
.auth
.onAuthStateChange(
async (
event,
session
) => {

```
        console.log(
            "Auth event:",
            event
        );


        if (session) {

            updateNavigationForUser(
                session.user
            );

        } else {

            updateNavigationForUser(
                null
            );

        }

    }
);
```

/* =========================================================
SIGN OUT
========================================================= */

async function signOut() {

```
try {

    const {
        error
    } =
        await supabaseClient
            .auth
            .signOut();


    if (error) {
        throw error;
    }


    showToast(
        "You have been signed out."
    );


    setTimeout(() => {

        window.location.reload();

    }, 600);


} catch (error) {

    console.error(
        "Sign out error:",
        error
    );

    showToast(
        "Unable to sign out."
    );

}
```

}

/* =========================================================
CONTACT FORM
========================================================= */

if (contactForm) {

```
contactForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            document
                .getElementById(
                    "contactName"
                )
                ?.value
                .trim();

        const email =
            document
                .getElementById(
                    "contactEmail"
                )
                ?.value
                .trim();

        const message =
            document
                .getElementById(
                    "contactMessage"
                )
                ?.value
                .trim();


        if (
            !name ||
            !email ||
            !message
        ) {

            setContactStatus(
                "Please complete all fields.",
                true
            );

            return;

        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(email)
        ) {

            setContactStatus(
                "Please enter a valid email address.",
                true
            );

            return;

        }


        /*
         * Front-end only for now.
         * Connect this form to Supabase
         * or another backend when ready.
         */

        setContactStatus(
            "Thank you! Your message has been received.",
            false
        );

        showToast(
            "Message submitted successfully."
        );


        contactForm.reset();

    }
);
```

}

function setContactStatus(
message,
isError
) {

```
if (!contactMessageStatus) {
    return;
}

contactMessageStatus.textContent =
    message;

contactMessageStatus.style.color =
    isError
        ? "#c0392b"
        : "#21834d";
```

}

/* =========================================================
TOAST
========================================================= */

let toastTimer;

function showToast(
message
) {

```
if (!toast || !toastText) {
    return;
}


toastText.textContent =
    message;


toast.classList.add(
    "show"
);


clearTimeout(
    toastTimer
);


toastTimer =
    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 3500);
```

}

if (closeToast) {

```
closeToast.addEventListener(
    "click",
    () => {

        toast.classList.remove(
            "show"
        );

    }
);
```

}

/* =========================================================
ACTIVE NAVIGATION
========================================================= */

const sections =
document.querySelectorAll(
"main section[id]"
);

const navigationLinks =
document.querySelectorAll(
".nav-links a"
);

window.addEventListener(
"scroll",
() => {

```
    let currentSection = "";

    sections.forEach(
        section => {

            const top =
                section.offsetTop -
                130;

            const height =
                section.offsetHeight;

            if (
                window.scrollY >= top &&
                window.scrollY <
                top + height
            ) {

                currentSection =
                    section.id;

            }

        }
    );


    navigationLinks.forEach(
        link => {

            link.classList.remove(
                "active"
            );


            const href =
                link.getAttribute(
                    "href"
                );


            if (
                href ===
                "#" + currentSection
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );

}
```

);

/* =========================================================
INITIALIZE
========================================================= */

document.addEventListener(
"DOMContentLoaded",
() => {

```
    checkUserSession();

    console.log(
        "AI Farmer Credit Scorer ready."
    );

}
```

);
