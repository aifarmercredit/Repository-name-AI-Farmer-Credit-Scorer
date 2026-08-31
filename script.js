/* =========================================================
   AI FARMER CREDIT SCORER
   STYLE.CSS
========================================================= */

/* =========================
   ROOT & RESET
========================= */

:root {
    --primary: #167a45;
    --primary-dark: #0d5a31;
    --primary-light: #e8f5ec;
    --secondary: #d9a441;
    --dark: #17251c;
    --text: #4f5d53;
    --light-text: #718077;
    --white: #ffffff;
    --background: #f7faf7;
    --border: #e3ebe5;
    --shadow: 0 15px 45px rgba(23, 37, 28, 0.08);
    --radius: 18px;
    --radius-small: 12px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
    scroll-padding-top: 90px;
}

body {
    font-family: "Inter", sans-serif;
    background: var(--background);
    color: var(--dark);
    line-height: 1.6;
    overflow-x: hidden;
}

button,
input,
textarea {
    font: inherit;
}

button {
    cursor: pointer;
    border: none;
}

a {
    color: inherit;
    text-decoration: none;
}

img {
    max-width: 100%;
}

/* =========================
   GLOBAL
========================= */

.section {
    padding: 110px 7%;
}

.section-container {
    width: min(1180px, 100%);
    margin: auto;
}

.section-heading {
    max-width: 700px;
    margin-bottom: 65px;
}

.section-heading.center {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
}

.section-heading h2,
.about-content h2,
.cta-container h2 {
    font-family: "Outfit", sans-serif;
    font-size: clamp(2.2rem, 4vw, 3.8rem);
    line-height: 1.1;
    letter-spacing: -1.5px;
    margin-top: 16px;
}

.section-heading h2 span,
.about-content h2 span,
.cta-container h2 span,
.hero h1 span {
    color: var(--primary);
}

.section-heading p {
    margin-top: 20px;
    color: var(--text);
    font-size: 1.05rem;
}

.section-tag {
    display: inline-flex;
    align-items: center;
    background: var(--primary-light);
    color: var(--primary);
    padding: 8px 14px;
    border-radius: 100px;
    font-weight: 700;
    font-size: 0.82rem;
}

.section-tag.light {
    background: rgba(255, 255, 255, 0.14);
    color: var(--white);
}

/* =========================
   BUTTONS
========================= */

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 12px;
    padding: 13px 21px;
    font-weight: 700;
    transition: 0.25s ease;
    white-space: nowrap;
}

.btn:hover {
    transform: translateY(-2px);
}

.btn-primary {
    background: var(--primary);
    color: var(--white);
    box-shadow: 0 10px 25px rgba(22, 122, 69, 0.22);
}

.btn-primary:hover {
    background: var(--primary-dark);
}

.btn-login {
    background: transparent;
    color: var(--dark);
}

.btn-login:hover {
    background: var(--primary-light);
    color: var(--primary);
}

.btn-outline {
    background: var(--white);
    border: 1px solid var(--border);
    color: var(--dark);
}

.btn-outline:hover {
    border-color: var(--primary);
    color: var(--primary);
}

.btn-light {
    background: var(--white);
    color: var(--primary-dark);
}

.btn-large {
    padding: 16px 24px;
}

/* =========================
   NAVIGATION
========================= */

.navbar {
    position: sticky;
    top: 0;
    z-index: 1000;
    height: 78px;
    padding: 0 7%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(227, 235, 229, 0.7);
}

.navbar.scrolled {
    box-shadow: 0 10px 30px rgba(23, 37, 28, 0.07);
}

.brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.brand-icon {
    width: 43px;
    height: 43px;
    border-radius: 12px;
    background: var(--primary);
    color: var(--white);
    display: grid;
    place-items: center;
    font-size: 1.15rem;
}

.brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
}

.brand-text strong {
    font-family: "Outfit", sans-serif;
    font-size: 1.05rem;
}

.brand-text span {
    color: var(--primary);
    font-size: 0.8rem;
    font-weight: 600;
}

.nav-menu {
    display: flex;
    align-items: center;
    gap: 27px;
}

