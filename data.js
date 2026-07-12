// SM Times — Edition Data
// Date: July 12, 2026
// Update this file to publish a new edition.

const EDITION = {
  date: "Saturday, July 12, 2026",
  dateISO: "2026-07-12",
  volume: "Vol. 1, No. 1",
  lastUpdated: "07:00 IST",
  nextRefresh: "19:00 IST",

  breakingNews: {
    active: true,
    text: "RBI holds repo rate at 6.25% in off-cycle assessment; MPC minutes signal data-dependent stance ahead of August review.",
    link: "#rbi-watch"
  },

  quoteOfDay: {
    text: "Risk comes from not knowing what you're doing.",
    author: "Warren Buffett",
    context: "On the nature of investment risk"
  },

  weeklyRecap: {
    active: true,
    headline: "Week in Review: Jul 7–12, 2026",
    points: [
      "RBI held rates steady; INR strengthened 0.4% vs USD on easing global risk-off",
      "US CPI printed at 2.8% YoY — closer to Fed target; rate cut expectations repriced to Sep 2026",
      "Nifty 50 gained 1.2% WoW; IT and Banking led; PSU Energy lagged",
      "NPCI reported UPI transaction volume crossed 18 billion for June 2026",
      "SEBI issued circular tightening F&O position limits for FPIs"
    ]
  },

  sections: [

    // ─────────────────────────────────────────────────────────────
    // SECTION 1: GLOBAL MACRO
    // ─────────────────────────────────────────────────────────────
    {
      id: "global-macro",
      number: "01",
      title: "Global Macro",
      icon: "🌐",
      stories: [
        {
          id: "us-cpi-june",
          headline: "US CPI Cools to 2.8% in June — Goldilocks or Fragile?",
          summary: "Core PCE and headline CPI both decelerated in June, narrowing the gap to the Fed's 2% target and reigniting debate on September rate cut timing.",
          whyItMatters: "A sustained decline in US inflation changes the global rate environment, affects dollar strength, and drives EM capital flows — including India. Every 25bps Fed cut historically correlates with ~$2–4B FII inflows into Indian equities within 30 days.",
          keyNumbers: [
            { label: "US CPI (Jun)", value: "2.8% YoY" },
            { label: "Core CPI (Jun)", value: "3.1% YoY" },
            { label: "Prior Month", value: "3.0% YoY" },
            { label: "Fed Target", value: "2.0%" },
            { label: "Fed Funds Rate", value: "5.25–5.50%" }
          ],
          marketImpact: "10Y US Treasury yield fell 8bps to 4.22%. Dollar Index (DXY) softened 0.3%. Gold moved up $18/oz. CME FedWatch now prices 68% probability of Sep cut.",
          indiaImpact: "INR appreciated to 83.2/USD. RBI may have more room to ease without triggering currency depreciation. FII net buyers of ₹3,200 Cr in equities on Friday.",
          globalImpact: "ECB and BOE policy trajectories now diverge less from Fed. EM central banks gain breathing room. China's PBOC may accelerate stimulus if USD weakens further.",
          source: "US Bureau of Labor Statistics",
          sourceUrl: "https://www.bls.gov/news.release/cpi.nr0.htm",
          readMoreUrl: "https://www.federalreserve.gov",
          tags: ["US", "Inflation", "Fed", "Rate Cuts"]
        },
        {
          id: "india-iip-may",
          headline: "India IIP Rises 5.9% in May — Manufacturing Leads Revival",
          summary: "Index of Industrial Production grew 5.9% YoY in May 2026, led by manufacturing (6.4%) and electricity generation (7.1%), signaling broad-based industrial recovery.",
          whyItMatters: "IIP is a high-frequency proxy for GDP momentum. Above-trend IIP combined with moderating WPI inflation creates the most favourable macro backdrop for Indian equities and credit in three years.",
          keyNumbers: [
            { label: "IIP Growth (May)", value: "+5.9% YoY" },
            { label: "Manufacturing", value: "+6.4% YoY" },
            { label: "Electricity", value: "+7.1% YoY" },
            { label: "Mining", value: "+3.8% YoY" },
            { label: "Prior Month", value: "+5.2% YoY" }
          ],
          marketImpact: "Positive for industrials, capital goods, and power sector. Cement and steel volumes corroborate. L&T, Siemens, ABB trading near 52W highs.",
          indiaImpact: "Supports RBI's view that growth is resilient despite tight monetary conditions. Reduces urgency for aggressive rate cuts. PLI scheme showing visible traction in electronics.",
          globalImpact: "Reinforces India's positioning as a viable China+1 manufacturing destination. Attracts re-shoring FDI from Japan, South Korea, and EU.",
          source: "MOSPI",
          sourceUrl: "https://mospi.gov.in",
          readMoreUrl: "https://mospi.gov.in/iip",
          tags: ["India", "IIP", "Manufacturing", "Growth"]
        },
        {
          id: "china-deflation",
          headline: "China CPI Turns Negative Again — Deflation Trap Deepens",
          summary: "China's Consumer Price Index fell -0.2% YoY in June 2026, the third consecutive negative print, signaling entrenched deflationary pressure despite PBOC stimulus.",
          whyItMatters: "A deflationary China exports price pressure globally — good for Indian importers of machinery and electronics, but dangerous for commodity exporters. It also compresses Chinese corporate profits, undermining their stock market and debt capacity.",
          keyNumbers: [
            { label: "China CPI (Jun)", value: "-0.2% YoY" },
            { label: "PPI (Jun)", value: "-2.1% YoY" },
            { label: "Retail Sales Growth", value: "+3.2% YoY" },
            { label: "Youth Unemployment", value: "18.4%" },
            { label: "PBOC 1Y LPR", value: "3.45%" }
          ],
          marketImpact: "Copper and iron ore under pressure. Chinese equities (CSI 300) down 1.8% on week. Commodities markets reassessing China demand outlook.",
          indiaImpact: "Imported deflation keeps India's WPI soft. IT companies with China exposure cautious. Risk of cheap Chinese goods flooding Indian markets — DGTR monitoring.",
          globalImpact: "Signals structural weakness in Chinese domestic demand. Calls into question 5% GDP growth target achievability. Watch for RRR cut from PBOC in coming weeks.",
          source: "National Bureau of Statistics China",
          sourceUrl: "https://www.stats.gov.cn/english/",
          readMoreUrl: "https://www.pboc.gov.cn",
          tags: ["China", "Deflation", "PBOC", "Commodities"]
        },
        {
          id: "eurozone-growth",
          headline: "Eurozone Q2 GDP Holds at 0.3% QoQ — Germany the Weak Link",
          summary: "Eurozone Q2 2026 GDP growth came in at 0.3% QoQ (flash estimate), but Germany contracted 0.1% for the second consecutive quarter, meeting the technical definition of recession.",
          whyItMatters: "Germany is Europe's industrial anchor. Its contraction reflects energy cost restructuring post-Ukraine crisis and weak export demand from China. ECB rate cut trajectory now more aggressive.",
          keyNumbers: [
            { label: "Eurozone GDP Q2", value: "+0.3% QoQ" },
            { label: "Germany GDP Q2", value: "-0.1% QoQ" },
            { label: "France GDP Q2", value: "+0.4% QoQ" },
            { label: "ECB Rate", value: "3.65%" },
            { label: "Eurozone CPI (Jun)", value: "2.5% YoY" }
          ],
          marketImpact: "EUR/USD softened. European bank stocks mixed. German Bund yields fell. ECB seen cutting in September.",
          indiaImpact: "Slower EU growth dampens demand for Indian IT services and exports. But weaker Euro could improve India's competitiveness in USD-priced exports.",
          globalImpact: "Eurozone structural divergence between north and south continues. German fiscal restraint (debt brake) constraining fiscal stimulus response.",
          source: "Eurostat",
          sourceUrl: "https://ec.europa.eu/eurostat",
          readMoreUrl: "https://www.ecb.europa.eu",
          tags: ["Europe", "GDP", "Germany", "ECB"]
        },
        {
          id: "japan-boj",
          headline: "BOJ Signals Gradual Policy Normalization Amid Wage Growth Surprise",
          summary: "Bank of Japan Governor Ueda indicated readiness to raise rates further in H2 2026 after May wage data showed +3.1% YoY growth — highest in 30 years — validating its exit from ultra-loose policy.",
          whyItMatters: "BOJ normalization is the single most important structural shift in global fixed income in a decade. As Japanese yields rise, Japanese institutional investors (the world's largest creditor bloc) repatriate capital from US Treasuries — putting upward pressure on US yields globally.",
          keyNumbers: [
            { label: "Japan Wage Growth", value: "+3.1% YoY" },
            { label: "BOJ Policy Rate", value: "0.50%" },
            { label: "Japan CPI", value: "2.8% YoY" },
            { label: "10Y JGB Yield", value: "1.08%" },
            { label: "USD/JPY", value: "152.3" }
          ],
          marketImpact: "JPY strengthened. JGB yields rose to multi-decade highs. Yen carry trade partially unwound — risk for EM currencies and leveraged equity positions.",
          indiaImpact: "Yen carry unwind historically creates brief INR volatility. BOJ rate hike cycles have correlated with FII equity outflows from EM. Watchlist event.",
          globalImpact: "Potential for significant Japanese capital repatriation from US Treasuries. Could keep 10Y US yields elevated even as Fed cuts. Structural inflection in global bond markets.",
          source: "Bank of Japan",
          sourceUrl: "https://www.boj.or.jp/en/",
          readMoreUrl: "https://www.boj.or.jp/en/mopo/",
          tags: ["Japan", "BOJ", "Yen", "Bond Markets"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 2: RBI WATCH
    // ─────────────────────────────────────────────────────────────
    {
      id: "rbi-watch",
      number: "02",
      title: "RBI Watch",
      icon: "🏦",
      stories: [
        {
          id: "rbi-repo-hold",
          headline: "RBI Keeps Repo Rate at 6.25% — Accommodative Stance Retained",
          summary: "In an off-cycle assessment communicated through MPC minutes released July 10, RBI held the repo rate at 6.25% and maintained its accommodative stance, with MPC members signaling data-dependence ahead of the August 6 policy meeting.",
          whyItMatters: "Repo rate is the foundational rate that cascades through the entire Indian financial system — from bank lending rates (MCLR, EBLR) to bond yields to EMIs. An RBI on hold with an accommodative bias is a 'green light' for banks to price credit competitively and for the bond market to rally.",
          keyNumbers: [
            { label: "Repo Rate", value: "6.25%" },
            { label: "SDF (Floor)", value: "6.00%" },
            { label: "MSF (Ceiling)", value: "6.50%" },
            { label: "CRR", value: "4.00%" },
            { label: "SLR", value: "18.00%" }
          ],
          marketImpact: "10Y G-Sec yield dipped 4bps to 6.98%. Banking stocks rose. Short-end yield curve stable.",
          indiaImpact: "Home loan and auto loan rates expected to stay stable or soften marginally. Good for housing demand. Mutual fund liquid category in focus.",
          globalImpact: "India real rate (repo minus CPI) is among the highest in G20 at ~175bps — supports INR carry attractiveness.",
          source: "Reserve Bank of India",
          sourceUrl: "https://www.rbi.org.in",
          readMoreUrl: "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx",
          tags: ["RBI", "Repo Rate", "MPC", "Monetary Policy"]
        },
        {
          id: "rbi-master-direction-pa",
          headline: "RBI Issues Revised Master Direction on Payment Aggregators — Stricter KYC & Escrow",
          summary: "RBI published revised Master Directions for Payment Aggregators (PAs), mandating enhanced merchant KYC, stronger escrow account norms, and requiring all PAs to maintain a minimum net worth of ₹25 Cr by March 2027.",
          whyItMatters: "For finance professionals: this tightens compliance for ~30 licensed PAs operating in India, raises barriers to entry, and consolidates the market toward well-capitalized players. For investors in PayTech: higher compliance costs but a cleaner, safer ecosystem.",
          keyNumbers: [
            { label: "PA Net Worth Req.", value: "₹25 Cr (by Mar 2027)" },
            { label: "Escrow Buffer", value: "T+1 settlement mandatory" },
            { label: "Merchant KYC", value: "Enhanced DD required" },
            { label: "Licensed PAs in India", value: "~30 active" }
          ],
          marketImpact: "Positive for Razorpay, PayU, Cashfree (stronger players). Negative for smaller, undercapitalized PAs. No listed pure-play PA stocks in India yet.",
          indiaImpact: "Reduces risk of merchant funds being locked in PA failure events. Strengthens e-commerce and D2C ecosystem trust. Aligns with FATF compliance requirements.",
          globalImpact: "Positions India's PA framework closer to SEPA standards in Europe. Encourages cross-border payment corridors.",
          source: "Reserve Bank of India",
          sourceUrl: "https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx",
          readMoreUrl: "https://www.rbi.org.in",
          tags: ["RBI", "Payment Aggregators", "FinTech Regulation", "KYC"]
        },
        {
          id: "rbi-fsr-highlights",
          headline: "RBI Financial Stability Report June 2026 — Banking System Resilient, NBFC Risks Flagged",
          summary: "RBI's semi-annual Financial Stability Report shows scheduled commercial banks' GNPA ratio at a decade-low of 2.8%, capital adequacy (CRAR) at 16.9%, but flagged rising stress in mid-sized NBFCs and microfinance institutions.",
          whyItMatters: "The FSR is the RBI's most authoritative systemic risk assessment. Low bank NPA + high capital = room for credit expansion. But NBFC stress in microfinance = credit cost risk for banks with large NBFC exposure. Monitor MFI portfolios.",
          keyNumbers: [
            { label: "GNPA (Banks)", value: "2.8%" },
            { label: "NNPA (Banks)", value: "0.6%" },
            { label: "CRAR (System)", value: "16.9%" },
            { label: "PCR", value: "78.2%" },
            { label: "NBFC GNPA", value: "4.1%" }
          ],
          marketImpact: "Sector: strong for large PSU and private banks. Risk flag for small finance banks and MFI-heavy NBFCs. Bandhan Bank, MAS Financial — watch credit costs.",
          indiaImpact: "Clean bank balance sheets create capacity for a new credit cycle. Will accelerate if rate cuts materialize. Infrastructure credit expected to grow 18-22% in FY27.",
          globalImpact: "Indian banking system now among most stable in Asia by capital adequacy metrics. Attracts foreign bank partnerships and co-lending interest.",
          source: "Reserve Bank of India",
          sourceUrl: "https://www.rbi.org.in/Scripts/PublicationReportDetails.aspx?UrlPage=&ID=1252",
          readMoreUrl: "https://www.rbi.org.in",
          tags: ["RBI", "FSR", "NPA", "Banking Stability", "NBFC"]
        },
        {
          id: "rbi-forex",
          headline: "RBI FX Reserves Climb to $685 Billion — 12-Month Import Cover Restored",
          summary: "India's foreign exchange reserves rose to $685 billion as of July 4, 2026, providing 12.4 months of import cover — a level that significantly cushions against external shocks.",
          whyItMatters: "High reserves = low vulnerability to sudden stop crises, currency attacks, or commodity price spikes. The RBI can use reserves to smooth INR volatility without sacrificing monetary policy independence. This is the fiscal equivalent of a large cash buffer for a country.",
          keyNumbers: [
            { label: "Forex Reserves", value: "$685 Billion" },
            { label: "Import Cover", value: "12.4 months" },
            { label: "Gold Reserves", value: "$68 Billion" },
            { label: "SDR Allocation", value: "$19 Billion" },
            { label: "INR/USD", value: "83.2" }
          ],
          marketImpact: "Strong signal for INR stability. Reduces sovereign risk premium. Positive for India sovereign bond yields and FII comfort.",
          indiaImpact: "RBI can intervene to prevent excessive INR depreciation. Cushion against oil price spike impact. Supports India's credit rating outlook.",
          globalImpact: "India is now the world's 4th largest holder of forex reserves after China, Japan, and Switzerland.",
          source: "Reserve Bank of India",
          sourceUrl: "https://www.rbi.org.in/Scripts/WSSViewDetail.aspx?TYPE=Section&PARAM1=2",
          readMoreUrl: "https://www.rbi.org.in",
          tags: ["RBI", "Forex Reserves", "INR", "External Stability"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 3: PAYMENTS & FINTECH
    // ─────────────────────────────────────────────────────────────
    {
      id: "payments-fintech",
      number: "03",
      title: "Payments & FinTech",
      icon: "💳",
      stories: [
        {
          id: "upi-18-billion",
          headline: "UPI Crosses 18 Billion Transactions in June 2026 — New Monthly Record",
          summary: "NPCI data shows UPI processed 18.04 billion transactions worth ₹23.7 trillion in June 2026 — a new all-time monthly record, representing 42% YoY growth in volume.",
          whyItMatters: "UPI is arguably the most successful financial infrastructure project in the world. At 18B monthly transactions, India's digital payments volume now exceeds the combined digital transaction volumes of the US, EU, and UK. This scale creates compounding network effects.",
          keyNumbers: [
            { label: "UPI Volume (Jun)", value: "18.04 Billion" },
            { label: "UPI Value (Jun)", value: "₹23.7 Trillion" },
            { label: "YoY Growth (Vol)", value: "+42%" },
            { label: "Daily Average", value: "600 Million txns" },
            { label: "Avg Ticket Size", value: "₹1,315" }
          ],
          marketImpact: "Continues to compress interchange economics for payment companies. PhonePe (#1, 48% share), Google Pay (#2, 37% share) dominant. Paytm stabilizing at ~9%.",
          indiaImpact: "UPI-based credit (credit on UPI) growing rapidly — strategic priority for banks and NBFCs as a customer acquisition channel. RuPay credit on UPI seeing 3x growth.",
          globalImpact: "India exporting UPI stack to Singapore (UPI-PayNow), UAE, France, Mauritius, Sri Lanka, Nepal, Bhutan. Internationalization accelerating.",
          source: "NPCI",
          sourceUrl: "https://www.npci.org.in/what-we-do/upi/upi-ecosystem-statistics",
          readMoreUrl: "https://www.npci.org.in",
          tags: ["UPI", "NPCI", "Payments", "FinTech"]
        },
        {
          id: "cbdc-retail-pilot",
          headline: "RBI e-Rupee Pilot Expands — 5 Million Wallets, 25 Banks Onboarded",
          summary: "RBI's Digital Rupee (e-Rupee) retail pilot has reached 5 million active wallets and expanded to 25 participating banks, with programmable CBDC features being piloted for government welfare disbursement.",
          whyItMatters: "CBDCs represent the next frontier of monetary policy transmission. Programmable e-Rupee allows the RBI to ensure that money disbursed for specific purposes (e.g., agriculture subsidies) can only be spent on those purposes — eliminating leakage. This is monetary innovation at scale.",
          keyNumbers: [
            { label: "Active Wallets", value: "5 Million" },
            { label: "Participating Banks", value: "25" },
            { label: "Daily Txn Volume", value: "~85,000" },
            { label: "Avg Ticket", value: "₹820" },
            { label: "Offline Mode", value: "Under testing" }
          ],
          marketImpact: "Long-term: CBDC could compress demand for physical cash and alter bank liability structures. Near-term: minimal P&L impact.",
          indiaImpact: "Programmable CBDC for JAM (Jan Dhan-Aadhaar-Mobile) benefit transfer could save billions in leakage. Government keenly evaluating.",
          globalImpact: "India's CBDC progress being studied by 130+ countries with CBDC projects. BIS Innovation Hub tracking.",
          source: "Reserve Bank of India",
          sourceUrl: "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx",
          readMoreUrl: "https://rbidocs.rbi.org.in",
          tags: ["CBDC", "Digital Rupee", "RBI", "Monetary Innovation"]
        },
        {
          id: "account-aggregator",
          headline: "Account Aggregator Ecosystem Hits 100 Million Consented Data Flows",
          summary: "India's Account Aggregator (AA) framework has facilitated over 100 million consented financial data flows since launch, enabling faster loan processing, better underwriting, and expanding credit access to thin-file borrowers.",
          whyItMatters: "AA is the invisible infrastructure revolution. By allowing banks, NBFCs, and fintechs to access consented financial data (bank statements, GST, IT returns, investments) in real-time, it collapses loan processing time from 15 days to 15 minutes and expands credit to the underserved.",
          keyNumbers: [
            { label: "Consented Data Flows", value: "100 Million+" },
            { label: "Registered AAs", value: "7 live" },
            { label: "FIPs (Data Sources)", value: "150+" },
            { label: "FIUs (Data Users)", value: "350+" },
            { label: "Avg Loan Processing", value: "~14 hours" }
          ],
          marketImpact: "Massive tailwind for digital lending NBFCs. Companies like Perfios, Finvu, CAMS FinServ are key enablers. Banks with AA-based underwriting gaining edge.",
          indiaImpact: "Credit gap in India estimated at ₹80 lakh crore. AA is the infrastructure needed to bridge it. MSME and agriculture lending the next frontier.",
          globalImpact: "India's AA is the world's most advanced consent-based financial data sharing framework. UK's Open Banking and EU's PSD2 are similar but less comprehensive.",
          source: "Sahamati (AA Alliance)",
          sourceUrl: "https://sahamati.org.in",
          readMoreUrl: "https://sahamati.org.in/reports",
          tags: ["Account Aggregator", "Open Finance", "Credit", "FinTech Infrastructure"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 4: BANKING
    // ─────────────────────────────────────────────────────────────
    {
      id: "banking",
      number: "04",
      title: "Banking",
      icon: "🏛️",
      stories: [
        {
          id: "hdfc-bank-q1",
          headline: "HDFC Bank Q1 FY27: Net Profit ₹16,175 Cr (+18% YoY) — NIMs Expanding",
          summary: "HDFC Bank reported Q1 FY27 net profit of ₹16,175 crore, up 18% YoY. Net Interest Margin (NIM) expanded 12bps QoQ to 3.65%, driven by improved loan mix. Gross NPA stayed stable at 1.24%.",
          whyItMatters: "HDFC Bank (7% of Nifty 50) sets the tone for the banking sector. NIM expansion signals pricing power recovery post the HDFC-HDFC Bank merger integration cycle. Watch credit growth for signal on whether corporate lending is recovering.",
          keyNumbers: [
            { label: "Net Profit", value: "₹16,175 Cr (+18% YoY)" },
            { label: "NIM", value: "3.65% (+12bps QoQ)" },
            { label: "Gross NPA", value: "1.24%" },
            { label: "Credit Growth", value: "+14.2% YoY" },
            { label: "CASA Ratio", value: "43.8%" }
          ],
          marketImpact: "Stock up 2.1% post results. Bank Nifty outperformed. Triggers re-rating of private banking sector. HDFC Bank target price consensus: ₹1,950.",
          indiaImpact: "Strong CASA ratio indicates sticky deposit base. Retail credit growth robust at 16% — auto, home loan, credit cards all positive.",
          globalImpact: "HDFC Bank among top 10 global banks by market cap. Foreign ownership at 54% — near FPI limit. Global index inclusion drives passive inflows.",
          source: "HDFC Bank Exchange Filing",
          sourceUrl: "https://www.bseindia.com",
          readMoreUrl: "https://www.hdfcbank.com/content/bbp/repositories/723fb80a-2dde-42a3-9793-7ae1be57c87f/investor-relations",
          tags: ["HDFC Bank", "Q1 Results", "Banking", "NIM", "NPA"]
        },
        {
          id: "credit-growth-rbi",
          headline: "System Credit Growth at 13.8% YoY — Services and Retail Lead",
          summary: "RBI's latest data shows scheduled commercial bank credit grew 13.8% YoY as of June 28, 2026 — above the 12% expected range, with services sector credit (+17.2%) and retail (+15.4%) leading.",
          whyItMatters: "Credit growth above nominal GDP growth (~11-12%) signals private investment pickup and consumer confidence. Sustained 14%+ credit growth creates both opportunity (bank earnings upside) and risk (asset quality monitoring needed).",
          keyNumbers: [
            { label: "Total Credit Growth", value: "+13.8% YoY" },
            { label: "Services Sector", value: "+17.2% YoY" },
            { label: "Retail Credit", value: "+15.4% YoY" },
            { label: "Agriculture", value: "+9.8% YoY" },
            { label: "Industry Credit", value: "+11.3% YoY" }
          ],
          marketImpact: "Broad positive for banking. Differentiated: private banks with retail focus outperform. PSU banks with industry exposure — watch corporate cycle.",
          indiaImpact: "Credit-to-GDP ratio rising toward 60% from 55% — still below Asian peers. Long runway for credit deepening. SFBs and MFIs seeing credit pressure in unsecured portfolios.",
          globalImpact: "India's credit growth rate highest among major economies currently. Reflects domestic growth leadership vs. global slowdown.",
          source: "Reserve Bank of India",
          sourceUrl: "https://www.rbi.org.in/Scripts/WSSViewDetail.aspx?TYPE=Section&PARAM1=2",
          readMoreUrl: "https://www.rbi.org.in",
          tags: ["Credit Growth", "Banking", "RBI", "Retail Credit"]
        },
        {
          id: "basel-iii-india",
          headline: "RBI's Proposed Basel III Endgame Rules — Higher Capital for Operational Risk",
          summary: "RBI released a discussion paper on adopting the final Basel III framework ('Basel IV'), which would require Indian banks to hold more capital against operational and market risks, with a 3-year transition from FY28.",
          whyItMatters: "Basel III endgame increases the cost of banking by requiring more capital to be set aside. Banks will need to either raise capital (diluting existing shareholders) or slow balance sheet growth. Understanding Basel is essential for any banking sector analysis.",
          keyNumbers: [
            { label: "Output Floor", value: "72.5% of SA requirement" },
            { label: "Implementation", value: "April 2028 (proposed)" },
            { label: "Estimated Capital Impact", value: "₹60,000–80,000 Cr" },
            { label: "CET-1 Minimum", value: "6.0% (unchanged)" },
            { label: "Transition Period", value: "3 years" }
          ],
          marketImpact: "Negative for banks with high operational complexity (large universal banks). Mid-size private banks and PSU banks less impacted. Capital raising cycle expected.",
          indiaImpact: "Indian banks currently over-capitalized vs. minimum requirement — provides comfort. PSU banks may need government equity infusion if credit growth continues at 14%+.",
          globalImpact: "Aligns India with BIS Basel III endgame which US and EU are also implementing. Creates level playing field for Indian banks competing globally.",
          source: "Reserve Bank of India",
          sourceUrl: "https://www.rbi.org.in/Scripts/PublicationDraftReportDetails.aspx",
          readMoreUrl: "https://www.bis.org/bcbs/publ/d559.htm",
          tags: ["Basel III", "Capital Adequacy", "RBI", "Banking Regulation"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 5: MARKETS
    // ─────────────────────────────────────────────────────────────
    {
      id: "markets",
      number: "05",
      title: "Markets",
      icon: "📈",
      stories: [
        {
          id: "nifty-weekly",
          headline: "Nifty 50 Crosses 25,800 — IT and Banking Lead; PSU Energy Drags",
          summary: "Nifty 50 ended the week at 25,842, gaining 1.2% WoW. IT sector rose 2.8% on US CPI softness and dollar optimism. Private banks rose 1.9%. PSU Energy fell 1.4% on profit-taking.",
          whyItMatters: "The composition of market gains matters more than the headline number. IT-led rallies are earnings-driven (sustainable). Index gains driven by FII flows (sentiment-driven) can reverse faster. Current composition signals quality earnings recovery, not just liquidity.",
          keyNumbers: [
            { label: "Nifty 50", value: "25,842 (+1.2% WoW)" },
            { label: "Sensex", value: "84,620 (+1.1% WoW)" },
            { label: "Bank Nifty", value: "55,240 (+1.9% WoW)" },
            { label: "Nifty IT", value: "37,480 (+2.8% WoW)" },
            { label: "Nifty Midcap 150", value: "+1.7% WoW" },
            { label: "Nifty P/E", value: "21.8x" }
          ],
          marketImpact: "FII net buyers at ₹8,240 Cr for the week. DII net sellers at ₹2,100 Cr (profit booking). Market breadth positive: 1,612 advances vs. 800 declines on NSE.",
          indiaImpact: "Nifty trailing P/E at 21.8x — within fair value range (historical avg: 20.5x). Market not cheap, but earnings growth trajectory supports current levels.",
          globalImpact: "India remains a preferred EM destination. India vs. MSCI EM premium at 62% — historically high but justified by growth differential.",
          source: "NSE India",
          sourceUrl: "https://www.nseindia.com",
          readMoreUrl: "https://www.nseindia.com/market-data/live-market-statistics",
          tags: ["Nifty", "Sensex", "FII", "Equity Markets", "Sector Rotation"]
        },
        {
          id: "fii-dii-flows",
          headline: "FIIs Accelerate India Equity Buying — ₹32,000 Cr Net Purchase in July So Far",
          summary: "Foreign Institutional Investors have net purchased Indian equities worth ₹32,180 crore in the first 12 days of July 2026 — the strongest start to a month since March 2024 — driven by US disinflation, Fed pivot expectations, and India growth premium.",
          whyItMatters: "FII flows are the most important short-to-medium term driver of Indian market direction. When FIIs buy aggressively, they amplify rupee strength, compress bond yields, and lift market sentiment — creating a self-reinforcing positive cycle.",
          keyNumbers: [
            { label: "FII Buy (Jul 1–12)", value: "₹32,180 Cr" },
            { label: "FII Sell (Debt)", value: "₹1,240 Cr" },
            { label: "DII Net", value: "-₹6,200 Cr (selling)" },
            { label: "Domestic MF Net", value: "-₹4,800 Cr" },
            { label: "SIP Flows (Jun)", value: "₹21,260 Cr" }
          ],
          marketImpact: "Strong short-term market support. Risk: reversal triggers include stronger US data, geopolitical events, or domestic earnings disappointment.",
          indiaImpact: "SIP flows at record ₹21,260 Cr in June — domestic retail is now a structural buffer against FII selling. Indian retail investor base has matured significantly.",
          globalImpact: "India among top 3 EM equity destinations alongside Taiwan and South Korea. China outflows partly redirecting to India.",
          source: "NSDL / SEBI",
          sourceUrl: "https://www.nsdl.co.in/nsdlnews/FIIData.php",
          readMoreUrl: "https://www.sebi.gov.in",
          tags: ["FII", "DII", "Capital Flows", "SIP", "Market Outlook"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 6: FIXED INCOME
    // ─────────────────────────────────────────────────────────────
    {
      id: "fixed-income",
      number: "06",
      title: "Fixed Income",
      icon: "📊",
      stories: [
        {
          id: "gsec-rally",
          headline: "10Y G-Sec at 6.98% — Heading Toward 6.75% as Rate Cut Bets Build",
          summary: "The benchmark 10-year Government Security yield fell to 6.98%, the lowest since March 2024, as markets price in a 25bps RBI rate cut in October 2026 and global bond yields ease.",
          whyItMatters: "Bond prices move inversely to yields. The fall in the 10Y yield means anyone holding long-duration G-Secs is sitting on mark-to-market gains. For bond funds (especially long-duration gilt funds), this is significant. For banks with large G-Sec portfolios (HTM and AFS), this improves balance sheet quality.",
          keyNumbers: [
            { label: "10Y G-Sec Yield", value: "6.98% (-4bps)" },
            { label: "5Y G-Sec Yield", value: "6.82%" },
            { label: "3M T-Bill", value: "6.65%" },
            { label: "Repo Rate", value: "6.25%" },
            { label: "10Y-Repo Spread", value: "73bps" }
          ],
          marketImpact: "Long-duration gilt funds returning 8–10% annualized. Gilt mutual funds seeing higher inflows. Insurance and pension funds natural buyers at current levels.",
          indiaImpact: "Lower 10Y yield reduces government borrowing cost. Every 10bps decline saves ~₹7,000 Cr annually on the ₹70 lakh crore outstanding G-Sec pile.",
          globalImpact: "India's 10Y real yield (~310bps) among the highest in Asia — attracting carry trade from Japan and EM-focused FPI debt investors.",
          source: "RBI / CCIL",
          sourceUrl: "https://www.rbi.org.in/Scripts/BS_ViewBulletin.aspx",
          readMoreUrl: "https://www.ccilindia.com",
          tags: ["G-Sec", "Bond Yields", "Fixed Income", "Gilt Funds", "RBI"]
        },
        {
          id: "rbi-liquidity",
          headline: "Banking System Liquidity Turns Surplus — RBI Absorbs ₹1.2 Lakh Crore via VRRR",
          summary: "Banking system liquidity has turned into a surplus of ₹1.2 lakh crore as of July 10, after months of deficit. RBI is now absorbing excess liquidity through Variable Rate Reverse Repo (VRRR) auctions to maintain rate corridor discipline.",
          whyItMatters: "Liquidity is the lifeblood of short-term money markets. When the banking system has surplus liquidity, call money rates and CD rates fall — reducing the cost of short-term funds. This benefits money market funds, short-duration bond funds, and working capital borrowers.",
          keyNumbers: [
            { label: "System Liquidity", value: "+₹1.2 Lakh Cr (surplus)" },
            { label: "VRRR Absorption", value: "₹1.2 Lakh Cr" },
            { label: "Call Money Rate", value: "6.20%" },
            { label: "3M CD Rate", value: "7.08%" },
            { label: "CBLO/TREPS Rate", value: "6.18%" }
          ],
          marketImpact: "Positive for liquid funds and ultra-short funds. Call rates anchored at SDF floor (6.00%). CD spreads narrowing.",
          indiaImpact: "Surplus liquidity signals RBI's comfort with monetary conditions ahead of August MPC. May reduce pressure for CRR cut as a standalone liquidity measure.",
          globalImpact: "India's money market conditions among the most orderly in EM. Weighted average call rate close to repo rate — sign of effective monetary transmission.",
          source: "Reserve Bank of India",
          sourceUrl: "https://www.rbi.org.in/Scripts/WSSViewDetail.aspx",
          readMoreUrl: "https://www.rbi.org.in",
          tags: ["Liquidity", "VRRR", "Money Market", "RBI", "Liquid Funds"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 7: COMMODITIES
    // ─────────────────────────────────────────────────────────────
    {
      id: "commodities",
      number: "07",
      title: "Commodities",
      icon: "🥇",
      stories: [
        {
          id: "gold-rally",
          headline: "Gold at $2,680/oz — Fed Pivot + China Central Bank Buying Drive Rally",
          summary: "Gold rose 2.3% this week to $2,680 per troy ounce, driven by softening US CPI expectations for a Fed rate cut, continued central bank buying led by China's PBOC, and safe-haven demand amid Middle East uncertainty.",
          whyItMatters: "Gold at multi-year highs reflects deep structural shifts: (1) De-dollarization by central banks, (2) Rising geopolitical risk premium, (3) Declining real interest rate expectations. For Indian investors: gold ETFs and sovereign gold bonds are gaining as a portfolio hedge.",
          keyNumbers: [
            { label: "Gold Spot", value: "$2,680/oz (+2.3% WoW)" },
            { label: "MCX Gold", value: "₹74,200/10g" },
            { label: "Gold ETF AUM (India)", value: "₹32,400 Cr" },
            { label: "Central Bank Buying (2025)", value: "1,037 tonnes" },
            { label: "PBOC Gold Holdings", value: "2,264 tonnes" }
          ],
          marketImpact: "Positive for gold ETFs, gold mining stocks globally. Neutral to negative for jewellery demand (high prices suppress volumes). SGB premiums widening.",
          indiaImpact: "MCX gold above ₹74,000 — import duty adjustment being watched. RBI's own gold reserve at 825 tonnes — 9% of total forex reserves.",
          globalImpact: "Global central banks bought record gold in 2025 (1,037 tonnes). De-dollarization thesis reinforcing gold's role as reserve asset.",
          source: "World Gold Council / MCX",
          sourceUrl: "https://www.gold.org",
          readMoreUrl: "https://www.mcxindia.com",
          tags: ["Gold", "Commodities", "Central Banks", "De-dollarization"]
        },
        {
          id: "crude-oil",
          headline: "Brent Crude Slides to $78/bbl — OPEC+ Output Increase Weighs",
          summary: "Brent Crude fell to $78 per barrel after OPEC+ confirmed a 500,000 bpd production increase for August, combined with demand concerns from China's deflationary data and weaker-than-expected European PMI.",
          whyItMatters: "Oil at $78 vs. $90 means a 13% savings on India's crude import bill — which translates directly to a lower current account deficit, lower WPI inflation, and fiscal space (lower subsidy burden). Every $10/bbl decline saves India roughly $12–14 billion annually.",
          keyNumbers: [
            { label: "Brent Crude", value: "$78.4/bbl (-3.1% WoW)" },
            { label: "WTI Crude", value: "$74.8/bbl" },
            { label: "India Import Price", value: "~₹6,520/bbl" },
            { label: "Basket Price (PPAC)", value: "$79.1/bbl" },
            { label: "India Import Volume", value: "~5.2 Mbpd" }
          ],
          marketImpact: "Positive for OMCs (HPCL, BPCL, IOC) — lower crude = better marketing margins. Negative for upstream E&P companies (Oil India, ONGC).",
          indiaImpact: "Lower oil = lower current account deficit. Reduces pressure on INR. Aviation fuel costs down — positive for IndiGo, Air India. Road transport cost reduction.",
          globalImpact: "Lower oil revenue pressures Saudi Arabia's Vision 2030 projects. Russia's fiscal balance at risk below $70. US shale producers watching $70 breakeven.",
          source: "IEA / OPEC",
          sourceUrl: "https://www.iea.org",
          readMoreUrl: "https://www.opec.org",
          tags: ["Crude Oil", "OPEC+", "Commodities", "Energy", "India CAD"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 8: TECHNOLOGY
    // ─────────────────────────────────────────────────────────────
    {
      id: "technology",
      number: "08",
      title: "Technology",
      icon: "💻",
      stories: [
        {
          id: "openai-gpt5",
          headline: "OpenAI GPT-5 Achieves Human-Level Performance on Standardized Professional Exams",
          summary: "OpenAI's GPT-5 has scored above the 90th percentile on bar exams, CFA Level I, USMLE, and CA Final examinations — marking a qualitative threshold in AI capability that has direct implications for knowledge-work professions.",
          whyItMatters: "When AI can pass CFA and legal exams, it doesn't replace finance professionals immediately — but it compresses the knowledge gap between junior and senior analysts. The work that used to take a team of analysts 2 weeks can now take 2 hours with AI assistance. This restructures firm economics and talent strategy.",
          keyNumbers: [
            { label: "Bar Exam Score", value: "92nd Percentile" },
            { label: "CFA Level I Pass", value: "Yes (87% score)" },
            { label: "API Cost (per 1M tokens)", value: "$15" },
            { label: "ChatGPT Users", value: "500M+ monthly" },
            { label: "OpenAI Valuation", value: "$300 Billion" }
          ],
          marketImpact: "Positive: NVIDIA (inference chips), Microsoft (Azure AI), CoreWeave (compute). Negative risk: consulting firm valuations, legal tech, financial research platforms.",
          indiaImpact: "India's $250B IT services industry facing structural renegotiation of contracts. Wipro, Infosys, TCS investing $500M+ each in AI tools. BPO sector most vulnerable.",
          globalImpact: "AI replacing knowledge workers is now a macro risk, not a futurist scenario. IMF estimates 40% of global jobs have significant AI exposure. Productivity gains vs. displacement = policy debate.",
          source: "OpenAI",
          sourceUrl: "https://openai.com/research",
          readMoreUrl: "https://openai.com/gpt-5",
          tags: ["AI", "OpenAI", "GPT-5", "Technology", "Future of Work"]
        },
        {
          id: "nvidia-blackwell",
          headline: "NVIDIA Blackwell Ultra Chips Constrained — H2 Delivery Slippage",
          summary: "NVIDIA's Blackwell Ultra B300 GPU deliveries face H2 supply constraints due to CoWoS packaging bottlenecks at TSMC, with lead times extending to 52 weeks. Cloud providers building alternative strategies.",
          whyItMatters: "NVIDIA's supply constraints are not a demand problem — they're a supply chain bottleneck that keeps prices and margins elevated for NVIDIA while frustrating cloud hyperscalers (AWS, Azure, GCP). Every week of delay costs cloud companies billions in AI revenue potential.",
          keyNumbers: [
            { label: "Blackwell B300 Price", value: "~$35,000/chip" },
            { label: "Lead Time", value: "52 weeks" },
            { label: "NVIDIA Q1 Revenue", value: "$44.1B (+262% YoY)" },
            { label: "NVIDIA Data Center", value: "$39.1B" },
            { label: "Gross Margin", value: "78.4%" }
          ],
          marketImpact: "NVIDIA stock at all-time high. AMD MI300X gaining share. Custom silicon (Amazon Trainium, Google TPU, Apple Neural) becoming strategic priority for cloud cos.",
          indiaImpact: "India's AI compute capacity limited by chip access. RIL, Adani, Yotta racing to build GPU clusters. IndiaAI Mission's ₹10,000 Cr compute fund critical.",
          globalImpact: "Semiconductor supply chain concentration risk: TSMC makes 90% of advanced chips. Geopolitical risk (Taiwan) = strategic vulnerability for global AI progress.",
          source: "NVIDIA Investor Relations",
          sourceUrl: "https://investor.nvidia.com",
          readMoreUrl: "https://www.nvidia.com/en-us/data-center/",
          tags: ["NVIDIA", "AI Chips", "Semiconductors", "Technology", "Supply Chain"]
        },
        {
          id: "india-ai-ecosystem",
          headline: "India's AI Startup Funding Reaches $2.1 Billion in H1 2026 — 3x YoY Growth",
          summary: "Indian AI startups raised $2.1 billion in H1 2026 across 186 deals, a 3x increase from $700M in H1 2025. Vertical AI (FinTech, HealthTech, AgriTech) led; foundation model companies remain rare.",
          whyItMatters: "India is becoming an AI application layer powerhouse — building on top of models from OpenAI, Anthropic, and Google rather than building base models. This is a rational capital-efficient strategy. The real competitive advantage: India's massive distribution through UPI, Aadhaar, and smartphone penetration.",
          keyNumbers: [
            { label: "AI Funding H1 2026", value: "$2.1 Billion" },
            { label: "Deal Count", value: "186 deals" },
            { label: "YoY Growth", value: "+200%" },
            { label: "Top Vertical", value: "FinTech AI (32%)" },
            { label: "Avg Deal Size", value: "$11.3M" }
          ],
          marketImpact: "No direct listed market play yet. Zomato, Paytm, MakeMyTrip integrating AI. Wipro, Infosys building AI CoEs. IT sector P/E re-rating if AI transition executed well.",
          indiaImpact: "Government's IndiaAI Mission targeting ₹10,000 Cr public compute. Bhashini (multilingual AI) critical for Tier 2-3 city digital inclusion.",
          globalImpact: "India positioned as AI talent exporter. 35% of AI researchers at top US labs are of Indian origin. Brain drain vs. brain gain: government policy challenge.",
          source: "Tracxn / DST India",
          sourceUrl: "https://tracxn.com",
          readMoreUrl: "https://indiaai.gov.in",
          tags: ["India AI", "Startups", "FinTech AI", "Technology", "IndiaAI Mission"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 9: ENERGY
    // ─────────────────────────────────────────────────────────────
    {
      id: "energy",
      number: "09",
      title: "Energy",
      icon: "⚡",
      stories: [
        {
          id: "india-solar-capacity",
          headline: "India Crosses 100 GW Installed Solar Capacity — Renewable Revolution Underway",
          summary: "India crossed the landmark 100 GW installed solar power capacity milestone, becoming the world's 3rd largest solar energy producer. The Ministry of New and Renewable Energy projects 500 GW total renewable capacity by 2030.",
          whyItMatters: "Energy is the foundation of economic growth. India's renewable push reduces dependence on imported coal and crude, compresses energy inflation, and makes Indian manufacturing more globally competitive on sustainability criteria (ESG supply chain requirements from EU, US).",
          keyNumbers: [
            { label: "Solar Installed", value: "100 GW" },
            { label: "Wind Installed", value: "48 GW" },
            { label: "Total Renewable", value: "198 GW" },
            { label: "2030 Target", value: "500 GW" },
            { label: "Solar Tariff (Latest)", value: "₹2.25/kWh" }
          ],
          marketImpact: "Positive for Adani Green, Tata Power, NTPC Renewable, Suzlon, Inox Wind. Power grid stocks (Power Grid Corp) benefiting from transmission capex.",
          indiaImpact: "Solar at ₹2.25/kWh is cheaper than thermal power (~₹4.5/kWh). Drives industrial energy cost reduction. Rooftop solar PM Surya Ghar scheme: 10M homes target.",
          globalImpact: "India's solar panel demand: 40GW+ annually. But 70% of cells still imported from China — domestic manufacturing is the policy priority.",
          source: "Ministry of New and Renewable Energy",
          sourceUrl: "https://mnre.gov.in",
          readMoreUrl: "https://mnre.gov.in/renewable-energy-sector",
          tags: ["Solar", "Renewables", "Energy", "India", "Net Zero"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 10: VC & STARTUPS
    // ─────────────────────────────────────────────────────────────
    {
      id: "vc-startups",
      number: "10",
      title: "VC & Startups",
      icon: "🚀",
      stories: [
        {
          id: "zepto-ipo",
          headline: "Zepto Files DRHP — Eyes $700M IPO at $5 Billion Valuation in Q4 FY27",
          summary: "Quick-commerce startup Zepto has filed its Draft Red Herring Prospectus with SEBI, targeting a ₹5,800 crore IPO at a $5 billion valuation — a potential test of India's appetite for loss-making high-growth tech companies.",
          whyItMatters: "Zepto's IPO will be a critical market signal for India's startup ecosystem. A successful listing at premium valuation validates the quick commerce category. A disappointing response signals Indian public markets demanding clearer paths to profitability — like they did with Paytm.",
          keyNumbers: [
            { label: "IPO Size", value: "~$700M (₹5,800 Cr)" },
            { label: "Valuation Target", value: "$5 Billion" },
            { label: "Revenue (FY26)", value: "₹10,200 Cr (est.)" },
            { label: "Adjusted EBITDA", value: "Marginal positive" },
            { label: "Cities", value: "30+ cities, 700+ stores" }
          ],
          marketImpact: "Watch for price discovery. Zomato (profitable) at 6x revenue sets the comp. Swiggy Instamart (loss-making) is Zepto's closest peer. Market may apply 3–4x revenue.",
          indiaImpact: "Quick commerce is reshaping kirana economics. ₹40,000 Cr category growing 60% annually. Long-term margin path depends on dark store density and order economics.",
          globalImpact: "Global VC watching India's quick commerce — largest at-scale experiment globally. Investors from Tiger Global, Nexus, Y Combinator backing Zepto.",
          source: "SEBI DRHP Filing",
          sourceUrl: "https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=39",
          readMoreUrl: "https://www.sebi.gov.in",
          tags: ["Zepto", "IPO", "Quick Commerce", "VC", "Startups"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 11: REGULATION & LAW
    // ─────────────────────────────────────────────────────────────
    {
      id: "regulation-law",
      number: "11",
      title: "Regulation & Law",
      icon: "⚖️",
      stories: [
        {
          id: "sebi-fpo-limits",
          headline: "SEBI Tightens F&O Position Limits for FPIs — Curbing Speculative Flows",
          summary: "SEBI issued circular reducing single-stock F&O position limits for Foreign Portfolio Investors by 25%, and mandating real-time position reporting for FPIs with F&O positions exceeding ₹500 crore.",
          whyItMatters: "SEBI is actively trying to reduce derivatives market concentration risk. Large FPI positions in index and single-stock derivatives can amplify volatility on rollover dates. Tighter limits = less systemic risk, but also reduced market depth for foreign participants.",
          keyNumbers: [
            { label: "FPI Position Limit Reduction", value: "-25%" },
            { label: "Reporting Threshold", value: "₹500 Cr" },
            { label: "Effective Date", value: "September 1, 2026" },
            { label: "F&O Turnover (India)", value: "₹3.2 Lakh Cr/day avg" }
          ],
          marketImpact: "Short-term volatility on announcement. Long-term reduces end-of-month expiry volatility. Options premium structures may adjust.",
          indiaImpact: "Aligns with SEBI's broader agenda to reduce retail trader losses in F&O (SEBI study: 9 of 10 individual F&O traders lose money). Also reduces potential FPI manipulation concerns.",
          globalImpact: "India's F&O market is the world's largest by contract volume. SEBI must balance investor protection with global competitiveness.",
          source: "SEBI",
          sourceUrl: "https://www.sebi.gov.in/legal/circulars/",
          readMoreUrl: "https://www.sebi.gov.in",
          tags: ["SEBI", "F&O", "FPI", "Derivatives Regulation"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 12: POLITICS THAT MATTERS
    // ─────────────────────────────────────────────────────────────
    {
      id: "politics-matters",
      number: "12",
      title: "Politics That Matters",
      icon: "🏛️",
      stories: [
        {
          id: "india-us-trade",
          headline: "India-US Trade Deal Framework Agreed in Principle — Tariff Reduction on 85% of Goods",
          summary: "India and the United States have agreed in principle to a Bilateral Trade Agreement (BTA) framework covering tariff reductions on 85% of traded goods, with pharmaceuticals and dairy remaining sensitive sectors. Full text expected by December 2026.",
          whyItMatters: "A US-India BTA would be the most significant bilateral trade agreement in India's history. Lower tariffs = lower cost of US goods in India (auto, aerospace, agriculture) and expanded access for Indian goods in US (pharmaceuticals, textiles, IT services). This is macro-positive for India's export trajectory.",
          keyNumbers: [
            { label: "India-US Trade (FY26)", value: "$145 Billion" },
            { label: "India Trade Surplus", value: "$42 Billion" },
            { label: "Tariff Coverage", value: "85% of goods" },
            { label: "Timeline", value: "Dec 2026 (full text)" },
            { label: "US Tariff on India (current)", value: "10-26%" }
          ],
          marketImpact: "Positive for India export sectors: pharma, textiles, IT, gems. Negative risk for domestic auto (Ford, Harley access) and dairy farmers.",
          indiaImpact: "Historically significant. Reduces India's dependence on China trade. Aligns with Make in India and PLI scheme goals. MSME exporters biggest beneficiaries.",
          globalImpact: "Geopolitically: signals US-India strategic partnership deepening. Sets template for India's trade negotiation approach with EU (BTIA still pending).",
          source: "Ministry of Commerce & Industry",
          sourceUrl: "https://commerce.gov.in",
          readMoreUrl: "https://pib.gov.in",
          tags: ["India-US Trade", "BTA", "Geopolitics", "Trade Policy"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 13: IMF | WORLD BANK | BIS | OECD
    // ─────────────────────────────────────────────────────────────
    {
      id: "imf-bis-worldbank",
      number: "13",
      title: "IMF · World Bank · BIS · OECD",
      icon: "🌍",
      stories: [
        {
          id: "imf-weo",
          headline: "IMF World Economic Outlook Update: Global Growth Revised Up to 3.3% for 2026",
          summary: "IMF's July 2026 WEO Update raised global growth forecast to 3.3% (from 3.1% in April), driven by stronger US resilience and India outperformance, but flagged elevated debt levels and geopolitical fragmentation as tail risks.",
          whyItMatters: "The IMF WEO is the world's most authoritative macroeconomic forecast. When the IMF raises global growth, it signals a more benign environment for risk assets, trade, and EM capital flows. The debt risk flag is critical: global public debt at 93% of GDP is near post-WWII highs.",
          keyNumbers: [
            { label: "Global Growth 2026", value: "3.3% (prev: 3.1%)" },
            { label: "India Growth 2026", value: "6.8%" },
            { label: "US Growth 2026", value: "2.6%" },
            { label: "China Growth 2026", value: "4.6%" },
            { label: "Global Debt/GDP", value: "93%" }
          ],
          marketImpact: "Supports EM equity and bond markets. India remains the fastest-growing major economy — justifies India premium in EM indices.",
          indiaImpact: "India projected at 6.8% — IMF most bullish on India among major economies. RBI's own projection: 7.2%. Real GDP momentum intact.",
          globalImpact: "IMF's debt warning is significant: countries with high debt have less fiscal space to respond to the next shock. Watch US (123% debt/GDP) and Japan (250%).",
          source: "International Monetary Fund",
          sourceUrl: "https://www.imf.org/en/Publications/WEO",
          readMoreUrl: "https://www.imf.org/en/Publications/WEO/Issues/2026/07/update",
          tags: ["IMF", "WEO", "Global Growth", "India GDP", "Macro Forecast"]
        },
        {
          id: "bis-cbdc-report",
          headline: "BIS Annual Economic Report 2026: CBDCs Could Reshape Global Payment Architecture",
          summary: "The Bank for International Settlements' Annual Economic Report 2026 devotes a full chapter to CBDCs, arguing that well-designed CBDCs could improve cross-border payment efficiency, reduce intermediary costs by 60–80%, and enhance financial inclusion.",
          whyItMatters: "BIS is the central bank of central banks. When BIS formally endorses CBDCs and quantifies their potential, it accelerates adoption. The 60-80% cost reduction in cross-border payments is enormous — cross-border payments today cost $200 billion+ annually in friction.",
          keyNumbers: [
            { label: "Cross-border Payment Cost Reduction", value: "60–80% (CBDC)" },
            { label: "Global Remittance Market", value: "$650 Billion" },
            { label: "Avg Remittance Cost", value: "6.4% (current)" },
            { label: "CBDC Programs Globally", value: "130+ countries" },
            { label: "Live CBDCs", value: "11 countries" }
          ],
          marketImpact: "Long-term negative for SWIFT and correspondent banking. Positive for central bank digital infrastructure vendors. Short-term: no immediate impact.",
          indiaImpact: "India's e-Rupee + UPI international expansion positions India as a CBDC leader. India-Singapore, India-UAE corridors first beneficiaries.",
          globalImpact: "BIS mBridge project (multi-CBDC platform) could become the new SWIFT for central bank transactions. Watch geopolitical dynamics: US reluctant, China leads.",
          source: "Bank for International Settlements",
          sourceUrl: "https://www.bis.org/publ/arpdf/ar2026e.htm",
          readMoreUrl: "https://www.bis.org",
          tags: ["BIS", "CBDC", "Cross-border Payments", "Digital Currency", "Global Finance"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 14: INDUSTRY DEEP DIVE — INSURANCE
    // ─────────────────────────────────────────────────────────────
    {
      id: "industry-deep-dive",
      number: "14",
      title: "Industry Deep Dive",
      icon: "🔬",
      subtitle: "This Edition: Insurance",
      stories: [
        {
          id: "insurance-overview",
          headline: "India Insurance: The ₹10 Lakh Crore Opportunity — Underpenetrated, Underpriced, Underestimated",
          summary: "India's insurance sector has total premium income of ₹10.4 lakh crore (FY26), with insurance penetration at just 4.2% of GDP — one of the lowest among G20 nations (global average: 7.2%). The sector is entering a structural growth phase driven by rising incomes, IRDAI reforms, and digitization.",
          whyItMatters: "Insurance is the ultimate alignment between individual financial security and national capital formation. India's under-insurance creates massive economic vulnerability — a single health crisis wipes out family savings, a natural disaster destroys uninsured farm income. Closing this gap is both a business opportunity and a social imperative.",
          keyNumbers: [
            { label: "Total Premium (FY26)", value: "₹10.4 Lakh Crore" },
            { label: "Insurance Penetration", value: "4.2% of GDP" },
            { label: "Life Premium Growth", value: "+12% YoY" },
            { label: "Non-Life Premium Growth", value: "+16% YoY" },
            { label: "Health Insurance Growth", value: "+22% YoY" },
            { label: "Listed Insurers", value: "14 (BSE/NSE)" }
          ],
          marketImpact: "Key listed companies: LIC (life), SBI Life, HDFC Life, Max Life (listed via Max Financial), ICICI Prudential, New India Assurance, Star Health, ICICI Lombard, Bajaj Allianz. Composite licenses (post-IRDAI reform) to be transformative.",
          indiaImpact: "IRDAI's 'Insurance for All by 2047' mission. Bima Trinity (Bima Sugam, Bima Vistar, Bima Vistaar) is the IRDAI's UPI moment for insurance. Technology-driven distribution disruption.",
          globalImpact: "India is the world's 10th largest insurance market. Swiss Re and Munich Re increasing India exposure. Global reinsurers: India market growing faster than China.",
          source: "IRDAI",
          sourceUrl: "https://irdai.gov.in",
          readMoreUrl: "https://irdai.gov.in/annual-report",
          tags: ["Insurance", "IRDAI", "LIC", "Health Insurance", "Deep Dive"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 15: RESEARCH CORNER
    // ─────────────────────────────────────────────────────────────
    {
      id: "research-corner",
      number: "15",
      title: "Research Corner",
      icon: "📚",
      reads: [
        {
          title: "The Global Debt Monitor: Navigating the Next Fiscal Adjustment Cycle",
          publisher: "IMF Fiscal Affairs Department",
          summary: "Analyzes the trajectory of global public debt and fiscal consolidation paths for G20 economies. Particularly relevant for India: section on emerging market debt dynamics and the role of financial repression vs. genuine consolidation.",
          whyRead: "Essential reading for understanding the structural constraint on global fiscal policy. With global debt at 93% of GDP and interest costs rising, governments globally have less room than in 2008 or 2020. This shapes the macro environment for the next decade.",
          pages: 48,
          url: "https://www.imf.org/en/Publications/fiscal-monitor",
          tags: ["IMF", "Fiscal Policy", "Public Debt", "Macro"]
        },
        {
          title: "Central Bank Digital Currencies: System Design and Interoperability",
          publisher: "BIS Working Papers No. 1117",
          summary: "Technical paper on CBDC design choices — account-based vs. token-based, tiered systems, and the critical question of interoperability between national CBDCs. India's e-Rupee architecture compared against 15 other central banks.",
          whyRead: "For anyone working in payments, banking, or monetary policy, this is the definitive technical reference on how CBDCs actually work. The interoperability section is particularly important for cross-border payment professionals.",
          pages: 62,
          url: "https://www.bis.org/publ/work1117.htm",
          tags: ["BIS", "CBDC", "Payments", "Monetary Policy"]
        },
        {
          title: "AI and the Economy: Productivity, Labor Markets, and Inequality",
          publisher: "NBER Working Paper 31699",
          summary: "Economists Erik Brynjolfsson and Daron Acemoglu's latest assessment of AI's economic impact. Counter-intuitively, argues that current AI deployment may increase productivity concentration in large firms while suppressing wage growth for median workers.",
          whyRead: "The best serious economic analysis of AI's macro impact available today. If you invest in or work at companies deploying AI, understanding the distribution of AI's economic benefits is critical for modeling long-term industry structures.",
          pages: 44,
          url: "https://www.nber.org/papers/w31699",
          tags: ["AI", "Labor Economics", "NBER", "Productivity", "Inequality"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 16: EXECUTIVE INTELLIGENCE
    // ─────────────────────────────────────────────────────────────
    {
      id: "executive-intelligence",
      number: "16",
      title: "Executive Intelligence",
      icon: "🎯",
      stories: [
        {
          id: "jp-morgan-dimon-letter",
          headline: "Jamie Dimon's Annual Letter 2026: 'AI is Real, Debt is a Problem, China is Complex'",
          summary: "JPMorgan CEO Jamie Dimon's 2026 annual shareholder letter focused on three structural themes: (1) AI as a genuine productivity multiplier — JPM deploying AI across 600+ use cases, (2) US fiscal trajectory as the most underappreciated macro risk, and (3) the need for nuanced China engagement despite competition.",
          whyItMatters: "Dimon's annual letter is required reading because he sees more economic data than almost anyone on earth — JPMorgan processes $10 trillion daily in transactions. When he warns on fiscal policy and AI investment simultaneously, both signals deserve weight.",
          keyNumbers: [
            { label: "JPM AI Use Cases", value: "600+" },
            { label: "JPM Annual Revenue", value: "$175 Billion" },
            { label: "JPM Profit (2025)", value: "$58.5 Billion" },
            { label: "US Debt/GDP (Dimon's concern)", value: "123%" },
            { label: "JPM Employees using AI daily", value: "55,000+" }
          ],
          marketImpact: "Dimon's AI endorsement is significant — banking sector AI adoption accelerating. His debt warning: risk-off event if US downgraded (Moody's downgraded US in May 2025).",
          indiaImpact: "JPMorgan is a major FPI in Indian markets. Dimon's positive India view (mentioned separately) supports continued JPM India allocation.",
          globalImpact: "Most influential banking CEO globally. Dimon's policy recommendations carry weight with US Treasury, Fed, and G7 finance ministers.",
          source: "JPMorgan Chase Annual Report",
          sourceUrl: "https://www.jpmorganchase.com/ir/annual-report",
          readMoreUrl: "https://www.jpmorganchase.com/ir/annual-report",
          tags: ["Jamie Dimon", "JPMorgan", "AI Banking", "Shareholder Letter", "Executive Intelligence"]
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 17: BOOK RECOMMENDATION
    // ─────────────────────────────────────────────────────────────
    {
      id: "book-recommendation",
      number: "17",
      title: "Book Recommendation",
      icon: "📖",
      book: {
        title: "The Price of Time: The Real Story of Interest",
        author: "Edward Chancellor",
        year: 2022,
        publisher: "Atlantic Monthly Press",
        category: "Finance / Economic History",
        summary: "Chancellor traces the history of interest rates from Mesopotamia to the present day — arguing that the suppression of interest rates by central banks creates misallocation of capital, inflates bubbles, and ultimately produces the very crises they are meant to prevent. A masterpiece of financial history with urgent relevance in today's rate normalization environment.",
        whyRead: "In an era when every central banker and investor is trying to understand the consequences of zero-rate policies and now rapid normalization, Chancellor provides the 5,000-year perspective that policy models cannot. If you work in fixed income, banking, or macro, this is essential.",
        keyConcept: "Natural Rate of Interest (Wicksellian) — the rate at which savings equal investment. When central banks force rates below this rate, capital flows to speculation rather than productive investment.",
        rating: "⭐⭐⭐⭐⭐",
        buyLink: "https://www.amazon.in/Price-Time-Real-Story-Interest/dp/0802159648"
      }
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION 18: QUOTE OF THE DAY
    // ─────────────────────────────────────────────────────────────
    {
      id: "quote-of-day",
      number: "18",
      title: "Quote of the Day",
      icon: "💬",
      quote: {
        text: "Risk comes from not knowing what you're doing.",
        author: "Warren Buffett",
        context: "On the true nature of investment risk — and why deep knowledge reduces it better than any hedge."
      }
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // ECONOMIC CALENDAR
  // ─────────────────────────────────────────────────────────────
  economicCalendar: [
    { date: "Jul 14", event: "US Retail Sales (Jun)", country: "US", importance: "high" },
    { date: "Jul 15", event: "China GDP Q2 2026 (Flash)", country: "CN", importance: "high" },
    { date: "Jul 16", event: "India WPI Inflation (Jun)", country: "IN", importance: "medium" },
    { date: "Jul 17", event: "Eurozone CPI Final (Jun)", country: "EU", importance: "medium" },
    { date: "Jul 18", event: "Japan CPI (Jun)", country: "JP", importance: "medium" },
    { date: "Jul 21", event: "India BSE Options Expiry", country: "IN", importance: "medium" },
    { date: "Jul 23", event: "HDFC Bank Q1 Detailed Results Call", country: "IN", importance: "high" },
    { date: "Jul 25", event: "US PCE Deflator (Jun)", country: "US", importance: "high" },
    { date: "Jul 29", event: "RBI MPC Meeting Begins", country: "IN", importance: "critical" },
    { date: "Aug 1", event: "India PMI Manufacturing (Jul)", country: "IN", importance: "medium" },
    { date: "Aug 6", event: "RBI MPC Decision + Press Conference", country: "IN", importance: "critical" },
    { date: "Aug 12", event: "India CPI Inflation (Jul)", country: "IN", importance: "high" },
    { date: "Aug 14", event: "India IIP (Jun) + WPI (Jul)", country: "IN", importance: "high" },
    { date: "Aug 27", event: "Fed Jackson Hole Symposium Begins", country: "US", importance: "critical" },
    { date: "Sep 17", event: "FOMC Meeting (Rate Decision)", country: "US", importance: "critical" }
  ],

  // ─────────────────────────────────────────────────────────────
  // GLOSSARY
  // ─────────────────────────────────────────────────────────────
  glossary: [
    {
      term: "Repo Rate",
      category: "Monetary Policy",
      definition: "The rate at which the RBI lends short-term funds to commercial banks against government securities.",
      formula: "Cost of overnight borrowing from RBI",
      example: "If Repo Rate = 6.25%, banks can borrow ₹100 Cr overnight from RBI by pledging G-Secs, and repay ₹100 Cr + ₹17,123 interest the next day.",
      whyItMatters: "The foundational rate that anchors all other interest rates in the Indian economy. A cut in repo rate eventually reduces home loan, auto loan, and corporate loan rates."
    },
    {
      term: "SDF",
      fullForm: "Standing Deposit Facility",
      category: "Monetary Policy",
      definition: "The rate at which the RBI absorbs excess liquidity from banks overnight. The floor of the RBI's interest rate corridor.",
      formula: "SDF Rate = Repo Rate - 25bps",
      example: "Banks with excess cash can park funds with RBI at 6.00% overnight via SDF.",
      whyItMatters: "The SDF replaced the Reverse Repo Rate as the effective floor of the rate corridor. It determines the minimum return banks earn on overnight surplus funds."
    },
    {
      term: "CRR",
      fullForm: "Cash Reserve Ratio",
      category: "Banking / Monetary Policy",
      definition: "The minimum percentage of a bank's Net Demand and Time Liabilities (NDTL) that must be maintained as cash with the RBI.",
      formula: "CRR = (Cash with RBI / Total NDTL) × 100",
      example: "If a bank has ₹1,000 Cr in deposits (NDTL) and CRR = 4%, it must keep ₹40 Cr with the RBI. This ₹40 Cr earns zero interest.",
      whyItMatters: "CRR is a direct tool to control money supply. A 50bps CRR cut injects approximately ₹1.1 lakh crore into the banking system."
    },
    {
      term: "SLR",
      fullForm: "Statutory Liquidity Ratio",
      category: "Banking / Monetary Policy",
      definition: "The minimum percentage of a bank's NDTL that must be maintained in liquid assets: cash, gold, or government securities.",
      formula: "SLR = (Liquid Assets / NDTL) × 100",
      example: "With SLR = 18% and NDTL of ₹1,000 Cr, the bank must hold ₹180 Cr in G-Secs/gold/cash.",
      whyItMatters: "SLR creates a captive buyer for government bonds, suppressing G-Sec yields. It's one reason India's government can finance its deficit relatively cheaply."
    },
    {
      term: "VRRR",
      fullForm: "Variable Rate Reverse Repo",
      category: "Monetary Policy / Liquidity",
      definition: "An auction mechanism through which the RBI absorbs excess liquidity from banks for a specified tenor at variable rates determined by competitive bidding.",
      formula: "Banks bid the rate at which they're willing to lend to RBI. Lowest bidders get preference.",
      example: "In a ₹1 lakh crore VRRR auction, banks compete to park surplus funds with RBI. If RBI's cutoff is 6.22%, only bids at 6.22% or below get accepted.",
      whyItMatters: "VRRR replaced the older fixed-rate reverse repo as the RBI's primary tool for absorbing surplus liquidity. Critically important for understanding money market rates."
    },
    {
      term: "Yield Curve",
      category: "Fixed Income",
      definition: "A graphical representation showing the relationship between bond yields and their maturities (short to long term) for securities of similar credit quality.",
      formula: "Plot of Yield (Y-axis) vs. Maturity (X-axis)",
      example: "Normal curve: 3M T-Bill at 6.65%, 5Y G-Sec at 6.82%, 10Y G-Sec at 6.98%. Inverted: short rates > long rates (signals recession ahead).",
      whyItMatters: "The shape of the yield curve is one of the most reliable predictors of economic conditions. An inverted US yield curve has preceded every US recession for 50 years."
    },
    {
      term: "Duration",
      category: "Fixed Income",
      definition: "A measure of a bond's sensitivity to changes in interest rates, expressed in years. Specifically, Modified Duration measures the percentage change in bond price for a 1% change in yield.",
      formula: "Modified Duration = Macaulay Duration / (1 + YTM/n)",
      example: "A bond with Modified Duration of 7 years will fall ~7% in price if interest rates rise 1%. Conversely, it gains ~7% if rates fall 1%.",
      whyItMatters: "Duration is the most important metric for managing interest rate risk. Long-duration bond funds are more sensitive to rate changes than short-duration funds."
    },
    {
      term: "NPA",
      fullForm: "Non-Performing Asset",
      category: "Banking",
      definition: "A loan or advance where the borrower has not paid interest or principal for 90 days or more.",
      formula: "GNPA Ratio = Gross NPA / Gross Advances × 100",
      example: "If a bank has ₹1,000 Cr in loans and ₹28 Cr haven't been repaid for 90+ days, GNPA = 2.8%.",
      whyItMatters: "NPA ratio is the primary measure of bank asset quality. High NPAs reduce bank profitability, erode capital, and constrain new lending — damaging economic growth."
    },
    {
      term: "CASA",
      fullForm: "Current Account Savings Account",
      category: "Banking",
      definition: "The proportion of a bank's total deposits held in current and savings accounts, which are low-cost or zero-cost deposits for the bank.",
      formula: "CASA Ratio = (Current + Savings Deposits) / Total Deposits × 100",
      example: "If a bank has ₹100 Cr total deposits with ₹44 Cr in current/savings accounts, CASA = 44%.",
      whyItMatters: "High CASA = lower cost of funds = higher NIM (Net Interest Margin) = more profitable bank. HDFC Bank's ~44% CASA is a key competitive advantage."
    },
    {
      term: "NIM",
      fullForm: "Net Interest Margin",
      category: "Banking",
      definition: "The difference between interest income earned on loans and interest paid on deposits, expressed as a percentage of interest-earning assets.",
      formula: "NIM = (Interest Income – Interest Expense) / Average Earning Assets × 100",
      example: "Bank earns 9% on loans, pays 5% on deposits, with ₹500 Cr assets → NIM = (9%-5%) × 500 = ₹20 Cr = 4%.",
      whyItMatters: "NIM is the core profitability metric for banks. Rising NIMs signal improving margins; falling NIMs may indicate competitive pressure or rising deposit costs."
    },
    {
      term: "Basis Point (bps)",
      category: "Finance",
      definition: "One hundredth of one percentage point (0.01%). Used to describe changes in interest rates, bond yields, and spreads.",
      formula: "1 bps = 0.01% = 0.0001",
      example: "If the RBI cuts repo rate by 25bps, the repo rate drops from 6.25% to 6.00%.",
      whyItMatters: "Financial markets quote rate changes in basis points to avoid ambiguity. '25bps cut' is unambiguous; 'quarter percent cut' could be misinterpreted."
    },
    {
      term: "G-Sec",
      fullForm: "Government Security",
      category: "Fixed Income",
      definition: "Debt instruments issued by the Government of India with a fixed tenure, coupon, and face value. The risk-free benchmark for Indian fixed income.",
      formula: "Yield = Coupon Payment / Current Price × 100 (simplified)",
      example: "A 10Y G-Sec with face value ₹100, coupon 7%, trading at ₹100 → yield = 7%. If price rises to ₹102, yield falls below 7%.",
      whyItMatters: "G-Sec yields are the foundation of all Indian interest rates. Corporate bonds, bank FDs, and loan rates are all priced relative to G-Sec yields."
    },
    {
      term: "PCR",
      fullForm: "Provision Coverage Ratio",
      category: "Banking",
      definition: "The percentage of NPAs for which the bank has set aside provisions (reserves) from profits.",
      formula: "PCR = Provisions / Gross NPA × 100",
      example: "If a bank has ₹100 Cr GNPA and ₹78 Cr in provisions, PCR = 78%. If the NPA is finally written off, only ₹22 Cr impacts P&L.",
      whyItMatters: "Higher PCR = more conservative and better prepared bank. PCR above 70% is considered healthy. Low PCR with high NPAs = future earnings shock risk."
    },
    {
      term: "CET-1",
      fullForm: "Common Equity Tier 1 Capital",
      category: "Banking / Basel",
      definition: "The highest quality capital of a bank — consisting of paid-up equity capital and retained earnings. The primary loss-absorbing buffer under Basel III.",
      formula: "CET-1 Ratio = CET-1 Capital / Risk-Weighted Assets × 100",
      example: "A bank with ₹10,000 Cr CET-1 and ₹100,000 Cr RWA has a CET-1 ratio of 10%, well above the 6% Basel minimum.",
      whyItMatters: "CET-1 is the ultimate measure of bank strength. Higher CET-1 = better crisis absorption. Banks with CET-1 below 8% face regulatory scrutiny."
    },
    {
      term: "OMO",
      fullForm: "Open Market Operations",
      category: "Monetary Policy",
      definition: "RBI's purchase or sale of government securities in the open market to inject or absorb liquidity from the banking system.",
      formula: "OMO Purchase → injects liquidity → bond yields fall. OMO Sale → absorbs liquidity → bond yields rise.",
      example: "RBI buys ₹25,000 Cr of G-Secs from banks → banks receive cash → liquidity in system increases → interest rates ease.",
      whyItMatters: "OMOs are the most powerful tool RBI has for managing both liquidity and long-term bond yields. Large OMO purchases can rally bond markets significantly."
    },
    {
      term: "YTM",
      fullForm: "Yield to Maturity",
      category: "Fixed Income",
      definition: "The total expected return on a bond if held until maturity, accounting for coupon payments and the gain/loss from buying at a discount/premium to face value.",
      formula: "YTM = [C + (F-P)/n] / [(F+P)/2], where C=coupon, F=face value, P=price, n=years to maturity",
      example: "Bond: Face ₹1000, Coupon 7% (₹70/yr), Price ₹950, Maturity 5Y → YTM ≈ 8.2%.",
      whyItMatters: "YTM is the single most important metric for comparing bonds. A bond trading at a discount (price < face) will have YTM > coupon rate, and vice versa."
    },
    {
      term: "FII / FPI",
      fullForm: "Foreign Institutional Investor / Foreign Portfolio Investor",
      category: "Markets",
      definition: "Foreign entities registered with SEBI to invest in Indian securities markets. FPI is the newer, broader term replacing FII.",
      formula: "Net FII/FPI Flow = Purchases – Sales",
      example: "If FPIs buy ₹15,000 Cr of Indian equities and sell ₹6,760 Cr in a week, net FPI = +₹8,240 Cr (net buyers).",
      whyItMatters: "FPI flows are the single most influential short-term driver of Indian market direction. Heavy FPI selling = INR depreciation + market fall. FPI buying = INR strengthening + rally."
    },
    {
      term: "CAD",
      fullForm: "Current Account Deficit",
      category: "Macroeconomics",
      definition: "When a country's imports of goods, services, and transfers exceed its exports — the gap must be financed by capital flows.",
      formula: "CAD = (Imports – Exports) + (Net Transfer Income) + (Net Income from Abroad)",
      example: "India imports ₹5,00,000 Cr of goods/services, exports ₹4,60,000 Cr. Net: -₹40,000 Cr deficit = CAD.",
      whyItMatters: "India's CAD is primarily driven by oil and gold imports. Lower oil prices directly reduce India's CAD. Persistent high CAD → INR depreciation pressure → inflation → RBI headache."
    },
    {
      term: "UPI",
      fullForm: "Unified Payments Interface",
      category: "Payments",
      definition: "A real-time payment system developed by NPCI that enables instant fund transfers between bank accounts using a mobile phone, 24/7/365.",
      formula: "Settlement: Payer's bank debits → NPCI routes → Payee's bank credits (within seconds)",
      example: "Scanning a QR code at a grocery store and paying ₹500 from your savings account — settled instantly via UPI.",
      whyItMatters: "UPI has revolutionized India's payment landscape. 18 billion monthly transactions. Zero transaction cost for users (MDR = 0 by government mandate). The template for other countries' digital payment systems."
    },
    {
      term: "CBDC",
      fullForm: "Central Bank Digital Currency",
      category: "Payments / Monetary Policy",
      definition: "A digital form of sovereign currency issued directly by a central bank — a digital equivalent of physical banknotes.",
      formula: "CBDC = Legal tender issued as digital token/account by central bank",
      example: "India's e-Rupee: you hold ₹1,000 in a digital wallet issued by your bank but backed directly by RBI — not a bank deposit.",
      whyItMatters: "CBDCs allow programmable money (conditional payments), reduce intermediary costs, improve monetary policy transmission, and enable financial inclusion without traditional bank accounts."
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // FINANCIAL CALCULATIONS REFERENCE
  // ─────────────────────────────────────────────────────────────
  calculations: [
    {
      name: "Bond Yield (Current Yield)",
      formula: "Current Yield = Annual Coupon / Current Market Price × 100",
      example: "Bond with ₹1,000 face value, 7% coupon (₹70/yr), trading at ₹950: Current Yield = 70/950 × 100 = 7.37%",
      interpretation: "Bond trading below face value (at discount) has current yield > coupon rate. Important: this ignores capital gain/loss at maturity."
    },
    {
      name: "Modified Duration",
      formula: "Modified Duration = Macaulay Duration / (1 + YTM/m), where m = coupon payments per year",
      example: "Bond with Macaulay Duration of 7.5 years, YTM 7.0%, annual coupons: Modified Duration = 7.5 / 1.07 = 7.01 years",
      interpretation: "If rates rise 1%, this bond falls ~7.01% in price. If rates fall 1%, bond gains ~7.01%. Critical for bond fund risk management."
    },
    {
      name: "Capital Adequacy Ratio (CRAR)",
      formula: "CRAR = (Tier 1 Capital + Tier 2 Capital) / Risk-Weighted Assets × 100",
      example: "Bank: Tier 1 = ₹8,000 Cr, Tier 2 = ₹2,000 Cr, RWA = ₹58,800 Cr → CRAR = 10,000/58,800 × 100 = 17.0%",
      interpretation: "RBI minimum: 11.5% (including capital conservation buffer). Higher CRAR = better-capitalized, safer bank. Current system avg: 16.9%."
    },
    {
      name: "Return on Equity (ROE)",
      formula: "ROE = Net Profit / Average Shareholders' Equity × 100",
      example: "Bank: Net Profit ₹16,175 Cr, Avg Equity ₹1,20,000 Cr → ROE = 16,175/1,20,000 × 100 = 13.5%",
      interpretation: "ROE measures how efficiently management uses equity capital. Indian private banks: 15-18% ROE. PSU banks: 8-12% ROE. RoE > Cost of Equity = value creation."
    },
    {
      name: "Price-to-Earnings (P/E) Ratio",
      formula: "P/E = Market Price per Share / Earnings per Share (EPS)",
      example: "Stock price: ₹1,800. EPS (trailing 12 months): ₹82.5. P/E = 1800/82.5 = 21.8x",
      interpretation: "P/E tells you how much investors pay for each rupee of earnings. Nifty 50 at 21.8x means investors pay ₹21.80 for ₹1 of earnings. Compare to historical average (20.5x) to assess valuation."
    },
    {
      name: "CAGR (Compound Annual Growth Rate)",
      formula: "CAGR = (Ending Value / Beginning Value)^(1/Years) - 1",
      example: "UPI volume grew from 4.57B (2021) to 18.04B (2026) in 5 years: CAGR = (18.04/4.57)^(1/5) - 1 = 31.7%",
      interpretation: "CAGR smooths out year-to-year volatility to show the steady annual growth rate needed to reach from start to end value. More meaningful than absolute growth % for multi-year comparisons."
    }
  ]
};
