/* =====================================================
   AI FARMER CREDIT SCORER
   AUTHENTICATION SCRIPT
===================================================== */


/* =====================================================
   1. SUPABASE CONFIGURATION
===================================================== */

/*
   Supabase Dashboard
   → Project Settings
   → API

   PASTE:
   - Project URL
   - anon public key

   NEVER put Service Role Key or Secret Key here.
*/

const SUPABASE_URL =
    ""https://rronyxeiruuaizjinsvz.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_C_WZDTvi8dZwZAgKQh6ANA_vJDd6LKH";


/* =====================================================
   2. CREATE SUPABASE CLIENT
===================================================== */

let supabaseClient = null;

try {

    if (
        SUPABASE_URL.startsWith("http") &&
        SUPABASE_ANON_KEY.length > 30
    ) {

        supabaseClient =
            supabase.createClient(
                SUPABASE_URL,
                SUPABASE_ANON_KEY
            );

        console.log(
            "Supabase connected successfully."
        );

    } else {

        console.warn(
            "Supabase configuration is incomplete."
        );

    }

} catch (error) {

    console.error(
        "Supabase initialization error:",
        error
    );

}


/* =====================================================
   3. GET HTML ELEMENTS
===================================================== */

const authForm =
    document.getElementById("authForm");

const authTitle =
    document.getElementById("authTitle");

const authSubtitle =
    document.getElementById("authSubtitle");

const nameGroup =
    document.getElementById("nameGroup");

const fullName =
    document.getElementById("fullName");

const email =
    document.getElementById("email");

const password =
    document.getElementById("password");

const passwordToggle =
    document.getElementById("passwordToggle");

const passwordIcon =
    document.getElementById("passwordIcon");

const formOptions =
    document.getElementById("formOptions");

const authSubmit =
    document.getElementById("authSubmit");

const authSubmitText =
    document.getElementById("authSubmitText");

const submitIcon =
    document.getElementById("submitIcon");

const authMessage =
    document.getElementById("authMessage");

const switchAuthMode =
    document.getElementById("switchAuthMode");

const switchText =
    document.getElementById("switchText");

const googleLogin =
    document.getElementById("googleLogin");

const forgotPassword =
    document.getElementById("forgotPassword");


/* =====================================================
   4. AUTH MODE
===================================================== */

let authMode = "signin";


/* =====================================================
   5. SHOW MESSAGE
===================================================== */

function showMessage(
    message,
    type = "error"
) {

    if (!authMessage) return;

    authMessage.textContent =
        message;


    if (type === "success") {

        authMessage.style.color =
            "#218653";

    }

    else if (type === "info") {

        authMessage.style.color =
            "#197447";

    }

    else {

        authMessage.style.color =
            "#c93b3b";

    }

}


/* =====================================================
   6. CLEAR MESSAGE
===================================================== */

function clearMessage() {

    if (!authMessage) return;

    authMessage.textContent = "";

}


/* =====================================================
   7. UPDATE AUTH MODE
===================================================== */

function updateAuthMode() {

    clearMessage();


    /* =====================
       CREATE ACCOUNT MODE
    ====================== */

    if (authMode === "signup") {

        authTitle.textContent =
            "Create Account";


        authSubtitle.textContent =
            "Create your account and start your AI-powered credit assessment.";


        nameGroup.style.display =
            "flex";


        fullName.required =
            true;


        authSubmitText.textContent =
            "Create Account";


        switchText.textContent =
            "Already have an account?";


        switchAuthMode.textContent =
            "Sign In";


        formOptions.style.display =
            "none";


        password.autocomplete =
            "new-password";


        password.value = "";


        password.placeholder =
            "Create a password";

    }


    /* =====================
       SIGN IN MODE
    ====================== */

    else {

        authTitle.textContent =
            "Welcome Back";


        authSubtitle.textContent =
            "Sign in to continue to your AI-powered credit assessment.";


        nameGroup.style.display =
            "none";


        fullName.required =
            false;


        authSubmitText.textContent =
            "Sign In";


        switchText.textContent =
            "Don't have an account?";


        switchAuthMode.textContent =
            "Create Account";


        formOptions.style.display =
            "flex";


        password.autocomplete =
            "current-password";


        password.value = "";


        password.placeholder =
            "Enter your password";

    }

}