.nav-link {
    color: var(--text);
    font-size: 0.94rem;
    font-weight: 600;
    transition: 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
    color: var(--primary);
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.menu-toggle {
    display: none;
    width: 44px;
    height: 44px;
    background: var(--primary-light);
    color: var(--primary);
    border-radius: 10px;
    font-size: 1.2rem;
}

/* =========================
   HERO
========================= */

.hero {
    position: relative;
    overflow: hidden;
    min-height: calc(100vh - 78px);
    display: flex;
    align-items: center;
    padding: 85px 7%;
    background:
        radial-gradient(circle at 10% 20%, rgba(65, 171, 100, 0.14), transparent 35%),
        radial-gradient(circle at 90% 80%, rgba(217, 164, 65, 0.12), transparent 30%),
        var(--background);
}

.hero-background {
    position: absolute;
    width: 500px;
    height: 500px;
    right: -220px;
    top: -120px;
    border-radius: 50%;
    background: rgba(22, 122, 69, 0.06);
    pointer-events: none;
}

.hero-container {
    width: min(1180px, 100%);
    margin: auto;
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 70px;
    align-items: center;
    position: relative;
    z-index: 1;
}

.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 9px 14px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 100px;
    color: var(--primary);
    font-size: 0.85rem;
    font-weight: 700;
    box-shadow: 0 8px 25px rgba(23, 37, 28, 0.05);
}

.badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--primary);
}

.hero h1 {
    font-family: "Outfit", sans-serif;
    font-size: clamp(3rem, 5vw, 5.3rem);
    line-height: 1.02;
    letter-spacing: -2.5px;
    margin: 22px 0;
    max-width: 720px;
}

.hero-description {
    max-width: 620px;
    font-size: 1.12rem;
    color: var(--text);
}

.hero-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 30px;
}

.hero-trust {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 35px;
}

.trust-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--light-text);
    font-size: 0.9rem;
    font-weight: 600;
}

.trust-item i {
    color: var(--primary);
}

/* =========================
   DASHBOARD
========================= */

.hero-visual {
    position: relative;
    min-height: 530px;
    display: flex;
    align-items: center;
}

.dashboard-card {
    width: 100%;
    background: var(--white);
    border: 1px solid rgba(227, 235, 229, 0.9);
    border-radius: 24px;
    padding: 28px;
    box-shadow: 0 30px 80px rgba(23, 37, 28, 0.12);
    animation: floatCard 5s ease-in-out infinite;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 15px;
}

.dashboard-header p {
    color: var(--light-text);
    font-size: 0.85rem;
}

.dashboard-header h3 {
    font-family: "Outfit", sans-serif;
    font-size: 1.35rem;
    margin-top: 2px;
}

.ai-status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 10px;
    background: var(--primary-light);
    color: var(--primary);
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 700;
}

.pulse {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--primary);
    animation: pulse 1.5s infinite;
}

.score-area {
    display: flex;
    align-items: center;
    gap: 24px;
    margin: 32px 0 25px;
}

.score-circle {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    padding: 10px;
    background: conic-gradient(
        var(--primary) 0 78%,
        #e6eee8 78% 100%
    );
    display: grid;
    place-items: center;
    transform: rotate(-35deg);
}

.score-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--white);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transform: rotate(35deg);
}

.score-inner strong {
    font-family: "Outfit", sans-serif;
    font-size: 2.3rem;
    line-height: 1;
}

.score-inner span {
    color: var(--light-text);
    font-size: 0.72rem;
    margin-top: 5px;
}

.score-status {
    flex: 1;
}

.status-good {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--primary);
    font-weight: 800;
    font-size: 0.9rem;
}

.score-status p {
    margin-top: 9px;
    color: var(--light-text);
    font-size: 0.88rem;
}

.dashboard-divider {
    height: 1px;
    background: var(--border);
    margin-bottom: 20px;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.metric-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px;
    border-radius: 12px;
    background: #fafcfb;
    border: 1px solid #edf2ee;
}

.metric-icon {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 10px;
}

.metric-icon.income {
    color: var(--primary);
    background: #e7f5eb;
}

.metric-icon.stability {
    color: #2474c6;
    background: #eaf3ff;
}

.metric-icon.risk {
    color: #c17b17;
    background: #fff5df;
}

.metric-icon.growth {
    color: #8a5ec7;
    background: #f2ecff;
}

.metric-card div:last-child {
    display: flex;
    flex-direction: column;
}

