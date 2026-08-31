/* =========================================
   AI FARMER CREDIT SCORER
   SUPABASE CONFIGURATION
========================================= */

const SUPABASE_URL =
    "PASTE_YOUR_SUPABASE_PROJECT_URL_HERE";

const SUPABASE_ANON_KEY =
    "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


/* =========================================
   CREDIT ASSESSMENT FORM
========================================= */

const assessmentForm =
    document.getElementById(
        "assessmentForm"
    );


const formMessage =
    document.getElementById(
        "formMessage"
    );


const submitButton =
    document.getElementById(
        "submitButton"
    );


assessmentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /* GET USER DATA */

        const fullName =
            document
                .getElementById("fullName")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const phone =
            document
                .getElementById("phone")
                .value
                .trim();


        const location =
            document
                .getElementById("location")
                .value
                .trim();


        const farmType =
            document
                .getElementById("farmType")
                .value;


        const farmSize =
            Number(
                document
                    .getElementById("farmSize")
                    .value
            );


        const farmIncome =
            Number(
                document
                    .getElementById("farmIncome")
                    .value
            );


        const incomeFrequency =
            document
                .getElementById(
                    "incomeFrequency"
                )
                .value;


        const loanAmount =
            Number(
                document
                    .getElementById("loanAmount")
                    .value
            );


        const loanHistory =
            document
                .getElementById("loanHistory")
                .value;


        const expenses =
            Number(
                document
                    .getElementById("expenses")
                    .value
            );


        const repaymentAbility =
            document
                .getElementById(
                    "repaymentAbility"
                )
                .value;


        /* ===============================
           SIMPLE CREDIT SCORE
           This can later be replaced
           with your real AI model.
        =============================== */

        let creditScore = 500;


        /* Income */

        if (farmIncome > 100000) {

            creditScore += 100;

        } else if (farmIncome > 50000) {

            creditScore += 70;

        } else if (farmIncome > 20000) {

            creditScore += 40;

        }


        /* Farm size */

        if (farmSize >= 10) {

            creditScore += 50;

        } else if (farmSize >= 5) {

            creditScore += 30;

        } else {

            creditScore += 10;

        }


        /* Loan history */

        if (
            loanHistory ===
            "Paid On Time"
        ) {

            creditScore += 100;

        } else if (
            loanHistory ===
            "No Previous Loan"
        ) {

            creditScore += 30;

        } else if (
            loanHistory ===
            "Late Payments"
        ) {

            creditScore -= 70;

        }


        /* Repayment ability */

        if (
            repaymentAbility ===
            "High"
        ) {

            creditScore += 70;

        } else if (
            repaymentAbility ===
            "Medium"
        ) {

            creditScore += 35;

        }


        /* Expenses */

        if (
            expenses <
            farmIncome * 0.4
        ) {

            creditScore += 50;

        } else if (
            expenses >
            farmIncome * 0.8
        ) {

            creditScore -= 40;

        }


        /* Loan amount */

        if (
            loanAmount >
            farmIncome * 2
        ) {

            creditScore -= 50;

        }


        /* Limit score */

        creditScore =
            Math.max(
                300,
                Math.min(
                    850,
                    creditScore
                )
            );


        /* ===============================
           STATUS
        =============================== */

        let creditStatus;
        let description;


        if (creditScore >= 750) {

            creditStatus =
                "Excellent Credit Readiness";

            description =
                "Your financial and agricultural profile shows strong potential for agricultural financing.";

        }

        else if (creditScore >= 650) {

            creditStatus =
                "Good Credit Readiness";

            description =
                "Your profile shows good credit potential with some areas for improvement.";

        }

        else if (creditScore >= 550) {

            creditStatus =
                "Moderate Credit Readiness";

            description =
                "Your profile may require improvement before qualifying for larger financing.";

        }

        else {

            creditStatus =
                "Low Credit Readiness";

            description =
                "Improving financial stability and repayment capacity may improve your credit readiness.";

        }


        /* ===============================
           LOADING
        =============================== */

        submitButton.disabled = true;

        submitButton.innerHTML =
            "Analyzing Your Information...";


        formMessage.textContent =
            "Saving your information securely...";

        formMessage.style.color =
            "#21784e";


        try {

            /* ===============================
               SAVE TO SUPABASE
            =============================== */

            const {
                data,
                error
            } =
                await supabaseClient
                    .from(
                        "farmer_assessments"
                    )
                    .insert([

                        {

                            full_name:
                                fullName,

                            email:
                                email,

                            phone:
                                phone,

                            location:
                                location,

                            farm_type:
                                farmType,

                            farm_size:
                                farmSize,

                            farm_income:
                                farmIncome,

                            income_frequency:
                                incomeFrequency,

                            loan_amount:
                                loanAmount,

                            loan_history:
                                loanHistory,

                            monthly_expenses:
                                expenses,

                            repayment_ability:
                                repaymentAbility,

                            credit_score:
                                creditScore,

                            credit_status:
                                creditStatus

                        }

                    ])
                    .select();


            if (error) {

                throw error;

            }


            console.log(
                "Assessment saved:",
                data
            );


            /* ===============================
               SHOW RESULT
            =============================== */

            document
                .getElementById(
                    "resultScore"
                )
                .textContent =
                creditScore;


            document
                .getElementById(
                    "resultStatus"
                )
                .textContent =
                creditStatus;


            document
                .getElementById(
                    "resultDescription"
                )
                .textContent =
                description;


            formMessage.textContent =
                "Assessment completed successfully!";


            assessmentForm.reset();


            const resultSection =
                document.getElementById(
                    "resultSection"
                );


            resultSection.style.display =
                "block";


            setTimeout(() => {

                resultSection.scrollIntoView({

                    behavior: "smooth"

                });

            }, 300);


        }

        catch (error) {

            console.error(error);


            formMessage.textContent =
                "Error: " +
                error.message;


            formMessage.style.color =
                "#c0392b";

        }

        finally {

            submitButton.disabled =
                false;


            submitButton.innerHTML =
                "Analyze My Credit Score →";

        }

    }
);


/* =========================================
   CONTACT FORM
========================================= */

const contactForm =
    document.getElementById(
        "contactForm"
    );


contactForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById(
                    "contactName"
                )
                .value
                .trim();


        const email =
            document
                .getElementById(
                    "contactEmail"
                )
                .value
                .trim();


        const message =
            document
                .getElementById(
                    "contactMessage"
                )
                .value
                .trim();


        try {

            const {
                error
            } =
                await supabaseClient
                    .from(
                        "contact_messages"
                    )
                    .insert([

                        {

                            full_name:
                                name,

                            email:
                                email,

                            message:
                                message

                        }

                    ]);


            if (error) {

                throw error;

            }


            alert(
                "Thank you! Your message has been sent successfully."
            );


            contactForm.reset();

        }

        catch (error) {

            console.error(error);


            alert(
                "Message could not be sent: " +
                error.message
            );

        }

    }
);