/* =====================================================
   8. SWITCH SIGN IN / CREATE ACCOUNT
===================================================== */

switchAuthMode.addEventListener(
    "click",
    function () {

        if (
            authMode === "signin"
        ) {

            authMode =
                "signup";

        }

        else {

            authMode =
                "signin";

        }


        updateAuthMode();

    }
);


/* =====================================================
   9. PASSWORD SHOW / HIDE
===================================================== */

passwordToggle.addEventListener(
    "click",
    function () {

        if (
            password.type ===
            "password"
        ) {

            password.type =
                "text";


            passwordIcon.className =
                "fa-regular fa-eye-slash";

        }

        else {

            password.type =
                "password";


            passwordIcon.className =
                "fa-regular fa-eye";

        }

    }
);


/* =====================================================
   10. BUTTON LOADING
===================================================== */

function setSubmitLoading(
    loading,
    text = "Please wait..."
) {

    if (loading) {

        authSubmit.disabled =
            true;


        authSubmitText.textContent =
            text;


        submitIcon.className =
            "fa-solid fa-spinner fa-spin";

    }

    else {

        authSubmit.disabled =
            false;


        submitIcon.className =
            "fa-solid fa-arrow-right";


        if (
            authMode ===
            "signup"
        ) {

            authSubmitText.textContent =
                "Create Account";

        }

        else {

            authSubmitText.textContent =
                "Sign In";

        }

    }

}


/* =====================================================
   11. EMAIL / PASSWORD AUTH
===================================================== */

authForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        clearMessage();


        /* =====================
           CHECK SUPABASE
        ====================== */

        if (!supabaseClient) {

            showMessage(
                "Supabase is not configured. Add your Project URL and anon public key in script.js."
            );

            return;

        }


        const userEmail =
            email.value
                .trim();


        const userPassword =
            password.value;


        /* =====================
           VALIDATION
        ====================== */

        if (
            !userEmail ||
            !userPassword
        ) {

            showMessage(
                "Please enter your email and password."
            );

            return;

        }


        if (
            authMode ===
            "signup"
        ) {

            if (
                !fullName.value.trim()
            ) {

                showMessage(
                    "Please enter your full name."
                );

                return;

            }


            if (
                userPassword.length < 6
            ) {

                showMessage(
                    "Password must be at least 6 characters."
                );

                return;

            }

        }


        /* =====================
           CREATE ACCOUNT
        ====================== */

        if (
            authMode ===
            "signup"
        ) {

            try {

                setSubmitLoading(
                    true,
                    "Creating Account..."
                );


                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .auth
                        .signUp({

                            email:
                                userEmail,

                            password:
                                userPassword,

                            options: {

                                data: {

                                    full_name:
                                        fullName
                                            .value
                                            .trim()

                                },

                                emailRedirectTo:
                                    window.location.origin

                            }

                        });


                if (error) {

                    throw error;

                }


                /* =================
                   EMAIL CONFIRMATION
                ================== */

                if (
                    data.user &&
                    !data.session
                ) {

                    showMessage(
                        "Account created successfully. Please check your email and confirm your account.",
                        "success"
                    );

                }


                /* =================
                   USER LOGGED IN
                ================== */

                else {

                    showMessage(
                        "Account created successfully. Redirecting...",
                        "success"
                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                "assessment.html";

                        },
                        900
                    );

                }

            }

            catch (error) {

                console.error(
                    "Signup error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Could not create your account."
                );

            }

            finally {

                setSubmitLoading(
                    false
                );

            }

        }


        /* =====================
           SIGN IN
        ====================== */

        else {

            try {

                setSubmitLoading(
                    true,
                    "Signing In..."
                );


                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .auth
                        .signInWithPassword({

                            email:
                                userEmail,

                            password:
                                userPassword

                        });


                if (error) {

                    throw error;

                }


                if (
                    data.user
                ) {

                    showMessage(
                        "Sign in successful. Redirecting...",
                        "success"
                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                "assessment.html";

                        },
                        700
                    );

                }

            }

            catch (error) {

                console.error(
                    "Sign in error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Incorrect email or password."
                );

            }

            finally {

                setSubmitLoading(
                    false
                );

            }

        }

    }
);


