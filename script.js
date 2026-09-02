/*
  AI FARMER CREDIT SCORER — FRONTEND CONFIGURATION

  Development:
    Replace the empty values below with your Supabase project values.

  Production:
    Inject these values through your deployment environment or secure
    configuration process.

    SUPABASE_URL=YOUR_SUPABASE_URL =  "https://xcevtpkrasvevwyvvdjq.supabase.co";
    SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY =  "sb_publishable_C_WZDTvi8dZwZAgKQh6ANA_vJDd6LKH";
    GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID = "45705222359-rcgdd2mi2ackpv38ki10g7krlavbhdgm.apps.googleusercontent.com",

  SECURITY:
    Never place SUPABASE_SECRET_KEY or a Supabase service-role key here.
    Secret keys must only be used on a secure backend/server.
*/

const FRONTEND_CONFIG = {
  SUPABASE_URL: "https://xcevtpkrasvevwyvvdjq.supabase.com",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_C_WZDTvi8dZwZAgKQh6ANA_vJDd6LKH",
  GOOGLE_CLIENT_ID: "45705222359-rcgdd2mi2ackpv38ki10g7krlavbhdgm.apps.googleusercontent.com",
};

const STORAGE_KEY = "ai_farmer_credit_assessments";
const ACTIVE_RESULT_KEY = "ai_farmer_active_result";

let supabaseClient = null;
let currentUser = null;
let assessments = [];
let activeAssessment = null;

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function isSupabaseConfigured() {
  return Boolean(
    FRONTEND_CONFIG.SUPABASE_URL &&
    FRONTEND_CONFIG.SUPABASE_PUBLISHABLE_KEY
  );
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  $("#toastContainer").appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4500);
}

function showFormMessage(element, message, type = "error") {
  element.textContent = message;
  element.className = `form-message ${type}`;
}

function clearFormMessage(element) {
  element.textContent = "";
  element.className = "form-message";
}

