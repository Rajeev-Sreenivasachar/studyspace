(function () {
  "use strict";

  const registry = globalThis.STUDYSPACE_COURSES;
  if (!registry) return;

  const accessed = "2026-08-24";
  const schoolYear = "2025-2026";
  const schoolSource = {
    id: "middleton-2526-programming",
    label: "Middleton High School 2025-2026 programming sheets",
    type: "school-catalog",
    authority: "Middleton High School / Hillsborough County Public Schools",
    url: "https://www.hillsboroughschools.org/o/middleton/page/guidance",
    version: "2025-2026 - latest complete school-specific course-selection set located",
    scope: "School availability, grade options, magnet pathways, AICE offerings, and prerequisite symbols",
    priority: 0,
    accessed
  };
  const officialSources = {
    florida: {
      id: "fldoe-2526-academic",
      label: "Florida 2025-2026 Course Code Directory and official course descriptions",
      type: "official-framework",
      authority: "Florida Department of Education",
      url: "https://www.fldoe.org/policy/articulation/ccd/2025-2026-course-directory.stml",
      version: "2025-2026 adopted April 9, 2025; checked August 2026",
      scope: "Florida academic course codes, credit values, levels, and standards links",
      priority: 1,
      accessed
    },
    cte: {
      id: "fldoe-2526-cte",
      label: "Florida Career and Technical Education curriculum frameworks",
      type: "official-framework",
      authority: "Florida Department of Education",
      url: "https://www.fldoe.org/academics/career-adult-edu/career-tech-edu/program-resources.stml",
      version: "2025-2026 framework set; checked August 2026",
      scope: "Public CTE standards, programs, technical skills, and career-cluster outcomes",
      priority: 1,
      accessed
    },
    ap: {
      id: "collegeboard-current-ap",
      label: "Current AP Course and Exam Descriptions",
      type: "official-framework",
      authority: "College Board",
      url: "https://apcentral.collegeboard.org/courses",
      version: "Current course pages and announced Fall 2026 revisions checked August 2026",
      scope: "AP course frameworks, skills, units, and assessment expectations",
      priority: 1,
      accessed
    },
    cambridge: {
      id: "cambridge-current-aice",
      label: "Current Cambridge International AS & A Level syllabuses",
      type: "official-framework",
      authority: "Cambridge International Education",
      url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-advanced/cambridge-international-as-and-a-levels/subjects/",
      version: "Syllabuses valid for 2026 examinations checked August 2026",
      scope: "AICE syllabus content, assessment objectives, and paper expectations",
      priority: 1,
      accessed
    },
    pltw: {
      id: "pltw-current-programs",
      label: "Project Lead The Way high school pathways",
      type: "official-framework",
      authority: "Project Lead The Way",
      url: "https://www.pltw.org/curriculum/pltw-engineering",
      version: "Public pathway overview checked August 2026",
      scope: "Engineering and biomedical design-process competencies; exact classroom projects remain teacher-specific",
      priority: 1,
      accessed
    },
    cisco: {
      id: "cisco-current-cyber-it",
      label: "Cisco Networking Academy public course and competency outlines",
      type: "official-framework",
      authority: "Cisco Networking Academy",
      url: "https://www.netacad.com/courses",
      version: "Public catalog checked August 2026",
      scope: "Networking, IT support, and cybersecurity competencies when the Middleton title aligns",
      priority: 1,
      accessed
    }
  };

  const sourceFor = profile => profile === "ap" ? officialSources.ap : profile === "aice" ? officialSources.cambridge : profile === "engineering" || profile === "biomedical" ? officialSources.pltw : profile === "computer-science" ? officialSources.cisco : profile === "cte" ? officialSources.cte : officialSources.florida;
  const teacherSource = course => ({
    id: `${course.id}-class-source`, label: `${course.title} teacher materials`, type: "teacher-class-material", authority: "Student's Middleton class", url: null,
    version: "Not supplied", scope: "Teacher syllabus, Canvas modules, presentations, assignments, vocabulary, pacing, and class sequence", priority: 2, status: "needed"
  });
  const generatedSource = course => ({
    id: `${course.id}-studyspace`, label: "Original StudySpace instruction and practice", type: "studyspace-generated", authority: "StudySpace", url: null,
    version: "Original content", scope: `Copyright-safe lessons, examples, flashcards, quizzes, and activities for ${course.title}`, priority: 3
  });

  const topic = (id, title, summary, sourceIds) => ({ id, title, summary, sourceIds, status: "complete-original" });
  const unit = (id, title, summary, topics, sourceIds) => ({ id, title, summary, topics, sourceIds, status: "complete-original" });
  const rows = text => text.split("|").map(value => value.trim()).filter(Boolean);
  const define = (title, summary, topicText) => ({ title, summary, topics: rows(topicText) });

  const blueprints = {
    ela_foundations: [
      define("Reading Evidence and Meaning", "Build accurate comprehension by tracing central ideas, themes, inferences, and relationships to precise textual evidence.", "Close reading and annotation|Central ideas and themes|Inference and evidence|Objective summary"),
      define("Literary Craft", "Analyze how character, conflict, point of view, structure, and figurative language work together to create meaning.", "Character and conflict|Point of view|Structure and pacing|Figurative language and tone"),
      define("Informational and Rhetorical Reading", "Evaluate claims, evidence, organization, purpose, and rhetoric in original informational texts and media.", "Claims and evidence|Author purpose and audience|Rhetorical choices|Comparing accounts"),
      define("Writing and Language", "Plan, draft, support, revise, and edit arguments, explanations, and narratives for a defined audience and purpose.", "Argument writing|Explanatory writing|Narrative technique|Grammar revision and vocabulary")
    ],
    ela_advanced: [
      define("Complex Text and Interpretation", "Develop defensible interpretations of increasingly complex literary and informational texts through patterns, ambiguity, and textual evidence.", "Ambiguity and inference|Multiple themes and ideas|Structure and perspective|Evidence-based interpretation"),
      define("Rhetoric and Argument", "Analyze how writers build arguments for particular audiences and evaluate the relevance, sufficiency, and credibility of evidence.", "Rhetorical situation|Claims and reasoning|Source credibility|Counterargument and qualification"),
      define("Synthesis and Research", "Research a focused question, integrate multiple sources ethically, and distinguish synthesis from source-by-source summary.", "Research questions|Source evaluation|Citation and integration|Synthesis across perspectives"),
      define("Advanced Composition", "Control organization, syntax, diction, evidence, and revision to communicate nuanced ideas clearly.", "Purposeful organization|Style and sentence craft|Revision for reasoning|Timed and process writing")
    ],
    journalism: [
      define("News Judgment and Ethics", "Use accuracy, verification, fairness, independence, and public relevance to make responsible editorial decisions.", "News values|Verification|Attribution|Ethics and corrections"),
      define("Reporting", "Develop focused questions, conduct interviews, gather records, and distinguish observation from inference.", "Interview planning|Observation and notes|Public records and sources|Fact checking"),
      define("Story Forms", "Write clear leads, organize information, quote sources accurately, and adapt stories for print, broadcast, and digital audiences.", "Leads and nut graphs|Story structure|Quotations and paraphrase|Headlines and captions"),
      define("Publication Workflow", "Plan, edit, design, publish, and evaluate work using collaborative deadlines and audience feedback.", "Editing and revision|Layout and visual hierarchy|Copyright and media|Deadline production")
    ],
    theatre: [
      define("Actor Tools", "Develop voice, movement, concentration, listening, and safe ensemble practices for performance.", "Voice and diction|Movement and space|Objectives and actions|Ensemble trust"),
      define("Script Analysis", "Translate character, conflict, given circumstances, and dramatic structure into playable choices.", "Given circumstances|Character motivation|Conflict and stakes|Beat and scene structure"),
      define("Rehearsal and Production", "Use blocking, design vocabulary, rehearsal notes, and technical collaboration to build a coherent production.", "Blocking|Design elements|Rehearsal process|Technical safety"),
      define("Performance and Reflection", "Prepare, perform, receive criteria-based feedback, and revise artistic choices without inventing teacher repertoire.", "Performance preparation|Audience awareness|Critique and revision|Portfolio reflection")
    ],
    math_foundations: [
      define("Expressions and Equations", "Represent relationships with equivalent expressions and solve equations while preserving equality and checking solutions.", "Properties and equivalent forms|Linear equations|Inequalities|Solution checking"),
      define("Functions", "Interpret functions as relationships among inputs, outputs, equations, tables, graphs, and contexts.", "Function notation|Rate of change|Domain and range|Graph interpretation"),
      define("Geometry and Measurement", "Use definitions, transformations, similarity, coordinate reasoning, and measurement to justify conclusions.", "Transformations|Congruence and similarity|Coordinate geometry|Area volume and precision"),
      define("Data and Modeling", "Select representations, fit simple models, analyze residuals or variation, and communicate the limits of conclusions.", "Data displays|Association|Model selection|Reasoning from data")
    ],
    math_advanced: [
      define("Functions and Representations", "Analyze polynomial, rational, exponential, logarithmic, trigonometric, or piecewise models through equivalent representations.", "Function families|Transformations|Composition and inverse|Model interpretation"),
      define("Algebraic Reasoning", "Solve complex equations and systems with valid transformations, domain restrictions, and verification.", "Polynomial and rational equations|Exponential and logarithmic equations|Systems|Extraneous solutions"),
      define("Change and Accumulation", "Reason about rate, local behavior, approximation, and accumulated change using graphs, tables, formulas, and contexts.", "Average and instantaneous rate|Limits and continuity|Derivative reasoning|Accumulation"),
      define("Probability and Data", "Model chance, sampling, variation, and inference while checking assumptions and interpreting results in context.", "Probability models|Random variables|Sampling distributions|Statistical inference")
    ],
    science_foundations: [
      define("Scientific Practices", "Ask testable questions, design controlled investigations, use models, analyze uncertainty, and argue from evidence.", "Variables and controls|Measurement and uncertainty|Models|Claims evidence and reasoning"),
      define("Matter and Energy", "Trace matter through transformations and account for energy transfer, storage, and conservation in physical and living systems.", "Atomic and molecular models|Chemical change|Energy transfer|Conservation"),
      define("Systems and Change", "Explain interactions, feedback, stability, and change across scales rather than listing isolated parts.", "System boundaries|Cause and effect|Feedback|Scale and proportion"),
      define("Science in Society", "Evaluate evidence, technology, risk, ethics, and environmental effects in real decisions.", "Evidence quality|Risk and tradeoffs|Technology and design|Environmental impact")
    ],
    biology_extended: [
      define("Biochemistry and Cells", "Connect molecular structure to cell membranes, enzymes, energy transformations, organelles, and homeostasis.", "Water and biomolecules|Cell structure|Membrane transport|Enzymes and energetics"),
      define("Information and Heredity", "Trace information from DNA through gene expression and cell division to inheritance and variation.", "DNA replication|Gene expression|Mitosis and meiosis|Inheritance patterns"),
      define("Evolution", "Use multiple lines of evidence to explain natural selection, common ancestry, population change, and biodiversity.", "Variation and selection|Population change|Evidence for evolution|Classification and ancestry"),
      define("Ecology and Systems", "Analyze energy flow, matter cycling, population interactions, ecosystem change, and human impacts.", "Food webs and productivity|Biogeochemical cycles|Population and community ecology|Biodiversity and human impact")
    ],
    physics: [
      define("Motion", "Represent position, velocity, acceleration, and motion in one and two dimensions with graphs, equations, vectors, and experiments.", "Kinematics graphs|Constant acceleration|Vectors and projectiles|Experimental motion analysis"),
      define("Forces and Momentum", "Use system diagrams and conservation laws to predict changes caused by interactions.", "Newton laws|Free-body diagrams|Impulse and momentum|Rotation and equilibrium"),
      define("Energy and Oscillations", "Model work, energy transfer, conservation, periodic motion, and waves with clear system boundaries.", "Work and energy|Power|Simple harmonic motion|Mechanical waves"),
      define("Electricity and Modern Applications", "Relate charge, fields, potential, current, circuits, and electromagnetic effects to measurements and devices.", "Electric force and field|Potential and capacitance|DC circuits|Magnetism and induction")
    ],
    chemistry: [
      define("Atomic Structure and Bonding", "Use particle models, periodic patterns, electron structure, and electrostatic interactions to explain matter.", "Atomic models|Periodic trends|Ionic and covalent bonding|Intermolecular forces"),
      define("Quantitative Chemistry", "Relate particles, moles, mass, concentration, gases, and reaction stoichiometry with units and limiting constraints.", "Moles and formulas|Stoichiometry|Solutions|Gas relationships"),
      define("Reaction Energy and Rate", "Explain energy changes, collision processes, catalysts, and mechanisms using evidence and energy diagrams.", "Thermochemistry|Kinetics|Reaction mechanisms|Catalysis"),
      define("Equilibrium and Electrochemistry", "Analyze dynamic equilibrium, acids and bases, solubility, redox, and electrochemical cells quantitatively.", "Chemical equilibrium|Acids and bases|Solubility|Oxidation reduction and cells")
    ],
    social_history: [
      define("Historical Thinking", "Build arguments from primary and secondary evidence while accounting for context, sourcing, continuity, and change.", "Sourcing and context|Chronology|Causation|Continuity and change"),
      define("Power and Governance", "Compare how states, institutions, laws, conflict, and civic participation distribute and challenge power.", "State formation|Law and institutions|Conflict and diplomacy|Citizenship"),
      define("Economy and Society", "Explain how labor, technology, trade, social structures, and demographic change shape historical experience.", "Economic systems|Labor and migration|Social hierarchy|Technology and exchange"),
      define("Culture and Historical Argument", "Analyze identity, belief, art, reform, resistance, and memory through multiple perspectives.", "Culture and identity|Reform and resistance|Historical perspectives|Evidence-based writing")
    ],
    civics_economics: [
      define("Constitutional Government", "Explain foundations, structures, powers, rights, federalism, and checks using constitutional evidence.", "Foundations and principles|Branches and checks|Federalism|Civil liberties and rights"),
      define("Political Participation", "Analyze elections, parties, interest groups, media, public opinion, and civic action.", "Voting and elections|Parties and groups|Media and opinion|Civic participation"),
      define("Economic Decision Making", "Use scarcity, incentives, marginal reasoning, markets, and policy to analyze choices and tradeoffs.", "Scarcity and opportunity cost|Supply and demand|Market structures|Government policy"),
      define("Personal and Public Finance", "Apply budgeting, credit, saving, investing, risk, taxes, and macroeconomic indicators to decisions.", "Budgeting and goals|Credit and debt|Saving investing and risk|Inflation unemployment and growth")
    ],
    psychology: [
      define("Research and Biological Bases", "Evaluate psychological research designs and connect behavior to neural, hormonal, genetic, and environmental processes.", "Research methods|Ethics|Nervous and endocrine systems|Nature and nurture"),
      define("Cognition", "Explain sensation, perception, learning, memory, thinking, language, and decision making through evidence-based models.", "Sensation and perception|Learning|Memory|Thinking and language"),
      define("Development and Social Behavior", "Analyze development, identity, motivation, emotion, attitudes, groups, and interpersonal behavior.", "Development|Motivation and emotion|Social cognition|Group influence"),
      define("Health and Individual Differences", "Compare approaches to personality, stress, psychological disorders, treatment, and well-being without diagnosing people.", "Personality|Stress and health|Psychological disorders|Treatment and well-being")
    ],
    world_language: [
      define("Communication Foundations", "Build interpretive, interpersonal, and presentational communication with accurate high-frequency language.", "Listening and reading|Conversation strategies|Presentational speaking|Presentational writing"),
      define("Language Systems", "Develop vocabulary, sound or sign production, grammar, sentence patterns, and repair strategies in context.", "Vocabulary in context|Sound or sign production|Grammar and syntax|Self-correction"),
      define("Culture and Communities", "Connect products, practices, perspectives, identities, and regional variation without reducing cultures to stereotypes.", "Products practices and perspectives|Identity and community|Regional variation|Cultural comparison"),
      define("Applied Proficiency", "Integrate multiple modes to handle authentic school, community, travel, and academic tasks.", "Narration|Description|Explanation|Supporting an opinion")
    ],
    visual_art: [
      define("Studio Foundations", "Use tools, materials, processes, safety, and intentional practice to develop control and craftsmanship.", "Studio safety|Elements of art|Principles of design|Material exploration"),
      define("Planning and Creating", "Generate ideas, research visual references ethically, experiment, document decisions, and revise work.", "Ideation|Thumbnails and studies|Process documentation|Revision"),
      define("Meaning and Context", "Analyze how artists communicate through subject, style, culture, history, and audience.", "Visual analysis|Context|Symbol and meaning|Copyright and attribution"),
      define("Portfolio and Critique", "Select, present, explain, critique, and refine a body of original work using clear criteria.", "Critique language|Portfolio selection|Artist statement|Reflection and refinement")
    ],
    music_performance: [
      define("Technique and Musicianship", "Develop safe setup, tone, breath or bow control, dexterity, coordination, and independent practice habits.", "Setup and care|Tone production|Technique patterns|Practice strategies"),
      define("Music Literacy", "Read and perform rhythm, pitch, key, articulation, dynamics, form, and expressive markings accurately.", "Rhythm and meter|Pitch and key|Notation and symbols|Form and expression"),
      define("Ensemble Skills", "Maintain pulse, follow cues, balance, blend, tune, listen across parts, and contribute professionally.", "Pulse and subdivision|Cues and entrances|Balance blend and intonation|Rehearsal collaboration"),
      define("Performance Cycle", "Prepare, perform, evaluate recordings, apply feedback, and document growth without inventing repertoire.", "Goal setting|Sectional rehearsal|Performance readiness|Reflection and portfolio")
    ],
    computer_science: [
      define("Computing Systems", "Explain how hardware, software, operating systems, data, users, and constraints interact in a complete system.", "Hardware and software|Data representation|Operating systems|Human-computer interaction"),
      define("Networks and Security", "Trace network communication and apply layered controls to identities, devices, services, and data.", "Protocols and addressing|Network devices|Threats and vulnerabilities|Layered defense"),
      define("Programming and Data", "Design algorithms, implement programs, test edge cases, debug systematically, and manage data responsibly.", "Algorithms|Variables control and functions|Data structures|Testing and debugging"),
      define("Applied Computing", "Plan a solution for a user, evaluate tradeoffs, document work, and account for ethics, privacy, accessibility, and impact.", "Requirements|Design and prototyping|Documentation|Ethics and impact")
    ],
    game_design: [
      define("Game Systems", "Analyze goals, rules, mechanics, feedback, challenge, balance, and player experience as an interconnected system.", "Goals and rules|Core mechanics|Feedback loops|Balance and playtesting"),
      define("Interactive Development", "Build event-driven logic, state, input, collision, scoring, and progression through iterative prototypes.", "Events and state|Input and movement|Collision and physics|Progression systems"),
      define("Art Audio and Narrative", "Integrate visual hierarchy, animation, audio, interface, story, and accessibility around the design goal.", "Visual assets|Animation|Audio implementation|Narrative and interface"),
      define("Production and Portfolio", "Scope, version, test, debug, document, publish, and evaluate an original game project.", "Project scope|Version control|Quality assurance|Portfolio presentation")
    ],
    engineering: [
      define("Engineering Design Process", "Define a measurable problem, research constraints, generate concepts, compare tradeoffs, and plan verification.", "Problem definition|Criteria and constraints|Concept generation|Decision matrices"),
      define("Technical Modeling", "Communicate and test ideas with sketches, CAD, schematics, mathematical models, and precise documentation.", "Technical drawing|CAD and dimensioning|Systems diagrams|Model assumptions"),
      define("Build Test Improve", "Create prototypes safely, collect valid data, diagnose failures, and revise one controlled variable at a time.", "Prototyping safety|Test plans|Data and uncertainty|Iteration"),
      define("Engineering in Context", "Evaluate reliability, cost, sustainability, ethics, teamwork, and communication in a complete design review.", "Reliability and risk|Cost and sustainability|Ethics|Design presentation")
    ],
    biomedical: [
      define("Biomedical Investigation", "Use clinical-style evidence, experimental controls, measurement, documentation, and ethical reasoning to investigate a problem.", "Case evidence|Experimental design|Measurement and data|Ethics and privacy"),
      define("Human Systems", "Connect anatomy, physiology, molecular processes, feedback, and disease mechanisms across body systems.", "Structure and function|Homeostasis|System interactions|Disease mechanisms"),
      define("Diagnostics and Intervention", "Interpret models and test results, compare interventions, and justify conclusions with limitations.", "Diagnostic reasoning|Biomarkers and tests|Treatment tradeoffs|Evidence and uncertainty"),
      define("Innovation and Communication", "Develop, test, document, and present a biomedical solution for a defined need without making personal medical diagnoses.", "Needs analysis|Prototype and validation|Regulation and ethics|Scientific communication")
    ],
    cte: [
      define("Safety and Professional Practice", "Apply workplace safety, sanitation or tool controls, ethics, communication, and documentation for the field.", "Hazard identification|Safe procedures|Professional communication|Documentation"),
      define("Tools Materials and Processes", "Select field-specific tools and materials, follow a repeatable process, and judge quality against specifications.", "Tool selection|Materials|Process sequence|Quality control"),
      define("Technical Problem Solving", "Read requirements, diagnose faults, compare solutions, estimate resources, and verify a completed result.", "Requirements|Troubleshooting|Estimating|Verification"),
      define("Career and Business Application", "Connect technical work to customers, entrepreneurship, employability, certification, and responsible workplace decisions.", "Customer needs|Employability|Business fundamentals|Career portfolio")
    ],
    jrotc: [
      define("Citizenship and Leadership", "Practice ethical leadership, followership, goal setting, responsibility, and informed citizenship.", "Leadership styles|Followership|Ethical decisions|Civic responsibility"),
      define("Communication and Teamwork", "Communicate clearly, plan as a team, manage conflict, and conduct respectful briefings and feedback.", "Verbal communication|Written communication|Team roles|Conflict management"),
      define("Aerospace and Service Foundations", "Explore aerospace history, flight principles, organization, careers, and service concepts at the appropriate course level.", "Aerospace history|Principles of flight|Organization and careers|Service knowledge"),
      define("Wellness and Readiness", "Develop safe fitness, personal wellness, time management, resilience, and readiness habits.", "Fitness principles|Nutrition and wellness|Time management|Resilience")
    ],
    physical_education: [
      define("Movement and Safety", "Apply warm-up, technique, rules, spatial awareness, and injury-prevention practices for safe participation.", "Warm-up and recovery|Movement technique|Rules and safety|Injury prevention"),
      define("Fitness Concepts", "Use overload, specificity, progression, recovery, and measurement to plan age-appropriate fitness.", "Fitness components|Training principles|Monitoring intensity|Recovery"),
      define("Strategy and Teamwork", "Make decisions, communicate, demonstrate sportsmanship, and adapt tactics using evidence from play.", "Decision making|Offense and defense|Communication|Sportsmanship"),
      define("Personal Plan", "Set measurable goals, track activity, interpret results, and revise a sustainable wellness plan.", "Goal setting|Activity tracking|Data interpretation|Plan revision")
    ],
    student_success: [
      define("Goals and Organization", "Translate long-term goals into schedules, priorities, routines, and visible next actions.", "Goal setting|Time planning|Task breakdown|Organization systems"),
      define("Learning Strategies", "Use retrieval, spacing, elaboration, metacognition, and resource selection to study efficiently.", "Retrieval practice|Spacing|Note processing|Metacognition"),
      define("Communication and Advocacy", "Ask for help, collaborate, communicate professionally, and use feedback to improve work.", "Self-advocacy|Collaboration|Professional messages|Using feedback"),
      define("College Career and Leadership", "Research options, build a portfolio, evaluate opportunities, and lead service or school projects responsibly.", "Pathway research|Applications and resumes|Leadership|Portfolio reflection")
    ]
  };

  const apBlueprints = {
    "ap-world-history": [
      define("The Global Tapestry, c. 1200-c. 1450", "Compare major states, belief systems, and social structures across regions before intensified oceanic connection.", "East Asia|Dar al-Islam|South and Southeast Asia|Americas Africa and Europe"),
      define("Networks of Exchange", "Explain causes and consequences of Silk Roads, Indian Ocean, and trans-Saharan exchange.", "Silk Roads|Mongol Empire|Indian Ocean exchange|Trans-Saharan exchange"),
      define("Land-Based Empires", "Analyze expansion, administration, belief, and legitimacy in major early modern empires.", "Imperial expansion|Administration|Belief and legitimacy|Comparison of empires"),
      define("Transoceanic Interconnections", "Trace exploration, conquest, Columbian Exchange, coerced labor, and global economic change.", "Maritime technology|Columbian Exchange|Labor systems|Global economy"),
      define("Revolutions", "Connect Enlightenment ideas, political revolutions, industrialization, and social transformation.", "Enlightenment|Atlantic revolutions|Industrialization|Social change"),
      define("Consequences of Industrialization", "Analyze imperialism, migration, reform, resistance, and economic transformation.", "Imperialism|Indigenous responses|Global migration|Economic transformation"),
      define("Global Conflict", "Explain causes, conduct, and effects of global war, revolution, genocide, and shifting power.", "World War I|Interwar crisis|World War II|Mass atrocities"),
      define("Cold War and Decolonization", "Compare ideological conflict, independence movements, new states, and global resistance.", "Cold War|Decolonization|Newly independent states|Resistance movements"),
      define("Globalization", "Evaluate technological, economic, cultural, environmental, and institutional change since 1900.", "Technology|Economic globalization|Culture|Environment and institutions")
    ],
    "ap-us-history": [
      define("1491-1607", "Analyze Indigenous societies, European contact, exchange, and competing motives before English settlement.", "Native societies|European exploration|Columbian Exchange|Comparative colonization"),
      define("1607-1754", "Explain regional colonial development, labor systems, Atlantic exchange, and relations with Native peoples.", "Regional colonies|Labor and slavery|Atlantic world|Colonial society"),
      define("1754-1800", "Trace imperial crisis, revolution, constitutional change, and the early republic.", "Imperial conflict|American Revolution|Articles and Constitution|Early republic"),
      define("1800-1848", "Analyze political change, markets, expansion, reform, and transformations in American society.", "Democratization|Market Revolution|Expansion|Reform"),
      define("1844-1877", "Connect territorial expansion, slavery, sectional conflict, Civil War, and Reconstruction.", "Manifest Destiny|Sectional crisis|Civil War|Reconstruction"),
      define("1865-1898", "Explain industrial capitalism, western expansion, immigration, urbanization, labor, and political conflict.", "Industrialization|West and Native policy|Immigration and cities|Labor and politics"),
      define("1890-1945", "Analyze reform, overseas expansion, world wars, prosperity, depression, and federal response.", "Progressivism|Imperialism and World War I|1920s|Depression New Deal and World War II"),
      define("1945-1980", "Explain Cold War policy, prosperity, civil rights movements, social change, and political realignment.", "Cold War|Postwar economy|Civil rights|Social and political change"),
      define("1980-Present", "Evaluate conservatism, globalization, demographic change, technology, and United States power.", "Conservative movement|Globalization|Demographic change|Technology and foreign policy")
    ],
    "ap-government": [
      define("Foundations of American Democracy", "Use foundational documents and constitutional principles to explain legitimacy, federalism, and competing models of democracy.", "Foundational ideas|Constitution|Federalism|Democratic models"),
      define("Interactions Among Branches", "Analyze powers, constraints, processes, and relationships among Congress, the presidency, courts, and bureaucracy.", "Congress|Presidency|Judiciary|Bureaucracy"),
      define("Civil Liberties and Civil Rights", "Apply constitutional provisions, incorporation, precedent, and equal-protection reasoning to public controversies.", "First Amendment|Due process and incorporation|Privacy and procedure|Equal protection"),
      define("Political Ideologies and Beliefs", "Explain how values, socialization, polling, and economic policy shape political beliefs.", "Political socialization|Public opinion|Ideology|Economic policy"),
      define("Political Participation", "Analyze voting, elections, parties, interest groups, media, campaign finance, and linkage institutions.", "Voting|Elections and campaigns|Parties and groups|Media")
    ],
    "ap-microeconomics": [
      define("Basic Economic Concepts", "Use scarcity, opportunity cost, comparative advantage, marginal analysis, and production possibilities.", "Scarcity and choice|Production possibilities|Comparative advantage|Marginal analysis"),
      define("Supply and Demand", "Determine equilibrium and analyze changes, elasticity, controls, taxes, and surplus.", "Supply and demand|Elasticity|Government intervention|Consumer and producer surplus"),
      define("Production Cost and Perfect Competition", "Connect short-run and long-run production, cost curves, profit, and competitive firm decisions.", "Production|Costs|Profit maximization|Perfect competition"),
      define("Imperfect Competition", "Compare monopoly, monopolistic competition, oligopoly, strategic behavior, and regulation.", "Monopoly|Price discrimination|Monopolistic competition|Oligopoly and game theory"),
      define("Factor Markets", "Analyze derived demand, labor markets, resource pricing, and income distribution.", "Factor demand|Labor markets|Monopsony|Income distribution"),
      define("Market Failure and Government", "Evaluate externalities, public goods, information problems, equity, and policy tradeoffs.", "Externalities|Public goods|Information failure|Income inequality and policy")
    ],
    "ap-macroeconomics": [
      define("Basic Economic Concepts", "Use scarcity, opportunity cost, comparative advantage, and economic systems to frame macroeconomic choices.", "Scarcity|Production possibilities|Comparative advantage|Economic systems"),
      define("Indicators and the Business Cycle", "Calculate and interpret GDP, unemployment, inflation, real values, and phases of the business cycle.", "GDP|Unemployment|Inflation|Business cycles"),
      define("National Income and Price Determination", "Use aggregate demand and aggregate supply to explain output, price level, and stabilization.", "Aggregate demand|Short-run aggregate supply|Long-run adjustment|Fiscal policy"),
      define("Financial Sector", "Explain money, banking, interest rates, loanable funds, and central-bank policy.", "Money|Bank balance sheets|Money market|Monetary policy"),
      define("Long-Run Consequences", "Connect growth, deficits, debt, inflation, and policy actions across time.", "Economic growth|Phillips curve|Deficits and debt|Policy interaction"),
      define("Open Economy", "Analyze exchange rates, balance of payments, capital flows, trade, and policy effects.", "Balance of payments|Exchange markets|Capital flows|Policy in an open economy")
    ],
    "ap-precalculus": [
      define("Polynomial and Rational Functions", "Model change with polynomial and rational functions and analyze zeros, end behavior, holes, and asymptotes.", "Rates of change|Polynomial models|Zeros and factors|Rational behavior"),
      define("Exponential and Logarithmic Functions", "Model multiplicative change and solve exponential relationships using logarithms and equivalent forms.", "Geometric change|Exponential models|Logarithms|Semi-log representations"),
      define("Trigonometric and Polar Functions", "Model periodic phenomena with angles, trigonometric functions, identities, equations, and polar representations.", "Angles and unit circle|Sinusoidal models|Trigonometric equations|Polar functions"),
      define("Functions Involving Parameters Vectors and Matrices", "Use parameters, vectors, and matrices to represent motion, transformations, systems, and repeated processes.", "Parametric functions|Vectors|Matrices|Transformations and systems")
    ],
    "ap-statistics": [
      define("Exploring One-Variable Data", "Describe distributions using appropriate displays, center, variability, position, and unusual features.", "Data displays|Center and spread|Percentiles and standard scores|Comparing distributions"),
      define("Exploring Two-Variable Data", "Analyze association with categorical tables, scatterplots, correlation, regression, and residuals.", "Two-way tables|Scatterplots|Correlation|Regression and residuals"),
      define("Collecting Data", "Distinguish sampling from experimentation and evaluate bias, randomization, control, replication, and scope of inference.", "Sampling methods|Bias|Experimental design|Scope of inference"),
      define("Probability and Random Variables", "Use probability rules and random-variable models to calculate and interpret uncertain outcomes.", "Probability rules|Conditional probability|Random variables|Binomial and geometric models"),
      define("Sampling Distributions", "Explain sampling variability, unbiased estimators, and conditions for sampling-distribution models.", "Sampling variability|Sample proportions|Sample means|Central Limit Theorem"),
      define("Inference", "Construct and interpret confidence intervals and tests for proportions, means, categorical association, and regression slopes.", "Inference for proportions|Inference for means|Chi-square inference|Inference for slopes")
    ],
    "ap-calculus-ab": [
      define("Limits and Continuity", "Estimate and calculate limits, justify continuity, and connect multiple representations of local behavior.", "Limit notation|Estimating limits|Continuity|Asymptotes"),
      define("Differentiation", "Define derivatives, apply differentiation rules, and interpret derivatives as rates and local linear behavior.", "Derivative definition|Rules|Implicit differentiation|Inverse and composite functions"),
      define("Applications of Derivatives", "Use derivatives to analyze motion, extrema, related rates, approximation, and graph behavior.", "Motion|Related rates|Optimization|Curve analysis"),
      define("Integration", "Connect accumulation, antiderivatives, definite integrals, and the Fundamental Theorem of Calculus.", "Riemann sums|Definite integrals|Fundamental Theorem|Techniques and improper integrals"),
      define("Differential Equations and Applications", "Model change with slope fields, separable equations, exponential models, area, volume, and average value.", "Slope fields|Separable equations|Area between curves|Volume and average value")
    ],
    "ap-calculus-bc": [
      define("AB Foundations", "Master limits, derivatives, integrals, differential equations, and applications required by the shared AB framework.", "Limits|Differentiation|Derivative applications|Integration applications"),
      define("Advanced Integration", "Apply additional integration techniques, improper integrals, and logistic or other differential-equation models.", "Integration by parts|Partial fractions|Improper integrals|Logistic models"),
      define("Parametric Polar and Vector Functions", "Analyze motion, slope, arc length, and area in parametric, polar, and vector representations.", "Parametric derivatives|Vector motion|Polar derivatives|Polar area"),
      define("Infinite Sequences and Series", "Determine convergence and represent functions with power and Taylor series including error reasoning.", "Sequences and convergence|Convergence tests|Power series|Taylor series and error")
    ],
    "ap-biology": [
      define("Chemistry of Life", "Explain how molecular structure, water, macromolecules, and energy underpin living systems.", "Water|Macromolecules|Structure and function|Energy and enzymes"),
      define("Cell Structure and Function", "Connect membranes, organelles, transport, surface area, and compartmentalization to cell function.", "Cell structure|Membranes|Transport|Compartmentalization"),
      define("Cellular Energetics", "Model enzymes, photosynthesis, and respiration as matter and energy transformations.", "Enzymes|Photosynthesis|Cellular respiration|Energy regulation"),
      define("Cell Communication and Cycle", "Explain signaling, feedback, cell-cycle regulation, and consequences of failed control.", "Cell signaling|Signal transduction|Feedback|Cell cycle"),
      define("Heredity", "Use meiosis, inheritance models, probability, and chromosome behavior to explain variation.", "Meiosis|Mendelian genetics|Non-Mendelian inheritance|Chromosomes"),
      define("Gene Expression and Regulation", "Trace DNA replication, transcription, translation, regulation, mutation, and biotechnology.", "DNA replication|Gene expression|Gene regulation|Biotechnology"),
      define("Natural Selection", "Use population evidence and models to explain selection, evolution, speciation, and common ancestry.", "Natural selection|Population genetics|Speciation|Evidence for evolution"),
      define("Ecology", "Analyze responses, populations, communities, energy flow, biodiversity, and ecosystem change.", "Responses to environment|Population ecology|Community ecology|Energy and biodiversity")
    ],
    "ap-chemistry": [
      define("Atomic Structure and Properties", "Use particulate evidence, electron structure, mass spectra, and periodic trends to explain atoms and ions.", "Moles and mass spectra|Electron structure|Periodic trends|Photoelectron evidence"),
      define("Molecular and Ionic Structure", "Relate bonding, Lewis structures, resonance, formal charge, hybridization, and lattice structure to properties.", "Bonding|Lewis structures|Resonance|Molecular geometry"),
      define("Intermolecular Forces and Properties", "Explain states, solutions, separation, spectroscopy, and macroscopic properties through particle interactions.", "Intermolecular forces|Solids liquids and gases|Solutions|Spectroscopy"),
      define("Chemical Reactions", "Represent reactions at symbolic, particulate, and quantitative levels including stoichiometry and titration.", "Reaction representations|Stoichiometry|Titration|Net ionic equations"),
      define("Kinetics", "Use rate data, mechanisms, collision theory, and energy profiles to explain how fast reactions occur.", "Rate laws|Integrated rates|Mechanisms|Activation energy"),
      define("Thermodynamics", "Calculate and interpret heat, enthalpy, bond energy, entropy, and free energy.", "Calorimetry|Enthalpy|Entropy|Gibbs free energy"),
      define("Equilibrium", "Model dynamic equilibrium quantitatively and predict responses to changes.", "Equilibrium constants|Reaction quotient|Le Chatelier principle|Solubility"),
      define("Acids Bases and Electrochemistry", "Analyze acid-base systems, buffers, titrations, redox processes, and electrochemical cells.", "Acids and bases|Buffers|Titration curves|Electrochemistry")
    ],
    "ap-physics-c-mechanics": [
      define("Kinematics", "Model one- and two-dimensional motion with calculus, vectors, graphs, and experimental evidence.", "Position velocity acceleration|Vector motion|Relative motion|Experimental analysis"),
      define("Force and Translational Dynamics", "Apply Newton laws, free-body diagrams, differential relationships, and constraints to systems.", "Newton laws|Force models|Drag and terminal speed|Connected systems"),
      define("Work Energy and Power", "Relate work integrals, potential energy, conservation, power, and force-position functions.", "Work|Kinetic energy|Potential energy|Power"),
      define("Momentum", "Use impulse, momentum conservation, center of mass, and collision models.", "Impulse|Conservation of momentum|Collisions|Center of mass"),
      define("Rotation and Gravitation", "Analyze rotational kinematics and dynamics, angular momentum, oscillation, and gravitation.", "Torque and inertia|Angular momentum|Oscillation|Gravitation")
    ],
    "ap-physics-c-em": [
      define("Electrostatics", "Use calculus and superposition to analyze charge distributions, electric fields, flux, and Gauss law.", "Coulomb law|Electric field|Flux|Gauss law"),
      define("Potential and Conductors", "Connect potential, energy, fields, equipotentials, capacitance, dielectrics, and conductor behavior.", "Electric potential|Potential energy|Conductors|Capacitance"),
      define("Electric Circuits", "Analyze current, resistance, power, Kirchhoff laws, RC circuits, and transient behavior.", "Current and resistance|Circuit rules|Power|RC circuits"),
      define("Magnetism", "Use fields, forces, current distributions, Ampere law, and particle motion to analyze magnetic interactions.", "Magnetic force|Fields from currents|Ampere law|Charged-particle motion"),
      define("Electromagnetism", "Explain induction, Faraday and Lenz laws, inductance, and Maxwell-related field change.", "Magnetic flux|Faraday law|Lenz law|Inductance")
    ],
    "ap-csp": [
      define("Creative Development", "Design programs and computing artifacts iteratively through collaboration, documentation, testing, and reflection.", "Development process|Collaboration|Program purpose|Testing and refinement"),
      define("Data", "Represent, transform, visualize, and use data while evaluating privacy, bias, and limitations.", "Binary representation|Data compression|Data processing|Data privacy"),
      define("Algorithms and Programming", "Develop algorithms using variables, sequencing, selection, iteration, procedures, lists, and testing.", "Algorithms|Control structures|Procedures|Lists and data abstraction"),
      define("Computer Systems and Networks", "Explain how computing systems and the Internet operate reliably across abstraction layers.", "Computing systems|Internet protocols|Routing and fault tolerance|Cybersecurity"),
      define("Impact of Computing", "Evaluate benefits, harms, access, bias, innovation, intellectual property, and societal tradeoffs.", "Innovation|Equity and access|Bias and consequences|Legal and ethical issues")
    ],
    "ap-csa": [
      define("Using Objects and Methods", "Develop Java programs using primitive values, expressions, objects, method calls, strings, and program design.", "Variables and expressions|Objects and methods|Strings|Program design"),
      define("Selection and Iteration", "Control program flow with Boolean expressions, conditionals, loops, tracing, and testing.", "Boolean logic|Conditional statements|Iteration|Tracing and debugging"),
      define("Class Creation", "Design classes with encapsulated state, constructors, methods, scope, inheritance concepts, and readable APIs.", "Instance variables|Constructors|Methods and scope|Class design"),
      define("Data Collections", "Process arrays, array lists, two-dimensional arrays, and collections with traversal algorithms.", "Arrays|ArrayList|Two-dimensional arrays|Searching and processing")
    ],
    "ap-spanish-language": [
      define("Families and Communities", "Interpret and communicate about family structures, communities, values, and social change across Spanish-speaking contexts.", "Family structures|Community values|Social networks|Contemporary change"),
      define("Personal and Public Identities", "Explore language, belief, gender, nationality, ethnicity, and identity through authentic Spanish-language sources.", "Identity|Beliefs and values|Language and culture|National and ethnic identity"),
      define("Beauty and Aesthetics", "Analyze definitions of beauty, architecture, art, fashion, and language as cultural products and practices.", "Visual arts|Architecture|Fashion|Ideas of beauty"),
      define("Science and Technology", "Discuss access, innovation, ethics, health, and environmental effects of science and technology.", "Innovation|Health|Access|Ethics and environment"),
      define("Contemporary Life and Global Challenges", "Communicate about education, work, leisure, migration, sustainability, rights, and global issues.", "Education and careers|Leisure and traditions|Global challenges|Civic life")
    ],
    "ap-spanish-literature": [
      define("Literary Analysis Skills", "Build text-based interpretations in Spanish using characterization, structure, narration, poetic devices, and context.", "Close reading|Narrative technique|Poetic analysis|Drama analysis"),
      define("Medieval and Early Modern Traditions", "Analyze selected public-domain and assigned texts through historical context, genre, and intertextual relationships.", "Medieval traditions|Golden Age prose|Golden Age drama|Poetry and form"),
      define("Nineteenth and Twentieth Century Movements", "Compare Romanticism, Realism, Modernismo, avant-garde, and other movements without reproducing copyrighted works.", "Romanticism|Realism and Naturalism|Modernismo|Avant-garde"),
      define("Contemporary Voices and Synthesis", "Analyze identity, power, gender, culture, memory, and literary dialogue across regions and periods.", "Identity|Power and resistance|Memory|Intertextual synthesis")
    ],
    "ap-english-literature": [
      define("Short Fiction", "Analyze character, setting, structure, narration, and figurative language in original or public-domain short fiction.", "Character|Setting|Structure|Narration and language"),
      define("Poetry", "Analyze speaker, situation, imagery, figurative language, sound, form, and complexity in poems.", "Speaker and situation|Imagery|Figurative language|Form and sound"),
      define("Long Fiction and Drama", "Trace character, conflict, plot, perspective, and thematic development across longer works assigned by the teacher.", "Character development|Conflict and plot|Narrative perspective|Thematic complexity"),
      define("Literary Argument", "Develop defensible theses, select specific evidence, explain reasoning, address complexity, and revise timed analysis.", "Thesis|Evidence|Commentary|Complexity and revision")
    ]
  };

  const aiceBlueprints = {
    "aice-general-paper": [define("Reading and Analysis", "Interpret information, distinguish fact and opinion, analyze reasoning, and evaluate language in unfamiliar texts.", "Main ideas|Inference|Argument analysis|Language effects"), define("Essay Argument", "Develop a focused, balanced, evidence-informed response to a broad issue for a defined audience.", "Question analysis|Thesis and scope|Evidence and examples|Evaluation"), define("Comprehension and Summary", "Select relevant ideas, paraphrase accurately, synthesize information, and write concisely.", "Selection|Paraphrase|Synthesis|Concise expression"), define("Knowledge and Communication", "Build usable knowledge across contemporary issues and communicate accurately without memorized scripts.", "Issue research|Perspective|Accurate expression|Revision")],
    "aice-english-language": [define("Text and Context", "Analyze how form, audience, purpose, and context shape meaning in diverse spoken, written, and multimodal texts.", "Form and genre|Audience|Purpose|Context"), define("Meaning and Style", "Explain how lexis, grammar, discourse, imagery, and sound create meanings and effects.", "Lexis|Grammar|Discourse|Figurative and sound patterns"), define("Directed and Creative Writing", "Transform and create texts for precise audiences and purposes, then comment analytically on language choices.", "Directed writing|Narrative and descriptive writing|Voice and register|Reflective commentary"), define("Language Diversity and Change", "Investigate language variation, acquisition, change, identity, and public debates with linguistic evidence.", "Variation|Language acquisition|Language change|Language and identity")],
    "aice-global-perspectives": [define("Critical Path: Deconstruction", "Identify arguments, evidence, assumptions, perspectives, and context in global issues.", "Arguments|Evidence|Assumptions|Perspectives"), define("Critical Path: Reconstruction", "Research, compare, synthesize, and build reasoned responses with credible sources.", "Research questions|Source evaluation|Synthesis|Reasoned conclusions"), define("Reflection and Communication", "Evaluate how perspective and evidence changed thinking, then communicate findings for an audience.", "Reflection|Academic communication|Presentation|Citation"), define("Team Project", "Collaborate on a global issue while documenting individual contribution, coordination, outcomes, and reflection.", "Team planning|Collaboration|Project outcome|Individual reflection")],
    "aice-marine-science": [define("Marine Scientific Method", "Use field and laboratory evidence, sampling, variables, uncertainty, and data presentation in marine investigations.", "Sampling|Experimental design|Data analysis|Evaluation"), define("Marine Ecosystems", "Explain physical and chemical ocean conditions, productivity, food webs, nutrient cycles, and ecological interactions.", "Ocean conditions|Productivity|Food webs|Nutrient cycles"), define("Marine Organisms", "Relate adaptation, physiology, behavior, reproduction, and distribution to marine environments.", "Adaptation|Physiology|Behavior|Distribution"), define("Human Impacts and Management", "Evaluate fisheries, pollution, climate change, conservation, and resource management using evidence and tradeoffs.", "Fisheries|Pollution|Climate change|Conservation")],
    "aice-environmental-management": [define("Earth Systems", "Analyze lithosphere, atmosphere, hydrosphere, biosphere, resources, and natural hazards as interacting systems.", "Earth systems|Resources|Hazards|Cycles"), define("Ecosystems and Biodiversity", "Explain ecosystem function, population change, succession, biodiversity, and conservation.", "Energy and nutrients|Populations|Succession|Biodiversity"), define("Human Pressures", "Evaluate pollution, climate change, agriculture, energy, urbanization, and resource use at multiple scales.", "Pollution|Climate change|Food and agriculture|Energy and cities"), define("Management and Investigation", "Design investigations and compare policies, technologies, stakeholder perspectives, and sustainability strategies.", "Field methods|Data analysis|Policy tools|Sustainable management")],
    "aice-mathematics": [define("Pure Mathematics", "Develop algebraic, functional, coordinate, trigonometric, sequence, differentiation, and integration reasoning required by the selected components.", "Algebra and functions|Coordinate geometry|Trigonometry|Calculus"), define("Probability and Statistics", "Model data and chance with representation, counting, distributions, expectation, sampling, and inference at the selected level.", "Data representation|Probability|Random variables|Distributions"), define("Mechanics Options", "When selected, apply mathematical models to forces, motion, momentum, and energy with stated assumptions.", "Kinematics|Forces|Momentum|Energy"), define("Exam Reasoning", "Choose efficient methods, communicate exact working, use technology appropriately, and verify answers against domain and context.", "Method selection|Exact and approximate values|Verification|Timed practice")],
    "aice-psychology": blueprints.psychology,
    "aice-sport-pe": [define("Applied Anatomy and Physiology", "Connect musculoskeletal, cardiovascular, respiratory, and energy systems to physical activity and recovery.", "Musculoskeletal system|Cardiovascular and respiratory systems|Energy systems|Recovery"), define("Skill Acquisition and Psychology", "Analyze learning, motivation, arousal, group dynamics, feedback, and mental preparation in sport.", "Learning theories|Motivation|Arousal|Groups and feedback"), define("Sport and Society", "Evaluate participation, equity, media, ethics, technology, organizations, and contemporary issues.", "Participation|Equity and ethics|Media|Technology and organizations"), define("Performance Analysis", "Plan, observe, measure, evaluate, and improve performance using valid evidence and safe training principles.", "Performance testing|Training principles|Data analysis|Improvement plan")]
  };

  const iconFor = subject => ({ English: "📖", Mathematics: "➗", Science: "🧬", "Social Studies": "🌎", "World Languages": "🗣️", "Visual Arts": "🎨", "Performing Arts": "🎵", "Computer Science": "💻", Engineering: "⚙️", Biomedical: "🩺", CTE: "🧰", JROTC: "✈️", "Physical Education": "🏃", "Student Success": "🎯" }[subject] || "📚");
  const slug = value => value.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const allBlueprints = { ...blueprints, ...apBlueprints, ...aiceBlueprints };
  const courseSpecs = [];
  const add = (title, subject, level, grades, program, key, options = {}) => courseSpecs.push({ id: options.id || slug(title), title, subject, level, gradeLevels: grades, program, key, ...options });
  const batch = (titles, subject, level, grades, program, key, options = {}) => titles.forEach(title => add(title, subject, level, grades, program, typeof key === "function" ? key(title) : key, typeof options === "function" ? options(title) : options));

  batch(["English 1", "English 2", "English 2 Honors", "English 3", "English 4"], "English", "Standard / Honors", ["9", "10", "11", "12"], "Traditional", "ela_foundations", title => ({ code: { "English 1": "1001310", "English 2": "1001340", "English 2 Honors": "1001350", "English 3": "1001370", "English 4": "1001400" }[title] || null }));
  add("AP English Literature and Composition", "English", "AP", ["12"], "Traditional / Magnet", "ap-english-literature", { profile: "ap", ap: true, code: "1001430" });
  batch(["Journalism 1 - Introduction to Journalism", "Journalism 2 - Reporting", "Journalism 3 - Yearbook", "Journalism 4 - Advertising and Public Relations"], "English", "Elective", ["9", "10", "11", "12"], "Traditional / Magnet", "journalism", title => ({ prerequisite: title.includes("1 -") ? "None stated" : "Prerequisite indicated; exact requirement not stated on the Middleton sheet" }));
  batch(["Theatre 1", "Theatre 2"], "Performing Arts", "Elective", ["9", "10", "11", "12"], "Traditional / Magnet", "theatre", title => ({ prerequisite: title.endsWith("2") ? "Prerequisite indicated; exact requirement not stated" : "None stated" }));
  add("Leadership - SGA", "Student Success", "Elective", ["10", "11", "12"], "Traditional / Magnet", "student_success", { prerequisite: "SGA membership required" });

  batch(["Algebra 1A", "Algebra 1", "Geometry", "Geometry Honors"], "Mathematics", "Standard / Honors", ["9", "10", "11"], "Traditional / Magnet", "math_foundations", title => ({ code: title === "Geometry Honors" ? "1206320" : null }));
  batch(["Algebra 2", "Math for College Liberal Arts", "Math for Data and Financial Literacy"], "Mathematics", "Standard", ["9", "10", "11", "12"], "Traditional / Magnet", "math_advanced");
  add("AP Precalculus", "Mathematics", "AP", ["10", "11", "12"], "Traditional / Magnet", "ap-precalculus", { profile: "ap", code: "1202305", ap: true });
  add("AP Statistics", "Mathematics", "AP", ["11", "12"], "Magnet", "ap-statistics", { profile: "ap", ap: true });
  add("AP Calculus AB", "Mathematics", "AP", ["11", "12"], "Magnet", "ap-calculus-ab", { profile: "ap", ap: true });
  add("AP Calculus BC", "Mathematics", "AP", ["11", "12"], "Magnet", "ap-calculus-bc", { profile: "ap", ap: true });

  batch(["Environmental Science", "Biology 1", "Chemistry 1", "Chemistry 1 Honors", "Forensic Science", "Zoology", "Anatomy and Physiology"], "Science", "Standard / Honors", ["9", "10", "11", "12"], "Traditional / Magnet", "science_foundations");
  add("AP Biology", "Science", "AP", ["9", "11", "12"], "Traditional / Magnet", "ap-biology", { profile: "ap", ap: true });
  add("AP Chemistry", "Science", "AP", ["11", "12"], "Traditional / Magnet", "ap-chemistry", { profile: "ap", ap: true });
  add("Physics 1 Honors", "Science", "Honors", ["10", "11", "12"], "Traditional / Magnet", "physics");
  add("AP Physics - exact course title needs confirmation", "Science", "AP listing needs exact title", ["10", "12"], "Magnet", "physics", { id: "ap-physics-unconfirmed-title", profile: "science", ap: true, frameworkStatus: "needs-exact-ap-title", note: "Middleton writes 'AP Physics' without identifying AP Physics 1 or another AP Physics course; StudySpace does not guess." });
  add("AP Physics C: Mechanics", "Science", "AP", ["11", "12"], "Magnet", "ap-physics-c-mechanics", { profile: "ap", ap: true });
  add("AP Physics C: Electricity and Magnetism", "Science", "AP", ["11"], "Magnet", "ap-physics-c-em", { profile: "ap", ap: true });

  batch(["World History", "World History Honors", "United States History", "United States History Honors", "African American History", "Wars of the 20th Century"], "Social Studies", "Standard / Honors", ["9", "10", "11"], "Traditional / Magnet", "social_history");
  batch(["United States Government", "Economics", "Financial Literacy", "Psychology 1", "Psychology 2"], "Social Studies", "Standard / Semester elective", ["9", "10", "11", "12"], "Traditional / Magnet", title => title.startsWith("Psychology") ? "psychology" : "civics_economics");
  add("AP World History: Modern", "Social Studies", "AP", ["10"], "Traditional / Magnet", "ap-world-history", { profile: "ap", ap: true });
  add("AP United States History", "Social Studies", "AP", ["11"], "Traditional / Magnet", "ap-us-history", { profile: "ap", ap: true });
  add("AP United States Government and Politics", "Social Studies", "AP", ["12"], "Magnet", "ap-government", { profile: "ap", ap: true });
  add("AP Microeconomics", "Social Studies", "AP", ["12"], "Magnet", "ap-microeconomics", { profile: "ap", ap: true });
  add("AP Macroeconomics", "Social Studies", "AP", ["12"], "Magnet", "ap-macroeconomics", { profile: "ap", ap: true });

  batch(["Spanish 1", "Spanish 2", "Spanish 3 Honors", "American Sign Language 1", "American Sign Language 2", "American Sign Language 3 Honors", "American Sign Language 4"], "World Languages", "Standard / Honors", ["9", "10", "11", "12"], "Traditional / Magnet", "world_language", title => ({ prerequisite: /[234]/.test(title) ? "Prerequisite indicated; exact requirement not stated" : "None stated" }));
  add("AP Spanish Language and Culture", "World Languages", "AP", ["11", "12"], "Traditional / Magnet", "ap-spanish-language", { profile: "ap", ap: true, prerequisite: "Prerequisite indicated; exact requirement not stated" });
  add("AP Spanish Literature and Culture", "World Languages", "AP", ["11", "12"], "Traditional / Magnet", "ap-spanish-literature", { profile: "ap", ap: true, prerequisite: "Prerequisite indicated; exact requirement not stated" });

  batch(["Creating Two-Dimensional Art", "Creating Three-Dimensional Art", "Two-Dimensional Studio Art 1", "Two-Dimensional Studio Art 2", "Two-Dimensional Studio Art 3 Honors", "Three-Dimensional Studio Art 1", "Three-Dimensional Studio Art 2", "Three-Dimensional Studio Art 3 Honors", "Digital Art Imaging 1"], "Visual Arts", "Elective / Honors", ["9", "10", "11", "12"], "Traditional / Magnet", "visual_art");
  batch(["Band 1", "Band 2", "Band 3", "Band 4", "Instrumental Techniques - Drumline", "Orchestra 2", "Orchestra 3", "Orchestra 4", "Piano 1", "Piano 2", "Piano 3", "Piano 4", "Vocal Ensemble 1", "Vocal Ensemble 2", "Vocal Ensemble 3", "Vocal Ensemble 4"], "Performing Arts", "Elective", ["9", "10", "11", "12"], "Traditional / Magnet", "music_performance", title => ({ prerequisite: /[234]$/.test(title) ? "Prerequisite indicated; exact requirement not stated" : "None stated" }));

  batch(["HOPE", "Team Sports 1", "Team Sports 2", "Basketball 1", "Basketball 2", "Comprehensive Fitness", "Fitness and Lifestyle Design", "Volleyball", "Soccer", "Weight Training 1", "Weight Training 2", "Weight Training 3", "Power Weight Training"], "Physical Education", "Standard / Elective", ["9", "10", "11", "12"], "Traditional / Magnet", "physical_education");
  add("Driver Education", "Student Success", "Semester elective", ["10", "11", "12"], "Traditional / Magnet", "student_success", { prerequisite: "Student must be age 15 before the class begins" });

  batch(["Air Force JROTC 1", "Air Force JROTC 2", "Air Force JROTC 3", "Air Force JROTC 4"], "JROTC", "Elective", ["9", "10", "11", "12"], "Traditional / Magnet", "jrotc", title => ({ prerequisite: title.endsWith("1") ? "None stated" : "Prerequisite indicated; exact requirement not stated" }));
  batch(["AVID 1", "AVID 2", "AVID 3 Honors", "AVID 4"], "Student Success", "Elective / Honors", ["9", "10", "11", "12"], "Traditional / Magnet", "student_success");

  batch(["Agriscience Foundations Honors", "Agritechnology 1", "Agritechnology 2", "Horticulture 2", "Barbering 1", "Barbering 2", "Barbering 3", "Barbering 4", "Blueprint for Success", "Building and Construction Technologies 1", "Building and Construction Technologies 2", "Building and Construction Technologies 3", "Building and Construction Technologies 4", "Business Ownership", "Customer Service 1", "Customer Service 2", "Digital Information Technology 1", "Principles of Entrepreneurship", "Television Production 1 - Introduction to Broadcasting", "Television Production 2 - Morning Show", "Television Production 3 - Commercial and Public Service Announcements", "Television Production 4 - Broadcasting and Certifications", "On-the-Job Training"], "CTE", "CTE / Elective", ["9", "10", "11", "12"], "Traditional / Magnet", "cte");

  batch(["Principles of Biomedical Science Honors", "Human Body Systems Honors", "Bioscience 2 Honors", "Medical Interventions Honors", "Biotechnology 3 Honors", "Bio-Innovation"], "Biomedical", "Magnet / Honors", ["9", "10", "11", "12"], "Biomedical-Biotechnology / Scientific Research", "biomedical", { profile: "biomedical" });
  batch(["Computer Fundamentals", "Game Design Foundations", "Game Design Audio", "Game and Simulation Design", "Game Programming", "3D Game Animation", "Game and Simulation Graphic Arts", "Advanced Game Applications"], "Computer Science", "Magnet", ["9", "10", "11", "12"], "Academy of Computer Game Design", "game_design", title => ({ profile: "computer-science", prerequisite: title === "Game Design Audio" ? "Game Design Foundations in Grade 8" : /Programming|3D|Graphic|Advanced/.test(title) ? "Pathway prerequisite indicated by sequence; exact requirement not stated" : "None stated" }));
  batch(["CSIT Network Systems Configuration", "Artificial Intelligence", "CSIT Network Systems Design and Administration", "CSIT Cyber Security Essentials", "CSIT Cyber Security Physical"], "Computer Science", "Magnet", ["10", "11", "12"], "Computer Systems: Cyber Security", "computer_science", { profile: "computer-science" });
  add("AP Computer Science Principles", "Computer Science", "AP", ["10", "11", "12"], "Traditional / Magnet", "ap-csp", { profile: "ap", ap: true });
  add("AP Computer Science A", "Computer Science", "AP", ["11", "12"], "Magnet", "ap-csa", { profile: "ap", ap: true });
  batch(["Introduction to Engineering Design", "Technical Design 1", "Computer Manufacturing", "Digital Electronics", "Principles of Engineering", "Aerospace Engineering", "Civil Engineering and Architecture", "Engineering Design and Development Honors", "Technical Design 3"], "Engineering", "Magnet / Honors", ["9", "10", "11", "12"], "Academy of Engineering (PLTW)", "engineering", { profile: "engineering" });

  add("AICE English General Paper AS", "English", "AICE", ["10", "11"], "AICE", "aice-general-paper", { profile: "aice", aice: true, code: "8021" });
  add("AICE English Language AS", "English", "AICE", ["11", "12"], "AICE", "aice-english-language", { profile: "aice", aice: true, code: "9093" });
  add("AICE Global Perspectives and Research AS", "Social Studies", "AICE", ["9", "10", "11", "12"], "AICE", "aice-global-perspectives", { profile: "aice", aice: true, code: "9239" });
  add("AICE Marine Science AS", "Science", "AICE", ["11", "12"], "AICE", "aice-marine-science", { profile: "aice", aice: true, code: "9693" });
  add("AICE Environmental Management AS", "Science", "AICE", ["10", "11", "12"], "AICE", "aice-environmental-management", { profile: "aice", aice: true, code: "8291" });
  add("AICE Mathematics", "Mathematics", "AICE", ["11", "12"], "AICE", "aice-mathematics", { profile: "aice", aice: true, code: "9709", note: "Middleton lists AICE Math and identifies AS/A component combinations; students should confirm the exact component entry with counseling." });
  add("AICE Psychology AS", "Social Studies", "AICE", ["9", "10", "11", "12"], "AICE", "aice-psychology", { profile: "aice", aice: true, code: "9990" });
  add("AICE Sport and Physical Education AS", "Physical Education", "AICE", ["9", "10", "11", "12"], "AICE", "aice-sport-pe", { profile: "aice", aice: true, code: "8386" });

  const known = {
    aphg: { subject: "Social Studies", level: "AP", gradeLevels: ["9"], program: "Traditional / Magnet", ap: true, code: "Not listed by Middleton", route: "aphg.html" },
    algebra2: { subject: "Mathematics", level: "Honors", gradeLevels: ["9", "10", "11", "12"], program: "Traditional / Magnet", code: "1200340", route: "algebra2.html" },
    biology: { subject: "Science", level: "Honors", gradeLevels: ["9", "10"], program: "Traditional / Magnet", code: "2000320", route: "biology.html" },
    english: { subject: "English", level: "Honors", gradeLevels: ["9"], program: "Traditional / Magnet", code: "1001320", route: "subject.html?s=english" },
    orchestra: { subject: "Performing Arts", level: "Elective", gradeLevels: ["9", "10", "11", "12"], program: "Traditional / Magnet", code: "1302360", route: "subject.html?s=orchestra" },
    "thinking-skills": { subject: "Social Studies", level: "AICE", gradeLevels: ["9", "10", "11", "12"], program: "AICE", aice: true, code: "9694", route: "subject.html?s=thinking-skills" },
    "csit-foundations": { subject: "Computer Science", level: "Magnet", gradeLevels: ["9"], program: "Computer Systems: Cyber Security", code: "Not listed by Middleton", route: "subject.html?s=csit-foundations" },
    "csit-essentials": { subject: "Computer Science", level: "Magnet", gradeLevels: ["9"], program: "Computer Systems: Cyber Security", code: "Not listed by Middleton", route: "csit-essentials.html" }
  };

  Object.entries(known).forEach(([id, metadata]) => {
    const course = registry.course(id);
    if (!course) return;
    Object.assign(course, metadata, {
      availabilityStatus: "verified-middleton", schoolAvailability: "Verified on Middleton 2025-2026 programming sheets", sourceYear: schoolYear,
      source: schoolSource.id, status: "verified-middleton",
      offeringSourceUrl: schoolSource.url, credits: course.credits || "Not listed by Middleton", prerequisites: course.prerequisites || "See grade placement and counselor guidance",
      contentStatus: "complete", libraryRoute: metadata.route, libraryNote: "Existing detailed StudySpace course preserved"
    });
    if (!course.sources.some(source => source.id === schoolSource.id)) course.sources.unshift(schoolSource);
  });

  function buildCourse(spec) {
    const id = spec.id;
    if (registry.course(id)) return;
    const profile = spec.profile || (spec.ap ? "ap" : spec.aice ? "aice" : spec.subject === "Mathematics" ? "math" : spec.subject === "Science" ? "science" : spec.subject === "Social Studies" ? "social" : spec.subject === "English" ? "english" : spec.subject === "World Languages" ? "world-language" : spec.subject === "Visual Arts" ? "visual-arts" : spec.subject === "Performing Arts" ? "performing-arts" : spec.subject === "Physical Education" ? "physical-education" : spec.subject === "JROTC" ? "jrotc" : spec.subject === "Student Success" ? "student-success" : spec.subject === "Engineering" ? "engineering" : spec.subject === "Biomedical" ? "biomedical" : spec.subject === "Computer Science" ? "computer-science" : "cte");
    const framework = sourceFor(profile);
    const base = { id, title: spec.title };
    const classSource = teacherSource(base);
    const generated = generatedSource(base);
    const sourceIds = [framework.id, generated.id];
    const plan = allBlueprints[spec.key] || blueprints[spec.key] || blueprints.cte;
    const units = plan.map((entry, index) => unit(String(index + 1), entry.title, entry.summary, entry.topics.map((title, topicIndex) => topic(`${index + 1}.${topicIndex + 1}`, title, `${title} in ${spec.title}: ${entry.summary}`, sourceIds)), sourceIds));
    registry.courses[id] = {
      id, title: spec.title, icon: iconFor(spec.subject), courseCode: spec.code || "Not listed by Middleton", credits: spec.credits || "Not listed by Middleton",
      prerequisites: spec.prerequisite || "Not stated on the Middleton programming sheets", subject: spec.subject, level: spec.level, gradeLevels: spec.gradeLevels,
      program: spec.program, ap: Boolean(spec.ap), aice: Boolean(spec.aice), profileId: profile, frameworkStatus: spec.frameworkStatus || "verified-framework",
      frameworkSourceId: framework.id, availabilityStatus: "verified-middleton", schoolAvailability: "Verified on Middleton 2025-2026 programming sheets",
      source: schoolSource.id, status: "verified-middleton",
      sourceYear: schoolYear, offeringSourceUrl: schoolSource.url, contentStatus: "complete-original", libraryRoute: `subject.html?s=${encodeURIComponent(id)}`,
      summary: `${spec.title} is a verified Middleton offering from the latest complete school-specific programming set located. StudySpace teaches an original ${units.length}-unit sequence mapped to the applicable public framework; teacher pacing and assignments remain separate.`,
      note: spec.note || "", skills: units.flatMap(item => item.topics.slice(0, 1).map(entry => entry.title)).slice(0, 6), sources: [schoolSource, framework, classSource, generated], units
    };
  }
  courseSpecs.forEach(buildCourse);

  const course = id => registry.course(id);
  const list = () => Object.values(registry.courses).filter(item => item.availabilityStatus === "verified-middleton").sort((a, b) => a.subject.localeCompare(b.subject) || a.title.localeCompare(b.title));
  const collections = {
    ap: () => list().filter(item => item.ap),
    aice: () => list().filter(item => item.aice),
    magnet: () => list().filter(item => /Biomedical|Game Design|Cyber Security|Engineering/.test(item.program || ""))
  };
  globalThis.MIDDLETON_COURSE_LIBRARY = { version: 1, accessed, schoolYear, schoolSource, course, list, collections };
})();
