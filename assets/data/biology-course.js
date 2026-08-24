(function () {
  "use strict";

  const sourceTypes = {
    outline: { label: "Course outline supplied in the StudySpace brief", priority: 1 },
    teacher: { label: "Teacher source file", priority: 1 },
    general: { label: "StudySpace general science explanation", priority: 4 }
  };

  const categories = ["Teacher Slides", "Teacher Reading", "Guided Reading", "Lab", "Vocabulary", "Review", "Video", "Other"];
  const sequenceTitles = {
    "1.1": "Properties of Water",
    "1.2": "Macromolecules & Enzymes",
    "1.3": "Cell Theory & Origin of Life",
    "1.4": "Cell Types, Organelles, & Movement Across the Cell Membrane",
    "1.5": "Photosynthesis, Cellular Respiration, & Cell Energetics"
  };

  const materials = Object.entries(sequenceTitles).map(([sequence, title]) => ({
    id: `biology-${sequence.replace(".", "-")}-source`,
    sequence,
    title: `${sequence} ${title} — source slot`,
    category: "Teacher Slides",
    source: "teacher",
    status: "file-needed",
    repositoryPath: null,
    originalAvailable: false,
    folder: `assets/materials/biology/unit1/${sequence}/`,
    note: "The course outline was supplied as text, but no original teacher PDF, PowerPoint, reading, lab, or worksheet file exists in the repository yet."
  }));

  const v = (id, term, definition, example) => ({ id: `bio-${id}`, term, definition, example, subject: "biology" });
  const p = (type, prompt, answer) => ({ type, prompt, answer });

  const sequences = [
    {
      id: "1.1",
      title: sequenceTitles["1.1"],
      standard: "SC.912.L.18.12",
      summary: "Connect water's molecular polarity and hydrogen bonding to the properties that make life possible.",
      learningTargets: [
        "Trace molecular structure → water property → biological importance.",
        "Explain cohesion, temperature moderation, freezing expansion, and solvent ability.",
        "Use evidence to explain how a water property supports homeostasis or survival."
      ],
      masteryTags: ["polarity", "hydrogen bonding", "cohesion", "temperature moderation", "freezing expansion", "solvent ability"],
      preClass: { reading: "Preview polarity, partial charges, and hydrogen bonds.", check: "Why can one water molecule attract another?", materials: "Teacher files have not been imported yet." },
      engage: { hook: "A paper clip can rest on water even though metal is denser. What holds the surface together?", prior: "Recall how positive and negative charges attract.", scenario: "Why does ice floating on a lake help aquatic organisms survive?" },
      explore: [
        { title: "Drops on a coin", detail: "Predict and observe how many drops fit before the dome breaks. Connect the dome to cohesion and surface tension." },
        { title: "Capillary pathway", detail: "Follow water through a narrow tube or paper towel. Identify where adhesion and cohesion each act." },
        { title: "Solvent model", detail: "Model how polar water surrounds charged or polar solute particles and separates them." }
      ],
      sections: [
        { title: "Polarity and hydrogen bonding", summary: "Oxygen pulls shared electrons more strongly than hydrogen, creating partial charges. The partially positive hydrogen of one molecule attracts the partially negative oxygen of another, forming a hydrogen bond.", keyIdeas: ["Water is polar, not ionic.", "Hydrogen bonds form between nearby water molecules.", "Many weak hydrogen bonds together create important large-scale effects."] },
        { title: "Cohesion, adhesion, and movement", summary: "Cohesion is attraction between water molecules; adhesion is attraction between water and another surface. Together they support surface tension and capillary action.", keyIdeas: ["Cohesion helps water form droplets and a strong surface.", "Adhesion helps water climb surfaces.", "Plants use both as water moves through narrow xylem tubes."] },
        { title: "Temperature moderation", summary: "Water has high specific heat because energy must disrupt hydrogen-bond interactions before molecules move much faster. Water can absorb or release substantial heat with a smaller temperature change.", keyIdeas: ["Large bodies of water moderate nearby temperatures.", "Sweating helps remove heat as water evaporates.", "Stable temperature supports homeostasis."] },
        { title: "Expansion upon freezing", summary: "When water freezes, hydrogen bonds hold molecules in an open crystal pattern. Ice is therefore less dense than liquid water and floats.", keyIdeas: ["Most substances become denser as they freeze; water is unusual.", "Floating ice insulates liquid water below.", "Aquatic ecosystems can remain habitable during cold weather."] },
        { title: "Versatile solvent", summary: "Water's partial charges surround many ions and polar molecules, allowing them to separate and dissolve. The solute dissolves; the solvent does the dissolving; solubility describes how much can dissolve.", keyIdeas: ["Water does not dissolve every substance.", "Dissolved materials can be transported through cells and organisms.", "Solutions support reactions needed for homeostasis."] }
      ],
      visuals: [
        { title: "Structure → property → life", type: "flow", items: ["Bent polar molecule", "Hydrogen bonding", "Cohesion / high specific heat / open ice lattice / solvent action", "Transport, stable temperature, winter survival, chemical reactions"] },
        { title: "Floating ice model", type: "compare", items: ["Liquid: molecules move and can pack closer", "Ice: hydrogen bonds hold an open lattice", "Result: ice is less dense and floats"] }
      ],
      elaborate: ["Predict how reduced hydrogen bonding would affect surface tension.", "Explain why coastal climates often change temperature more slowly than inland climates.", "Connect dissolving salts in blood plasma to transport and homeostasis.", "Mars/life application: choose two water properties that scientists would consider when evaluating whether an environment could support life, then connect each property to a biological need."],
      cer: { prompt: "Ice forms on the surface of a lake during winter while fish survive below.", claim: "State how floating ice supports aquatic life.", evidence: "Use the density of ice and the liquid water below as evidence.", reasoning: "Connect hydrogen bonding to the open ice structure, lower density, floating, and insulation." },
      vocabulary: [
        v("11-polarity", "Polarity", "An uneven distribution of electrical charge within a molecule.", "Water's oxygen side is partially negative and its hydrogen sides are partially positive."),
        v("11-hbond", "Hydrogen bond", "A weak attraction between a partially positive hydrogen and a nearby electronegative atom.", "A hydrogen on one water molecule attracts the oxygen of another."),
        v("11-cohesion", "Cohesion", "Attraction between molecules of the same substance.", "Water molecules hold together in a droplet."),
        v("11-adhesion", "Adhesion", "Attraction between different substances.", "Water clings to the wall of a thin glass tube."),
        v("11-surface", "Surface tension", "Resistance at a liquid surface caused by cohesive forces.", "A water strider can stand on the water's surface."),
        v("11-capillary", "Capillary action", "Movement of liquid through narrow spaces due to cohesion and adhesion.", "Water rises through plant xylem."),
        v("11-specific", "Specific heat", "The energy required to change the temperature of a substance.", "Water warms more slowly than dry sand."),
        v("11-solute", "Solute", "The substance dissolved in a solution.", "Salt is the solute in salt water."),
        v("11-solvent", "Solvent", "The substance that dissolves a solute.", "Water is the solvent in salt water."),
        v("11-solubility", "Solubility", "The amount of a substance that can dissolve under given conditions.", "More sugar may dissolve in warm water than cold water."),
        v("11-homeostasis", "Homeostasis", "Maintenance of stable internal conditions.", "Sweating helps regulate body temperature.")
      ],
      practice: [
        p("scenario application", "Why does ice floating on a lake help organisms survive? Identify the property, molecular cause, and biological importance.", "Hydrogen bonding creates a less-dense open lattice, so ice floats and insulates liquid water below."),
        p("CER", "Write a CER explaining why water moderates body temperature.", "Use water's high specific heat, heat absorption, and stable internal temperature."),
        p("compare/contrast", "Distinguish cohesion from adhesion in capillary action.", "Cohesion links water molecules; adhesion attracts water to the surrounding surface.")
      ]
    },
    {
      id: "1.2",
      title: sequenceTitles["1.2"],
      summary: "Compare the four major biological macromolecule groups, then connect enzyme shape and conditions to reaction rate.",
      learningTargets: ["Identify macromolecules from elements, building blocks, structures, and functions.", "Explain why protein shape matters for enzyme specificity.", "Predict how temperature, pH, and denaturation affect enzyme activity."],
      masteryTags: ["carbohydrate", "lipid", "protein", "nucleic acid", "monomer/polymer", "enzyme specificity", "activation energy", "pH/temperature effects"],
      preClass: { reading: "Preview monomers, polymers, and the four macromolecule groups.", check: "Which macromolecule group includes enzymes?", materials: "Teacher files have not been imported yet." },
      engage: { hook: "A cracker, cooking oil, hair, and DNA look unrelated. What chemical patterns connect them?", prior: "Recall that carbon can form many covalent bonds.", scenario: "Why might a high fever interfere with enzymes?" },
      explore: [
        { title: "Molecule sort", detail: "Sort molecule cards by elements, building block, shape, and function before naming each group." },
        { title: "Enzyme fit model", detail: "Test which substrate shapes fit an active site and identify the enzyme-substrate complex." },
        { title: "Reaction-rate investigation", detail: "Interpret a data set in which pH or temperature changes while enzyme activity is measured." }
      ],
      sections: [
        { title: "Macromolecule foundations", summary: "Macromolecules are large organic molecules. Monomers can join to form polymers, although lipids do not form polymers in the same repeating-monomer way.", keyIdeas: ["Organic compounds contain carbon and usually hydrogen.", "Structure helps determine function.", "Different groups have characteristic elements and building blocks."] },
        { title: "Carbohydrates", summary: "Carbohydrates contain C, H, and O, often near a 1:2:1 ratio. Monosaccharides such as glucose can form disaccharides and polysaccharides including starch, glycogen, and cellulose.", keyIdeas: ["Quick or primary energy", "Starch stores glucose in plants", "Glycogen stores glucose in animals", "Cellulose supports plant cell walls"] },
        { title: "Lipids", summary: "Lipids are built mainly from carbon, hydrogen, and oxygen. Glycerol and fatty acids form triglycerides; phospholipids form cell membranes.", keyIdeas: ["Long-term energy storage and insulation", "Saturated fats have no carbon-carbon double bonds; unsaturated fats have one or more", "Phospholipids have hydrophilic heads and hydrophobic tails"] },
        { title: "Proteins", summary: "Amino acids containing C, H, O, N, and sometimes S join into polypeptides that fold into functional proteins.", keyIdeas: ["Shape affects function", "Roles include structure, transport, antibodies, signaling, and enzymes", "Changing conditions can alter shape"] },
        { title: "Nucleic acids", summary: "DNA and RNA contain C, H, O, N, and P. Their nucleotide building blocks include a sugar, phosphate, and nitrogenous base.", keyIdeas: ["DNA stores genetic information", "RNA helps use information in protein synthesis", "Nucleotide order carries information"] },
        { title: "Enzymes", summary: "Enzymes are reusable protein catalysts. A specific substrate binds the active site, forming an enzyme-substrate complex. Enzymes lower activation energy without being consumed.", keyIdeas: ["Shape produces specificity", "Temperature and pH have optimal ranges", "Extreme conditions can denature an enzyme", "Lower activation energy speeds the reaction"] }
      ],
      comparison: [
        ["Carbohydrate", "C, H, O (~1:2:1)", "Monosaccharide", "Polysaccharide", "Quick energy; plant support", "Glucose, starch, glycogen, cellulose"],
        ["Lipid", "Mostly C, H, O", "Glycerol + fatty acids", "Triglyceride / phospholipid", "Long-term energy; insulation; membranes", "Fats, oils, phospholipids"],
        ["Protein", "C, H, O, N; sometimes S", "Amino acid", "Polypeptide / protein", "Structure, transport, signaling, catalysis", "Antibodies, enzymes, hemoglobin"],
        ["Nucleic acid", "C, H, O, N, P", "Nucleotide", "DNA / RNA", "Genetic information; protein synthesis", "DNA, RNA"]
      ],
      visuals: [
        { title: "Enzyme reaction", type: "flow", items: ["Enzyme + matching substrate", "Substrate binds active site", "Enzyme-substrate complex", "Products released", "Enzyme can be reused"] },
        { title: "Activation energy", type: "compare", items: ["Without enzyme: higher energy barrier", "With enzyme: lower energy barrier", "Starting and ending energy stay the same"] }
      ],
      elaborate: ["Identify a mystery macromolecule from its elements and function.", "Predict how a mutation that changes an active site's shape affects the reaction.", "Explain why an enzyme can work poorly above or below its optimal pH."],
      cer: { prompt: "An enzyme works fastest at 37°C but activity falls sharply at 70°C.", claim: "State why activity decreases.", evidence: "Use the activity data at the two temperatures.", reasoning: "Connect high temperature to altered protein shape and active-site function." },
      vocabulary: [
        v("12-macro", "Macromolecule", "A large biological molecule built from smaller components.", "Carbohydrates, lipids, proteins, and nucleic acids are major groups."),
        v("12-monomer", "Monomer", "A small building block that can join with others.", "An amino acid is a protein monomer."),
        v("12-polymer", "Polymer", "A large molecule made from repeating or linked smaller units.", "A polypeptide is built from amino acids."),
        v("12-carb", "Carbohydrate", "A C-H-O molecule used for quick energy and some structural roles.", "Glucose and starch are carbohydrates."),
        v("12-lipid", "Lipid", "A mostly nonpolar molecule used for long-term energy, insulation, and membranes.", "Fats, oils, and phospholipids are lipids."),
        v("12-protein", "Protein", "A folded chain of amino acids whose shape supports a specific function.", "Enzymes and antibodies are proteins."),
        v("12-nucleic", "Nucleic acid", "A nucleotide-based molecule that stores or uses genetic information.", "DNA and RNA are nucleic acids."),
        v("12-enzyme", "Enzyme", "A protein catalyst that speeds a biological reaction without being consumed.", "Lactase helps break down lactose."),
        v("12-substrate", "Substrate", "The reactant that binds to an enzyme's active site.", "Lactose is the substrate for lactase."),
        v("12-active", "Active site", "The region of an enzyme where its substrate binds.", "A correctly shaped substrate fits the active site."),
        v("12-activation", "Activation energy", "The energy barrier that must be overcome for a reaction to begin.", "Enzymes speed reactions by lowering this barrier."),
        v("12-denature", "Denaturation", "A change in protein shape that disrupts its function.", "Extreme heat may change an enzyme's active site.")
      ],
      practice: [
        p("matching", "Match each macromolecule to its building block and major function.", "Carbohydrate–monosaccharide–quick energy; protein–amino acid–many functions; nucleic acid–nucleotide–genetic information; lipid–glycerol/fatty acids–long-term energy/membranes."),
        p("diagram interpretation", "On an activation-energy graph, identify the curve representing the enzyme-catalyzed reaction.", "The enzyme-catalyzed curve has the lower peak."),
        p("scenario application", "An enzyme loses function after a major pH change. Explain why.", "The pH change altered interactions that maintain protein shape, changing the active site.")
      ]
    },
    {
      id: "1.3",
      title: sequenceTitles["1.3"],
      summary: "Evaluate evidence about early chemical evolution, connect discoveries to cell theory, and select microscopes for scientific questions.",
      learningTargets: ["Explain what Miller-Urey supported without claiming it created life.", "Connect scientists and evidence to the three parts of cell theory.", "Choose a microscope using specimen, detail, magnification, and living-status constraints."],
      masteryTags: ["early Earth", "Miller-Urey", "RNA world", "biogenesis", "cell theory", "scientists", "microscope selection"],
      preClass: { reading: "Preview early Earth conditions, cell theory, and microscope limits.", check: "Which statement says new cells come from existing cells?", materials: "Teacher files have not been imported yet." },
      engage: { hook: "Can an experiment show that building blocks of life form naturally without creating life itself?", prior: "Recall that scientific explanations must match evidence.", scenario: "Which microscope would you choose to watch a living protist move?" },
      explore: [
        { title: "Early Earth chamber", detail: "Label water, gases, heat, and electrical sparks in a Miller-Urey model, then state what evidence it produced." },
        { title: "Discovery timeline", detail: "Order Hooke, Leeuwenhoek, Schleiden, Schwann, and Virchow and connect each observation to cell theory." },
        { title: "Microscope decision lab", detail: "Choose a stereo, compound light, or electron microscope for each specimen and justify the tradeoff." }
      ],
      sections: [
        { title: "Origin-of-life evidence", summary: "Early Earth likely had little atmospheric oxygen, volcanic activity, and gases including nitrogen, carbon dioxide, carbon monoxide, water vapor, and hydrogen sulfide. Energy could support formation of simple organic molecules.", keyIdeas: ["Primordial-soup and hydrothermal-vent ideas describe possible environments", "RNA can store information and some RNA can catalyze reactions", "First life was simple and single-celled"] },
        { title: "Miller-Urey and RNA world", summary: "Miller and Urey simulated proposed early-Earth conditions using gases, water vapor, heat, and electrical sparks. They produced simple organic molecules including amino acids; they did not create life. RNA world proposes that RNA may have preceded DNA and proteins.", keyIdeas: ["Evidence supported possible abiotic formation of organic building blocks", "The exact early atmosphere remains a scientific question", "RNA combines information storage with some catalytic ability"] },
        { title: "Biogenesis and increasing complexity", summary: "Biogenesis means life comes from existing life; spontaneous generation was disproven. Photosynthetic cyanobacteria released oxygen. Endosymbiotic theory proposes that engulfed cells became mitochondria and chloroplasts.", keyIdeas: ["Oxygen changed Earth's atmosphere", "Mitochondria and chloroplasts retain traits consistent with bacterial ancestry", "Endosymbiosis contributed to eukaryotic complexity"] },
        { title: "Cell theory", summary: "All organisms are made of one or more cells; cells are the basic unit of structure and function; and all cells come from pre-existing cells.", keyIdeas: ["Hooke named cells after viewing cork", "Leeuwenhoek observed living microorganisms", "Schleiden studied plants; Schwann studied animals", "Virchow emphasized cells from existing cells"] },
        { title: "Prokaryotes, eukaryotes, and microscopes", summary: "Prokaryotes lack a nucleus and membrane-bound organelles; eukaryotes have them. Stereo microscopes show whole external specimens at low magnification, compound light microscopes can view thin living specimens, and electron microscopes reveal extreme detail from nonliving specimens.", keyIdeas: ["Stereo: whole, often living, external detail, about 300×", "Compound: thin, possibly living, up to about 2000×", "Electron: nonliving, very high detail, up to about 2,000,000×"] }
      ],
      visuals: [
        { title: "Evidence timeline", type: "flow", items: ["Hooke: cork cells", "Leeuwenhoek: living microbes", "Schleiden: plants", "Schwann: animals", "Virchow: cells from cells"] },
        { title: "Microscope chooser", type: "compare", items: ["Whole living specimen → stereo", "Thin living cells → compound light", "Ultrastructure at extreme detail → electron"] }
      ],
      microscopeParts: [
        ["Eyepiece lens", "Look through it; adds magnification"], ["Body tube", "Keeps lenses aligned"], ["Nosepiece", "Rotates between objective lenses"],
        ["Stage", "Supports the slide"], ["Stage clips", "Hold the slide in place"], ["Diaphragm", "Controls the amount of light"],
        ["Illuminator", "Provides light"], ["Coarse adjustment knob", "Moves focus quickly at low power"], ["Fine adjustment knob", "Sharpens focus precisely"],
        ["Arm", "Supports the upper microscope and is held when carrying"], ["Base", "Supports the microscope from below"]
      ],
      elaborate: ["Explain why Miller-Urey supported chemical evolution but did not prove a complete origin-of-life pathway.", "Choose a microscope for living onion cells and defend the choice.", "Connect cyanobacterial photosynthesis to later oxygen-dependent life."],
      cer: { prompt: "Mitochondria contain their own DNA and divide independently inside cells.", claim: "State whether this supports endosymbiotic theory.", evidence: "Use the observed mitochondrial traits.", reasoning: "Explain why bacterial-like traits fit an engulfed-cell origin." },
      vocabulary: [
        v("13-primordial", "Primordial soup", "An idea that early Earth's waters contained chemicals that could form organic molecules.", "Energy from lightning could drive reactions among early chemicals."),
        v("13-rna", "RNA World Hypothesis", "The idea that RNA-like molecules may have stored information and catalyzed reactions before DNA and proteins dominated.", "Some RNA molecules can catalyze reactions."),
        v("13-miller", "Miller-Urey experiment", "An experiment that simulated proposed early-Earth conditions and produced simple organic molecules.", "Electrical sparks and gases produced amino acids, not life."),
        v("13-biogenesis", "Biogenesis", "The principle that living things arise from existing living things.", "New bacterial cells come from other bacterial cells."),
        v("13-endo", "Endosymbiotic theory", "The explanation that mitochondria and chloroplasts descended from engulfed free-living cells.", "The organelles have their own DNA."),
        v("13-celltheory", "Cell theory", "Three principles describing cells as the basis of life and cells coming from existing cells.", "Both plants and animals are made of cells."),
        v("13-prok", "Prokaryote", "A cell without a nucleus or membrane-bound organelles.", "Bacteria are prokaryotes."),
        v("13-euk", "Eukaryote", "A cell with a nucleus and membrane-bound organelles.", "Plants, animals, fungi, and protists are eukaryotes."),
        v("13-compound", "Compound light microscope", "A microscope using visible light and multiple lenses to view thin specimens.", "It can view living cheek cells."),
        v("13-electron", "Electron microscope", "A microscope using electrons for extremely detailed images of nonliving specimens.", "It can show fine organelle structure.")
      ],
      practice: [
        p("sequence/order", "Place Hooke, Leeuwenhoek, Schleiden, Schwann, and Virchow in historical order.", "Hooke → Leeuwenhoek → Schleiden → Schwann → Virchow."),
        p("scenario application", "Choose a microscope for watching a living pond protist.", "A compound light microscope gives enough magnification while allowing a living thin specimen."),
        p("short explanation", "What did Miller-Urey support, and what did it not demonstrate?", "It supported natural formation of simple organic molecules under simulated conditions; it did not create or prove the origin of life.")
      ]
    },
    {
      id: "1.4",
      title: sequenceTitles["1.4"],
      summary: "Relate organelle structure to cell function, model the phospholipid membrane, and predict transport and tonicity outcomes.",
      learningTargets: ["Trace the protein pathway from nucleus to destination.", "Explain selective permeability using phospholipid and protein structure.", "Predict water movement, tonicity, cell response, and energy use."],
      masteryTags: ["organelles", "plant vs animal", "membrane structure", "diffusion", "osmosis", "tonicity", "passive vs active transport"],
      preClass: { reading: "Preview organelles, the phospholipid bilayer, and concentration gradients.", check: "Which transport process requires cellular energy?", materials: "Teacher files have not been imported yet." },
      engage: { hook: "A cell is a coordinated system: what happens if proteins are made but cannot be shipped?", prior: "Recall that form helps determine function.", scenario: "A red blood cell is placed in pure water. Predict what happens and why." },
      explore: [
        { title: "Organelle pathway", detail: "Arrange nucleus, ribosome, rough ER, Golgi, vesicle, and membrane in the path of a secreted protein." },
        { title: "Membrane model", detail: "Orient phospholipid heads toward water and tails away from water; add channel and transport proteins." },
        { title: "Tonicity lab", detail: "Compare solute dots inside and outside a model cell, predict water movement, and identify the cell response." }
      ],
      sections: [
        { title: "Cell structure and protein pathway", summary: "The nucleus stores DNA; ribosomes build proteins; rough ER folds and transports many proteins; the Golgi modifies, sorts, and packages them; vesicles carry them to the membrane or another destination.", keyIdeas: ["Nucleus → ribosome → rough ER → Golgi → vesicle → destination", "Smooth ER builds lipids and supports detoxification", "Lysosomes digest materials; mitochondria release usable energy", "Cytoskeleton, microtubules, and microfilaments support shape and movement"] },
        { title: "Plant and animal cells", summary: "Both are eukaryotic. Plant cells emphasize a cell wall, chloroplasts, and a large central vacuole; animal cells lack those plant-specific structures.", keyIdeas: ["Cell wall supports and protects", "Chloroplasts capture light energy", "Central vacuole stores water and supports pressure"] },
        { title: "Cell membrane", summary: "Every cell has a selectively permeable phospholipid bilayer. Hydrophilic heads face watery environments, hydrophobic tails face inward, and proteins help substances cross or communicate.", keyIdeas: ["Fluid mosaic means components can move within a mixed structure", "Selective permeability helps maintain homeostasis", "Channels and carriers provide pathways for particular substances"] },
        { title: "Passive and active transport", summary: "Diffusion, osmosis, and facilitated diffusion move substances down a concentration gradient without cellular energy. Active transport uses energy to move substances against a gradient.", keyIdeas: ["High → low is down the gradient", "Osmosis is diffusion of water across a selectively permeable membrane", "Facilitated diffusion uses a protein but no cellular energy", "Low → high requires active transport"] },
        { title: "Tonicity", summary: "In an isotonic solution, water moves both ways at equal overall rates. In a hypertonic solution, water leaves and the cell shrinks. In a hypotonic solution, water enters and the cell swells and may burst.", keyIdeas: ["Compare solute outside with solute inside", "Water moves toward the side with more dissolved solute when the solute cannot cross", "Plant cell walls change the visible outcome but not the direction of osmosis"] }
      ],
      organelles: [
        ["Cytoplasm", "Fluid region where many reactions occur", "all cells"], ["Cell membrane", "Controls movement into and out of the cell", "all cells"], ["Nucleus", "Stores DNA and directs cell activities", "eukaryotes"], ["Chromatin", "Loose DNA-protein material used between cell divisions", "eukaryotic nuclei"], ["Chromosomes", "Condensed DNA structures carrying genes", "cells during division"], ["Nucleolus", "Builds ribosome components", "eukaryotic nuclei"], ["Nuclear envelope", "Double membrane controlling movement into and out of the nucleus", "eukaryotes"], ["Ribosome", "Builds proteins", "all cells"], ["Rough ER", "Folds and transports many proteins", "eukaryotes"], ["Smooth ER", "Builds lipids and supports detoxification", "eukaryotes"], ["Golgi apparatus", "Modifies, sorts, and packages cell products", "eukaryotes"], ["Vesicle", "Transports materials", "eukaryotes"], ["Lysosome", "Digests and recycles materials", "mainly animal cells"], ["Mitochondrion", "Produces ATP through cellular respiration", "most eukaryotes"], ["Cytoskeleton", "Supports shape, organization, and movement", "eukaryotes"], ["Microtubules", "Hollow cytoskeletal fibers used for shape, transport, and chromosome movement", "eukaryotes"], ["Microfilaments", "Thin cytoskeletal fibers used for shape and cell movement", "eukaryotes"], ["Cell wall", "Provides rigid support", "plants and some other organisms"], ["Central vacuole", "Stores materials and supports plant pressure", "plant cells"], ["Chloroplast", "Carries out photosynthesis", "plants and algae"]
      ],
      visuals: [
        { title: "Secreted-protein pathway", type: "flow", items: ["Nucleus: DNA instructions", "Ribosome: builds polypeptide", "Rough ER: folds/transports", "Golgi: modifies/sorts", "Vesicle: delivers", "Membrane: releases or inserts"] },
        { title: "Tonicity predictor", type: "compare", items: ["Isotonic: equal concentration → no net size change", "Hypertonic outside: water leaves → cell shrinks", "Hypotonic outside: water enters → cell swells"] }
      ],
      elaborate: ["Predict what happens when a Golgi apparatus cannot package proteins.", "Determine whether glucose moving through a carrier from high to low concentration requires energy.", "Explain how selective permeability supports homeostasis."],
      cer: { prompt: "Potato cells lose mass after being placed in a concentrated salt solution.", claim: "Identify the solution's tonicity relative to the cells.", evidence: "Use the measured mass loss.", reasoning: "Connect higher outside solute concentration to water leaving by osmosis." },
      vocabulary: [
        v("14-organelle", "Organelle", "A specialized structure that performs a cell function.", "The Golgi apparatus sorts cell products."),
        v("14-bilayer", "Phospholipid bilayer", "Two phospholipid layers forming the basic cell-membrane structure.", "Hydrophilic heads face water and hydrophobic tails face inward."),
        v("14-selective", "Selective permeability", "The ability of a membrane to allow some substances across more easily than others.", "Small nonpolar molecules cross more easily than many ions."),
        v("14-gradient", "Concentration gradient", "A difference in concentration between two areas.", "Oxygen diffuses from higher to lower concentration."),
        v("14-diffusion", "Diffusion", "Net movement of particles from higher to lower concentration.", "Food coloring spreads through water."),
        v("14-osmosis", "Osmosis", "Diffusion of water across a selectively permeable membrane.", "Water enters a cell in a hypotonic solution."),
        v("14-facilitated", "Facilitated diffusion", "Passive movement down a gradient through a membrane protein.", "Glucose can enter through a carrier protein."),
        v("14-active", "Active transport", "Energy-requiring movement against a concentration gradient.", "A pump moves ions from low to high concentration."),
        v("14-isotonic", "Isotonic", "A solution with equal effective solute concentration relative to the cell.", "A cell has no net water-driven size change."),
        v("14-hypertonic", "Hypertonic", "A solution with higher effective solute concentration than the cell.", "Water leaves and an animal cell shrivels."),
        v("14-hypotonic", "Hypotonic", "A solution with lower effective solute concentration than the cell.", "Water enters and an animal cell swells.")
      ],
      practice: [
        p("labeling", "Label hydrophilic heads, hydrophobic tails, channel protein, and the watery environments on a membrane model.", "Heads face water; tails face inward; the channel spans the bilayer."),
        p("sequence/order", "Order the structures used to make and export a protein.", "Nucleus → ribosome → rough ER → Golgi → vesicle → cell membrane/destination."),
        p("scenario application", "A cell has more solute outside than inside. Predict water movement, tonicity, and response.", "Water moves out; the outside is hypertonic; an animal cell shrinks.")
      ]
    },
    {
      id: "1.5",
      title: sequenceTitles["1.5"],
      summary: "Track matter and energy through photosynthesis, plant transport, cellular respiration, and the ATP/ADP cycle.",
      learningTargets: ["Identify reactants, products, locations, and energy changes in photosynthesis and respiration.", "Connect chloroplast, plant-tissue, and mitochondrion structures to function.", "Explain how photosynthesis and respiration cycle matter while energy changes form."],
      masteryTags: ["photosynthesis equation", "chloroplast", "plant transport", "respiration equation", "mitochondria", "ATP", "aerobic vs anaerobic", "photosynthesis/respiration relationship"],
      preClass: { reading: "Preview reaction equations, chloroplasts, mitochondria, and ATP.", check: "Which process makes glucose using light energy?", materials: "Teacher files have not been imported yet." },
      engage: { hook: "A plant makes sugar in light but still performs cellular respiration day and night. Why does it need both?", prior: "Recall reactants, products, and energy transfer.", scenario: "Trace one carbon atom from atmospheric CO₂ into glucose and back to CO₂." },
      explore: [
        { title: "Equation card sort", detail: "Sort carbon dioxide, water, oxygen, glucose, light, and ATP into the two process equations." },
        { title: "Leaf transport model", detail: "Trace water from xylem, CO₂ through stomata, sugar through phloem, and water vapor out of a leaf." },
        { title: "Energy pathway", detail: "Compare ATP output when oxygen is available with fermentation after glycolysis." }
      ],
      sections: [
        { title: "Reaction basics and photosynthesis", summary: "Reactants enter a chemical reaction and products leave it. In chloroplasts, producers use light energy to build glucose: 6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂. The process stores energy in glucose.", keyIdeas: ["CO₂ enters through stomata", "Water arrives through xylem", "Oxygen can leave; glucose supports growth, storage, and respiration"] },
        { title: "Chloroplast and plant tissues", summary: "A chloroplast has a double membrane. Chlorophyll, accessory pigments, and photosystems in thylakoid membranes capture light; grana are stacks of thylakoids; lamellae connect them; stroma surrounds them. Dermal tissue and its epidermis protect the plant, guard cells control stomata by osmosis, ground tissue supports metabolism and storage, and vascular tissue transports materials.", keyIdeas: ["Xylem moves water mainly upward from roots", "Phloem moves sugars and nutrients in multiple directions", "The epidermis and waxy cuticle reduce water loss and protect the plant", "Stomata balance gas exchange with water loss"] },
        { title: "Cellular respiration", summary: "Producers and consumers break down glucose to release usable energy: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + ATP. Glycolysis occurs in cytoplasm; the Krebs cycle occurs in the mitochondrion; the electron transport chain is associated with the inner mitochondrial membrane.", keyIdeas: ["Aerobic respiration requires oxygen and is more efficient", "Mitochondrial cristae increase inner-membrane surface area", "The matrix contains enzymes and mitochondrial DNA"] },
        { title: "Fermentation", summary: "Without oxygen, glycolysis in the cytoplasm can be followed by fermentation. Class emphasis uses about 2 ATP total from glycolysis, far less than aerobic respiration. Lactic acid and alcoholic fermentation regenerate molecules needed for glycolysis to continue.", keyIdeas: ["No oxygen", "Much less ATP", "Lactic acid fermentation occurs in some cells", "Alcoholic fermentation produces alcohol and carbon dioxide"] },
        { title: "ATP and the big connection", summary: "ATP is adenosine triphosphate with three phosphate groups. Removing one phosphate transfers usable energy and forms ADP; cells regenerate ATP. Photosynthesis stores light energy in glucose, while respiration transfers glucose energy into ATP. Products of one process can become reactants of the other.", keyIdeas: ["Photosynthesis: CO₂ + H₂O + light → glucose + O₂", "Respiration: glucose + O₂ → CO₂ + H₂O + ATP", "Matter cycles; energy changes form and flows"] }
      ],
      visuals: [
        { title: "Photosynthesis ↔ respiration cycle", type: "cycle", items: ["Chloroplast: CO₂ + H₂O + light", "Glucose + O₂", "Mitochondrion: cellular respiration", "CO₂ + H₂O + ATP", "CO₂ and H₂O return to photosynthesis"] },
        { title: "ATP/ADP cycle", type: "flow", items: ["ATP: three phosphates", "Remove phosphate → usable energy released", "ADP: two phosphates", "Add phosphate using energy → ATP regenerated"] }
      ],
      elaborate: ["Explain why a plant can release carbon dioxide in darkness.", "Predict the effect of closed stomata on photosynthesis and water loss.", "Compare ATP availability during a sprint with and without enough oxygen."],
      cer: { prompt: "A plant gains mass over several weeks even though most soil mass changes very little.", claim: "Identify the major source of carbon in the new plant biomass.", evidence: "Use the photosynthesis equation.", reasoning: "Explain how carbon from CO₂ becomes part of glucose and other organic molecules." },
      vocabulary: [
        v("15-reactant", "Reactant", "A starting substance in a chemical reaction.", "Carbon dioxide and water are photosynthesis reactants."),
        v("15-product", "Product", "A substance formed by a chemical reaction.", "Glucose and oxygen are photosynthesis products."),
        v("15-photo", "Photosynthesis", "The process that uses light energy to build glucose from carbon dioxide and water.", "Plants carry it out in chloroplasts."),
        v("15-thylakoid", "Thylakoid", "A chloroplast membrane sac containing chlorophyll and photosystems.", "Thylakoids stack into grana."),
        v("15-stroma", "Stroma", "The fluid region surrounding thylakoids inside a chloroplast.", "Carbon-fixing reactions occur in the stroma."),
        v("15-stomata", "Stomata", "Leaf openings that allow gas exchange and water-vapor release.", "Carbon dioxide enters through stomata."),
        v("15-xylem", "Xylem", "Plant vascular tissue that transports water mainly upward from roots.", "Water reaches leaves through xylem."),
        v("15-phloem", "Phloem", "Plant vascular tissue that transports sugars and other nutrients.", "Sugar moves from a leaf to growing roots through phloem."),
        v("15-respiration", "Cellular respiration", "The process that breaks down glucose to transfer energy into ATP.", "Most aerobic stages occur in mitochondria."),
        v("15-atp", "ATP", "The cell's immediate energy carrier with three phosphate groups.", "ATP powers active transport."),
        v("15-fermentation", "Fermentation", "An anaerobic pathway that allows glycolysis to continue when oxygen is unavailable.", "Muscle cells can use lactic acid fermentation."),
        v("15-cristae", "Cristae", "Folds of the inner mitochondrial membrane that increase surface area.", "Electron transport proteins are associated with this membrane.")
      ],
      practice: [
        p("compare/contrast", "Compare the reactants, products, locations, and energy changes of photosynthesis and respiration.", "Photosynthesis in chloroplasts stores light energy in glucose; respiration in cytoplasm/mitochondria transfers glucose energy to ATP, with the main reactants and products reversed."),
        p("labeling", "Label thylakoid, granum, stroma, and chlorophyll on a chloroplast model.", "Thylakoids are membrane sacs; a granum is a stack; stroma surrounds them; chlorophyll is in thylakoid membranes."),
        p("scenario application", "A yeast culture loses oxygen. Predict the pathway and relative ATP yield.", "Glycolysis followed by alcoholic fermentation continues without oxygen and yields about 2 ATP from glycolysis, much less than aerobic respiration.")
      ]
    }
  ];

  const units = [
    { id: "1", title: "Unit 1", status: "available", sequences: sequences.map(item => ({ id: item.id, title: item.title, status: "available" })) },
    { id: "2", title: "Unit 2", status: "class-source-needed", sequences: [
      { id: "2.1", title: "DNA & DNA Replication, Protein Synthesis, Mutations, and Biotechnology" },
      { id: "2.2", title: "The Cell Cycle & Cancer" },
      { id: "2.3", title: "Asexual vs Sexual Reproduction including Meiosis" },
      { id: "2.4", title: "Human/Plant Reproduction & Development" }
    ] },
    { id: "semester", title: "Semester Exam Review", status: "class-source-needed", sequences: [{ id: "review-1-2", title: "Units 1–2" }] },
    { id: "3", title: "Unit 3", status: "class-source-needed", sequences: [
      { id: "3.1", title: "Mendelian Genetics" }, { id: "3.2", title: "Mechanisms of Evolution" }, { id: "3.3", title: "Evidence of Evolution" }, { id: "3.4", title: "Classification" }, { id: "3.5", title: "The Human Body" }
    ] },
    { id: "4", title: "Unit 4", status: "class-source-needed", sequences: [{ id: "4.1-4.3", title: "Ecosystems, Food Webs, & Human Impact" }] }
  ];

  const vocabulary = sequences.flatMap(sequence => sequence.vocabulary.map(term => ({ ...term, topic: sequence.id, sequence: sequence.id })));
  const unit1 = {
    id: "biology-unit1",
    subjectKey: "biology",
    subject: "Biology 1 Honors",
    title: "Unit 1 — Foundations of Life",
    sequences,
    topics: sequences,
    vocabulary,
    sequence(id) { return sequences.find(item => item.id === id); },
    termsForTopic(id) { return vocabulary.filter(term => term.topic === id); }
  };

  globalThis.BIOLOGY_COURSE = {
    id: "biology",
    subjectKey: "biology",
    title: "Biology 1 Honors",
    sourceTypes,
    materialCategories: categories,
    materials,
    units,
    sequences,
    vocabulary,
    unit1,
    sequence(id) { return sequences.find(item => item.id === id); },
    material(id) { return materials.find(item => item.id === id); },
    termsForTopic(id) { return vocabulary.filter(term => term.topic === id); }
  };
})();
