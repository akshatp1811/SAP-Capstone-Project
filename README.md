# SAP Record-to-Report (R2R) Project Report — KIIT 2024–25
**Vinayak Associate, Lucknow** | SAP BTP Developer | Topic 3 of 6

---

## Organisation Details

| Attribute | Details |
|---|---|
| Organisation | Vinayak Associate, Lucknow, U.P. — 226001 |
| Specialization | SAP BTP Developer — FI/CO + BTP Extension |
| Academic Year | 2024–2025 MBA / BBA Finance |
| Topic | R2R Financial Close — Topic 3 of 6 |
| SCOPE | SAP S/4HANA 2023 │ FI-GL · FI-AR · FI-AP · FI-AA · CO-CCA · CO-PCA │ BTP: CAP · Integration Suite · HANA Cloud · Workflow Management · Build Apps |

---

## About This Report

This project report documents the SAP Record-to-Report (R2R) process for Vinayak Associate — a fictitious trading and consulting firm in Lucknow, U.P. It is structured across seven pages covering company setup, Chart of Accounts design, sub-ledger configuration, Controlling module setup, month-end close procedures, year-end close activities, and the SAP BTP Developer extension layer. Prepared under KIIT SAP Project Work, it follows the end-to-end scenario approach (Option 2) for Topic 3 — Record-to-Report, with specialisation in SAP BTP Development.

| Attribute | Details |
|---|---|
| Process Name | Record-to-Report (R2R) — Month-End & Year-End Financial Close |
| SAP System | SAP S/4HANA 2023 (On-Premise / Private Cloud) |
| Primary Modules | FI-GL, FI-AR, FI-AP, FI-AA, CO-CCA, CO-PCA, CO-PA |
| BTP Services | CAP, Integration Suite, HANA Cloud, Workflow Mgmt., Build Apps, Alert Notification |
| Compliance | Ind AS, Companies Act 2013, Income Tax Act, GST Act |
| Reporting | Ind AS Schedule III B/S & P&L, Ind AS 7 (Cash Flow), IFRS (Parallel) |
| Close Target | Month-End: 4 Calendar Days │ Year-End: 15 Calendar Days |

---

## 1. Company Blueprint — Vinayak Associate

The company blueprint defines legal, organisational, and logistics entities mapping real-world business structures into SAP. For Vinayak Associate — a multi-branch trading and consulting firm — it is designed to support multi-ledger accounting, inter-branch cost allocation, and SAP BTP cloud extensions.

| Parameter | Detail | SAP Object | Value |
|---|---|---|---|
| Company Name | Vinayak Associate | Chart of Accounts | VKCA — 6-digit scheme |
| Company Code / CA | VK01 / VK01 | FY Variant | V3 — Apr–Mar + 4 Spl. Periods |
| Location | Lucknow, U.P. — 226001 | Post./Field Status Var. | VK01 / VKFS |
| Branches | Kanpur │ Varanasi │ Delhi NCR | Leading / Parallel Ledger | 0L — Ind AS │ 2L — IFRS |
| Industry | Trading, Consulting & Fin. Svcs | Plants | VKP1 Lucknow │ VKP2 Kanpur |
| Currency / FY | INR │ April 1 – March 31 | Sales / Purch. Org. | VKSO │ VKPO (Centralised) |
| Legal Form / CIN | Pvt. Ltd. │ U74999UP2016PTC083421 | Credit Control Area | VK01 — Vinayak Credit Control |

---

## 2. Chart of Accounts & GL Configuration

CoA VKCA follows Ind AS Schedule III (Companies Act 2013) with a 6-digit numbering convention. GL accounts are classified by type (Asset, Liability, Revenue, Expense) for automatic financial statement generation. Key T-Codes: OB13 → OB62 → OB29 → OB37 → OBBO → OB52. Parallel Ledgers: 0L (Ind AS / INR) as leading ledger; 2L (IFRS / INR+USD) as non-leading — with IFRS 16 lease, IAS 19 benefit provisions, and fair value adjustments posting selectively to Ledger 2L via T-Code FINSC_LEDGER / FINSC_LD_GRP.