function getInitials(name) {
  return String(name || "User")
    .trim()
    .split(/\s+/)
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatCurrency(value) {
  return `ETB ${Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 0
  })}`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function slugifyName(name) {
  return String(name || "farmer")
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeRisk(score, category = "") {
  const categoryText = String(category).toLowerCase();

  if (categoryText.includes("high") && !categoryText.includes("medium")) {
    return "High Risk";
  }

  if (categoryText.includes("medium") || categoryText.includes("moderate")) {
    return "Medium Risk";
  }

  if (categoryText.includes("low")) {
    return "Low Risk";
  }

  if (score >= 70) return "Low Risk";
  if (score >= 50) return "Medium Risk";
  return "High Risk";
}

function riskClass(risk) {
  if (risk === "Low Risk") return "risk-low";
  if (risk === "Medium Risk") return "risk-medium";
  return "risk-high";
}

function getEligibility(score, risk) {
  if (risk === "Low Risk" || score >= 70) return "Eligible for Credit";
  if (risk === "Medium Risk" || score >= 50) return "Review Required";
  return "Not Eligible";
}

function calculateRecommendedAmount(data, score) {
  const income = Number(data.financial.annual_income || 0);
  const existingLoan = Number(data.financial.existing_loan || 0);
  const outstandingDebt = Number(data.financial.outstanding_debt || 0);
  const requested = Number(data.financial.loan_amount_requested || 0);

  const monthlyExpenses = Number(data.financial.monthly_expenses || 0);
  const annualExpenses = monthlyExpenses * 12;
  const netIncome = Math.max(0, income - annualExpenses);
  const availableCapacity = Math.max(0, netIncome * (score / 100) - existingLoan - outstandingDebt);
  const calculated = Math.min(requested, Math.max(0, availableCapacity * 0.55));

  return Math.round(calculated / 100) * 100;
}

function buildPositiveFactors(data, score) {
  const positive = [];

  if (score >= 70) positive.push("Strong overall credit assessment score.");
  if (Number(data.financial.savings) > Number(data.financial.monthly_expenses) * 3) {
    positive.push("Savings provide a meaningful financial buffer.");
  }
  if (data.farm.irrigation_access === "Full access") {
    positive.push("Full irrigation access may support production stability.");
  }
  if (data.additional.cooperative_membership === "Yes") {
    positive.push("Cooperative membership may improve market and support access.");
  }
  if (data.additional.market_access === "Strong") {
    positive.push("Strong market access may support reliable sales.");
  }
  if (data.farm.land_ownership === "Owned") {
    positive.push("Owned land may improve operational stability.");
  }
  if (data.credit.repayment_history === "Always repaid on time") {
    positive.push("Previous repayment history indicates consistent repayment behavior.");
  }

  return positive.length
    ? positive
    : ["Assessment completed using the submitted farmer and financial information."];
}

function buildRiskFactors(data, score) {
  const risks = [];

  if (score < 70) risks.push("The overall score indicates additional review may be appropriate.");
  if (Number(data.financial.outstanding_debt) > Number(data.financial.annual_income) * 0.5) {
    risks.push("Outstanding debt is substantial compared with annual income.");
  }
  if (Number(data.financial.monthly_expenses) * 12 > Number(data.financial.annual_income)) {
    risks.push("Reported annual expenses exceed annual income.");
  }
  if (data.farm.irrigation_access === "No access") {
    risks.push("Lack of irrigation access may increase production variability.");
  }
  if (data.additional.market_access === "Limited") {
    risks.push("Limited market access may affect sales and cash flow.");
  }
  if (data.credit.repayment_history === "Defaults recorded") {
    risks.push("Previous defaults require careful credit review.");
  }
  if (Number(data.financial.existing_loan) > Number(data.financial.annual_income) * 0.4) {
    risks.push("Existing loan obligations are high relative to annual income.");
  }

  return risks.length
    ? risks
    : ["No major risk factor was identified from the submitted inputs."];
}

function buildAssessmentSummary(data, score, risk, recommendedAmount) {
  const farmerName = data.farmer.full_name;
  const purpose = data.financial.loan_purpose;
  const eligibility = getEligibility(score, risk);

  return `The assessment for ${farmerName} produced a credit score of ${score} out of 100 and a ${risk.toLowerCase()} classification. The requested loan purpose is ${purpose}. The calculated recommended credit amount is ${formatCurrency(recommendedAmount)}. This result is decision support and should be reviewed with relevant financial, agricultural, and institutional information before a final lending decision.`;
}

function buildLocalPrediction(data) {
  /*
    Fallback scoring only.
    In production, replace this fallback with your trained backend API.
    No model file or secret key is included in the frontend.
  */
  let score = 50;

  const income = Number(data.financial.annual_income || 0);
  const expenses = Number(data.financial.monthly_expenses || 0) * 12;
  const requested = Number(data.financial.loan_amount_requested || 0);
  const savings = Number(data.financial.savings || 0);
  const debt = Number(data.financial.outstanding_debt || 0);

  if (income > expenses) score += 12;
  if (savings > expenses * 0.25) score += 8;
  if (data.credit.repayment_history === "Always repaid on time") score += 15;
  if (data.credit.repayment_history === "Usually repaid on time") score += 8;
  if (data.credit.repayment_history === "Defaults recorded") score -= 20;
  if (data.farm.irrigation_access === "Full access") score += 7;
  if (data.additional.cooperative_membership === "Yes") score += 4;
  if (data.additional.market_access === "Strong") score += 5;
  if (debt > income * .5) score -= 12;
  if (requested > income * .75) score -= 10;
  if (data.additional.agricultural_insurance === "Yes") score += 3;

  score = Math.max(0, Math.min(100, Math.round(score)));
  const risk = normalizeRisk(score);
  const recommendation = getEligibility(score, risk);
  const recommendedAmount = calculateRecommendedAmount(data, score);

  return {
    credit_score: score,
    risk_category: risk,
    recommendation,
    recommended_loan_amount: recommendedAmount
  };
}

async function callPredictionApi(data) {
  /*
    Configure your real backend URL here or load it from a secure deployment
    configuration. Example expected response:

    {
      "credit_score": 78,
      "risk_category": "Low Risk",
      "recommendation": "Eligible",
      "recommended_loan_amount": 50000
    }
  */

  const predictionApiUrl = "";

  if (!predictionApiUrl) {
    return buildLocalPrediction(data);
  }

  const response = await fetch(predictionApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Prediction service returned an error.");
  }

  const result = await response.json();

  if (!Number.isFinite(Number(result.credit_score))) {
    throw new Error("Prediction response was invalid.");
  }

  const score = Math.max(0, Math.min(100, Number(result.credit_score)));
  const risk = normalizeRisk(score, result.risk_category);
  const recommendedAmount =
    result.recommended_loan_amount !== undefined
      ? Number(result.recommended_loan_amount)
      : calculateRecommendedAmount(data, score);

  return {
    credit_score: Math.round(score),
    risk_category: risk,
    recommendation: result.recommendation || getEligibility(score, risk),
    recommended_loan_amount: Math.max(0, Math.round(recommendedAmount))
  };
}

function getLocalAssessments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLocalAssessments() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
}

async function loadAssessments() {
  if (isSupabaseConfigured() && currentUser) {
    try {
      const { data, error } = await supabaseClient
        .from("farmer_assessments")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      assessments = data || [];
      return;
    } catch {
      showToast("Unable to load cloud records. Local records are being used.", "warning");
    }
  }

  assessments = getLocalAssessments().filter(record => {
    return !currentUser || record.user_id === currentUser.id;
  });
}

async function saveAssessment(record) {
  if (isSupabaseConfigured() && currentUser) {
    const { data, error } = await supabaseClient
      .from("farmer_assessments")
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const localRecord = {
    ...record,
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    created_at: new Date().toISOString()
  };

  assessments.unshift(localRecord);
  saveLocalAssessments();
  return localRecord;
}

function collectFormData(form) {
  const formData = new FormData(form);
  const values = Object.fromEntries(formData.entries());

  return {
    farmer: {
      full_name: values.farmer_full_name,
      age: Number(values.age),
      gender: values.gender,
      phone: values.phone,
      region: values.region,
      district: values.district,
      location: values.location
    },
    farm: {
      farm_size: Number(values.farm_size),
      main_crop: values.main_crop,
      farming_experience: Number(values.farming_experience),
      annual_production: Number(values.annual_production),
      livestock_ownership: values.livestock_ownership,
      livestock_count: Number(values.livestock_count || 0),
      irrigation_access: values.irrigation_access,
      land_ownership: values.land_ownership,
      agricultural_equipment: values.agricultural_equipment
    },
    financial: {
      annual_income: Number(values.annual_income),
      existing_loan: Number(values.existing_loan || 0),
      previous_loan_history: values.previous_loan_history,
      previous_loan_amount: Number(values.previous_loan_amount || 0),
      loan_amount_requested: Number(values.loan_amount_requested),
      loan_purpose: values.loan_purpose,
      repayment_history: values.repayment_history,
      savings: Number(values.savings),
      monthly_expenses: Number(values.monthly_expenses),
      outstanding_debt: Number(values.outstanding_debt)
    },
    credit: {
      previous_credit_experience: values.previous_credit_experience
    },
    additional: {
      cooperative_membership: values.cooperative_membership,
      market_access: values.market_access,
      agricultural_insurance: values.agricultural_insurance,
      extension_service_access: values.extension_service_access
    }
  };
}

function validateFinancialData(data) {
  const financial = data.financial;

  if (financial.annual_income < 0 ||
      financial.existing_loan < 0 ||
      financial.previous_loan_amount < 0 ||
      financial.loan_amount_requested <= 0 ||
      financial.savings < 0 ||
      financial.monthly_expenses < 0 ||
      financial.outstanding_debt < 0) {
    throw new Error("Please enter valid non-negative financial values.");
  }

  if (data.farmer.age < 18 || data.farmer.age > 100) {
    throw new Error("Farmer age must be between 18 and 100.");
  }

  if (data.farm.farm_size <= 0) {
    throw new Error("Farm size must be greater than zero.");
  }
}

function assessmentRecord(data, prediction) {
  const score = Math.round(Number(prediction.credit_score));
  const risk = normalizeRisk(score, prediction.risk_category);
  const recommendedAmount =
    Number(prediction.recommended_loan_amount) ||
    calculateRecommendedAmount(data, score);

  return {
    user_id: currentUser?.id || "local-user",
    farmer: data.farmer,
    farm: data.farm,
    financial: data.financial,
    credit: data.credit,
    additional: data.additional,
    credit_score: score,
    risk_category: risk,
    recommendation: prediction.recommendation || getEligibility(score, risk),
    recommended_loan_amount: recommendedAmount,
    positive_factors: buildPositiveFactors(data, score),
    risk_factors: buildRiskFactors(data, score),
    summary: buildAssessmentSummary(data, score, risk, recommendedAmount),
    created_at: new Date().toISOString()
  };
}

function updateUserInterface() {
  if (!currentUser) return;

  const metadata = currentUser.user_metadata || {};
  const name = metadata.full_name || metadata.name || currentUser.email?.split("@")[0] || "User";
  const email = currentUser.email || "";

  $("#profileName").textContent = name;
  $("#profileEmail").textContent = email;
  $("#profileFullName").textContent = name;
  $("#profileFullEmail").textContent = email;
  $("#profileAvatar").textContent = getInitials(name);
  $("#profileLargeAvatar").textContent = getInitials(name);
}

function showApplication() {
  $("#authPage").classList.add("hidden");
  $("#application").classList.remove("hidden");
  updateUserInterface();
  navigateTo(location.hash.slice(1) || "dashboard");
}

function showAuthentication() {
  $("#application").classList.add("hidden");
  $("#authPage").classList.remove("hidden");
}

function navigateTo(viewName) {
  const validViews = ["dashboard", "assessment", "farmers", "results", "reports", "about", "contact", "profile"];
  const view = validViews.includes(viewName) ? viewName : "dashboard";

  $$(".view-panel").forEach(panel => {
    panel.classList.toggle("active", panel.dataset.view === view);
  });

  $$(".main-nav a[data-view-link]").forEach(link => {
    link.classList.toggle("active", link.dataset.viewLink === view);
  });

  const titles = {
    dashboard: ["Dashboard", "Your farmer credit portfolio at a glance."],
    assessment: ["Farmer Assessment", "Create a complete agricultural credit profile."],
    farmers: ["Farmer History", "Review completed farmer assessments."],
    results: ["Credit Results", "Review the selected AI credit assessment."],
    reports: ["Reports", "Download professional credit reports."],
    about: ["About", "Responsible agricultural credit assessment."],
    contact: ["Contact", "Connect with the AI Farmer Credit Scorer team."],
    profile: ["Profile", "Manage your account information."]
  };

  $("#pageTitle").textContent = titles[view][0];
  $("#pageSubtitle").textContent = titles[view][1];

  if (view === "dashboard") renderDashboard();
  if (view === "farmers") renderFarmersTable();
  if (view === "reports") renderReports();
  if (view === "results") renderActiveResult();

  location.hash = view;
  $("#mainNav").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderDashboard() {
  const total = assessments.length;
  const low = assessments.filter(item => item.risk_category === "Low Risk").length;
  const medium = assessments.filter(item => item.risk_category === "Medium Risk").length;
  const high = assessments.filter(item => item.risk_category === "High Risk").length;

  const average = total
    ? Math.round(assessments.reduce((sum, item) => sum + Number(item.credit_score || 0), 0) / total)
    : 0;

  const recommended = assessments.reduce(
    (sum, item) => sum + Number(item.recommended_loan_amount || 0),
    0
  );

  $("#totalFarmers").textContent = total;
  $("#lowRiskCount").textContent = low;
  $("#mediumRiskCount").textContent = medium;
  $("#highRiskCount").textContent = high;
  $("#averageScore").textContent = average;
  $("#totalRecommended").textContent = formatCurrency(recommended);

  const max = Math.max(total, 1);
  $("#lowBar").style.width = `${(low / max) * 100}%`;
  $("#mediumBar").style.width = `${(medium / max) * 100}%`;
  $("#highBar").style.width = `${(high / max) * 100}%`;
  $("#lowChartValue").textContent = low;
  $("#mediumChartValue").textContent = medium;
  $("#highChartValue").textContent = high;

  const recent = assessments.slice(0, 5);

  $("#recentAssessments").innerHTML = recent.length
    ? recent.map(item => `
      <div>
        <span>
          <strong>${escapeHtml(item.farmer.full_name)}</strong>
          <small>${escapeHtml(item.farmer.location)} · ${formatDate(item.created_at)}</small>
        </span>
        <span class="risk-badge ${riskClass(item.risk_category)}">${escapeHtml(item.risk_category)}</span>
      </div>
    `).join("")
    : `<p class="muted">No completed assessments yet.</p>`;
}

function renderFarmersTable() {
  const search = ($("#farmerSearch")?.value || "").toLowerCase().trim();

  const filtered = assessments.filter(item => {
    const name = item.farmer.full_name.toLowerCase();
    const location = item.farmer.location.toLowerCase();
    return name.includes(search) || location.includes(search);
  });

  $("#farmersTableBody").innerHTML = filtered.length
    ? filtered.map(item => `
      <tr>
        <td><strong>${escapeHtml(item.farmer.full_name)}</strong></td>
        <td>${escapeHtml(item.farmer.location)}</td>
        <td><strong>${item.credit_score} / 100</strong></td>
        <td><span class="risk-badge ${riskClass(item.risk_category)}">${escapeHtml(item.risk_category)}</span></td>
        <td>${formatCurrency(item.financial.loan_amount_requested)}</td>
        <td>${escapeHtml(item.recommendation)}</td>
        <td>${formatDate(item.created_at)}</td>
        <td><button class="table-action" data-open-assessment="${escapeHtml(item.id)}">View</button></td>
      </tr>
    `).join("")
    : `<tr><td colspan="8">No farmer records found.</td></tr>`;

  $$("[data-open-assessment]").forEach(button => {
    button.addEventListener("click", () => {
      const record = assessments.find(item => String(item.id) === button.dataset.openAssessment);
      if (record) {
        activeAssessment = record;
        localStorage.setItem(ACTIVE_RESULT_KEY, JSON.stringify(record));
        navigateTo("results");
      }
    });
  });
}

function renderReports() {
  $("#reportList").innerHTML = assessments.length
    ? assessments.map(item => `
      <div class="report-row">
        <span>
          <strong>${escapeHtml(item.farmer.full_name)}</strong>
          <small>${escapeHtml(item.farmer.location)} · ${formatDate(item.created_at)} · Score ${item.credit_score}/100</small>
        </span>
        <button class="button button-secondary" data-download-report="${escapeHtml(item.id)}">Download PDF</button>
      </div>
    `).join("")
    : `<p class="muted">No reports are available yet.</p>`;

  $$("[data-download-report]").forEach(button => {
    button.addEventListener("click", () => {
      const record = assessments.find(item => String(item.id) === button.dataset.downloadReport);
      if (record) downloadPdfReport(record);
    });
  });
}

function renderActiveResult() {
  if (!activeAssessment) {
    try {
      activeAssessment = JSON.parse(localStorage.getItem(ACTIVE_RESULT_KEY));
    } catch {
      activeAssessment = null;
    }
  }

  if (!activeAssessment) {
    $("#emptyResult").classList.remove("hidden");
    $("#resultContent").classList.add("hidden");
    return;
  }

  $("#emptyResult").classList.add("hidden");
  $("#resultContent").classList.remove("hidden");

  const record = activeAssessment;
  const name = record.farmer.full_name;
  const risk = normalizeRisk(record.credit_score, record.risk_category);

  $("#resultFarmerName").textContent = name;
  $("#resultFarmerName2").textContent = name;
  $("#resultMeta").textContent = `${record.farmer.location} · ${formatDate(record.created_at)}`;
  $("#resultLocation").textContent = record.farmer.location;
  $("#resultScore").textContent = record.credit_score;
  $("#resultRisk").textContent = risk;
  $("#resultRisk").className = `risk-badge ${riskClass(risk)}`;
  $("#resultEligibility").textContent = record.recommendation;
  $("#resultRecommended").textContent = formatCurrency(record.recommended_loan_amount);
  $("#resultPurpose").textContent = record.financial.loan_purpose;
  $("#resultDate").textContent = formatDate(record.created_at);

  const score = Math.max(0, Math.min(100, Number(record.credit_score)));
  const color = risk === "High Risk" ? "var(--red)" : risk === "Medium Risk" ? "var(--gold)" : "var(--green)";
  $("#scoreCircle").style.background = `conic-gradient(${color} 0 ${score}%, var(--mint) ${score}% 100%)`;

  $("#positiveFactors").innerHTML = record.positive_factors
    .map(factor => `<li>${escapeHtml(factor)}</li>`)
    .join("");

  $("#riskFactors").innerHTML = record.risk_factors
    .map(factor => `<li>${escapeHtml(factor)}</li>`)
    .join("");

  $("#assessmentSummary").textContent = record.summary;
}

function createPdfRow(label, value) {
  return [label, String(value ?? "—")];
}

function downloadPdfReport(record = activeAssessment) {
  try {
    if (!record || !window.jspdf) {
      showToast("PDF generation is not available.", "error");
      return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const name = record.farmer.full_name;
    const risk = normalizeRisk(record.credit_score, record.risk_category);

    pdf.setFillColor(7, 31, 21);
    pdf.rect(0, 0, 210, 30, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text("AI FARMER CREDIT SCORER", 14, 13);
    pdf.setFontSize(10);
    pdf.text("Farmer Credit Assessment Report", 14, 22);

    pdf.setTextColor(20, 35, 25);
    pdf.setFontSize(13);
    pdf.text(`Credit Assessment for ${name}`, 14, 42);

    const farmerRows = [
      createPdfRow("Actual Farmer Full Name", record.farmer.full_name),
      createPdfRow("Age", record.farmer.age),
      createPdfRow("Gender", record.farmer.gender),
      createPdfRow("Phone", record.farmer.phone),
      createPdfRow("Region", record.farmer.region),
      createPdfRow("District", record.farmer.district),
      createPdfRow("Location", record.farmer.location)
    ];

    const farmRows = [
      createPdfRow("Farm Size", `${record.farm.farm_size} hectares`),
      createPdfRow("Main Crop", record.farm.main_crop),
      createPdfRow("Farming Experience", `${record.farm.farming_experience} years`),
      createPdfRow("Annual Production", `${record.farm.annual_production} kg`),
      createPdfRow("Livestock Ownership", record.farm.livestock_ownership),
      createPdfRow("Number of Livestock", record.farm.livestock_count),
      createPdfRow("Irrigation Access", record.farm.irrigation_access),
      createPdfRow("Land Ownership", record.farm.land_ownership),
      createPdfRow("Agricultural Equipment", record.farm.agricultural_equipment)
    ];

    const financialRows = [
      createPdfRow("Annual Income", formatCurrency(record.financial.annual_income)),
      createPdfRow("Existing Loan", formatCurrency(record.financial.existing_loan)),
      createPdfRow("Previous Loan History", record.financial.previous_loan_history),
      createPdfRow("Previous Loan Amount", formatCurrency(record.financial.previous_loan_amount)),
      createPdfRow("Loan Amount Requested", formatCurrency(record.financial.loan_amount_requested)),
      createPdfRow("Loan Purpose", record.financial.loan_purpose),
      createPdfRow("Repayment History", record.financial.repayment_history),
      createPdfRow("Savings", formatCurrency(record.financial.savings)),
      createPdfRow("Monthly Expenses", formatCurrency(record.financial.monthly_expenses)),
      createPdfRow("Outstanding Debt", formatCurrency(record.financial.outstanding_debt))
    ];

    const assessmentRows = [
      createPdfRow("Credit Score", `${record.credit_score} / 100`),
      createPdfRow("Risk Level", risk),
      createPdfRow("Loan Eligibility", record.recommendation),
      createPdfRow("Recommended Loan Amount", formatCurrency(record.recommended_loan_amount)),
      createPdfRow("Assessment Date", formatDate(record.created_at)),
      createPdfRow("Positive Factors", record.positive_factors.join("; ")),
      createPdfRow("Risk Factors", record.risk_factors.join("; ")),
      createPdfRow("Assessment Summary", record.summary)
    ];

    let y = 50;

    const addTable = (title, rows) => {
      pdf.setTextColor(15, 66, 45);
      pdf.setFontSize(12);
      pdf.text(title, 14, y);
      y += 4;

      pdf.autoTable({
        startY: y,
        body: rows,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 3,
          textColor: [30, 40, 32]
        },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 58 },
          1: { cellWidth: 125 }
        },
        headStyles: {
          fillColor: [228, 243, 233],
          textColor: [15, 66, 45]
        },
        margin: { left: 14, right: 14 }
      });

      y = pdf.lastAutoTable.finalY + 11;

      if (y > 265) {
        pdf.addPage();
        y = 18;
      }
    };

    addTable("Farmer Information", farmerRows);
    addTable("Farm Information", farmRows);
    addTable("Financial Information", financialRows);
    addTable("Credit Assessment", assessmentRows);

    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      "This report is a decision-support document and is not a final lending decision.",
      14,
      287
    );

    pdf.save(`AI-Farmer-Credit-Report-${slugifyName(name)}.pdf`);
    showToast("PDF report downloaded.");
  } catch {
    showToast("Failed to generate the PDF report.", "error");
  }
}

async function handleAssessmentSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const message = $("#assessmentMessage");
  clearFormMessage(message);

  if (!form.reportValidity()) {
    showFormMessage(message, "Please complete all required farmer, farm, financial, and credit fields.");
    return;
  }

  const submitButton = form.querySelector("button[type=submit]");
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Calculating...";

  try {
    const data = collectFormData(form);
    validateFinancialData(data);

    const prediction = await callPredictionApi(data);
    const record = assessmentRecord(data, prediction);
    const saved = await saveAssessment(record);

    activeAssessment = { ...record, ...saved };
    localStorage.setItem(ACTIVE_RESULT_KEY, JSON.stringify(activeAssessment));

    await loadAssessments();
    renderActiveResult();
    navigateTo("results");
    showToast("Credit assessment completed successfully.");
    form.reset();
  } catch (error) {
    showFormMessage(message, error.message || "Unable to complete the assessment.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const email = $("#loginEmail").value.trim();
  const password = $("#loginPassword").value;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast("Please enter a valid email address.", "error");
    return;
  }

  if (!password) {
    showToast("Please enter your password.", "error");
    return;
  }

  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      currentUser = data.user;
    } else {
      const localUser = JSON.parse(localStorage.getItem("ai_farmer_demo_user") || "null");

      if (!localUser || localUser.email !== email || localUser.password !== password) {
        throw new Error("Incorrect email or password.");
      }

      currentUser = {
        id: localUser.id,
        email: localUser.email,
        user_metadata: { full_name: localUser.name }
      };
    }

    await loadAssessments();
    showApplication();
    showToast("Login successful.");
  } catch {
    showToast("Authentication failed. Check your email and password.", "error");
  }
}

