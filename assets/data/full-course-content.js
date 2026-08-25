(function () {
  "use strict";

  const profiles = {
    aphg: {
      noun: "geographic process", evidence: "a map, table, image, or spatial pattern", visual: "scale-flow",
      method: ["Name the geographic concept", "Describe the visible spatial pattern", "Explain the process that produces it", "Test whether the claim changes at another scale"],
      example: "Compare two places, identify a pattern, and connect that pattern to a geographic process rather than simply restating the data.",
      mistake: "Naming a pattern without explaining the process or using the scale named in the prompt."
    },
    algebra2: {
      noun: "algebraic relationship", evidence: "an equation, graph, table, or contextual constraint", visual: "representation-bridge",
      method: ["Identify the function family and domain", "Choose an equivalent representation", "Carry out the algebra with valid operations", "Check the result in the original form and context"],
      example: "Translate the given information into a function, solve or transform it, then verify the answer by substitution or by comparing representations.",
      mistake: "Applying a remembered procedure without checking domain restrictions, equivalent forms, or whether the result fits the original problem."
    },
    biology: {
      noun: "biological mechanism", evidence: "a model, observation, data set, or experimental result", visual: "cause-mechanism-effect",
      method: ["Identify the structure, reactants, or organisms involved", "Trace matter, energy, or information through the mechanism", "Predict the effect of changing one variable", "Support the explanation with biological evidence"],
      example: "Use a labeled model to trace what enters, what changes, and what leaves, then predict how the system responds when one part is disrupted.",
      mistake: "Listing vocabulary without explaining the causal mechanism connecting structure, function, and evidence."
    },
    "thinking-skills": {
      noun: "reasoning skill", evidence: "the information explicitly supplied in the problem or argument", visual: "reasoning-chain",
      method: ["State exactly what must be found or judged", "Separate relevant evidence from background detail", "Show each inference or operation", "Check that the conclusion is no stronger than the evidence"],
      example: "Organize unfamiliar information into a table or argument map, perform only justified steps, and explain why the conclusion follows.",
      mistake: "Using outside assumptions or jumping from evidence to a conclusion without showing the missing reasoning step."
    },
    "csit-essentials": {
      noun: "IT support competency", evidence: "device symptoms, specifications, logs, or test results", visual: "diagnostic-flow",
      method: ["Identify the requirement or symptom", "Protect people, equipment, and data", "Test the simplest likely cause with a controlled change", "Verify full functionality and document the result"],
      example: "Confirm the symptom, choose a safe diagnostic test, change one variable, retest, and record both the cause and resolution.",
      mistake: "Replacing parts or changing several settings before confirming the problem and establishing a baseline."
    },
    "csit-foundations": {
      noun: "computing concept", evidence: "a system diagram, data representation, algorithm, or user requirement", visual: "input-process-output",
      method: ["Define the user or system goal", "Identify inputs, processes, outputs, and constraints", "Choose a safe and ethical solution", "Test the result and explain its limits"],
      example: "Break a digital task into smaller steps, represent the flow clearly, test typical and edge cases, and revise from evidence.",
      mistake: "Treating technology as a black box instead of explaining how data, instructions, people, and devices interact."
    },
    english: {
      noun: "literacy skill", evidence: "precise words, details, structures, or patterns in an original passage", visual: "claim-evidence-reasoning",
      method: ["Read for the exact task", "Select the strongest relevant textual evidence", "Explain how the evidence supports the idea", "Revise for clarity, organization, and precise language"],
      example: "Make a defensible claim about an original passage, embed a concise detail, and explain the connection rather than letting the quotation stand alone.",
      mistake: "Summarizing the passage or dropping in evidence without analyzing how the language supports the claim."
    },
    orchestra: {
      noun: "musicianship skill", evidence: "sound, notation, physical setup, or rehearsal feedback", visual: "practice-loop",
      method: ["Define the sound or notation goal", "Isolate one controllable technique", "Practice slowly with a steady pulse", "Listen, adjust, and reconnect the skill to the ensemble"],
      example: "Record or listen to a short attempt, identify one specific difference from the goal, adjust one variable, and repeat accurately before increasing tempo.",
      mistake: "Repeating the entire passage at full speed without isolating the cause of the inaccurate sound."
    },
    math: {
      noun: "mathematical relationship", evidence: "an equation, graph, table, diagram, or contextual constraint", visual: "representation-bridge",
      method: ["Identify the quantities and conditions", "Choose a valid representation or theorem", "Show equivalent steps with units and restrictions", "Verify the result in the original context"],
      example: "Translate the conditions into a mathematical model, solve with justified steps, and test whether the result satisfies every stated restriction.",
      mistake: "Applying a procedure without checking meaning, units, domain restrictions, or whether the answer fits the original conditions."
    },
    science: {
      noun: "scientific mechanism", evidence: "observations, a model, measurements, or an experimental data set", visual: "cause-mechanism-effect",
      method: ["Define the system and question", "Identify variables, structures, and evidence", "Explain the mechanism or mathematical relationship", "Evaluate uncertainty and test the prediction"],
      example: "Use a model and measured evidence to explain what changes, why it changes, and what result would support or challenge the explanation.",
      mistake: "Naming a trend or vocabulary term without explaining the mechanism, controls, or evidence that supports the conclusion."
    },
    social: {
      noun: "historical or civic claim", evidence: "a primary source, data set, map, law, or documented historical pattern", visual: "claim-evidence-reasoning",
      method: ["Place the question in time and context", "Source and compare the evidence", "Explain causation, continuity, or institutional process", "Qualify the conclusion with limits or competing evidence"],
      example: "Build a claim from specific evidence, connect it to historical context or civic structure, and address a plausible alternative interpretation.",
      mistake: "Retelling events or stating an opinion without sourcing evidence and explaining the connection to the claim."
    },
    "world-language": {
      noun: "communication skill", evidence: "meaning conveyed through spoken, signed, written, or visual language in context", visual: "practice-loop",
      method: ["Identify the audience, purpose, and mode", "Notice key language and cultural context", "Communicate a complete message", "Repair, revise, and compare how meaning was received"],
      example: "Interpret the main message and supporting detail, then respond with language appropriate to the audience, purpose, and cultural context.",
      mistake: "Translating word by word while ignoring context, register, communication mode, or whether the message is understandable."
    },
    "visual-arts": {
      noun: "visual-art decision", evidence: "the artwork, process record, material test, reference, or critique criteria", visual: "practice-loop",
      method: ["Define the visual purpose", "Select elements, principles, tools, and materials", "Create and document intentional trials", "Critique the result and revise one decision"],
      example: "Develop multiple studies, choose a composition for a stated reason, document the process, and revise from specific critique evidence.",
      mistake: "Treating the first draft as finished or describing an artwork without analyzing how visual choices create meaning."
    },
    "performing-arts": {
      noun: "performance skill", evidence: "sound, movement, notation, script, rehearsal notes, or a recording", visual: "practice-loop",
      method: ["Define the intended performance effect", "Isolate one technical or expressive variable", "Rehearse accurately at a controllable pace", "Apply feedback and reconnect the part to the ensemble"],
      example: "Record a focused attempt, compare it with the performance criteria, adjust one controllable choice, and repeat before restoring full context.",
      mistake: "Repeating the whole performance without isolating the technical or expressive decision that needs adjustment."
    },
    "computer-science": {
      noun: "computing system", evidence: "requirements, code, a system diagram, data, logs, tests, or user feedback", visual: "input-process-output",
      method: ["Define the user need and constraints", "Model data, components, and control flow", "Implement or configure one testable increment", "Test edge cases, security, accessibility, and impact"],
      example: "Break the requirement into components, build a minimal working version, test normal and edge cases, and document the revision.",
      mistake: "Changing code or configuration without a testable requirement, baseline, or evidence that the change solved the right problem."
    },
    engineering: {
      noun: "engineering design decision", evidence: "criteria, constraints, calculations, prototype data, failure observations, or stakeholder feedback", visual: "diagnostic-flow",
      method: ["Define measurable criteria and constraints", "Generate and compare multiple concepts", "Build and run a controlled test", "Use evidence to justify the next iteration"],
      example: "Create a test plan tied to one criterion, measure prototype performance, identify the limiting failure, and revise one variable.",
      mistake: "Choosing a preferred idea before defining criteria or claiming success without a repeatable test against the requirement."
    },
    biomedical: {
      noun: "biomedical mechanism or design", evidence: "case evidence, biological data, a model, experiment, or diagnostic result", visual: "cause-mechanism-effect",
      method: ["Define the biological system and ethical boundary", "Trace structure, function, and evidence", "Compare diagnostic or design alternatives", "State the conclusion with uncertainty and limitations"],
      example: "Use de-identified case evidence to trace a mechanism, compare possible explanations, and propose a test that could distinguish them.",
      mistake: "Jumping from one symptom or measurement to a diagnosis without considering alternatives, uncertainty, and ethical limits."
    },
    cte: {
      noun: "technical workplace competency", evidence: "specifications, a work order, measurements, safety rules, customer requirements, or a finished product", visual: "diagnostic-flow",
      method: ["Confirm the requirement and hazards", "Select the correct tools, materials, and procedure", "Complete and document the process", "Inspect quality and correct defects safely"],
      example: "Read the work requirement, prepare the workspace, follow the field process, and verify the result against a quality standard.",
      mistake: "Starting work without confirming the requirement, safety controls, material limits, or how quality will be checked."
    },
    jrotc: {
      noun: "leadership and citizenship competency", evidence: "a scenario, mission goal, team plan, standard, or after-action review", visual: "reasoning-chain",
      method: ["Clarify the mission and ethical standard", "Assign roles and communicate expectations", "Act safely and accountably", "Review outcomes and improve the plan"],
      example: "Brief a team on a measurable goal, confirm roles and risks, carry out the plan, and use an after-action review to improve.",
      mistake: "Confusing authority with leadership or giving directions without communication, accountability, and review."
    },
    "physical-education": {
      noun: "movement or fitness skill", evidence: "technique criteria, activity data, game conditions, or a personal training log", visual: "practice-loop",
      method: ["Warm up and define the safe movement goal", "Practice the technique at a controllable intensity", "Use feedback or activity data", "Recover and adjust the next session"],
      example: "Use a measurable fitness or skill goal, perform with safe technique, record the result, and adjust workload using progression and recovery.",
      mistake: "Increasing intensity before technique, recovery, and individual readiness are established."
    },
    "student-success": {
      noun: "student success strategy", evidence: "a deadline, goal, schedule, rubric, feedback, or progress record", visual: "practice-loop",
      method: ["Define the outcome and deadline", "Break it into visible next actions", "Use a realistic schedule and support", "Review evidence of progress and adjust"],
      example: "Turn a broad goal into dated actions, schedule the first step, identify help resources, and revise the plan from actual progress.",
      mistake: "Setting a vague goal without a next action, time estimate, checkpoint, or plan for getting help."
    },
    ap: {
      noun: "AP framework concept", evidence: "the source, representation, data, or problem conditions supplied by the prompt", visual: "claim-evidence-reasoning",
      method: ["Identify the official skill and concept being assessed", "Extract precise evidence and conditions", "Apply the discipline-specific method", "Justify the conclusion and check the scoring demand"],
      example: "Analyze an original AP-style prompt, show the discipline-specific reasoning, and support the response with the exact evidence or representation provided.",
      mistake: "Recalling isolated facts without answering the command, using evidence, or showing the reasoning expected by the course framework."
    },
    aice: {
      noun: "Cambridge syllabus skill", evidence: "the stimulus, data, argument, source, or task conditions supplied", visual: "reasoning-chain",
      method: ["Identify the assessment objective and command word", "Select relevant evidence or information", "Show a clear analytical method", "Evaluate the result and communicate it precisely"],
      example: "Apply the current syllabus skill to an original task, make the reasoning visible, and evaluate limitations before reaching a conclusion.",
      mistake: "Writing a memorized response that does not address the specific source, data, command word, or assessment objective."
    }
  };

  const unitAnchors = {
    aphg: {
      "1": ["spatial thinking", "scale", "pattern", "geographic evidence"], "2": ["population distribution", "demographic change", "migration", "population policy"],
      "3": ["culture", "cultural landscape", "diffusion", "identity"], "4": ["state", "territoriality", "boundary", "sovereignty"],
      "5": ["agricultural system", "land use", "food network", "sustainability"], "6": ["urbanization", "city system", "land-use model", "infrastructure"],
      "7": ["industrialization", "development", "global production", "sustainability"]
    },
    algebra2: {
      "class-1": ["parent function", "transformation", "domain and range", "piecewise rule"], A: ["imaginary unit", "complex conjugate", "polynomial zero", "factor"],
      B: ["equivalent expression", "polynomial division", "radical restriction", "excluded value"], C: ["function family", "rate of change", "asymptote", "model fit"],
      D: ["solution set", "intersection", "substitution", "feasible region"], E: ["transformation", "composition", "inverse", "domain restriction"],
      F: ["sample space", "conditional probability", "independence", "two-way table"]
    },
    biology: {
      "1": ["structure and function", "matter and energy", "cell", "homeostasis"], "2": ["cell cycle", "chromosome", "DNA", "gene expression"],
      "3": ["allele", "variation", "natural selection", "common ancestry"], "4": ["ecosystem", "energy flow", "matter cycle", "biodiversity"],
      "5": ["structure and function", "feedback loop", "homeostasis", "system interaction"]
    },
    "thinking-skills": {
      PS1: ["relevant information", "constraint", "condition", "model"], PS2: ["operation", "process", "method", "efficiency"], PS3: ["representation", "pattern", "hypothesis", "conclusion"],
      CT1: ["credibility", "corroboration", "inference", "plausibility"], CT2: ["reason", "conclusion", "assumption", "argument structure"],
      CT3: ["fallacy", "relevance", "consistency", "counterexample"], CT4: ["claim", "reason", "intermediate conclusion", "counterargument"], EX: ["command word", "method mark", "time allocation", "evaluation"]
    },
    english: {
      "1": ["textual evidence", "central idea", "objective summary", "inference"], "2": ["characterization", "conflict", "point of view", "theme"],
      "3": ["claim", "evidence", "purpose", "rhetoric"], "4": ["argument", "counterclaim", "organization", "reasoning"],
      "5": ["structure", "narrative technique", "style", "convention"], "6": ["morpheme", "syntax", "usage", "register"],
      "7": ["research question", "credibility", "citation", "presentation"], "8": ["synthesis", "timed analysis", "revision", "reflection"]
    },
    orchestra: {
      "1": ["instrument care", "playing position", "rehearsal etiquette", "ensemble awareness"], "2": ["tone", "bow distribution", "left-hand frame", "intonation"],
      "3": ["notation", "subdivision", "key signature", "articulation"], "4": ["pulse", "balance", "conductor cue", "part preparation"],
      "5": ["motif", "variation", "improvisation", "notation"], "6": ["performance criterion", "feedback", "context", "connection"],
      "7": ["goal", "practice strategy", "reflection", "portfolio evidence"]
    }
  };

  const definitions = {
    "spatial thinking": "reasoning about where things are, why they are there, and how places are connected", scale: "the geographic level of observation or the relationship between map distance and ground distance", pattern: "a repeated spatial arrangement that may reveal an underlying process", "geographic evidence": "mapped, quantitative, qualitative, or visual information used to support a spatial claim",
    "population distribution": "the arrangement of people across space", "demographic change": "change in population size or composition through births, deaths, and migration", migration: "a permanent or semipermanent move to a new residence", "population policy": "government action intended to influence population size, composition, or distribution",
    culture: "shared practices, technologies, beliefs, and values learned by a group", "cultural landscape": "the visible imprint of human activity and values on a place", diffusion: "the spread of an idea, trait, technology, or practice through space and time", identity: "how people understand and express membership, difference, and belonging",
    state: "a politically organized territory with a permanent population and sovereignty", territoriality: "the effort to control land, people, and resources by delimiting territory", boundary: "a line that marks the territorial limit of political authority", sovereignty: "the recognized authority of a state to govern its territory",
    "agricultural system": "the connected inputs, practices, locations, and markets involved in food production", "land use": "the human purpose assigned to land", "food network": "the linked production, processing, transport, retail, and consumption of food", sustainability: "meeting current needs while maintaining environmental and social systems for the future",
    urbanization: "an increase in the share of people living in cities and the processes that create urban growth", "city system": "a network of settlements connected by flows and organized by size and function", "land-use model": "a simplified representation of how activities are arranged within urban space", infrastructure: "the transportation, utility, communication, and public-service systems that support settlement",
    industrialization: "the growth of machine-based manufacturing and related economic change", development: "improvement in economic, social, and human well-being", "global production": "the division of production stages among connected places", "parent function": "the simplest function in a family from which transformations are described", transformation: "a change to a graph produced by modifying a function's input or output", "domain and range": "the permitted input values and resulting output values", "piecewise rule": "a function defined by different expressions on different parts of its domain",
    "imaginary unit": "the number i defined by i squared equals negative one", "complex conjugate": "a pair a+bi and a-bi whose product is real", "polynomial zero": "an input value that makes a polynomial equal zero", factor: "an expression multiplied by another expression to produce a product",
    "equivalent expression": "an expression with the same value for every permitted input", "polynomial division": "division that rewrites a polynomial as divisor times quotient plus remainder", "radical restriction": "a condition required for a radical expression to be real and defined", "excluded value": "an input that makes an original denominator zero",
    "function family": "a group of functions sharing a characteristic equation and graph shape", "rate of change": "the change in output per unit change in input", asymptote: "a line a graph approaches according to its end or boundary behavior", "model fit": "how well a function represents observed data and the context",
    "solution set": "all values that make an equation, inequality, or system true", intersection: "a point or region satisfying multiple relations at once", substitution: "replacing an expression with an equivalent value or expression", "feasible region": "the set of points satisfying every constraint in a system",
    composition: "using the output of one function as the input of another", inverse: "a relation that reverses a function's input-output process", "domain restriction": "a limitation on inputs needed for a function or inverse to be valid", "sample space": "the set of all possible outcomes", "conditional probability": "the probability of an event given that another event has occurred", independence: "a relationship in which one event does not change the probability of another", "two-way table": "a frequency table that classifies observations by two categorical variables",
    "structure and function": "the principle that a biological part's form helps determine what it can do", "matter and energy": "materials are rearranged while energy is transferred and transformed in living systems", cell: "the smallest unit capable of carrying out all processes of life", homeostasis: "maintenance of internal conditions within a life-sustaining range",
    "cell cycle": "the regulated sequence of growth, DNA replication, and division", chromosome: "a DNA molecule packaged with proteins and carrying genetic information", DNA: "the nucleic acid that stores hereditary information", "gene expression": "the regulated use of genetic information to produce functional RNA or protein",
    allele: "an alternative form of a gene", variation: "heritable and environmental differences among individuals", "natural selection": "differential survival and reproduction associated with heritable traits", "common ancestry": "descent of different lineages from shared ancestral populations",
    ecosystem: "organisms and the physical environment interacting as a system", "energy flow": "one-way transfer of usable energy through trophic levels", "matter cycle": "repeated movement of atoms among living and nonliving reservoirs", biodiversity: "variation among genes, species, and ecosystems",
    "feedback loop": "a system in which a change produces responses that amplify or reduce that change", "system interaction": "the coordinated effect of multiple parts or organ systems",
    "relevant information": "evidence that can change or determine the requested result", constraint: "a condition that a valid solution must satisfy", condition: "a requirement that may be necessary, sufficient, both, or neither", model: "a simplified representation used to reason about a system",
    operation: "a defined action performed on information or quantities", process: "an ordered sequence that changes an input into an output", method: "a repeatable strategy for reaching and checking a result", efficiency: "achieving a valid result with minimal unnecessary work",
    representation: "a table, diagram, expression, graph, or wording that encodes information", hypothesis: "a testable proposed explanation or pattern", conclusion: "the claim supported at the end of reasoning", credibility: "the degree to which a source or claim deserves trust", corroboration: "independent evidence that supports the same claim", inference: "a conclusion drawn from evidence rather than directly stated", plausibility: "how reasonably a claim fits the available evidence and background knowledge",
    reason: "a statement offered to support a conclusion", assumption: "an unstated idea required for reasoning to work", "argument structure": "the way reasons and intermediate conclusions combine to support a main conclusion", fallacy: "a recognizable flaw in reasoning", relevance: "the degree to which evidence bears on the claim", consistency: "freedom from contradiction", counterexample: "a case showing that a general claim is false", claim: "a statement that can be supported or challenged", counterargument: "a reasoned objection to a claim", "intermediate conclusion": "a claim supported by reasons that then supports a further conclusion",
    "textual evidence": "specific language or detail from a text that supports an interpretation", "central idea": "the main understanding developed by an informational text", "objective summary": "a concise account of main ideas without personal judgment", characterization: "the methods a text uses to reveal a character", conflict: "a struggle that drives action or change", "point of view": "the position and perspective from which a text is presented", theme: "an insight about life or human experience developed through a text", rhetoric: "strategic language choices used to influence an audience", argument: "a claim supported by reasons and evidence", organization: "the deliberate arrangement of ideas", reasoning: "the explanation connecting evidence to a claim", "narrative technique": "a storytelling choice such as pacing, dialogue, description, or reflection", style: "the distinctive effect of diction, syntax, and structure", convention: "an agreed rule for grammar, usage, mechanics, or genre", morpheme: "the smallest meaningful word part", syntax: "the arrangement of words and phrases in sentences", usage: "conventional choices among word forms", register: "language suited to a particular audience, purpose, and situation", citation: "a record identifying the source of borrowed information", synthesis: "combining ideas from multiple sources into a new understanding", revision: "rethinking content and organization to improve meaning", reflection: "evidence-based evaluation of learning or performance",
    tone: "the quality of sound shaped by bow, instrument, resonance, and technique", "bow distribution": "planning how much bow is used for notes or phrases", "left-hand frame": "the balanced hand shape that supports consistent finger placement", intonation: "accuracy of pitch", notation: "symbols that communicate musical sound and performance directions", subdivision: "dividing a beat into equal smaller units", "key signature": "sharps or flats that establish the pitch collection of a key", articulation: "how a note begins, continues, and ends", pulse: "the steady underlying beat", balance: "the relative volume of parts", "conductor cue": "a visible signal communicating entrance, tempo, character, or release", motif: "a short recognizable musical idea", improvisation: "creating music in real time within chosen constraints", "performance criterion": "a specific observable standard used to judge a performance", feedback: "information used to adjust future performance", context: "historical, cultural, or practical circumstances shaping music", goal: "a specific intended performance result", "practice strategy": "a deliberate method chosen to solve a musical problem", "portfolio evidence": "recorded, written, or notated work demonstrating growth", safety: "procedures that protect people, equipment, and data from preventable harm", compatibility: "the ability of components, standards, and software to work together as required", configuration: "the selected settings that determine how a device or service operates", troubleshooting: "a systematic process for identifying, testing, correcting, and documenting the cause of a problem", system: "connected people, components, rules, and processes working toward a purpose", data: "encoded facts or observations that can be stored, processed, and communicated", algorithm: "a finite ordered set of steps for solving a class of problems", "digital ethics": "principles for responsible, fair, lawful, safe, and privacy-aware use of technology"
  };

  const defaultAnchors = {
    "csit-essentials": ["safety", "compatibility", "configuration", "troubleshooting"],
    "csit-foundations": ["system", "data", "algorithm", "digital ethics"]
  };
  Object.assign(defaultAnchors, {
    english: ["textual evidence", "claim", "purpose", "revision"], orchestra: ["tone", "notation", "ensemble", "feedback"],
    math: ["representation", "constraint", "equivalence", "verification"], science: ["system", "variable", "mechanism", "evidence"], social: ["context", "source", "causation", "claim"],
    "world-language": ["audience", "purpose", "register", "communication"], "visual-arts": ["composition", "medium", "process", "critique"], "performing-arts": ["technique", "expression", "ensemble", "feedback"],
    "computer-science": ["requirement", "algorithm", "data", "testing"], engineering: ["criteria", "constraints", "prototype", "iteration"], biomedical: ["structure and function", "diagnostic evidence", "intervention", "ethics"],
    cte: ["safety", "procedure", "quality control", "customer requirement"], jrotc: ["leadership", "mission", "teamwork", "reflection"], "physical-education": ["technique", "progression", "recovery", "fitness data"],
    "student-success": ["goal", "next action", "schedule", "reflection"], ap: ["framework skill", "evidence", "command word", "justification"], aice: ["assessment objective", "stimulus", "analysis", "evaluation"]
  });
  const subjectProfile = { English: "english", Mathematics: "math", Science: "science", "Social Studies": "social", "World Languages": "world-language", "Visual Arts": "visual-arts", "Performing Arts": "performing-arts", "Computer Science": "computer-science", Engineering: "engineering", Biomedical: "biomedical", CTE: "cte", JROTC: "jrotc", "Physical Education": "physical-education", "Student Success": "student-success" };
  const unitTerms = (course, unitId) => unitAnchors[course.id]?.[unitId] || defaultAnchors[subjectProfile[course.subject]] || defaultAnchors[course.profileId || course.id] || [];
  const sentence = value => /[.!?]$/.test(value) ? value : `${value}.`;

  const fallbackFact = (course, unit, topic) => `${topic.summary || `${topic.title} belongs to ${unit.title}.`} Mastery means explaining the governing idea, applying it to new evidence or conditions, and checking the result against the expectations of ${course.title}.`;

  function specific(course, unit, topic) {
    const t = topic.title.toLowerCase();
    if (course.subject === "Science") {
      if (t === "water" || t.includes("properties of water")) return { fact: "Water is polar, forms hydrogen bonds, resists rapid temperature change, dissolves many ionic and polar substances, and participates directly in biological reactions.", example: "Hydrogen bonding creates surface tension and helps water buffer temperature changes inside cells and ecosystems.", mistake: "Saying water dissolves every substance or treating hydrogen bonds as the covalent bonds within one water molecule." };
      if (t.includes("macromolecule")) return { fact: "Carbohydrates, lipids, proteins, and nucleic acids have distinct monomers, bonds, structures, and cellular functions; structure determines what each molecule can do.", example: "Changing an enzyme's amino-acid interactions can alter its three-dimensional active site and therefore its function.", mistake: "Memorizing four categories without connecting monomer, bond, shape, and function." };
      if (t.includes("membrane") || t === "transport") return { fact: "A selectively permeable phospholipid bilayer regulates movement through diffusion, osmosis, facilitated diffusion, and energy-requiring active transport.", example: "Water moves toward the side with lower free-water concentration, while a pump can move ions against their gradient using ATP.", mistake: "Assuming every molecule crosses the membrane freely or that osmosis is the movement of solute." };
      if (t.includes("enzyme") || t.includes("activation energy")) return { fact: "Enzymes speed reactions by lowering activation energy through specific interactions with substrates; temperature, pH, concentration, and inhibitors affect reaction rate.", example: "An inhibitor occupying an active site can reduce product formation even though the reaction remains thermodynamically possible.", mistake: "Claiming enzymes supply energy, change equilibrium, or are permanently consumed by each reaction." };
      if (t.includes("photosynthesis")) return { fact: "Light reactions convert light energy into ATP and NADPH, while the Calvin cycle uses those products to reduce carbon dioxide into carbohydrate precursors.", example: "Closing stomata can conserve water but limit carbon dioxide entry and lower carbon fixation.", mistake: "Saying plants create matter from sunlight or that the Calvin cycle directly requires light photons." };
      if (t.includes("cellular respiration")) return { fact: "Glycolysis, pyruvate oxidation, the citric acid cycle, and oxidative phosphorylation transfer energy from fuel molecules to ATP through electron carriers and chemiosmosis.", example: "Without oxygen as the final electron acceptor, the electron transport chain slows and cells must regenerate NAD+ by another pathway.", mistake: "Treating oxygen as the source of the carbon dioxide released during glucose oxidation." };
      if (t.includes("stoichiometry") || t.includes("moles")) return { fact: "A balanced equation gives particle and mole ratios; dimensional analysis connects those ratios to mass, solution volume, gas volume, or particle count.", example: "Convert grams to moles, apply the balanced-equation ratio, then convert to the requested unit and check significant figures.", mistake: "Using coefficients as gram ratios or skipping the limiting-reactant check." };
      if (t.includes("equilibrium") || t.includes("le chatelier")) return { fact: "At dynamic equilibrium forward and reverse rates are equal; equilibrium constants describe the ratio of activities, while a disturbance changes the reaction quotient and drives a response.", example: "Adding reactant makes Q smaller than K, so the system proceeds forward until Q again equals K.", mistake: "Saying equilibrium means equal concentrations or that a catalyst changes the equilibrium constant." };
      if (t.includes("acid") || t.includes("buffer") || t.includes("titration")) return { fact: "Acid-base behavior depends on proton transfer and equilibrium; buffers use a weak acid-base pair to reduce pH change, and titration calculations must match the reaction stoichiometry.", example: "Near a buffer's pKa, comparable weak-acid and conjugate-base amounts allow added acid or base to be consumed.", mistake: "Assuming neutral pH is always exactly 7 or that the equivalence point must be neutral." };
      if (t.includes("electric field") || t.includes("coulomb") || t.includes("potential")) return { fact: "Electric fields describe force per unit charge, while electric potential describes energy per unit charge; both obey superposition.", example: "A positive test charge accelerates in the field direction while its electric potential energy decreases.", mistake: "Treating electric field and electric potential as the same quantity or adding vector fields as scalars." };
      if (t.includes("kinematic") || t.includes("acceleration") || t.includes("motion")) return { fact: "Position, velocity, and acceleration describe different aspects of motion; slopes and signed areas connect their graphs.", example: "The slope of a position-time graph is velocity, while area under an acceleration-time graph gives change in velocity.", mistake: "Assuming negative acceleration always means an object is slowing down." };
      if (t.includes("force") || t.includes("newton") || t.includes("free-body")) return { fact: "Net external force determines acceleration; a free-body diagram must isolate one system and show only forces acting on that system.", example: "For a sliding block, weight and normal can balance vertically while friction changes horizontal motion.", mistake: "Drawing motion arrows as forces or placing both members of a Newton's-third-law pair on one object's diagram." };
      if (t.includes("momentum") || t.includes("collision") || t.includes("impulse")) return { fact: "Impulse changes momentum, and total momentum is conserved for a system with negligible net external impulse even when kinetic energy is not conserved.", example: "Increasing collision time lowers average force for the same momentum change, which is why padding reduces injury risk.", mistake: "Assuming kinetic energy is conserved in every collision." };
    }
    if (course.subject === "Mathematics") {
      if (t.includes("complex")) return { fact: "Use i² = −1, combine like real and imaginary parts, and rationalize with a conjugate when needed.", example: "(3+2i)(3−2i)=9−(2i)²=13; the conjugates remove the imaginary part.", mistake: "Treating i² as 1 instead of −1." };
      if (t.includes("logarith")) return { fact: "A logarithm reverses exponentiation: log_b(x)=y exactly when b^y=x, with b>0, b≠1, and x>0.", example: "log₂(32)=5 because 2⁵=32; log₂(0) is undefined.", mistake: "Ignoring the positive-domain requirement for logarithm inputs." };
      if (t.includes("probability") || t.includes("independence")) return { fact: "For P(A)>0, P(B|A)=P(A∩B)/P(A); independent events satisfy P(B|A)=P(B).", example: "If 12 of 30 club members code and 8 of those also play music, P(music|codes)=8/12.", mistake: "Using the whole sample-space denominator when the condition changes the relevant group." };
      if (t.includes("inverse")) return { fact: "An inverse swaps inputs and outputs; verify f(f⁻¹(x))=x on the restricted domain.", example: "For f(x)=3x−4, solve y=3x−4 for x to get f⁻¹(x)=(x+4)/3.", mistake: "Mistaking 1/f(x) for f⁻¹(x)." };
      if (t.includes("polynomial") || t.includes("zero") || t.includes("factor")) return { fact: "The Factor Theorem connects f(r)=0 with the factor (x−r); multiplicity controls whether a graph crosses or touches the axis.", example: "If f(2)=0, then (x−2) is a factor. A zero of even multiplicity touches the x-axis.", mistake: "Listing a zero without converting it to the factor with the opposite sign." };
      if (t.includes("radical") || t.includes("rational")) return { fact: "Preserve equivalence while tracking domain restrictions; squaring and clearing denominators can create extraneous solutions.", example: "Solve √(x+1)=x−1 only with x≥1, then check each candidate in the original equation.", mistake: "Keeping a candidate that fails the original equation." };
      if (t.includes("system")) return { fact: "A solution must satisfy every relation in the system, so graph intersections and substitution describe the same shared values.", example: "Substitute y=x² into y=2x+3, solve x²=2x+3, then pair each x with its y-value.", mistake: "Reporting x-values without the matching coordinates or without checking both equations." };
    }
    if (course.id === "biology" || course.id === "ap-biology") {
      if (t.includes("dna") || t.includes("replication")) return { fact: "DNA polymerases build complementary strands in the 5′→3′ direction; base pairing preserves sequence information semiconservatively.", example: "A template segment 3′-TACG-5′ directs a new 5′-ATGC-3′ strand.", mistake: "Saying DNA is copied without identifying complementary base pairing and strand direction." };
      if (t.includes("protein") || t.includes("gene regulation")) return { fact: "Transcription produces RNA from DNA; translation uses ribosomes and tRNA to assemble amino acids according to codons.", example: "A change in a DNA base can alter an mRNA codon and possibly the amino acid sequence or protein function.", mistake: "Confusing transcription in DNA-to-RNA with translation in RNA-to-protein." };
      if (t.includes("natural selection")) return { fact: "Selection acts on individuals' phenotypes, but allele frequencies change across generations in populations.", example: "When a pesticide kills susceptible insects, resistant survivors leave a larger share of the next generation.", mistake: "Claiming organisms develop a needed trait because the environment causes them to try." };
      if (t.includes("photosynthesis") || t.includes("respiration") || t.includes("energetics")) return { fact: "Photosynthesis stores light energy in chemical bonds; cellular respiration transfers energy from organic molecules to ATP.", example: "Lower light can reduce carbon fixation, while oxygen availability affects the pathways cells use to regenerate ATP.", mistake: "Calling matter 'energy' or saying plants do not perform cellular respiration." };
      if (t.includes("food web") || t.includes("energy flow")) return { fact: "Energy enters ecosystems mainly through producers and decreases between trophic levels, while atoms are recycled.", example: "Removing a top predator can indirectly increase herbivores and decrease producer biomass.", mistake: "Drawing arrows toward what is eaten instead of toward the organism receiving energy." };
      if (t.includes("homeostasis") || t.includes("feedback")) return { fact: "Negative feedback reduces deviation from a set range; positive feedback amplifies a change until a stopping event.", example: "Rising body temperature activates cooling responses that reduce the original change.", mistake: "Assuming 'negative' means harmful rather than change-reducing." };
    }
    if (course.subject === "Social Studies") {
      if (t.includes("sourcing") || t.includes("primary") || t.includes("historical evidence")) return { fact: "Historical sourcing asks who created evidence, when, for what audience and purpose, with what access, and under which conditions before using it in an argument.", example: "A wartime speech is strong evidence of a government's public message but may be weak evidence of what every citizen privately believed.", mistake: "Calling a source biased and dismissing it instead of explaining what the perspective reveals and limits." };
      if (t.includes("causation") || t.includes("cause")) return { fact: "Causal analysis distinguishes long-term conditions, short-term triggers, necessary factors, and relative importance while tracing a plausible mechanism from cause to effect.", example: "An economic crisis may weaken a government, but institutions and political choices explain why similar crises produce different outcomes.", mistake: "Listing events in chronological order without explaining how one produced or constrained another." };
      if (t.includes("supply and demand") || t === "elasticity") return { fact: "Market price and quantity emerge from buyers' willingness and ability to pay and sellers' willingness and ability to produce; elasticity measures responsiveness to change.", example: "A binding price ceiling below equilibrium creates quantity demanded greater than quantity supplied.", mistake: "Calling movement along a curve a shift, or shifting a curve without naming a non-price determinant." };
      if (t === "gdp" || t.includes("economic growth")) return { fact: "Real GDP measures inflation-adjusted production within an economy; per-capita values aid comparison but do not capture distribution, unpaid work, environment, or overall well-being.", example: "Nominal output can rise only because prices increased, so economists use a price index to compare real production.", mistake: "Treating GDP as wealth, happiness, or a complete measure of living standards." };
      if (t.includes("federalism")) return { fact: "Federalism divides authority between national and subnational governments, creating concurrent, exclusive, delegated, and reserved powers that shift through law, funding, and court decisions.", example: "A federal grant can influence state policy through conditions even when the program is administered locally.", mistake: "Confusing separation of powers among branches with federalism across levels of government." };
      if (t.includes("civil libert") || t.includes("civil right") || t.includes("equal protection")) return { fact: "Civil liberties limit government interference, while civil rights concern equal legal treatment and protection; courts apply constitutional text, precedent, and standards of review.", example: "A claim about speech asks whether government restricted expression and whether the restriction satisfies the applicable constitutional test.", mistake: "Treating every unfair act as a constitutional violation without identifying state action and the governing provision." };
      if (t.includes("natural selection") || t.includes("nature and nurture")) return { fact: "Human behavior and social outcomes reflect interacting biological, psychological, cultural, institutional, and environmental influences rather than one isolated cause.", example: "A measured difference between groups does not by itself reveal whether development, context, selection, or measurement produced it.", mistake: "Turning correlation into a single-cause explanation or treating group averages as individual destiny." };
      if (t.includes("credibility") || t.includes("corroboration") || t.includes("source evaluation")) return { fact: "Source credibility is claim-specific and depends on ability to know, opportunity to observe, expertise, incentives, reputation, evidence quality, and independent corroboration.", example: "An expert may be qualified on one issue but still need transparent data and independent confirmation for a particular claim.", mistake: "Accepting or rejecting a claim solely because of the speaker's identity." };
    }
    if (course.id === "aphg") {
      if (t.includes("diffusion")) return { fact: "Relocation diffusion moves with migrants; expansion diffusion spreads outward through contagious, hierarchical, or stimulus processes.", example: "A food practice carried by migrants is relocation diffusion; adoption from major cities first is hierarchical diffusion.", mistake: "Naming diffusion without using evidence about who moved, who adopted, and how the pattern spread." };
      if (t.includes("scale")) return { fact: "Scale of analysis controls aggregation: a national average can conceal strong regional or neighborhood variation.", example: "A country's average income may rise while a local map reveals concentrated poverty within particular districts.", mistake: "Confusing map scale with scale of analysis." };
      if (t.includes("demographic transition")) return { fact: "The DTM compares changes in birth and death rates as societies industrialize; it describes patterns but does not predict every country perfectly.", example: "Death rates often fall before birth rates, creating rapid natural increase during the transition.", mistake: "Treating stages as a guaranteed timeline or including migration in natural increase." };
      if (t.includes("von thünen")) return { fact: "The model predicts rings of agricultural land use from transport cost, perishability, and land value under simplifying assumptions.", example: "Perishable dairy tends to locate nearer the market than extensive ranching when other conditions are equal.", mistake: "Using the rings as a literal map without testing terrain, transport, policy, or global-market exceptions." };
      if (t.includes("development")) return { fact: "Development is multidimensional; income measures production, while composite indicators add health, education, or inequality.", example: "Two countries with similar income per person can differ greatly in life expectancy and school enrollment.", mistake: "Treating one national average as a complete measure of well-being." };
      if (t.includes("boundary") || t.includes("sovereignty") || t.includes("devolution")) return { fact: "Political boundaries organize authority, while devolution transfers power toward regional governments and can reshape sovereignty.", example: "A culturally distinct region gaining taxation authority illustrates devolution without necessarily becoming independent.", mistake: "Treating nation, state, and nation-state as interchangeable." };
      if (t.includes("urban") || t.includes("cities") || t.includes("city")) return { fact: "Urban patterns reflect site, situation, accessibility, land value, planning, migration, and historical inequality.", example: "A new rail line can increase accessibility and change housing and commercial pressures around stations.", mistake: "Applying one urban model universally without considering the city's history and context." };
    }
    if (course.id.includes("csit") || course.profileId === "computer-science") {
      if (t.includes("esd") || t.includes("safety")) return { fact: "Remove power, use appropriate PPE and grounding, protect data, and follow the equipment-specific procedure before touching components.", example: "Attach an antistatic wrist strap to an unpainted grounded chassis before handling memory by its edges.", mistake: "Assuming a powered-off device is safe when stored charge, batteries, lasers, or sharp edges remain." };
      if (t.includes("address") || t.includes("dhcp") || t.includes("network")) return { fact: "IP addressing identifies interfaces; masks define the local network; DHCP automates configuration; DNS resolves names.", example: "A host with a valid local address but incorrect default gateway can reach nearby devices yet fail to reach remote networks.", mistake: "Changing hardware before checking address, gateway, DNS, link state, and a known-good path." };
      if (t.includes("security") || t.includes("threat") || t.includes("authentication")) return { fact: "Layered security combines identity, least privilege, updates, filtering, encryption, backups, monitoring, and user awareness.", example: "MFA reduces account-takeover risk even when a password is exposed, but it does not replace patching or backups.", mistake: "Treating one control, such as antivirus, as complete protection." };
      if (t.includes("troubleshoot") || t.includes("fault")) return { fact: "A defensible diagnosis follows identify, theory, test, plan, verify, and document—while protecting user data.", example: "For an intermittent boot failure, record the symptom, check power and connections, test one theory, and confirm repeated successful starts.", mistake: "Changing multiple variables at once, which hides the actual cause." };
    }
    if (course.subject === "English") {
      if (t.includes("evidence") || t.includes("claim")) return { fact: "Strong evidence is accurate, relevant, sufficient, and explained; the reasoning must show how the detail supports the claim.", example: "Instead of saying a narrator is nervous, cite the repeated checking behavior and explain how it reveals uncertainty.", mistake: "Choosing a vivid quotation that does not actually support the claim." };
      if (t.includes("theme") || t.includes("central idea")) return { fact: "A topic is one word or phrase; a theme or central idea is a complete insight developed through details and change.", example: "'Friendship' is a topic; 'trust grows when people admit uncertainty' is a defensible thematic statement.", mistake: "Writing a single-word topic or a plot summary as the theme." };
      if (t.includes("rhetor") || t.includes("purpose")) return { fact: "Rhetorical analysis connects a deliberate language choice to an audience, purpose, context, and effect.", example: "A writer's repeated second-person address may create urgency by making the audience feel directly responsible.", mistake: "Merely labeling ethos, pathos, or logos without analyzing the actual wording and effect." };
      if (t.includes("counterclaim")) return { fact: "A useful counterclaim represents a reasonable opposing position and receives a specific response supported by evidence.", example: "Concede a valid limitation, then explain why the overall claim remains stronger under the stated criteria.", mistake: "Inventing a weak opposing view that no reasonable reader would hold." };
    }
    if (course.id === "orchestra") {
      if (t.includes("intonation")) return { fact: "Intonation improves through a stable frame, accurate spacing, aural prediction, resonance, and adjustment against a reference pitch.", example: "Play the target note slowly, compare it with an open string or drone, then adjust the finger by the smallest audible amount.", mistake: "Sliding randomly after the note instead of preparing the pitch and identifying whether it is sharp or flat." };
      if (t.includes("bow") || t.includes("tone")) return { fact: "Tone responds to the coordinated variables of bow speed, weight, contact point, direction, and distribution.", example: "A longer phrase usually needs planned bow distribution so the bow does not run out before the cadence.", mistake: "Pressing harder to fix every weak sound, which can choke vibration." };
      if (t.includes("rhythm") || t.includes("pulse") || t.includes("subdivision")) return { fact: "A stable pulse is divided into equal subdivisions; durations and entrances are placed against that grid.", example: "Count and tap the smallest repeated subdivision before adding notes, bowing, or tempo.", mistake: "Reacting note by note instead of maintaining the underlying beat through rests and long notes." };
    }
    if (course.id === "thinking-skills") {
      if (t.includes("assumption")) return { fact: "An assumption is an unstated bridge: without it, the stated reason does not adequately support the conclusion.", example: "If a speaker argues a cafe is best because it is busiest, the reasoning assumes popularity is a reliable sign of quality.", mistake: "Repeating a stated reason instead of identifying what must be accepted implicitly." };
      if (t.includes("credibility") || t.includes("corroboration")) return { fact: "Assess ability to know, opportunity to observe, expertise, neutrality, reputation, and independent corroboration in relation to the specific claim.", example: "A witness may have direct access but poor viewing conditions; a separate recording can corroborate some details.", mistake: "Calling a source credible or biased without explaining how that affects this evidence." };
      if (t.includes("fallac")) return { fact: "A fallacy label matters only when you identify the reasoning move and explain why it weakens support for the conclusion.", example: "Attacking a speaker's personality does not refute the evidence offered for a policy claim.", mistake: "Spotting strong language and naming a fallacy without tracing the argument." };
    }
    const profile = profiles[course.profileId || course.id];
    return { fact: fallbackFact(course, unit, topic), example: `For ${topic.title}, ${profile.example.charAt(0).toLowerCase()}${profile.example.slice(1)}`, mistake: profile.mistake };
  }

  function buildLesson(course, unit, topic) {
    const profile = profiles[course.profileId || course.id];
    const detail = specific(course, unit, topic);
    const anchors = unitTerms(course, unit.id);
    const vocabulary = [
      { term: topic.title, definition: detail.fact },
      ...anchors.map(term => ({ term, definition: definitions[term] || `A core idea used to reason about ${unit.title.toLowerCase()}.` }))
    ].slice(0, 5);
    return {
      id: `${course.id}-${topic.id}`, subject: course.id, unit: unit.id, topic: topic.id, title: topic.title,
      overview: `${sentence(detail.fact)} The goal is not just recognition: you should be able to explain the idea, use ${profile.evidence}, and defend a conclusion.`,
      objectives: [`Explain ${topic.title.toLowerCase()} in your own words.`, `Apply it using ${profile.evidence}.`, `Recognize and correct a common error in reasoning about this topic.`],
      sections: [
        { title: "Core idea", body: detail.fact },
        { title: "How to reason", body: profile.method.map((step, i) => `${i + 1}. ${step}.`).join(" ") },
        { title: "Connection", body: `${sentence(unit.summary)} ${topic.title} is one part of that larger unit story, so connect the lesson to at least one other topic before calling it mastered.` }
      ],
      vocabulary, example: detail.example, misconception: detail.mistake, visual: profile.visual,
      practice: [
        { level: "Recall", prompt: `Define ${vocabulary[0].term} without looking, then name one feature that distinguishes it from a related idea.` },
        { level: "Core", prompt: `Use this four-step method for ${topic.title}: ${profile.method.join(" → ")}.` },
        { level: "Application", prompt: `Apply the lesson to this original scenario: ${detail.example}` },
        { level: "Challenge", prompt: `Change one assumption, input, scale, or condition. Explain what changes, what stays the same, and what evidence would settle the question.` }
      ],
      questions: [
        { id: `${course.id}-${topic.id}-q1`, prompt: `Which statement best explains ${topic.title}?`, choices: [detail.fact, detail.mistake, `It can be determined without using the source, conditions, or representation.`, `It is only a vocabulary label and has no connection to ${unit.title}.`], answer: 0, explanation: detail.fact },
        { id: `${course.id}-${topic.id}-q2`, prompt: `What is the strongest first move when solving a new ${topic.title} problem?`, choices: [profile.method[0], `Choose the longest answer`, `Ignore the source or representation`, `Assume the conclusion and work backward`], answer: 0, explanation: `${profile.method[0]} keeps the reasoning tied to the actual task.` },
        { id: `${course.id}-${topic.id}-q3`, prompt: `Which error should you actively avoid in this lesson?`, choices: [detail.mistake, `Showing each important step`, `Checking the answer against evidence`, `Using precise vocabulary in context`], answer: 0, explanation: detail.mistake },
        { id: `${course.id}-${topic.id}-q4`, prompt: `After reaching an answer about ${topic.title}, what should you do next?`, choices: [profile.method[3], `Delete the work`, `Add an unrelated fact`, `Treat the first result as universally true`], answer: 0, explanation: `${profile.method[3]} turns a result into a defensible conclusion.` }
      ],
      sources: topic.sourceIds
    };
  }

  const courseCache = new Map();
  function course(courseId) {
    if (courseCache.has(courseId)) return courseCache.get(courseId);
    const item = globalThis.STUDYSPACE_COURSES?.course(courseId);
    if (!item || !profiles[item.profileId || courseId]) return null;
    const complete = { ...item, units: item.units.map(unit => ({ ...unit, lessons: unit.topics.map(topic => buildLesson(item, unit, topic)) })) };
    courseCache.set(courseId, complete);
    return complete;
  }

  function lesson(courseId, unitId, topicId) {
    const item = course(courseId);
    return item?.units.find(unit => unit.id === unitId)?.lessons.find(entry => entry.topic === topicId) || null;
  }

  globalThis.STUDYSPACE_LEARNING = { version: 1, course, lesson, profiles, definitions };
})();
