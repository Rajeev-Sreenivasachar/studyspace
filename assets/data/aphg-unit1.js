(function () {
  "use strict";

  const sources = {
    teacher: { label: "Teacher material", priority: 1 },
    amsco: { label: "AMSCO reading", priority: 2 },
    existing: { label: "Existing StudySpace content", priority: 3 },
    "studyspace-ai": { label: "StudySpace explanation", priority: 4 }
  };

  const materials = [
    {
      id: "teacher-1-1",
      group: "Teacher Materials",
      title: "1.1 Introduction to Maps",
      topic: "1.1",
      source: "teacher",
      status: "transcribed",
      originalPath: null,
      fileNote: "Teacher concepts were supplied in the StudySpace brief, but the original PowerPoint file was not attached.",
      summary: "Reference and thematic maps, location and distance, spatial patterns, map projections, S.A.D.D., and Mercator, Peters Equal Area, and Robinson projections."
    },
    {
      id: "teacher-1-6",
      group: "Teacher Materials",
      title: "1.6 Scales of Analysis",
      topic: "1.6",
      source: "teacher",
      status: "transcribed",
      originalPath: null,
      fileNote: "Teacher concepts were supplied in the StudySpace brief, but the original PowerPoint file was not attached.",
      summary: "Global, regional, national, and local scales of analysis; large- versus small-scale maps; and why changing scale changes visible patterns."
    },
    {
      id: "amsco-unit1",
      group: "Textbook / Reading",
      title: "AMSCO Unit 1",
      topic: "unit1",
      source: "amsco",
      status: "file-needed",
      originalPath: null,
      fileNote: "The AMSCO source is listed in the brief, but no PDF or document was supplied in the attachments or repository.",
      summary: "Reserved as the priority source for Topics 1.2, 1.3, 1.4, 1.5, and 1.7 until the actual reading is added."
    },
    {
      id: "unit1-vocabulary",
      group: "Assignments",
      title: "Unit 1 Vocabulary",
      topic: "unit1",
      source: "teacher",
      status: "transcribed",
      originalPath: null,
      fileNote: "The complete 46-entry teacher-assigned list was provided as text in the StudySpace brief. No original worksheet file was attached.",
      summary: "All 46 teacher-assigned Unit 1 entries are available. Assignment 41 intentionally repeats Shape distortion and keeps its original number."
    }
  ];

  const futureTeacherSlots = ["1.2", "1.3", "1.4", "1.5", "1.7"].map(topic => ({
    id: `teacher-${topic.replace(".", "-")}`,
    topic,
    title: `${topic} Teacher PowerPoint`,
    status: "future"
  }));

  const vocabulary = [
    { number: 1, id: "u1-v01", term: "Absolute direction", definition: "A fixed direction using cardinal or intermediate directions, such as north, south, east, west, northeast, or southwest.", simpleExplanation: "An exact compass direction.", example: "Florida is south of Georgia.", hook: "N / S / E / W", topic: "1.1", source: "existing" },
    { number: 2, id: "u1-v02", term: "Absolute distance", definition: "The exact distance between places, usually measured in feet, miles, meters, or kilometers.", simpleExplanation: "A distance stated with a precise measurement.", example: "Your school is 2.2 miles from your house.", hook: "exact measurement", topic: "1.1", source: "existing" },
    { number: 3, id: "u1-v03", term: "Absolute location", definition: "The precise spot where something is located according to a system, most commonly latitude and longitude.", simpleExplanation: "The exact coordinates or address of a place.", example: "Mexico City is about 19°N, 99°W.", hook: "coordinates", topic: "1.1", source: "existing" },
    { number: 4, id: "u1-v04", term: "Area distortion", definition: "A map projection error that makes the size or area of a place appear different from its real size.", simpleExplanation: "A place looks too large or too small on a map.", example: "Greenland appears too large on a Mercator projection.", hook: "wrong size", topic: "1.1", source: "existing" },
    { number: 5, id: "u1-v05", term: "Clustering", definition: "A distribution pattern in which phenomena are arranged in a group or concentrated area.", simpleExplanation: "Many things are located close together.", example: "Restaurants grouped together in a mall food court.", hook: "grouped together", topic: "1.1", source: "existing" },
    { number: 6, id: "u1-v06", term: "Direction distortion", definition: "A map projection error in which directions between places are not represented accurately.", simpleExplanation: "The map changes the true direction between places.", example: "A projection may preserve shape but make direction less accurate.", hook: "wrong direction", topic: "1.1", source: "existing" },
    { number: 7, id: "u1-v07", term: "Dispersal", definition: "A distribution pattern in which phenomena are spread out over a large area.", simpleExplanation: "Things are spaced apart rather than grouped.", example: "Large shopping malls spread throughout a city.", hook: "spread out", topic: "1.1", source: "existing" },
    { number: 8, id: "u1-v08", term: "Distance decay", definition: "Interaction and connection between places usually decrease as distance increases.", simpleExplanation: "Farther places usually interact less.", example: "A store usually has more influence on nearby customers than people who live far away.", hook: "farther = less interaction", topic: "1.4", source: "existing" },
    { number: 9, id: "u1-v09", term: "Distance distortion", definition: "A map projection error in which the distance between places is shown inaccurately.", simpleExplanation: "Places look closer or farther apart than they really are.", example: "Two places may look closer or farther apart than they really are.", hook: "wrong distance", topic: "1.1", source: "existing" },
    { number: 10, id: "u1-v10", term: "Elevation", definition: "The distance of a feature above sea level, usually measured in feet or meters.", simpleExplanation: "How high a place is above sea level.", example: "Mount Everest has an elevation of more than 29,000 feet.", hook: "height above sea level", topic: "1.1", source: "existing" },
    { number: 11, id: "u1-v11", term: "Environmental determinism", definition: "The belief that landforms and climate are the most powerful forces shaping human behavior and societal development, while underestimating culture.", simpleExplanation: "The idea that the environment controls how societies develop.", example: "Claiming that a society developed mainly because of its climate.", hook: "environment controls society", topic: "1.5", source: "existing" },
    { number: 12, id: "u1-v12", term: "Field observation", definition: "Physically visiting a location, place, or region and recording firsthand information there.", simpleExplanation: "A geographer goes to a place and collects information directly.", example: "A geographer visits a neighborhood, takes photos, counts buildings, and interviews people.", hook: "go there + observe it yourself", topic: "1.2", source: "existing" },
    { number: 13, id: "u1-v13", term: "Flow", definition: "The patterns and movement of ideas, people, products, and other phenomena between places.", simpleExplanation: "Movement connecting one place to another.", example: "People migrating from one country to another.", hook: "movement", topic: "1.4", source: "existing" },
    { number: 14, id: "u1-v14", term: "Formal region", definition: "A region united by one or more shared traits, such as political, physical, cultural, or economic characteristics.", simpleExplanation: "An area defined by a measurable shared feature.", example: "The Sahara is a formal region because it shares desert characteristics.", hook: "shared trait", topic: "1.7", source: "existing" },
    { number: 15, id: "u1-v15", term: "Functional region", definition: "A region organized around a focal point or node and connected by an activity, network, or interaction.", simpleExplanation: "An area connected to a central place.", example: "A pizza shop and the area where it delivers.", hook: "node + connections", topic: "1.7", source: "existing" },
    { number: 16, id: "u1-v16", term: "Geographic Information System (GIS)", definition: "A computer system that can store, analyze, and display information from multiple digital maps or geospatial data sets.", simpleExplanation: "Software that stacks and analyzes layers of location data.", example: "A city uses GIS to map crime locations, roads, land use, and pollution.", hook: "computer map layers", topic: "1.3", source: "existing" },
    { number: 17, id: "u1-v17", term: "Geographical data", definition: "Information about places or geographic phenomena that geographers collect and analyze to understand spatial patterns and relationships.", simpleExplanation: "Information tied to places and locations.", example: "Population counts, interviews, field notes, maps, and satellite images.", hook: "information about places", topic: "1.2", source: "existing" },
    { number: 18, id: "u1-v18", term: "Geospatial data", definition: "Information connected to a specific geographic location.", simpleExplanation: "Data that can be placed on a map.", example: "A spreadsheet records each bus stop with its latitude and longitude.", hook: "geo + location", topic: "1.2", source: "teacher" },
    { number: 19, id: "u1-v19", term: "Global scale", definition: "Analysis at the level of the entire world.", simpleExplanation: "Looking at a pattern worldwide.", example: "Comparing carbon emissions for every country uses a global scale.", hook: "whole globe", topic: "1.6", source: "teacher" },
    { number: 20, id: "u1-v20", term: "Land use", definition: "How people use, organize, or modify land.", simpleExplanation: "What people do with an area of land.", example: "A city map separates residential, commercial, industrial, and park land uses.", hook: "how land is used", topic: "1.5", source: "teacher" },
    { number: 21, id: "u1-v21", term: "Landscape analysis", definition: "Studying the visible human and physical characteristics of an area.", simpleExplanation: "Reading what the landscape reveals about a place.", example: "A geographer studies roads, buildings, vegetation, and terrain in a neighborhood.", hook: "study what you can see", topic: "1.2", source: "teacher" },
    { number: 22, id: "u1-v22", term: "Local scale", definition: "Analysis of a small or subnational area.", simpleExplanation: "Looking closely at a community or smaller area.", example: "Comparing census tracts inside Tampa uses a local scale.", hook: "neighborhood level", topic: "1.6", source: "teacher" },
    { number: 23, id: "u1-v23", term: "Map distortion", definition: "Inaccuracies created when Earth’s curved surface is represented on a flat map.", simpleExplanation: "Flattening Earth makes some map properties inaccurate.", example: "A world projection may alter area, shape, distance, or direction.", hook: "flat map tradeoff", topic: "1.1", source: "teacher" },
    { number: 24, id: "u1-v24", term: "National scale", definition: "Analysis at the level of one country.", simpleExplanation: "Looking at a pattern across one nation.", example: "Studying unemployment across the United States uses a national scale.", hook: "one nation", topic: "1.6", source: "teacher" },
    { number: 25, id: "u1-v25", term: "Natural resources", definition: "Useful materials that come from nature and may be renewable or nonrenewable.", simpleExplanation: "Materials people use from the natural environment.", example: "Fresh water is renewable when managed well, while coal is nonrenewable.", hook: "useful from nature", topic: "1.5", source: "teacher" },
    { number: 26, id: "u1-v26", term: "Pattern", definition: "The arrangement or distribution of something across space.", simpleExplanation: "How something is organized on Earth.", example: "Homes may form a clustered, linear, or dispersed pattern.", hook: "spatial arrangement", topic: "1.4", source: "teacher" },
    { number: 27, id: "u1-v27", term: "Perceptual/vernacular region", definition: "An informal region based on people’s ideas or sense of place, often without exact boundaries.", simpleExplanation: "A region people believe exists, even if its borders vary.", example: "People disagree about the exact boundaries of the American South.", hook: "region in people's minds", topic: "1.7", source: "teacher" },
    { number: 28, id: "u1-v28", term: "Place", definition: "A location defined by its unique human and physical characteristics.", simpleExplanation: "A location with meaning and distinct features.", example: "New Orleans is known for its Mississippi River setting and cultural traditions.", hook: "location + character", topic: "1.4", source: "teacher" },
    { number: 29, id: "u1-v29", term: "Possibilism", definition: "The idea that the environment creates opportunities and limits, but humans make choices and adapt.", simpleExplanation: "Nature sets conditions; people still choose what to do.", example: "People use irrigation technology to farm in a dry environment.", hook: "environment allows choices", topic: "1.5", source: "teacher" },
    { number: 30, id: "u1-v30", term: "Qualitative data", definition: "Descriptive, non-numerical information.", simpleExplanation: "Information expressed with words and observations.", example: "Interview responses about how residents feel about their neighborhood are qualitative.", hook: "qualities and descriptions", topic: "1.2", source: "teacher" },
    { number: 31, id: "u1-v31", term: "Quantitative data", definition: "Numerical or measurable information.", simpleExplanation: "Information expressed with numbers.", example: "Population totals and average travel times are quantitative data.", hook: "quantities and numbers", topic: "1.2", source: "teacher" },
    { number: 32, id: "u1-v32", term: "Reference maps", definition: "Maps mainly used to show locations and general geographic features.", simpleExplanation: "Maps that help you locate places and features.", example: "A road map showing cities and highways is a reference map.", hook: "find where", topic: "1.1", source: "teacher" },
    { number: 33, id: "u1-v33", term: "Regional scale", definition: "Analysis of an area made up of multiple places with shared characteristics.", simpleExplanation: "Looking at a larger region such as a continent or group of countries.", example: "Comparing migration across South America uses a regional scale.", hook: "shared-area level", topic: "1.6", source: "teacher" },
    { number: 34, id: "u1-v34", term: "Relative direction", definition: "Direction described in relation to another place or object.", simpleExplanation: "Direction explained using a nearby reference point.", example: "The library is across the street from the school.", hook: "direction by relationship", topic: "1.1", source: "teacher" },
    { number: 35, id: "u1-v35", term: "Relative distance", definition: "Distance described using travel time, cost, convenience, or another comparison instead of exact measurement.", simpleExplanation: "How far a place feels based on the trip.", example: "The airport is about twenty minutes away in light traffic.", hook: "time, cost, convenience", topic: "1.1", source: "teacher" },
    { number: 36, id: "u1-v36", term: "Relative location", definition: "Where a place is compared with another place.", simpleExplanation: "A location described by what is around it.", example: "Tampa is west of Orlando on Florida’s Gulf Coast.", hook: "located relative to", topic: "1.1", source: "teacher" },
    { number: 37, id: "u1-v37", term: "Remote sensing", definition: "Collecting information about Earth from satellites, aircraft, or other sensors from a distance.", simpleExplanation: "Observing Earth without directly touching the location.", example: "A satellite image helps track the spread of a wildfire.", hook: "sense from far away", topic: "1.3", source: "teacher" },
    { number: 38, id: "u1-v38", term: "Shape distortion", definition: "When a map projection changes the apparent shape of places.", simpleExplanation: "A place looks stretched or compressed on a map.", example: "A projection may preserve area while stretching continents vertically.", hook: "wrong shape", topic: "1.1", source: "teacher" },
    { number: 39, id: "u1-v39", term: "Site", definition: "The physical and human characteristics of the exact location of a place.", simpleExplanation: "What the place itself is like.", example: "A city’s site includes its river, elevation, climate, and built environment.", hook: "characteristics at the spot", topic: "1.4", source: "teacher" },
    { number: 40, id: "u1-v40", term: "Situation", definition: "A place’s location relative to surrounding places and connections.", simpleExplanation: "How a place is positioned and connected to other places.", example: "Chicago’s situation near the Great Lakes and major transportation routes supported its growth.", hook: "surroundings + connections", topic: "1.4", source: "teacher" },
    { number: 41, id: "u1-v41", term: "Shape distortion", definition: "When a map projection changes the apparent shape of places.", simpleExplanation: "A place looks stretched or compressed on a map.", example: "A projection may preserve area while stretching continents vertically.", hook: "intentional duplicate #41", topic: "1.1", source: "teacher", intentionalDuplicateOf: "u1-v38" },
    { number: 42, id: "u1-v42", term: "Space", definition: "The area or distance between geographic features or phenomena.", simpleExplanation: "The separation or area between things.", example: "A geographer measures the space between homes and public transit stops.", hook: "area between", topic: "1.4", source: "teacher" },
    { number: 43, id: "u1-v43", term: "Sustainability", definition: "Using resources in ways that meet present needs while allowing future generations to meet theirs.", simpleExplanation: "Meet today’s needs without ruining tomorrow’s options.", example: "A city conserves water so the supply remains available in the future.", hook: "today + future", topic: "1.5", source: "teacher" },
    { number: 44, id: "u1-v44", term: "Thematic maps", definition: "Maps designed to show the spatial pattern of a particular topic or variable.", simpleExplanation: "Maps focused on one subject.", example: "A map showing population density by county is thematic.", hook: "one theme", topic: "1.1", source: "teacher" },
    { number: 45, id: "u1-v45", term: "Choropleth maps", definition: "Thematic maps that use different colors or shading to represent data values across areas.", simpleExplanation: "Shaded areas show higher or lower values.", example: "Counties are shaded from light to dark according to median income.", hook: "shade by value", topic: "1.1", source: "teacher" },
    { number: 46, id: "u1-v46", term: "Time-space compression", definition: "The reduction in perceived distance because transportation and communication become faster.", simpleExplanation: "Technology makes faraway places feel closer.", example: "Video calls allow people on different continents to communicate instantly.", hook: "faster = feels closer", topic: "1.4", source: "teacher" }
  ];

  const topics = [
    {
      id: "1.1",
      slug: "introduction-to-maps",
      title: "Introduction to Maps",
      sourceStatus: "teacher",
      sourceIds: ["teacher-1-1", "unit1-vocabulary"],
      overview: "Read maps by identifying their purpose, the spatial pattern they show, and the distortions created when Earth is flattened.",
      essentials: ["Reference maps support location and navigation.", "Thematic maps communicate one subject or characteristic.", "Absolute descriptions are exact; relative descriptions depend on relationships.", "Every flat map projection is selective and creates distortion."],
      notes: [
        { heading: "Reference vs. thematic", body: "Reference maps give general location information, including political, physical, and road maps. Thematic maps focus on a particular spatial subject or characteristic.", source: "teacher" },
        { heading: "Thematic map types", body: "Choropleth uses shades or patterns; dot-density assigns a quantity to each dot; proportional symbols change size; cartograms distort area; isolines join equal values; topographic maps show terrain and elevation.", source: "teacher" },
        { heading: "Location, distance, and direction", body: "Absolute location, distance, and direction are exact. Relative versions describe relationships, accessibility, travel time, or landmarks.", source: "teacher" },
        { heading: "Spatial patterns", body: "Clustering means features are close together. Density counts features in an area. Distribution or dispersal describes how features spread. Spatial association asks whether two phenomena may be related.", source: "teacher" },
        { heading: "Projection distortion", body: "Teacher mnemonic S.A.D.D. stands for Shape, Area, Distance, and Direction. Mercator preserves direction and shape relatively well but enlarges polar areas. Peters represents area more accurately but stretches shape. Robinson compromises by distorting every major property somewhat without one extreme distortion.", source: "teacher" }
      ],
      remember: ["Reference = general location; thematic = one subject.", "Large symbols, dots, shades, lines, and distorted areas communicate different kinds of data.", "S.A.D.D. names four properties a projection can distort.", "All maps are selective and distort Earth in some way."],
      confusions: ["Choropleth maps shade areas; dot-density maps place quantity dots.", "Absolute direction uses cardinal directions; relative direction uses relational instructions.", "Mercator is useful for navigation but does not preserve area near the poles."],
      vocabularyIds: ["u1-v01", "u1-v02", "u1-v03", "u1-v04", "u1-v05", "u1-v06", "u1-v07", "u1-v09", "u1-v10", "u1-v23", "u1-v32", "u1-v34", "u1-v35", "u1-v36", "u1-v38", "u1-v41", "u1-v44", "u1-v45"]
    },
    {
      id: "1.2", slug: "geographic-data", title: "Geographic Data", sourceStatus: "awaiting-amsco", sourceIds: ["amsco-unit1", "unit1-vocabulary"],
      overview: "This page currently organizes the authoritative existing vocabulary for collecting and describing information about places. Add the AMSCO file to complete the reading notes.",
      essentials: ["Geographic data describes places and spatial phenomena.", "Field observation collects firsthand information at a location.", "Data can come from counts, interviews, field notes, maps, and imagery."],
      notes: [{ heading: "Current StudySpace coverage", body: "Geographers gather information tied to location and use it to identify spatial patterns and relationships. Field observation means visiting a place and recording evidence directly.", source: "existing" }],
      remember: ["Ask where the data came from and what location it represents.", "Field observation is firsthand collection at the site."],
      confusions: ["The AMSCO reading itself is not yet available in this repository, so this page does not claim to reproduce it."],
      vocabularyIds: ["u1-v12", "u1-v17", "u1-v18", "u1-v21", "u1-v30", "u1-v31"]
    },
    {
      id: "1.3", slug: "power-of-geographic-data", title: "The Power of Geographic Data", sourceStatus: "awaiting-amsco", sourceIds: ["amsco-unit1", "unit1-vocabulary"],
      overview: "Use geographic tools to layer, compare, and analyze location-based evidence. The AMSCO source file is still needed for source-complete notes.",
      essentials: ["GIS stores, layers, analyzes, and displays geospatial data.", "Combining layers can reveal relationships that a single map may hide."],
      notes: [{ heading: "GIS layers", body: "Existing StudySpace vocabulary defines GIS as a computer system for storing, analyzing, and displaying multiple digital maps or geospatial data sets.", source: "existing" }, { heading: "Additional explanation", body: "Comparing layers can help a student form a question about association, but association alone does not prove that one pattern caused another.", source: "studyspace-ai" }],
      remember: ["GIS = computer map layers plus analysis.", "A visible association is evidence to investigate, not automatic proof of causation."],
      confusions: ["GIS analyzes mapped data; it is not simply a paper map or a location coordinate."],
      vocabularyIds: ["u1-v16", "u1-v37"]
    },
    {
      id: "1.4", slug: "spatial-concepts", title: "Spatial Concepts", sourceStatus: "awaiting-amsco", sourceIds: ["amsco-unit1", "unit1-vocabulary"],
      overview: "Describe how places and phenomena are arranged, connected, and affected by distance.",
      essentials: ["Distance decay predicts weaker interaction as distance grows.", "Flows connect places through movement.", "Location, distribution, and association help describe spatial patterns."],
      notes: [{ heading: "Distance and interaction", body: "Existing StudySpace vocabulary describes distance decay as the tendency for interaction to decrease as distance increases.", source: "existing" }, { heading: "Flows", body: "Flows are movements of people, ideas, products, or other phenomena between places.", source: "existing" }],
      remember: ["Farther often means less interaction, but transportation and technology can change the strength of that effect.", "A flow always involves movement between places."],
      confusions: ["Distance decay describes an interaction pattern; absolute distance is the exact measured separation."],
      vocabularyIds: ["u1-v08", "u1-v13", "u1-v26", "u1-v28", "u1-v39", "u1-v40", "u1-v42", "u1-v46"]
    },
    {
      id: "1.5", slug: "human-environmental-interaction", title: "Human-Environmental Interaction", sourceStatus: "awaiting-amsco", sourceIds: ["amsco-unit1", "unit1-vocabulary"],
      overview: "Examine claims about how physical environments and human choices shape one another.",
      essentials: ["Environmental determinism gives the environment too much control over human development.", "Culture, technology, decisions, and institutions also shape outcomes."],
      notes: [{ heading: "Environmental determinism", body: "The existing assignment defines this as the belief that landforms and climate are the most powerful forces shaping human behavior and development while underestimating culture.", source: "existing" }, { heading: "Additional explanation", body: "A careful geographic explanation considers both environmental limits and the choices people make within them.", source: "studyspace-ai" }],
      remember: ["Avoid one-cause explanations that treat climate or landforms as destiny."],
      confusions: ["The AMSCO source is required before StudySpace can label broader Topic 1.5 notes as textbook-based."],
      vocabularyIds: ["u1-v11", "u1-v20", "u1-v25", "u1-v29", "u1-v43"]
    },
    {
      id: "1.6", slug: "scales-of-analysis", title: "Scales of Analysis", sourceStatus: "teacher", sourceIds: ["teacher-1-6"],
      overview: "The scale at which data is displayed or analyzed changes the pattern a geographer can see and the interpretation they may reach.",
      essentials: ["Global data covers the world.", "Regional data covers a continent or group of countries.", "National data covers a country.", "Local data covers areas below the national level.", "Map scale and scale of analysis are different concepts."],
      notes: [
        { heading: "Four scales of analysis", body: "Global means the world; regional means a region such as a continent or group of countries; national means one country; local means a state, county, city, ZIP code, neighborhood, or another subnational area.", source: "teacher" },
        { heading: "Map scale", body: "A small-scale map covers a large geographic area with less detail and looks zoomed out. A large-scale map covers a smaller area with more detail and looks zoomed in.", source: "teacher" },
        { heading: "Why scale matters", body: "Different scales of analysis can reveal different spatial patterns and may produce different interpretations of the same data.", source: "teacher" }
      ],
      remember: ["Scale of analysis = level used to display or analyze data.", "Small-scale map = large area, less detail.", "Large-scale map = small area, more detail.", "Changing analysis scale can change the pattern you notice."],
      confusions: ["Map scale describes map coverage/detail. Scale of analysis describes the level used to organize data.", "Regional does not mean one country; national does."],
      vocabularyIds: ["u1-v19", "u1-v22", "u1-v24", "u1-v33"]
    },
    {
      id: "1.7", slug: "regional-analysis", title: "Regional Analysis", sourceStatus: "awaiting-amsco", sourceIds: ["amsco-unit1", "unit1-vocabulary"],
      overview: "Organize space into regions based on shared traits, connections to a node, or people's perceptions.",
      essentials: ["Formal regions share a measurable trait.", "Functional regions connect to a focal point or node.", "Perceptual regions depend on people's ideas and may not have exact boundaries."],
      notes: [{ heading: "Formal regions", body: "Existing StudySpace vocabulary defines a formal region by shared political, physical, cultural, or economic characteristics.", source: "existing" }, { heading: "Functional regions", body: "Existing StudySpace vocabulary defines a functional region around a node and its connected activity or network.", source: "existing" }, { heading: "Perceptual regions", body: "Additional explanation: a perceptual or vernacular region exists because people share an idea of where it is, so its boundaries can vary.", source: "studyspace-ai" }],
      remember: ["Formal = shared trait.", "Functional = node plus connections.", "Perceptual = people's shared idea."],
      confusions: ["A pizza delivery area is functional, not formal, because it is organized around the restaurant's service connection."],
      vocabularyIds: ["u1-v14", "u1-v15", "u1-v27"]
    }
  ];

  globalThis.APHG_UNIT1 = {
    id: "aphg-unit1",
    subject: "AP Human Geography",
    title: "Unit 1 — Thinking Geographically",
    assignedVocabularyExpected: 46,
    assignedVocabularyAvailable: vocabulary.length,
    sources,
    materials,
    futureTeacherSlots,
    vocabulary,
    topics,
    topic(id) { return topics.find(topic => topic.id === id); },
    material(id) { return materials.find(material => material.id === id); },
    termsForTopic(id) { return vocabulary.filter(term => term.topic === id); },
    sourceLabel(id) { return sources[id]?.label || "Unknown source"; }
  };
})();