| Account Range | Account Class | SAP Type | Key Examples |
|---|---|---|---|
| 100000–149999 | Fixed Assets | Asset (A) | Land, Buildings, IT Equipment, Vehicles |
| 150000–199999 | Current Assets | Asset (A) | Cash, Bank, AR, Inventory, Prepaid Expenses |
| 200000–249999 | Capital & Reserves | Liability (P) | Share Capital, Retained Earnings, General Reserve |
| 250000–299999 | Non-Current Liabilities | Liability (P) | Long-term Loans, Deferred Tax Liability |
| 300000–349999 | Current Liabilities | Liability (P) | Trade Creditors, GST Payable, Provisions |
| 400000–499999 | Revenue Accounts | Revenue (X) | Trading Income, Consulting Fees, Other Income |
| 500000–699999 | Operating Expenses | Expense (K) | COGS, Salaries, Rent, Depreciation, Admin Costs |
| 700000–799999 | Financial Items | Both | Interest Exp/Income, FX Gain/Loss, Bank Charges |

---

## 3. Sub-Ledger & Controlling Configuration

Sub-ledgers (AR, AP, AA) always reconcile in real-time with corresponding GL reconciliation accounts. The CO module provides cost centre tracking, profit centre P&L, overhead allocation, and profitability analysis.

### 3.1 Accounts Receivable (FI-AR)

Account group CUST, number range 200000–299999, reconciliation GL 150010. Payment terms VK30/VK45 (Net 30/45 days). Dunning procedure VKDP with 4 escalation levels — Level 1 at 7 days (reminder), Level 2 at 14 days (formal notice), Level 3 at 21 days (final notice with charges), Level 4 at 30 days (legal escalation) — executed via T-Code F150. FX revaluation of open USD items at month-end via F.05.

### 3.2 Accounts Payable (FI-AP)

Account group VEND, reconciliation GL 300010. Auto Payment Program F110 configured with House Bank VKBI (SBI Lucknow, A/c: 987654321001), supporting NEFT/RTGS/Cheque. GR/IR clearing via MR11 monthly to match open goods receipts against outstanding invoices.

### 3.3 Fixed Asset Accounting (FI-AA)

| Class | Description | Depreciation | GL Acct | Notes |
|---|---|---|---|---|
| Class 1000 | Land | Not Depreciated | 120010 | Freehold — not subject to wear |
| Class 2000 | Buildings | SLM 5% / 20 yrs | 120020 | Office premises Lucknow & Kanpur |
| Class 3000 | Office Equipment | SLM 33.33% / 3 yrs | 120030 | Printers, scanners, furniture |
| Class 4000 | Vehicles | WDV 25.89% | 120040 | Company cars & delivery vehicles |
| Class 5000 | Computers & IT | SLM 33.33% / 3 yrs | 120050 | Laptops, servers, network equipment |
| Class 9000 | Assets Under Construction | No Depreciation | 120090 | Capitalised once project is complete |

Three depreciation areas activated via OADB: Area 01 (Ind AS), Area 15 (IFRS), Area 20 (Income Tax Act). GL assignment via AO90. Monthly depreciation run: AFAB. AUC capitalisation: AIAB/AIBU.

### 3.4 Controlling (CO) Module

Cost Centre Hierarchy VNKAS_HIER: VNK-CORP (Finance/HR/IT), VNK-TRADE (Lucknow/Kanpur), VNK-CONSULT, VNK-FINSERV, VNK-ADMIN. Profit Centres: PC-TRADE │ PC-CONSULT │ PC-FINSERV. Key T-Codes: OKKP/OX19 → KS01/KSH1 → KCH1/KE51 → KA01/KA06 → OKB9 → OKP1. Default PC substitution on balance sheet accounts via T-Code 3KEH.

---

## 4. Month-End Closing — Step-by-Step Process

The Month-End Close (MEC) targets a 4-calendar-day cycle managed via SAP Financial Closing Cockpit (FCCX), assigning tasks to responsible users with real-time status tracking and a full digital audit trail.