async function handleSignup(event) {
  event.preventDefault();

  const name = $("#signupName").value.trim();
  const email = $("#signupEmail").value.trim();
  const password = $("#signupPassword").value;
  const confirmPassword = $("#signupConfirmPassword").value;

  if (name.length < 2) {
    showToast("Please enter your full name.", "error");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast("Please enter a valid email address.", "error");
    return;
  }

  if (password.length < 8) {
    showToast("Password must contain at least 8 characters.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match.", "error");
    return;
  }

  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });

      if (error) throw error;

      if (!data.session) {
        showToast("Account created. Check your email to confirm your account.", "success");
        switchAuthTab("login");
        return;
      }

      currentUser = data.user;
    } else {
      const user = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        name,
        email,
        password
      };

      localStorage.setItem("ai_farmer_demo_user", JSON.stringify(user));
      currentUser = {
        id: user.id,
        email: user.email,
        user_metadata: { full_name: user.name }
      };
    }

    await loadAssessments();
    showApplication();
    showToast("Account created successfully.");
  } catch {
    showToast("Account creation failed. Please try again.", "error");
  }
}

async function handleForgotPassword() {
  const email = $("#loginEmail").value.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast("Enter your email address first.", "error");
    return;
  }

  if (!isSupabaseConfigured()) {
    showToast("Password reset requires Supabase configuration.", "warning");
    return;
  }

  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });

    if (error) throw error;
    showToast("Password reset instructions have been sent.");
  } catch {
    showToast("Unable to send password reset instructions.", "error");
  }
}