.metric-card span {
    font-size: 0.72rem;
    color: var(--light-text);
}

.metric-card strong {
    font-size: 0.85rem;
}

.ai-analysis {
    margin-top: 17px;
    display: flex;
    gap: 11px;
    padding: 14px;
    border-radius: 13px;
    background: var(--primary-light);
}

.analysis-icon {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    background: var(--primary);
    color: var(--white);
    border-radius: 10px;
}

.ai-analysis strong {
    font-size: 0.82rem;
}

.ai-analysis p {
    color: var(--text);
    font-size: 0.76rem;
    margin-top: 3px;
}

.floating-card {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 15px;
    background: var(--white);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    border-radius: 14px;
    animation: floatSmall 4s ease-in-out infinite;
}

.floating-top {
    top: 15px;
    right: -55px;
}

.floating-top > i {
    color: var(--secondary);
    font-size: 1.25rem;
}

.floating-bottom {
    bottom: 15px;
    left: -55px;
    animation-delay: 1s;
}

.floating-card span {
    display: block;
    color: var(--light-text);
    font-size: 0.7rem;
}

.floating-card strong {
    font-size: 0.83rem;
}

.mini-score {
    width: 43px;
    height: 43px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--primary);
    color: var(--white);
    font-weight: 800;
}

/* =========================
   STATS
========================= */

.stats-section {
    background: var(--white);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.stats-container {
    width: min(1180px, 100%);
    margin: auto;
    padding: 28px 7%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.stat-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 11px;
}

.stat-icon {
    width: 45px;
    height: 45px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: var(--primary-light);
    color: var(--primary);
}

.stat-item div:last-child {
    display: flex;
    flex-direction: column;
}

.stat-item strong {
    font-size: 0.9rem;
}

.stat-item span {
    color: var(--light-text);
    font-size: 0.75rem;
}

/* =========================
   FEATURES
========================= */

.features-section {
    background: var(--background);
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
}

.feature-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 30px;
    transition: 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow);
    border-color: rgba(22, 122, 69, 0.25);
}

.feature-icon {
    width: 54px;
    height: 54px;
    display: grid;
    place-items: center;
    border-radius: 15px;
    background: var(--primary-light);
    color: var(--primary);
    font-size: 1.25rem;
}

.feature-card h3 {
    font-family: "Outfit", sans-serif;
    margin-top: 20px;
    font-size: 1.22rem;
}

.feature-card p {
    color: var(--text);
    font-size: 0.92rem;
    margin-top: 10px;
}

/* =========================
   HOW IT WORKS
========================= */

.how-section {
    background: var(--white);
}

.steps-grid {
    display: grid;
    grid-template-columns: 1fr 70px 1fr 70px 1fr;
    align-items: center;
    gap: 10px;
}

.step-card {
    position: relative;
    text-align: center;
    padding: 32px 24px;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--background);
}

.step-number {
    position: absolute;
    top: 14px;
    right: 17px;
    color: #cbd6ce;
    font-weight: 800;
    font-size: 0.8rem;
}

.step-icon {
    width: 66px;
    height: 66px;
    margin: auto;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: var(--primary);
    color: var(--white);
    font-size: 1.4rem;
}

.step-card h3 {
    font-family: "Outfit", sans-serif;
    margin-top: 20px;
    font-size: 1.2rem;
}

.step-card p {
    margin-top: 10px;
    color: var(--text);
    font-size: 0.9rem;
}

.step-line {
    height: 2px;
    background: linear-gradient(
        to right,
        var(--primary),
        rgba(22, 122, 69, 0.15)
    );
}

/* =========================
   ABOUT
========================= */

.about-section {
    background: var(--background);
}

.about-grid {
    display: grid;
    grid-template-columns: 0.95fr 1.05fr;
    gap: 80px;
    align-items: center;
}

.about-visual {
    position: relative;
}

.about-main-card {
    padding: 20px;
    background: var(--white);
    border-radius: 24px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
}

.about-image-placeholder {
    height: 270px;
    display: grid;
    place-items: center;
    border-radius: 17px;
    background:
        linear-gradient(
            135deg,
            rgba(22, 122, 69, 0.95),
            rgba(53, 142, 82, 0.75)
        );
    color: var(--white);
    font-size: 4rem;
}