**Timeline:** Day –1: Pre-close prep → Day 0: Month-end → Day +1: FI Sub-ledger close → Day +2: CO close → Day +3: Reporting & sign-off

### Phase 1 — Pre-Close Preparation (Day –1)

| # | Activity | T-Code | Mod. | Responsible |
|---|---|---|---|---|
| P1 | Review & Clear GR/IR Clearing Account | MR11 | FI-MM | AP & Procurement Team |
| P2 | Automatic Clearing of Open Items + Post Accruals | F.13 / FBS1 | FI-GL | Finance Team |
| P3 | Verify Zero Intercompany Balances + Confirm No Parked Docs | FAGLB03 / FBV0 | FI-GL | Finance Controller |

### Phase 2 — FI Sub-Ledger Closing (Day 0 – Day +1)

| # | Activity | T-Code | Mod. | Responsible |
|---|---|---|---|---|
| F1 | FX Revaluation — Open AR Items (USD/EUR) | F.05 | FI-GL | Finance Controller |
| F2 | FX Revaluation — Open AP Items | F.07 | FI-AP | AP Team |
| F3 | Post Provision for Doubtful Debts + Dunning Run | F-02 / F150 | FI-AR | AR Team |
| F4 | Auto Payment Run NEFT/RTGS + Bank Statement Upload & Post | F110 / FF_5 / FEBP | FI-AP / Bank | AP & Treasury |
| F5 | Monthly Depreciation Posting + Sub-Ledger Reconciliation to GL | AFAB / FAGLB03 | FI-AA / GL | Asset Accountant |

### Phase 3 — CO Module Closing (Day +1 – Day +2)

| # | Activity | T-Code | Mod. | Responsible |
|---|---|---|---|---|
| C1 | Calculate WIP on Open Orders + Cost Variances | KKAX / KKS1 | CO-PC | Costing Team |
| C2 | Settle Internal Orders to Cost Centres | KO88 | CO | Finance Controller |
| C3 | Run Overhead Assessment + Distribution Cycles | KSU5 / KSV5 | CO-CCA | Mgmt. Accounting |
| C4 | Transfer Actual Costs to CO-PA + Lock Controlling Area | KE5T / OKP1 | CO-PA / CO | Mgmt. Accounting |

### Phase 4 — GL Closing & Period Lock (Day +2 – Day +3)

| # | Activity | T-Code | Mod. | Responsible |
|---|---|---|---|---|
| G1 | Post Remaining Manual Journal Entries + Review Trial Balance | FB50 / F.01 | FI-GL | Finance Controller |
| G2 | Generate B/S & P&L + Close Posting Period | S_ALR_87012284 / OB52 | FI-GL | CFO / Finance Head |

---

## 5. Year-End Closing — Step-by-Step Process

The Year-End Close (YEC) occurs at 31 March, encompassing all MEC Period 12 activities plus statutory, regulatory, and accounting steps unique to year-end. Compliance with Companies Act 2013, Income Tax Act, and Ind AS is mandatory.

**Key Dates:** FY End: 31 March │ Carryforward Target: 15 April │ Board Approval: 30 June │ Statutory Audit Sign-Off: 30 September

| # | Activity | T-Code | Mod. | Responsible |
|---|---|---|---|---|
| Y01 | Complete Final Month-End Close — Period 12 (March) | Multiple | FI/CO | Finance Controller |
| Y02 | FX Revaluation — All Open Items at 31 March Rate | FAGL_FC_VAL | FI-GL | Finance Controller |
| Y03 | Post Tax Provision & Deferred Tax + Employee Benefits (Gratuity/Leave) | FB50 | FI-GL | Tax / HR Finance |
| Y04 | Physical Inventory — Freeze → Post Differences → NRV Write-Down | MI01 / MI04 / MI07 | MM/FI | Stores & Finance |
| Y05 | Final Settlement Internal Orders + CO Assessment/Distribution Cycles | KO88 / KSU5 | CO | Mgmt. Accounting |
| Y06 | Profit Centre Year-End Closing Entry — Retained Earnings | 9KE0 | CO-PCA | Mgmt. Accounting |
| Y07 | Open Special Periods 13–16 → Post Audit/Tax/IFRS Adjustments → Close | OB52 / FB50 | FI-GL | Finance Controller |
| Y08 | New GL Balance Carryforward + AR/AP Carryforward | FAGLGVTR / F.07 | FI-GL | Finance Controller |
| Y09 | AA Year-End Close + Open New Fiscal Year | AJAB / AJRW | FI-AA | Asset Accountant |
| Y10 | Generate Final Audited Statements + Lock Prior FY + Archive | F.01 / OB52 / SARA | FI-GL | CFO / Compliance |