/* =====================================================
   12. GOOGLE LOGIN
===================================================== */

googleLogin.addEventListener(
    "click",
    async function () {

        clearMessage();


        if (!supabaseClient) {

            showMessage(
                "Supabase is not configured yet."
            );

            return;

        }


        try {

            googleLogin.disabled =
                true;


            googleLogin.innerHTML = `

                <i class="fa-solid fa-spinner fa-spin"></i>

                <span>
                    Connecting to Google...
                </span>

            `;


            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .signInWithOAuth({

                        provider:
                            "google",

                        options: {

                            redirectTo:
                                window.location.origin +
                                "/assessment.html"

                        }

                    });


            if (error) {

                throw error;

            }


            console.log(
                "Google authentication started:",
                data
            );

        }

        catch (error) {

            console.error(
                "Google login error:",
                error
            );


            showMessage(
                error.message ||
                "Google sign in failed."
            );


            googleLogin.disabled =
                false;


            googleLogin.innerHTML = `

                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    aria-hidden="true">

                    <path
                        fill="#4285F4"
                        d="M21.35 12.27c0-.79-.07-1.55-.21-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.93v2.79h3.14c1.84-1.69 2.92-4.18 2.92-7.75z"
                    />

                    <path
                        fill="#34A853"
                        d="M12 21.75c2.63 0 4.84-.87 6.45-2.35l-3.14-2.79c-.87.58-1.99.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.88A9.75 9.75 0 0 0 12 21.75z"
                    />

                    <path
                        fill="#FBBC05"
                        d="M6.54 13.5A5.86 5.86 0 0 1 6.24 12c0-.52.09-1.02.3-1.5V7.62H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.38l3.24-2.88z"
                    />

                    <path
                        fill="#EA4335"
                        d="M12 6.47c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.58 14.63 2.25 12 2.25A9.75 9.75 0 0 3.3 7.62l3.24 2.88C7.31 8.19 9.46 6.47 12 6.47z"
                    />

                </svg>

                <span>
                    Continue with Google
                </span>

            `;

        }

    }
);


/* =====================================================
   13. FORGOT PASSWORD
===================================================== */

forgotPassword.addEventListener(
    "click",
    async function () {

        clearMessage();


        if (!supabaseClient) {

            showMessage(
                "Supabase is not configured yet."
            );

            return;

        }


        const userEmail =
            email.value
                .trim();


        if (!userEmail) {

            showMessage(
                "Please enter your email address first."
            );

            email.focus();

            return;

        }


        try {

            forgotPassword.disabled =
                true;


            showMessage(
                "Sending password reset email...",
                "info"
            );


            const {
                error
            } =
                await supabaseClient
                    .auth
                    .resetPasswordForEmail(
                        userEmail,
                        {

                            redirectTo:
                                window.location.origin +
                                "/index.html"

                        }
                    );


            if (error) {

                throw error;

            }


            showMessage(
                "Password reset link sent. Please check your email.",
                "success"
            );

        }

        catch (error) {

            console.error(
                "Password reset error:",
                error
            );


            showMessage(
                error.message ||
                "Could not send reset email."
            );

        }

        finally {

            forgotPassword.disabled =
                false;

        }

    }
);


/* =====================================================
   14. CHECK USER SESSION
===================================================== */

async function checkSession() {

    if (!supabaseClient) {

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

            return;

        }


        /*
           IMPORTANT:

           Do not automatically redirect from this
           authentication page immediately if the user
           is already logged in, because the user may
           intentionally return here.

           assessment.html will verify login itself.
        */

        if (
            data.session
        ) {

            console.log(
                "Current user:",
                data.session.user.email
            );

        }

    }

    catch (error) {

        console.error(
            "Session check failed:",
            error
        );

    }

}


/* =====================================================
   15. INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateAuthMode();

        checkSession();

        console.log(
            "AI Farmer Credit Scorer authentication ready."
        );

    }
);