.about-chart {
    padding: 20px 5px 5px;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chart-header span {
    color: var(--light-text);
    font-size: 0.8rem;
}

.chart-header strong {
    color: var(--primary);
}

.chart-bars {
    height: 100px;
    margin-top: 15px;
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 10px;
}

.chart-bars span {
    flex: 1;
    background: var(--primary-light);
    border-radius: 8px 8px 3px 3px;
}

.chart-bars span:nth-child(1) {
    height: 32%;
}

.chart-bars span:nth-child(2) {
    height: 48%;
}

.chart-bars span:nth-child(3) {
    height: 44%;
}

.chart-bars span:nth-child(4) {
    height: 68%;
}

.chart-bars span:nth-child(5) {
    height: 76%;
}

.chart-bars span:nth-child(6) {
    height: 95%;
    background: var(--primary);
}

.about-floating-card {
    position: absolute;
    bottom: 30px;
    right: -30px;
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 14px 17px;
    border-radius: 14px;
    background: var(--white);
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
}

.about-floating-card > i {
    color: var(--primary);
    font-size: 1.3rem;
}

.about-floating-card div {
    display: flex;
    flex-direction: column;
}

.about-floating-card strong {
    font-size: 0.82rem;
}

.about-floating-card span {
    font-size: 0.72rem;
    color: var(--light-text);
}

.about-content > p {
    margin-top: 18px;
    color: var(--text);
}

.about-list {
    display: grid;
    gap: 12px;
    margin: 26px 0;
}

.about-list div {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
}

.about-list i {
    color: var(--primary);
}

/* =========================
   CTA
========================= */

.cta-section {
    padding: 70px 7%;
    background: var(--primary);
    color: var(--white);
}

.cta-container {
    width: min(1180px, 100%);
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
}

.cta-container h2 {
    max-width: 700px;
    margin-top: 15px;
}

.cta-container h2 span {
    color: #d7f4df;
}

.cta-container p {
    max-width: 650px;
    margin-top: 15px;
    color: rgba(255, 255, 255, 0.8);
}

/* =========================
   CONTACT
========================= */

.contact-section {
    background: var(--background);
}

.contact-grid {
    display: grid;
    grid-template-columns: 0.75fr 1.25fr;
    gap: 25px;
}

.contact-info-card,
.contact-form {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 34px;
}

.contact-info-card h3 {
    font-family: "Outfit", sans-serif;
    font-size: 1.5rem;
}

.contact-info-card > p {
    margin-top: 9px;
    color: var(--text);
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 27px;
}

.contact-icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: var(--primary-light);
    color: var(--primary);
}

.contact-item div:last-child {
    display: flex;
    flex-direction: column;
}

.contact-item span {
    color: var(--light-text);
    font-size: 0.75rem;
}

.contact-item strong {
    font-size: 0.88rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-bottom: 17px;
}

.form-group label {
    font-size: 0.84rem;
    font-weight: 700;
}

.form-group input,
.form-group textarea {
    width: 100%;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 13px 14px;
    outline: none;
    color: var(--dark);
    background: #fcfdfc;
    transition: 0.2s ease;
}

.form-group textarea {
    resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(22, 122, 69, 0.08);
}

/* =========================
   FOOTER
========================= */

.footer {
    background: #122018;
    color: var(--white);
    padding: 70px 7% 0;
}

.footer-container {
    width: min(1180px, 100%);
    margin: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    padding-bottom: 55px;
}

.footer .brand-icon {
    background: var(--primary);
}

.footer .brand-text span {
    color: #7ccf97;
}

.footer-brand > p {
    max-width: 380px;
    margin-top: 20px;
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.9rem;
}

.footer-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
}