### Special Posting Periods (13–16)

| Period | Purpose | Detail & Statutory Basis |
|---|---|---|
| Period 13 | Statutory Audit Adjustments | External audit corrections, prior-period rectifications per Ind AS 8 |
| Period 14 | Income Tax Audit (Sec. 44AB) | Deferred tax revisions, transfer pricing adjustments |
| Period 15 | Group Consolidation & IFRS | Intercompany eliminations, IFRS vs. Ind AS reconciliation |
| Period 16 | Board / Management Approvals | Exceptional items, Board-approved corrections & reclassifications |

T-Code FAGLGVTR carries all B/S balances to Period 0 of the new FY; P&L accounts reset to zero; net profit/loss transfers to Retained Earnings GL 200050. Asset Accounting: AJAB (close) + AJRW (open new year).

---

## 6. SAP BTP Developer Extension — Financial Close Suite

The BTP Extension Suite builds cloud-native applications on SAP BTP without modifying the S/4HANA core (Clean Core principle). BTP Stack: SAP CAP (Node.js) │ Integration Suite (CPI) │ HANA Cloud │ Build Apps │ Workflow Management │ XSUAA / SAP IAS │ Alert Notification.

| Application | Description & Key Features |
|---|---|
| App 1 — Financial Close Cockpit (Fiori + CAP) | Custom Fiori Elements (List Report + Object Page) on BTP HTML5 Repository. CAP Node.js OData V4 backend reading from FCCX + HANA Cloud tables. XSUAA roles: CLOSE_VIEWER / CLOSE_EXECUTOR / CLOSE_APPROVER. Features: RAG status, S/4HANA deep-links, Gantt timeline, CFO PDF export. |
| App 2 — JE Approval Workflow (BTP Workflow Mgmt.) | All manual JEs > INR 1,00,000 require dual-control digital approval. Integration Suite iFlow detects parked document (FBV1) via RFC → starts Workflow → assigns User Task in Fiori My Inbox → posts document via OData API on approval. Full approval trail retained as audit evidence. |
| App 3 — Bank Statement Integration (Integration Suite) | Timer-triggered iFlow at 08:00 IST connects to SBI Corporate API (OAuth 2.0), retrieves bank statement, transforms SBI JSON → MT940 via Groovy script, sends to S/4HANA via IDoc Adapter (FINSTA01) — replacing manual FF_5 upload. Alert Notification on failure. |
| App 4 — Close Status Mobile App (SAP Build Apps) | PWA on BTP HTML5 Repository for branch managers without SAP GUI access. Authenticated via SAP IAS (SSO). Consumes same CAP OData V4 API as Close Cockpit. Features: period selector, RAG dashboard, overdue push notifications. |
| App 5 — Close Analytics Dashboard (HANA Cloud) | Delta-load iFlows replicate close data to HANA Cloud. Calculation View CV_CLOSE_KPI_DASHBOARD aggregates six KPIs consumed by a Fiori analytical card on the CFO dashboard. |

### BTP KPI Dashboard Targets