async function handleGoogleLogin() {
  if (!isSupabaseConfigured()) {
    showToast("Google authentication requires Supabase configuration.", "warning");
    return;
  }

  if (!FRONTEND_CONFIG.GOOGLE_CLIENT_ID ||
      FRONTEND_CONFIG.GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID") {
    showToast("Configure YOUR_GOOGLE_CLIENT_ID in the deployment environment.", "warning");
  }

  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) throw error;
  } catch {
    showToast("Google authentication could not be started.", "error");
  }
}

async function logout() {
  try {
    if (isSupabaseConfigured()) {
      await supabaseClient.auth.signOut();
    }
  } finally {
    currentUser = null;
    assessments = [];
    activeAssessment = null;
    localStorage.removeItem(ACTIVE_RESULT_KEY);
    showAuthentication();
    showToast("You have been logged out.");
  }
}

async function submitContactForm(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const message = $("#contactMessage");

  if (!form.reportValidity()) {
    showFormMessage(message, "Please complete all contact fields.");
    return;
  }

  const values = Object.fromEntries(new FormData(form).entries());

  try {
    if (isSupabaseConfigured()) {
      const { error } = await supabaseClient
        .from("contact_messages")
        .insert({
          ...values,
          user_id: currentUser?.id || null
        });

      if (error) throw error;
    } else {
      const messages = JSON.parse(localStorage.getItem("ai_farmer_contact_messages") || "[]");
      messages.unshift({
        ...values,
        created_at: new Date().toISOString()
      });
      localStorage.setItem("ai_farmer_contact_messages", JSON.stringify(messages));
    }

    form.reset();
    showFormMessage(message, "Message sent successfully.", "success");
  } catch {
    showFormMessage(message, "Unable to send the message. Please try again.");
  }
}