.footer-links div {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.footer-links h4 {
    margin-bottom: 6px;
}

.footer-links a,
.footer-auth {
    color: rgba(255, 255, 255, 0.62);
    background: transparent;
    text-align: left;
    font-size: 0.86rem;
    transition: 0.2s ease;
}

.footer-links a:hover,
.footer-auth:hover {
    color: var(--white);
}

.footer-bottom {
    width: min(1180px, 100%);
    margin: auto;
    padding: 22px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    gap: 20px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.78rem;
}

.footer-bottom div {
    display: flex;
    gap: 18px;
}

/* =========================
   AUTH MODAL
========================= */

.auth-modal {
    position: fixed;
    inset: 0;
    z-index: 5000;
    padding: 20px;
    display: none;
    align-items: center;
    justify-content: center;
    background: rgba(9, 19, 13, 0.65);
    backdrop-filter: blur(6px);
}

.auth-modal.active {
    display: flex;
}

.auth-box {
    position: relative;
    width: min(430px, 100%);
    max-height: 92vh;
    overflow-y: auto;
    background: var(--white);
    border-radius: 22px;
    padding: 34px;
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.25);
    animation: modalIn 0.25s ease;
}

.close-modal {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 37px;
    height: 37px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    background: #f1f4f2;
    color: var(--dark);
}

.auth-header {
    text-align: center;
    margin-bottom: 23px;
}

.auth-logo {
    width: 58px;
    height: 58px;
    margin: auto;
    border-radius: 17px;
    display: grid;
    place-items: center;
    background: var(--primary);
    color: var(--white);
    font-size: 1.5rem;
}

.auth-header h2 {
    font-family: "Outfit", sans-serif;
    margin-top: 15px;
    font-size: 1.7rem;
}

.auth-header p {
    margin-top: 7px;
    color: var(--light-text);
    font-size: 0.88rem;
}

.google-btn {
    width: 100%;
    min-height: 48px;
    border: 1px solid var(--border);
    border-radius: 11px;
    background: var(--white);
    color: var(--dark);
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 11px;
    transition: 0.2s ease;
}

.google-btn:hover {
    background: #fafafa;
    border-color: #cfd8d1;
}

.google-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.google-btn i {
    color: #4285f4;
    font-size: 1.1rem;
}

.auth-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 20px 0;
    color: var(--light-text);
}

.auth-divider span {
    height: 1px;
    flex: 1;
    background: var(--border);
}

.auth-divider small {
    font-size: 0.72rem;
    font-weight: 700;
}

.auth-submit {
    width: 100%;
    margin-top: 3px;
}

.auth-status {
    min-height: 20px;
    margin-bottom: 10px;
    font-size: 0.8rem;
    font-weight: 600;
    text-align: center;
}

.auth-switch {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 19px;
    font-size: 0.82rem;
    color: var(--light-text);
}

.auth-switch button {
    background: transparent;
    color: var(--primary);
    font-weight: 800;
}

/* =========================
   TOAST
========================= */

.toast {
    position: fixed;
    z-index: 6000;
    right: 20px;
    bottom: 20px;
    min-width: 260px;
    max-width: 390px;
    padding: 14px 16px;
    border-radius: 12px;
    background: var(--dark);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    box-shadow: var(--shadow);
    transform: translateY(130px);
    opacity: 0;
    pointer-events: none;
    transition: 0.3s ease;
}

.toast.show {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
}

.toast span {
    font-size: 0.83rem;
}

.toast button {
    background: transparent;
    color: var(--white);
}

/* =========================
   ANIMATIONS
========================= */

@keyframes floatCard {
    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-9px);
    }
}

@keyframes floatSmall {
    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-7px);
    }
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(22, 122, 69, 0.5);
    }

    70% {
        box-shadow: 0 0 0 7px rgba(22, 122, 69, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(22, 122, 69, 0);
    }
}