| KPI | Definition | Target |
|---|---|---|
| Days-to-Close | Calendar days from period-end to CFO sign-off | ≤ 4 days |
| Journal Entry Volume | Count of manual JEs per period | Reduce 20% YoY |
| Rework Rate | % of posted JEs subsequently reversed | < 2% |
| JE Approval SLA | Time from FBV1 parking to Workflow approval | < 2 hours |
| Sub-Ledger Recon. Time | Sub-ledger close start to GL reconciliation sign-off | < 4 hours |
| Audit Findings | Statutory audit observations per financial year | Zero repeats |

---

## 7. FI Integration, Reports, T-Code Reference & Conclusion

### 7.1 FI-MM & FI-SD Integration

Every MM goods movement and SD billing document auto-generates FI postings via SAP Automatic Account Determination.

**FI-MM:** MIGO (Dr Inventory/Cr GR-IR, OBYC BSX+WRX) → MIRO (clears GR-IR/Cr Vendor) → MB1A (Dr COGS, OBYC GBB-VBR) → MI07 (Inventory Differences, OBYC INV) → MR11 (GR/IR month-end clearing).

**FI-SD:** VF01 (Dr Customer/Cr Revenue, VKOA ERE) → VL02N (Dr COGS/Cr Finished Goods, VKOA EIN) → F-29 (Down payment Spl. GL Indicator A) → F-32 (Cash discount auto-cleared on payment).

### 7.2 Key Financial Reports

| T-Code | Report & Purpose | Frequency |
|---|---|---|
| F.01 / S_ALR_87012284 | Balance Sheet & P&L (Ind AS Schedule III) | Monthly / Annual |
| S_ALR_87012271 | Cash Flow Statement — Indirect Method (Ind AS 7) | Annual |
| S_ALR_87012178 / 083 | AR Aging / AP Aging (0–30, 31–60, 61–90, 90+ days) | Monthly |
| S_ALR_87011963 | Fixed Asset Register — Cost, Accum. Dep., NBV, WDV | Monthly |
| S_ALR_87013611 | Cost Centre Actual vs. Plan — Variance Analysis | Monthly |
| S_ALR_87013336 | Profit Centre Divisional P&L — Trade/Consult/FS | Monthly |
| KE30 / FAGLB03 | CO-PA Contribution Margin │ GL Account Balances (New GL) | Monthly |

### 7.3 Master T-Code Quick Reference

| T-Code | Description | T-Code | Description |
|---|---|---|---|
| OB52 | Open / Close Posting Periods | AFAB | Periodic Depreciation Run |
| FAGLGVTR | New GL Balance Carryforward | AJAB / AJRW | AA Year-End Close & New Year |
| F.05 / F.07 | FX Revaluation AR / AP | F110 / F150 | Auto Payment Run / Dunning |
| FCCX | Financial Closing Cockpit | FF_5 / FEBP | Bank Statement Upload & Post |
| KSU5 / KSV5 | CO Assessment & Distribution | KO88 | Settle Internal Orders |
| MR11 / MI01-07 | GR/IR Clearing / Physical Inventory | SARA / DART | Archiving / Tax Audit Data |
| FB50 / FBS1 / FBV1 | GL JE, Accrual & Parked Docs | FBL3N / FBL5N / FBL1N | GL / Customer / Vendor Items |

---

## Conclusion

This report has presented a comprehensive, end-to-end documentation of the SAP Record-to-Report (R2R) process for Vinayak Associate, Lucknow. The document covered the full SAP FI/CO configuration stack — Chart of Accounts VKCA, parallel ledger setup (Ind AS + IFRS), AR/AP/Asset Accounting sub-ledgers, Controlling module with cost and profit centres, a structured 4-day month-end close across four phases, a 10-step year-end close with special period management, and a five-application SAP BTP Developer Extension Suite (Close Cockpit, JE Approval Workflow, Bank Statement Automation, Mobile Close App, and HANA Analytics Dashboard).

The SAP BTP layer applies the Clean Core principle — extending S/4HANA via cloud-native services without touching the core — reducing Days-to-Close from 7+ to 4 days, improving audit trail completeness, and delivering real-time financial close visibility to branch managers and CFO alike. The entire solution ensures full compliance with Ind AS, the Companies Act 2013, the Income Tax Act, and the GST Act.
