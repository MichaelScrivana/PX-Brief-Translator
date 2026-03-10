// Synthetic consumer personas for the Overnight Synthesis Loop demo
// Each persona represents a distinct consumer archetype with unique
// health contexts, decision styles, and AI agent delegation models

export const PERSONAS = [
  {
    id: "maria",
    name: "Maria Chen",
    age: 34,
    location: "San Francisco, CA",
    segment: "Health-Conscious Millennial",
    occupation: "Marketing Manager",
    gradient: ["#FF6B6B", "#EE5A24"],
    health: {
      context: "Recently diagnosed with Vitamin D deficiency after routine bloodwork. Concerned about bone density given family history of osteoporosis. Actively managing stress through yoga and meditation.",
      goals: ["Optimize bone health", "Maintain energy levels", "Reduce inflammation"],
      decisionStyle: "Research-driven. Reads clinical studies, checks third-party certifications (USP, NSF), compares active ingredient forms (D3 vs D2, cholecalciferol vs ergocalciferol).",
      purchaseTriggers: ["Clinical evidence", "Third-party testing", "Clean ingredient lists", "Transparent sourcing"],
      dealbreakers: ["Proprietary blends", "No third-party verification", "Artificial colors or fillers", "Vague dosage claims"],
      channels: ["Amazon (with verification)", "Thrive Market", "Direct from brand sites"],
      influences: ["Examine.com", "PubMed abstracts", "Reddit r/supplements", "Rhonda Patrick podcast"]
    },
    agentBehavior: {
      delegationModel: "Partial delegation — would use an AI agent to compile options and evidence, but insists on making the final decision herself after reviewing source studies.",
      trustLevel: "Medium-high. Trusts the agent for research aggregation but verifies key claims independently.",
      agentQuery: "Find me a Vitamin D3 supplement with at least 2000 IU per serving, USP or NSF certified, no artificial additives, with published bioavailability data. Compare the top 3 options by price per IU, evidence quality, and user reviews.",
      evaluationCriteria: ["Evidence quality score", "Certification status", "Ingredient transparency", "Price-per-unit value", "Manufacturing standards"]
    },
    deepDive: {
      quote: "I don't want to become a supplement expert. I just want to know I'm taking something that actually works and isn't full of junk.",
      dayInLife: "Maria starts her morning at 6:30 with a yoga session, followed by a green smoothie where she adds her supplements. She keeps a small tray of three supplements by the blender — Vitamin D, magnesium, and omega-3. She chose each one after weeks of research, bookmarking studies in Notion. On Sunday evenings she reviews her supplement stack against any new research she's encountered during the week. She's the person friends text when they want a supplement recommendation.",
      hiddenNeed: "Maria doesn't actually want to do all this research. She does it because she doesn't trust brands to be honest. If a brand could prove — through transparent, verifiable data — that their product was the best option, she'd happily stop researching and just buy it. Her hidden need is trust infrastructure, not more information.",
      journeyStages: [
        { stage: "Trigger", description: "Blood test shows Vitamin D at 18 ng/mL", emotion: "Concerned", color: "#FF6B6B" },
        { stage: "Research", description: "Deep dive into D3 forms, dosages, absorption factors", emotion: "Overwhelmed then focused", color: "#FECA57" },
        { stage: "Evaluate", description: "Narrows to 3 options using certification + evidence criteria", emotion: "Analytical", color: "#48DBFB" },
        { stage: "Purchase", description: "Buys from brand site after checking batch testing results", emotion: "Cautiously confident", color: "#0ABDE3" },
        { stage: "Routine", description: "Integrated into morning smoothie ritual, 90% adherence", emotion: "Satisfied", color: "#10AC84" },
        { stage: "Re-evaluate", description: "Quarterly review against new research, considers switching", emotion: "Curious", color: "#EE5A24" }
      ]
    },
    pxImplications: {
      research: "Claims must withstand scrutiny from informed consumers. HUT studies should include bioavailability metrics that can be consumer-facing.",
      design: "Packaging must signal clinical credibility — not lifestyle branding. Think medical journal, not wellness Instagram.",
      packaging: "QR code linking to batch testing results would directly address her trust gap.",
      agentReadiness: "Product data must include structured fields for: certification type, testing methodology, active ingredient form, and bioavailability data."
    }
  },
  {
    id: "robert",
    name: "Robert Blackwell",
    age: 68,
    location: "Scottsdale, AZ",
    segment: "Active Senior",
    occupation: "Retired Aerospace Engineer",
    gradient: ["#54A0FF", "#2E86DE"],
    health: {
      context: "Managing age-related bone density concerns and joint health. Takes 6 supplements daily as part of a regimented health protocol developed with his doctor. Tracks health metrics meticulously.",
      goals: ["Maintain bone density", "Support joint mobility", "Cognitive sharpness"],
      decisionStyle: "Systematic and data-driven. Maintains a spreadsheet tracking supplement brands, dosages, costs, and perceived effects. Consults with his doctor quarterly.",
      purchaseTriggers: ["Doctor recommendation", "Consistent quality over time", "Clear dosage information", "Established brand reputation"],
      dealbreakers: ["Frequent formula changes", "Unclear country of origin", "Gummy formats (prefers capsules)", "Inconsistent tablet sizes"],
      channels: ["Costco", "CVS pharmacy counter", "Amazon Subscribe & Save"],
      influences: ["His doctor", "Consumer Reports", "AARP publications", "Other retirees in his golf group"]
    },
    agentBehavior: {
      delegationModel: "Monitoring agent — would use AI to track price changes, formula updates, and alert him to any recalls or quality issues with his current supplements. Not for discovery, but for vigilance.",
      trustLevel: "Low for purchasing decisions, high for monitoring. Trusts his doctor over any AI recommendation.",
      agentQuery: "Monitor my current Vitamin D3 supplement (Nature Made 2000 IU) for any formula changes, recall notices, or significant price increases. Alert me if Consumer Reports or my doctor's medical association publishes new guidelines for Vitamin D supplementation in men over 65.",
      evaluationCriteria: ["Formula consistency", "Manufacturing reliability", "Price stability", "Doctor endorsement alignment"]
    },
    deepDive: {
      quote: "I've been taking the same brand for nine years. I don't need something better — I need to know nothing's changed.",
      dayInLife: "Robert's morning routine hasn't changed in a decade. Coffee at 6:00 AM, supplements at 6:15 (laid out the night before in a weekly pill organizer), walk the dog at 6:30, breakfast at 7:00. He updates his health tracking spreadsheet every Sunday — blood pressure, weight, supplement inventory, cost per month. When he noticed his Vitamin D brand changed their tablet coating last year, he called the manufacturer to ask why. He switches brands only when forced to.",
      hiddenNeed: "Robert represents the highest-value consumer segment — loyal, consistent, high-adherence — but brands treat him as passive. His hidden need is acknowledgment of his loyalty and a guarantee of consistency. A 'nothing has changed' notification would be more valuable to him than any new product launch.",
      journeyStages: [
        { stage: "Trigger", description: "Doctor recommends Vitamin D after DEXA scan at age 59", emotion: "Methodical", color: "#54A0FF" },
        { stage: "Research", description: "Consumer Reports comparison, pharmacist consultation", emotion: "Thorough", color: "#48DBFB" },
        { stage: "Purchase", description: "Nature Made from Costco, adds to Subscribe & Save", emotion: "Decisive", color: "#0ABDE3" },
        { stage: "Routine", description: "Daily pill organizer, 99% adherence for 9 years", emotion: "Disciplined", color: "#10AC84" },
        { stage: "Monitor", description: "Checks for formula changes, price shifts, new guidelines", emotion: "Vigilant", color: "#FECA57" },
        { stage: "Disruption", description: "Only switches if forced: discontinuation, recall, or doctor orders", emotion: "Reluctant", color: "#FF6B6B" }
      ]
    },
    pxImplications: {
      research: "Longitudinal consistency data matters more than novelty claims. His segment values 'unchanged for 10 years' over 'new and improved'.",
      design: "Packaging changes — even cosmetic ones — create anxiety in this segment. Any redesign needs clear 'same trusted formula' messaging.",
      packaging: "Ergonomic considerations critical: easy-open caps, readable text at arm's length, tablet size consistency.",
      agentReadiness: "Product data needs version history — when was the formula last changed? When was packaging last updated? This metadata doesn't exist for most brands."
    }
  },
  {
    id: "tyler",
    name: "Tyler Okafor",
    age: 22,
    location: "Austin, TX",
    segment: "Gen Z Wellness Native",
    occupation: "UX Design Student",
    gradient: ["#A29BFE", "#6C5CE7"],
    health: {
      context: "Plant-based diet since 18, concerned about potential nutrient gaps. Approaches health through a holistic lens — mental health, gut health, and physical health as interconnected. Gets health information primarily through TikTok and YouTube.",
      goals: ["Fill nutritional gaps from plant-based diet", "Support mental clarity", "Sustainable and ethical consumption"],
      decisionStyle: "Values-driven, community-influenced. Checks brand ethics before checking ingredients. Looks for BIPOC-owned, B-Corp certified, or sustainability-forward brands. Makes decisions fast but switches frequently.",
      purchaseTriggers: ["Brand values alignment", "Aesthetic packaging", "Influencer endorsement from trusted creators", "Vegan certification"],
      dealbreakers: ["Animal-derived ingredients", "Greenwashing", "Corporate-feeling branding", "Non-recyclable packaging"],
      channels: ["Brand DTC websites", "Whole Foods", "Instagram Shop", "TikTok Shop"],
      influences: ["TikTok wellness creators", "Friends' Instagram stories", "Brand founder stories", "Sustainability ratings apps"]
    },
    agentBehavior: {
      delegationModel: "Full optimization delegation — would hand the entire supplement selection process to an AI agent, with value constraints as the primary filter. Wants the agent to build and continuously optimize a personalized stack.",
      trustLevel: "High for AI, low for brands. Trusts an AI agent to be more objective than brand marketing. Would accept agent recommendations if the reasoning is transparent.",
      agentQuery: "Build me a supplement stack for a 22-year-old vegan male in Texas. Prioritize: filling B12 and D3 gaps, supporting focus for long study sessions, and gut health. Only include brands that are vegan-certified, use recyclable packaging, and have transparent supply chains. Optimize for cost under $40/month total. Update monthly if better options appear.",
      evaluationCriteria: ["Vegan certification", "Sustainability score", "Brand ethics rating", "Cost efficiency", "Packaging recyclability"]
    },
    deepDive: {
      quote: "I'd rather take nothing than support a brand that doesn't align with my values. But honestly, I'd love an AI to just handle this for me.",
      dayInLife: "Tyler wakes up around 9, checks his phone for 20 minutes (TikTok, then Instagram), makes a smoothie bowl with whatever's in the fridge. His supplements sit in a small ceramic bowl on his desk — he chose the brands partly because the bottles look good on his shelf. He takes them inconsistently — maybe 4 out of 7 days. When he sees a new supplement brand on TikTok with good aesthetics and a compelling founder story, he'll order it before finishing his current supply. His supplement shelf has three half-empty bottles from different brands.",
      hiddenNeed: "Tyler's inconsistent adherence isn't about forgetting — it's about waning enthusiasm. Each new brand purchase is an identity expression. His hidden need is a brand relationship that evolves with him, not a static product. He'd be the most loyal customer of a brand that updated its formulation, packaging, and storytelling seasonally — like a fashion drop model applied to supplements.",
      journeyStages: [
        { stage: "Trigger", description: "TikTok video about vegan nutrient gaps goes viral in his feed", emotion: "Curious, slightly anxious", color: "#A29BFE" },
        { stage: "Discover", description: "Sees brand on Instagram, checks their values page and founder story", emotion: "Intrigued", color: "#6C5CE7" },
        { stage: "Validate", description: "Quick check: vegan cert, recyclable packaging, ingredient list scan", emotion: "Decisive", color: "#48DBFB" },
        { stage: "Purchase", description: "Impulse buy from TikTok Shop or brand DTC site", emotion: "Excited", color: "#0ABDE3" },
        { stage: "Honeymoon", description: "Posts unboxing, takes daily for 2-3 weeks", emotion: "Enthusiastic", color: "#10AC84" },
        { stage: "Drift", description: "Adherence drops, new brand catches attention, cycle repeats", emotion: "Distracted", color: "#FECA57" }
      ]
    },
    pxImplications: {
      research: "Traditional HUT methodology may not capture this segment's decision drivers — brand narrative and values matter more than product performance in initial purchase. Need ethnographic approaches.",
      design: "Packaging IS the product for this segment. Shelf appeal, Instagram-worthiness, and unboxing experience drive purchase more than claims.",
      packaging: "Sustainability must be verifiable, not just claimed. QR code to supply chain transparency dashboard. Recyclability must be genuine and easy.",
      agentReadiness: "Agent data needs to include: brand ethics scores, vegan certifications, packaging material composition, and supply chain transparency ratings. These fields don't exist in standard product databases."
    }
  },
  {
    id: "linda",
    name: "Linda Meyers",
    age: 52,
    location: "Minneapolis, MN",
    segment: "Family Health Manager",
    occupation: "School Administrator",
    gradient: ["#FECA57", "#FF9F43"],
    health: {
      context: "Manages health products for a household of four — herself, her husband (55), and two teenagers (16 and 14). Recently started taking Vitamin D after reading a WebMD article about northern latitude deficiency. Also manages her mother's supplement regimen remotely.",
      goals: ["Ensure family gets essential nutrients", "Simplify supplement management", "Stay within household budget"],
      decisionStyle: "Practical and trust-based. Goes with brands she recognizes from the pharmacy shelf. Doesn't read studies but trusts 'doctor recommended' labels and pharmacist suggestions. Buys for convenience — family packs, gummies for kids, easy dosing.",
      purchaseTriggers: ["Pharmacist recommendation", "Doctor recommended label", "Family-size packaging", "BOGO deals"],
      dealbreakers: ["Complex dosing schedules", "Pill sizes too large", "Expensive per-person cost", "Unfamiliar brand names"],
      channels: ["Target", "Walgreens", "Costco", "Amazon (replenishment)"],
      influences: ["Her pharmacist", "WebMD", "Friends in her book club", "Her mother's doctor"]
    },
    agentBehavior: {
      delegationModel: "Household delegation — would use an AI agent to manage the entire family's supplement schedule, reordering, and budget. Wants a single system that tracks who needs what and when to reorder.",
      trustLevel: "Medium. Would trust an AI agent if it was integrated with her pharmacy or recommended by her pharmacist. Wouldn't trust a standalone AI tool she found online.",
      agentQuery: "I need Vitamin D for my whole family: me (52F), my husband (55M), and two teenagers (16F, 14M). Find options that work for all of us or tell me if we need different products. Keep total cost under $25/month. Prefer brands available at Target or Walgreens. Set up automatic reorder reminders.",
      evaluationCriteria: ["Family suitability", "Cost per household member", "Retail availability", "Dosing simplicity", "Brand recognition"]
    },
    deepDive: {
      quote: "I don't have time to research supplements for four people. Just tell me what's safe, what's effective, and where I can buy it on my Target run.",
      dayInLife: "Linda's mornings are orchestrated chaos. She's out the door by 7:15, but before that she's making lunches, confirming her husband took his blood pressure medication, and reminding the kids about their vitamins (the gummies she keeps in a jar on the kitchen counter — the bottle was too hard for her 14-year-old to open). She takes her own Vitamin D with her morning coffee, standing at the counter, reading the news on her phone. Supplement shopping happens during her weekly Target run — she grabs whatever's on the endcap or on sale from a brand she recognizes. She's the family's health logistics coordinator.",
      hiddenNeed: "Linda is making health decisions for four people with almost no bandwidth to research any of them properly. Her hidden need isn't better products — it's a trusted system that makes the right decisions at household scale. She'd pay a premium for a 'family health subscription' that handled everything: the right products for each person, auto-delivered, with a pharmacist's endorsement.",
      journeyStages: [
        { stage: "Trigger", description: "WebMD article about Vitamin D deficiency in northern climates", emotion: "Mildly concerned", color: "#FECA57" },
        { stage: "Quick Research", description: "Asks pharmacist, checks WebMD, texts book club friends", emotion: "Pragmatic", color: "#FF9F43" },
        { stage: "Purchase", description: "Grabs Nature Made at Target — recognized brand, on sale", emotion: "Efficient", color: "#0ABDE3" },
        { stage: "Distribute", description: "Sets up family routine: gummies for kids, capsules for adults", emotion: "Organized", color: "#10AC84" },
        { stage: "Maintain", description: "Reorders when she notices the bottle is low, inconsistent timing", emotion: "Autopilot", color: "#48DBFB" },
        { stage: "Expand", description: "Adds supplements as new health concerns arise for family members", emotion: "Responsible", color: "#A29BFE" }
      ]
    },
    pxImplications: {
      research: "Household-level research is underrepresented. HUTs should include 'household decision-maker' as a distinct segment — her evaluation criteria are fundamentally different from individual consumers.",
      design: "Family-friendly packaging: easy-open for kids, clear age-appropriate dosing on front panel, visual differentiation between family members' products.",
      packaging: "Counter-display friendly formats. She leaves supplements visible as reminders. Package should look good on a kitchen counter, not just a pharmacy shelf.",
      agentReadiness: "Product data needs household-level fields: age-appropriate dosing ranges, family pack availability, cross-product compatibility (can the whole family take the same product?), and retail location inventory."
    }
  },
  {
    id: "david",
    name: "David Park",
    age: 41,
    location: "Chicago, IL",
    segment: "Mainstream Maintainer",
    occupation: "IT Project Manager",
    gradient: ["#636E72", "#2D3436"],
    health: {
      context: "Knows he should take supplements but has no strong opinion about brands or formulations. Doctor mentioned Vitamin D at his last physical but didn't push it. Health-conscious in theory but passive in practice — eats reasonably well, exercises occasionally, doesn't track anything.",
      goals: ["Check the 'taking supplements' box", "Not overpay", "Minimal effort"],
      decisionStyle: "Path of least resistance. Buys whatever is most convenient and reasonably priced. Won't compare more than two options. Amazon's Choice badge is good enough. Doesn't read labels beyond the front panel.",
      purchaseTriggers: ["Amazon's Choice or Best Seller badge", "Price under $15", "4+ star rating", "One-a-day format"],
      dealbreakers: ["Complex regimens", "Strong taste or smell", "Large pills", "Subscription traps"],
      channels: ["Amazon (primary)", "Whatever pharmacy is nearest"],
      influences: ["Amazon algorithm", "His wife", "Occasional health article that makes him feel guilty"]
    },
    agentBehavior: {
      delegationModel: "Full delegation, zero oversight — would hand the entire decision to an AI agent and never think about it again. The ideal outcome is: agent picks it, agent orders it, it shows up, he takes it.",
      trustLevel: "High by default. Not because he's evaluated the AI's credibility — because he doesn't care enough to question it. Trust through apathy.",
      agentQuery: "Just pick me a good Vitamin D supplement. Nothing fancy. Under $15. Deliver it to my door. Reorder when I'm running low.",
      evaluationCriteria: ["Convenience", "Price", "Social proof (ratings/reviews)", "Simplicity"]
    },
    deepDive: {
      quote: "I literally just want someone to tell me: take this, once a day, it costs this much, here's why. Done.",
      dayInLife: "David's morning is coffee, email, commute. He bought Vitamin D three months ago after his wife mentioned his doctor's suggestion for the third time. The bottle is in the kitchen cabinet behind the cereal boxes — he takes it maybe twice a week when he happens to see it. He doesn't know the dosage. He couldn't name the brand without checking. When the bottle runs out, there's a 50/50 chance he'll reorder within a month or just forget for six months.",
      hiddenNeed: "David represents the massive drop-off between purchase intent and adherence. The product isn't the problem — the absence of routine integration is. His hidden need is for the supplement to be inserted into his existing habits without requiring any new behavior. A brand that figured out frictionless delivery plus habit-nudging would capture and retain this entire segment.",
      journeyStages: [
        { stage: "Trigger", description: "Doctor mentions Vitamin D, wife reminds him three times", emotion: "Mildly guilty", color: "#636E72" },
        { stage: "Purchase", description: "Amazon search, clicks first 4+ star result, one-click buy", emotion: "Relieved", color: "#0ABDE3" },
        { stage: "Initial Use", description: "Takes it daily for about a week", emotion: "Virtuous", color: "#10AC84" },
        { stage: "Decline", description: "Frequency drops to 2x/week, then occasional", emotion: "Indifferent", color: "#FECA57" },
        { stage: "Dormant", description: "Bottle sits in cabinet, forgotten for months", emotion: "Oblivious", color: "#DFE6E9" },
        { stage: "Re-trigger", description: "Next doctor visit or wife reminder restarts cycle", emotion: "Sheepish", color: "#FF6B6B" }
      ]
    },
    pxImplications: {
      research: "Adherence research is the unlock for this segment. Claimed usage vs. actual usage data would reveal the true scale of the drop-off problem.",
      design: "Counter-visible, habit-integrating packaging. A format designed to sit next to the coffee maker, not in a cabinet. Daily tear-away packs might outperform bottles.",
      packaging: "The package IS the adherence mechanism. If it can't remind him to take it, no amount of product quality matters.",
      agentReadiness: "For David's agent, the only data that matters is: is it well-rated, is it cheap, and can it auto-reorder? Product data needs simple, clear fields — not 50 attributes, just the 5 that drive convenience-based decisions."
    }
  },
  {
    id: "aisha",
    name: "Aisha Williams",
    age: 29,
    location: "Brooklyn, NY",
    segment: "Biohacker / Optimizer",
    occupation: "UX Designer at a Tech Startup",
    gradient: ["#00D2D3", "#01A3A4"],
    health: {
      context: "Deep into the quantified-self movement. Tracks sleep with WHOOP, logs meals in Cronometer, does quarterly blood panels through InsideTracker. Supplements are part of a meticulously optimized stack that she adjusts based on biomarker data.",
      goals: ["Optimize biomarkers to target ranges", "Maximize cognitive performance", "Data-driven health decisions"],
      decisionStyle: "Data-obsessed. Evaluates supplements by their measurable impact on her biomarkers. If she can't measure the effect, she won't take it. Reads ingredient labels at the molecular level — checks for bioavailable forms, cofactors, and potential interactions.",
      purchaseTriggers: ["Bioavailability data", "Synergistic cofactor formulations (D3+K2+magnesium)", "Third-party testing with published results", "Quantified user community endorsement"],
      dealbreakers: ["No bioavailability data", "Cheap ingredient forms (oxide instead of glycinate)", "No synergistic cofactors included", "Marketing claims without mechanism explanation"],
      channels: ["Thorne direct", "Life Extension", "Nootropics Depot", "iHerb"],
      influences: ["Andrew Huberman podcast", "Examine.com", "Bryan Johnson's protocol", "r/Nootropics", "InsideTracker recommendations"]
    },
    agentBehavior: {
      delegationModel: "Closed-loop optimization — wants an AI agent that integrates with her health tracking data, analyzes biomarker trends, and automatically adjusts her supplement stack. The agent should be a health optimization system, not just a shopping assistant.",
      trustLevel: "High, but conditional on data transparency. Will trust the agent's recommendations only if it shows the biomarker data and published research that informed the decision.",
      agentQuery: "My latest blood panel shows 25-OH Vitamin D at 42 ng/mL (target: 50-60). I'm currently taking 3000 IU D3 without K2. Recommend whether to increase dosage or switch to a D3+K2 formulation. Factor in my magnesium (currently at 2.1 mg/dL) and calcium levels. Show me the research supporting the recommendation and projected time to reach target range.",
      evaluationCriteria: ["Biomarker impact evidence", "Ingredient form bioavailability", "Cofactor synergy", "Dose-response data", "Integration with tracking platforms"]
    },
    deepDive: {
      quote: "I don't take supplements on faith. I take them because my data says I need them, and I'll stop the moment my data says I don't.",
      dayInLife: "Aisha wakes at 6 AM when her WHOOP alarm goes off at her optimal sleep stage. Before getting out of bed, she checks her sleep score, HRV, and recovery metrics. Her morning supplement protocol is timed: Vitamin D3+K2 with breakfast (fat-soluble, needs dietary fat for absorption), magnesium glycinate at 8 PM (supports sleep architecture). She's arranged her supplement shelf by the kitchen window like an apothecary — amber glass bottles, labeled with dosage and timing. She logs every supplement dose in Cronometer. Monthly, she reviews her stack against her biomarker trends and adjusts.",
      hiddenNeed: "Aisha seems self-sufficient, but she's spending 3-4 hours per month on supplement research and optimization that could be automated. Her hidden need is a trustworthy AI system that can process her biomarker data, cross-reference with current research, and proactively recommend stack adjustments. She doesn't need a product — she needs an intelligent health optimization platform that happens to sell products.",
      journeyStages: [
        { stage: "Baseline", description: "Blood panel reveals Vitamin D at 28 ng/mL, begins protocol", emotion: "Analytical", color: "#00D2D3" },
        { stage: "Research", description: "Deep dive into D3 forms, K2 synergy, optimal dosing curves", emotion: "Absorbed", color: "#01A3A4" },
        { stage: "Protocol Design", description: "Selects D3+K2 from Thorne, 5000 IU, timed with fatty breakfast", emotion: "Systematic", color: "#48DBFB" },
        { stage: "Monitor", description: "Quarterly blood panels, tracking 25-OH-D trending upward", emotion: "Satisfied", color: "#10AC84" },
        { stage: "Optimize", description: "Adjusts dose down to 3000 IU as levels reach target range", emotion: "Precise", color: "#FECA57" },
        { stage: "Iterate", description: "Continuous loop — new data triggers new adjustments", emotion: "Perpetual", color: "#A29BFE" }
      ]
    },
    pxImplications: {
      research: "This segment would be the ideal HUT participant — they'll provide more granular feedback than any study protocol asks for. But standard study designs may bore them.",
      design: "Packaging should communicate molecular precision. Show the ingredient form (cholecalciferol, not just 'Vitamin D3'), the cofactors included, and absorption enhancement technology.",
      packaging: "Amber glass, clinical aesthetic, minimal marketing language. Let the ingredient panel be the hero. Include a QR code linking to the Certificate of Analysis.",
      agentReadiness: "Agent data needs integration APIs — supplement products need to connect with health tracking platforms (WHOOP, InsideTracker, Cronometer). The product data layer needs to include: bioavailable form, cofactor synergies, absorption timing recommendations, and dose-response curves."
    }
  },
  {
    id: "carmen",
    name: "Dr. Carmen Reyes",
    age: 45,
    location: "Houston, TX",
    segment: "Healthcare Professional",
    occupation: "Family Practice Physician",
    gradient: ["#FD79A8", "#E84393"],
    health: {
      context: "Recommends supplements to patients daily but is deeply skeptical of the supplement industry's marketing claims. Takes Vitamin D herself based on her own clinical knowledge. Frustrated by patients bringing in low-quality supplements found on social media.",
      goals: ["Evidence-based patient recommendations", "Counter misinformation", "Efficiency in clinical conversations"],
      decisionStyle: "Evidence-only. Will only recommend products with clinical trial data, GMP certification, and USP verification. Dismisses products that lead with marketing claims over clinical evidence.",
      purchaseTriggers: ["Published clinical trials", "USP/GMP verification", "Healthcare professional channel availability", "Clear, accurate dosing information"],
      dealbreakers: ["Exaggerated claims", "MLM distribution", "No clinical evidence", "Misleading 'doctor recommended' labels from unverified sources"],
      channels: ["Professional samples from pharma reps", "Thorne practitioner portal", "Pure Encapsulations", "Fullscript"],
      influences: ["UpToDate clinical database", "Peer-reviewed journals", "Endocrine Society guidelines", "Colleague recommendations"]
    },
    agentBehavior: {
      delegationModel: "Clinical decision support — would use an AI agent as a rapid evidence synthesizer during patient consultations. Wants to pull up supplement evidence in real-time to guide patient conversations, not for personal shopping.",
      trustLevel: "Very low for consumer AI, very high for clinical AI with verifiable sources. Would only trust an agent that cites peer-reviewed studies with DOI numbers.",
      agentQuery: "For a 55-year-old female patient with osteopenia and Vitamin D at 22 ng/mL, what is the current evidence-based supplementation protocol? Include: recommended dosage range, preferred form, monitoring schedule, potential interactions with her current medications (lisinopril, metformin), and time to expected normalization. Cite guidelines from Endocrine Society and AACE.",
      evaluationCriteria: ["Clinical guideline alignment", "Peer-reviewed evidence", "Drug interaction data", "Dosing precision", "Monitoring protocols"]
    },
    deepDive: {
      quote: "I recommend Vitamin D to patients every single day. What I can't recommend is a specific brand — because none of them give me the clinical-grade data I need to make that call confidently.",
      dayInLife: "Dr. Reyes sees 25 patients a day. At least 5 of them will ask about supplements — and half of those will show her something they found on TikTok that she then has to diplomatically redirect. She keeps a short list of 3 supplement brands she trusts enough to mention (Thorne, Pure Encapsulations, Nature Made with USP seal). She wishes she could just hand patients a curated, evidence-based resource instead of having the same conversation 5 times a day. She takes her own Vitamin D3 — 2000 IU from Thorne — but she chose it in under 30 seconds based on professional familiarity, not consumer research.",
      hiddenNeed: "Carmen is a force multiplier — her single recommendation reaches hundreds of patients per year. But brands market to consumers, not to the physicians who drive those consumers' decisions. Her hidden need is a professional-grade product information system: rapid access to clinical evidence, drug interaction data, and patient-appropriate dosing guidance, branded to the product. The brand that equips her to recommend confidently captures an entire patient panel.",
      journeyStages: [
        { stage: "Clinical Need", description: "Patient presents with low Vitamin D, needs recommendation", emotion: "Routine", color: "#FD79A8" },
        { stage: "Evidence Check", description: "Quick UpToDate lookup for current guidelines", emotion: "Efficient", color: "#E84393" },
        { stage: "Recommend", description: "Suggests general Vitamin D3 supplementation with dosage", emotion: "Confident", color: "#0ABDE3" },
        { stage: "Brand Frustration", description: "Patient asks 'which brand?' — limited ability to recommend specifically", emotion: "Frustrated", color: "#FF6B6B" },
        { stage: "Default", description: "Falls back on 'look for USP seal' or names Thorne/Pure Encapsulations", emotion: "Resigned", color: "#FECA57" },
        { stage: "Follow-up", description: "Re-checks levels in 3 months, adjusts recommendation", emotion: "Methodical", color: "#10AC84" }
      ]
    },
    pxImplications: {
      research: "Healthcare professional research panel is a missing capability. HCPs evaluate products on fundamentally different criteria than consumers — need dedicated research streams.",
      design: "Dual-facing packaging: consumer shelf appeal on front, clinical-grade evidence panel on back with QR to professional monograph.",
      packaging: "Professional sample packaging for clinical settings. Small trial-size packs that physicians can hand to patients directly.",
      agentReadiness: "Clinical agent data needs: drug interaction databases, dosing protocols by indication, clinical guideline citations with DOI links, and professional monographs. This is a completely different data layer than consumer product data."
    }
  },
  {
    id: "james",
    name: "James Whitfield",
    age: 19,
    location: "Columbus, OH",
    segment: "Budget-Conscious Student",
    occupation: "College Sophomore / Part-Time Barista",
    gradient: ["#55E6C1", "#58B19F"],
    health: {
      context: "Living on campus with a meal plan that's heavy on pizza and pasta. Mom sent him Vitamin D gummies when he mentioned feeling tired all winter. Doesn't think much about supplements but takes them when they're around because his mom told him to.",
      goals: ["Not feel tired all the time", "Make mom stop worrying", "Spend as little as possible"],
      decisionStyle: "Non-existent. Uses whatever is given to him or whatever is cheapest. Would never proactively research or purchase supplements. Health decisions are made by proximity and convenience — he takes the gummies because they taste like candy and sit on his desk.",
      purchaseTriggers: ["Free (from mom)", "Gummy format", "Under $8", "Available at campus convenience store"],
      dealbreakers: ["Anything that tastes bad", "Pills (can't swallow them easily)", "Costs more than a meal", "Requires any routine planning"],
      channels: ["Whatever mom sends", "Campus convenience store", "Amazon if someone sends a link"],
      influences: ["His mother", "Roommate", "A YouTube video if it's under 60 seconds"]
    },
    agentBehavior: {
      delegationModel: "Mom's agent — he personally wouldn't use an AI agent for supplements, but his mother absolutely would on his behalf. The real user of a supplement agent isn't always the supplement taker.",
      trustLevel: "Zero personal engagement with AI for health. But high passive acceptance — if an AI-selected supplement showed up in the mail from his mom, he'd take it without question.",
      agentQuery: "(From his mother): My son is a 19-year-old college sophomore in Ohio. He's tired all the time, eating poorly, and won't take pills. Find him a Vitamin D gummy that's cheap, tastes good, and I can send to his dorm on auto-delivery. Nothing he has to think about.",
      evaluationCriteria: ["Taste/format", "Cost", "Auto-delivery capability", "Mom-approval factor", "Zero-effort adherence"]
    },
    deepDive: {
      quote: "Mom sent me these gummy vitamins. They taste like orange candy so I eat like three a day. Is that bad?",
      dayInLife: "James rolls out of bed at 10 for his 10:30 class. No breakfast. The gummy vitamin bottle sits on his desk between his gaming headset and a half-empty energy drink. He grabs two gummies (sometimes three because they taste good) as he walks out the door — not because of health consciousness, but because they're right there and they're essentially candy. He'd never buy supplements himself. When the bottle runs out, he texts his mom and she orders more. His health engagement is entirely passive — mediated by his mother's concern and the gummy format's near-zero friction.",
      hiddenNeed: "James is the future mainstream consumer. His relationship with supplements will be shaped entirely by whatever patterns are established now — and right now those patterns are: passive acceptance of what's given to him, format-driven adherence (gummies only), and zero brand awareness. The hidden opportunity is that whoever captures him now through frictionless, enjoyable formats will have a consumer for decades — if they can bridge the transition from mom-managed to self-managed health.",
      journeyStages: [
        { stage: "Trigger", description: "Mom worries about him being tired, sends gummies", emotion: "Indifferent", color: "#55E6C1" },
        { stage: "Receive", description: "Amazon package arrives at dorm, opens it eventually", emotion: "Mildly pleased", color: "#58B19F" },
        { stage: "Use", description: "Takes gummies because they taste good and are on his desk", emotion: "Absent-minded", color: "#10AC84" },
        { stage: "Overconsume", description: "Eats 3 instead of 2 because they taste like candy", emotion: "Oblivious", color: "#FECA57" },
        { stage: "Run Out", description: "Bottle empty, texts mom, waits 1-2 weeks for refill", emotion: "Unbothered", color: "#DFE6E9" },
        { stage: "Repeat", description: "Cycle continues until he graduates or mom stops sending", emotion: "Passive", color: "#636E72" }
      ]
    },
    pxImplications: {
      research: "Proxy purchaser research needed — the buyer and the user are different people. HUT studies should capture the proxy decision-maker's criteria alongside the end user's experience.",
      design: "Gummy format is non-negotiable for this segment. But overconsumption risk is real — packaging needs to make correct dosing intuitive even for users who aren't reading labels.",
      packaging: "Dorm-proof: compact, doesn't look like 'medicine', ideally desk-display friendly. Consider single-serve daily packs to prevent overconsumption.",
      agentReadiness: "Agent data needs to support proxy purchasing: gift/send-to-another capabilities, age-appropriate dosing warnings, and overconsumption safeguards for gummy formats."
    }
  }
];