function switchAuthTab(tab) {
  $$(".auth-tabs button").forEach(button => {
    button.classList.toggle("active", button.dataset.authTab === tab);
  });

  $("#loginForm").classList.toggle("hidden", tab !== "login");
  $("#signupForm").classList.toggle("hidden", tab !== "signup");
}

async function initializeSupabase() {
  if (!isSupabaseConfigured() || !window.supabase) return;

  supabaseClient = window.supabase.createClient(
    FRONTEND_CONFIG.SUPABASE_URL,
    FRONTEND_CONFIG.SUPABASE_PUBLISHABLE_KEY
  );

  const { data } = await supabaseClient.auth.getSession();

  if (data.session?.user) {
    currentUser = data.session.user;
    await loadAssessments();
    showApplication();
  }

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUser = session?.user || null;

    if (currentUser) {
      await loadAssessments();
      showApplication();
    } else {
      showAuthentication();
    }
  });
}

function bindEvents() {
  $$("[data-auth-tab]").forEach(button => {
    button.addEventListener("click", () => switchAuthTab(button.dataset.authTab));
  });

  $$("[data-toggle-password]").forEach(button => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.togglePassword);
      input.type = input.type === "password" ? "text" : "password";
      button.textContent = input.type === "password" ? "Show" : "Hide";
    });
  });

  $$("[data-view-link]").forEach(element => {
    element.addEventListener("click", event => {
      event.preventDefault();
      navigateTo(element.dataset.viewLink);
    });
  });

  $("#loginForm").addEventListener("submit", handleLogin);
  $("#signupForm").addEventListener("submit", handleSignup);
  $("#forgotPasswordButton").addEventListener("click", handleForgotPassword);
  $("#googleLoginButton").addEventListener("click", handleGoogleLogin);
  $("#logoutButton").addEventListener("click", logout);
  $("#navProfileButton").addEventListener("click", () => navigateTo("profile"));
  $("#assessmentForm").addEventListener("submit", handleAssessmentSubmit);
  $("#contactForm").addEventListener("submit", submitContactForm);
  $("#downloadPdfButton").addEventListener("click", () => downloadPdfReport());

  $("#farmerSearch").addEventListener("input", renderFarmersTable);

  $("#mobileMenuButton").addEventListener("click", () => {
    $("#mainNav").classList.toggle("open");
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  bindEvents();
  await initializeSupabase();

  if (!currentUser) {
    showAuthentication();
  }

  window.addEventListener("hashchange", () => {
    if (currentUser) navigateTo(location.hash.slice(1) || "dashboard");
   

  });
});