@keyframes modalIn {
    from {
        opacity: 0;
        transform: translateY(15px) scale(0.97);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* =========================
   TABLET
========================= */

@media (max-width: 1050px) {

    .navbar {
        padding: 0 5%;
    }

    .hero,
    .section,
    .cta-section,
    .footer {
        padding-left: 5%;
        padding-right: 5%;
    }

    .hero-container {
        gap: 40px;
    }

    .nav-menu {
        gap: 18px;
    }

    .floating-top {
        right: -20px;
    }

    .floating-bottom {
        left: -20px;
    }

    .features-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .steps-grid {
        grid-template-columns: 1fr;
    }

    .step-line {
        width: 2px;
        height: 40px;
        margin: auto;
        background: linear-gradient(
            to bottom,
            var(--primary),
            rgba(22, 122, 69, 0.15)
        );
    }

    .about-grid {
        gap: 50px;
    }

    .stats-container {
        grid-template-columns: repeat(2, 1fr);
    }

    .contact-grid {
        grid-template-columns: 1fr;
    }
}

/* =========================
   MOBILE NAVIGATION
========================= */

@media (max-width: 850px) {

    .nav-menu,
    .nav-actions {
        display: none;
    }

    .menu-toggle {
        display: grid;
        place-items: center;
    }

    .nav-menu.open {
        position: absolute;
        top: 78px;
        left: 5%;
        right: 5%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 4px;
        background: var(--white);
        border: 1px solid var(--border);
        border-radius: 16px;
        box-shadow: var(--shadow);
    }

    .nav-menu.open .nav-link {
        padding: 11px 13px;
        border-radius: 9px;
    }

    .nav-menu.open .nav-link:hover {
        background: var(--primary-light);
    }

    .hero {
        padding-top: 70px;
        padding-bottom: 70px;
    }

    .hero-container {
        grid-template-columns: 1fr;
    }

    .hero-content {
        text-align: center;
    }

    .hero-badge {
        margin: auto;
    }

    .hero-description {
        margin-left: auto;
        margin-right: auto;
    }

    .hero-buttons,
    .hero-trust {
        justify-content: center;
    }

    .hero-visual {
        max-width: 580px;
        width: 100%;
        margin: auto;
    }

    .about-grid {
        grid-template-columns: 1fr;
    }

    .about-content {
        text-align: center;
    }

    .about-list {
        justify-content: center;
    }

    .about-list div {
        justify-content: center;
    }

    .cta-container {
        flex-direction: column;
        align-items: flex-start;
    }

    .footer-container {
        grid-template-columns: 1fr;
        gap: 45px;
    }
}

/* =========================
   SMALL MOBILE
========================= */

@media (max-width: 600px) {

    .navbar {
        height: 70px;
    }

    .brand-icon {
        width: 39px;
        height: 39px;
    }

    .brand-text strong {
        font-size: 0.96rem;
    }

    .menu-toggle {
        width: 40px;
        height: 40px;
    }

    .nav-menu.open {
        top: 70px;
    }

    .hero {
        min-height: auto;
        padding-top: 55px;
    }

    .hero h1 {
        font-size: clamp(2.55rem, 13vw, 3.5rem);
        letter-spacing: -1.5px;
    }

    .hero-description {
        font-size: 1rem;
    }

    .hero-buttons {
        flex-direction: column;
    }

    .hero-buttons .btn {
        width: 100%;
    }

    .hero-trust {
        gap: 13px;
    }

    .hero-visual {
        min-height: auto;
    }

    .dashboard-card {
        padding: 20px;
    }

    .dashboard-header {
        flex-direction: column;
    }

    .score-area {
        flex-direction: column;
        text-align: center;
    }

    .score-status p {
        max-width: 290px;
    }

    .floating-top {
        right: -5px;
        top: -10px;
    }

    .floating-bottom {
        left: -5px;
        bottom: -10px;
    }

    .floating-card {
        padding: 10px 11px;
    }

    .metrics-grid {
        grid-template-columns: 1fr;
    }

    .stats-container {
        grid-template-columns: 1fr;
        padding-top: 25px;
        padding-bottom: 25px;
    }

    .stat-item {
        justify-content: flex-start;
    }

    .section {
        padding-top: 80px;
        padding-bottom: 80px;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }

    .feature-card {
        padding: 25px;
    }

    .section-heading {
        margin-bottom: 42px;
    }

    .about-floating-card {
        position: relative;
        right: auto;
        bottom: auto;
        margin: 15px auto 0;
        width: fit-content;
    }

    .cta-section {
        padding-top: 60px;
        padding-bottom: 60px;
    }

    .cta-container .btn {
        width: 100%;
    }

    .form-row {
        grid-template-columns: 1fr;
    }

    .contact-info-card,
    .contact-form {
        padding: 24px;
    }

    .footer-links {
        grid-template-columns: 1fr 1fr;
    }

    .footer-bottom {
        flex-direction: column;
    }

    .auth-box {
        padding: 28px 20px;
        border-radius: 18px;
    }

    .auth-switch {
        flex-wrap: wrap;
    }

    .toast {
        left: 15px;
        right: 15px;
        bottom: 15px;
        min-width: auto;
    }
}