// Loop simulation messages — what the agent "says" during generation
export const LOOP_MESSAGES = [
  { text: "Initializing consumer persona synthesis engine", type: "system" },
  { text: "Loading demographic distribution parameters", type: "system" },
  { text: "Generating persona: Health-Conscious Millennial archetype", type: "generate", personaIndex: 0 },
  { text: "Verifying demographic accuracy against census data", type: "verify", personaIndex: 0 },
  { text: "Generating persona: Active Senior archetype", type: "generate", personaIndex: 1 },
  { text: "Cross-referencing health behavior patterns with NIH data", type: "verify", personaIndex: 1 },
  { text: "Generating persona: Gen Z Wellness Native archetype", type: "generate", personaIndex: 2 },
  { text: "Validating values-driven purchase behavior model", type: "verify", personaIndex: 2 },
  { text: "Running diversity check — age range distribution", type: "diversity" },
  { text: "Generating persona: Family Health Manager archetype", type: "generate", personaIndex: 3 },
  { text: "Verifying household decision-making model accuracy", type: "verify", personaIndex: 3 },
  { text: "Generating persona: Mainstream Maintainer archetype", type: "generate", personaIndex: 4 },
  { text: "Validating adherence drop-off behavior model", type: "verify", personaIndex: 4 },
  { text: "Running diversity check — gender and income distribution", type: "diversity" },
  { text: "Generating persona: Biohacker / Optimizer archetype", type: "generate", personaIndex: 5 },
  { text: "Cross-referencing quantified-self behavior patterns", type: "verify", personaIndex: 5 },
  { text: "Generating persona: Healthcare Professional archetype", type: "generate", personaIndex: 6 },
  { text: "Validating clinical decision-making model", type: "verify", personaIndex: 6 },
  { text: "Running diversity check — geographic spread validation", type: "diversity" },
  { text: "Generating persona: Budget-Conscious Student archetype", type: "generate", personaIndex: 7 },
  { text: "Verifying proxy-purchaser behavior model", type: "verify", personaIndex: 7 },
  { text: "Final panel diversity validation — all checks passed", type: "complete" },
  { text: "8 synthetic personas generated — panel ready for review", type: "complete" }
];
