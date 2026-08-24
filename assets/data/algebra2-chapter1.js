(function () {
  "use strict";

  const skill = (id, title, summary) => ({ id, title, summary });
  const card = (id, topic, term, definition, example, concept = term) => ({ id: `alg-${id}`, topic, term, definition, example, concept, subject: "algebra2" });
  const section = (id, title, description, skills, lessons, workedExamples, visual) => ({ id, title, description, skills, masteryTags: skills.map(item => item.title), lessons, workedExamples, visual });

  const sections = [
    section("1.1", "Parent Functions and Transformations", "Recognize four parent families and describe how graphs move, reflect, stretch, and shrink.", [
      skill("function-families", "Function Families", "Identify constant, linear, absolute value, and quadratic families from rules, graphs, and tables."),
      skill("parent-functions", "Parent Functions", "Know each core parent rule, shape, domain, and range."),
      skill("translations", "Translations", "Connect outside changes to vertical movement and inside changes to opposite horizontal movement."),
      skill("reflections", "Reflections", "Distinguish an x-axis reflection from a y-axis reflection."),
      skill("vertical-scale", "Vertical Stretches/Shrinks", "Use the outside factor to describe vertical scale."),
      skill("combined-transformations", "Combined Transformations", "Decode several changes in one transformed function.")
    ], [
      { title: "Four parent families", summary: "A function family shares a recognizable rule and graph shape. The parent function is the simplest member of that family.", keyIdeas: ["Constant: f(x)=1, a horizontal line", "Linear: f(x)=x, a straight line through the origin", "Absolute value: f(x)=|x|, a V with vertex at the origin", "Quadratic: f(x)=x², a U-shaped parabola"] },
      { title: "Translations", summary: "Adding outside the function changes outputs and moves the graph vertically. Changing the input moves the graph horizontally, with the written sign opposite the direction.", keyIdeas: ["f(x)+k: up when k>0 and down when k<0", "f(x-h): right when h>0", "f(x+h): left when h>0", "Memory cue: outside is vertical; inside is horizontal"] },
      { title: "Reflections and vertical scale", summary: "A negative outside changes every output and reflects across the x-axis. Multiplying outputs by a changes their distance from the x-axis.", keyIdeas: ["-f(x): x-axis reflection", "f(-x): y-axis reflection", "|a|>1: vertical stretch", "0<|a|<1: vertical shrink"] }
    ], [
      { prompt: "Describe g(x)=-|x+5|-3.", steps: ["The parent is f(x)=|x|.", "The negative outside reflects across the x-axis.", "x+5 means left 5 because the inside sign is opposite.", "-3 outside means down 3."], answer: "Absolute value; reflect across x-axis; left 5; down 3." },
      { prompt: "Compare q(x)=0.5x² with f(x)=x².", steps: ["The factor 0.5 multiplies every output.", "0<0.5<1, so points move closer to the x-axis."], answer: "A vertical shrink by a factor of 1/2." }
    ], "parent-gallery"),

    section("1.2", "Transformations of Linear and Absolute Value Functions", "Write transformations with function notation, including reciprocal horizontal scale factors.", [
      skill("writing-transformations", "Writing Transformations", "Move between a verbal transformation and function notation."),
      skill("input-output-reflections", "Input vs Output Reflections", "Explain why changing outputs reflects vertically while changing inputs reflects horizontally."),
      skill("horizontal-scale", "Horizontal Stretches/Shrinks", "Use the reciprocal of the inside factor."),
      skill("vertical-scale-12", "Vertical Stretches/Shrinks", "Read vertical scale directly from the outside factor."),
      skill("transformation-tables", "Transformations from Tables", "Compare output patterns in f and g."),
      skill("transformation-order", "Order of Transformations", "Build a transformed function one stated step at a time.")
    ], [
      { title: "Inputs versus outputs", summary: "An outside change acts after f produces an output. An inside change modifies the input before f receives it.", keyIdeas: ["g(x)=-f(x): output signs change, so reflect across x-axis", "g(x)=f(-x): input signs change, so reflect across y-axis", "g(x)=f(x-h)+k: right h and up k"] },
      { title: "Horizontal scale is reciprocal", summary: "In g(x)=f(bx), the horizontal scale factor is 1/|b| because the input reaches the same parent value sooner or later.", keyIdeas: ["f(4x): horizontal shrink by 1/4", "f(x/3): horizontal stretch by 3", "Memory cue: outside factor is normal; inside factor is reciprocal"] },
      { title: "General decoder", summary: "In g(x)=a·f(b(x-h))+k, a controls vertical scale and possible x-axis reflection; b controls reciprocal horizontal scale and possible y-axis reflection; h and k translate.", keyIdeas: ["Read h from x-h", "Use 1/|b| for horizontal scale", "Negative a reflects across x-axis", "Negative b reflects across y-axis"] }
    ], [
      { prompt: "Write a function that shifts f right 4 and reflects it across the x-axis.", steps: ["Right 4 changes the input to x-4.", "An x-axis reflection places a negative outside."], answer: "g(x)=-f(x-4)" },
      { prompt: "Decode g(x)=2f(0.5(x+1))-6.", steps: ["a=2 gives a vertical stretch by 2.", "b=0.5 gives a horizontal stretch by 2.", "x+1 shifts left 1.", "k=-6 shifts down 6."], answer: "Vertical stretch 2; horizontal stretch 2; left 1; down 6." }
    ], "transformation-timeline"),

    section("1.3", "Modeling with Linear Functions", "Write, interpret, compare, and fit linear models from points, tables, graphs, and contexts.", [
      skill("linear-equations", "Linear Models", "Choose slope-intercept or point-slope form from the information given."),
      skill("slope-intercepts", "Slope & Intercepts", "Interpret rate, initial value, and when an output reaches zero."),
      skill("comparing-models", "Comparing Linear Models", "Compare slopes, intercepts, values, and intersection points."),
      skill("lines-of-fit", "Lines of Fit", "Estimate a reasonable line through a scatter plot."),
      skill("linear-regression", "Linear Regression", "Interpret a technology-generated slope, intercept, and prediction.")
    ], [
      { title: "Which equation form?", summary: "Choose the form that uses the information you already have, then simplify only when useful.", keyIdeas: ["Slope and y-intercept → y=mx+b", "Slope and one point → y-y₁=m(x-x₁)", "Two points → calculate m=(y₂-y₁)/(x₂-x₁), then use point-slope form"] },
      { title: "Meaning in context", summary: "Slope is the change in output for each one-unit increase in input. The y-intercept is the predicted starting amount when x=0. The x-intercept is where the output reaches zero.", keyIdeas: ["Always include units when interpreting slope", "Ask whether x=0 is meaningful before interpreting the y-intercept", "An intersection means two models have equal outputs"] },
      { title: "Fit versus best fit", summary: "A line of fit is a reasonable student estimate. A line of best fit is calculated by regression technology.", keyIdeas: ["For a hand-fit line, balance points above and below", "Choose two points on the drawn line, not necessarily data points", "Regression still needs contextual interpretation"] }
    ], [
      { prompt: "A tank has 72 liters and drains 6 liters per minute. Write and interpret a model.", steps: ["The starting amount is 72, so b=72.", "The amount decreases by 6 each minute, so m=-6."], answer: "V(t)=-6t+72; slope means 6 liters drain per minute, and 72 is the initial volume." },
      { prompt: "Find the line through (2,7) and (6,19).", steps: ["m=(19-7)/(6-2)=12/4=3.", "Use y-7=3(x-2).", "Simplify to y=3x+1."], answer: "y=3x+1" }
    ], "linear-model"),

    section("1.4", "Solving Absolute Value Inequalities", "Use distance, AND/OR reasoning, number lines, interval notation, and absolute-deviation models.", [
      skill("absolute-inequalities", "Absolute Value Inequalities", "Isolate the absolute value and solve the resulting compound inequality."),
      skill("and-or", "AND vs OR", "Connect less than with between/AND and greater than with outside/OR."),
      skill("interval-notation", "Interval Notation", "Convert among inequalities, number lines, and intervals."),
      skill("special-cases", "Special Cases", "Reason about no-solution and all-real-number results."),
      skill("absolute-deviation", "Absolute Deviation", "Model an allowed distance from a target value.")
    ], [
      { title: "Absolute value is distance", summary: "|x| measures the distance between x and zero. A distance smaller than c lies between -c and c; a distance greater than c lies outside that interval.", keyIdeas: ["Less than → between → AND", "Greater than → outside → OR", "The same pattern works with ≤ and ≥"] },
      { title: "Reliable solving process", summary: "First isolate the absolute value expression. Then decide AND or OR, solve each part, graph the result, and convert to interval notation when requested.", keyIdeas: ["Do not split before isolating", "Reverse an inequality when multiplying or dividing by a negative", "Infinity always uses a parenthesis"] },
      { title: "Special cases", summary: "Absolute value can never be negative. Compare the requested distance with zero before doing unnecessary algebra.", keyIdeas: ["|expression|<negative: no solution", "|expression|>negative: all real numbers", "For ≤0, equality may create one solution", "For ≥0, every real input works"] }
    ], [
      { prompt: "Solve |2x-5|≤9.", steps: ["Write -9≤2x-5≤9.", "Add 5: -4≤2x≤14.", "Divide by 2: -2≤x≤7."], answer: "[-2,7]" },
      { prompt: "A package should weigh 18 kg within a tolerance of 0.4 kg.", steps: ["Distance from 18 is |w-18|.", "At most 0.4 means ≤0.4.", "Solve 17.6≤w≤18.4."], answer: "|w-18|≤0.4, so w∈[17.6,18.4]." }
    ], "number-line"),

    section("1.5", "Absolute Value Functions", "Explore vertex form and analyze every important characteristic of an absolute value graph.", [
      skill("absolute-vertex-form", "Absolute Value Vertex Form", "Read and write g(x)=a|x-h|+k."),
      skill("absolute-characteristics", "Absolute Value Characteristics", "Determine vertex, symmetry, intercepts, domain, range, and extrema."),
      skill("increasing-decreasing", "Increasing/Decreasing", "Use the vertex and opening direction to identify behavior intervals."),
      skill("positive-negative", "Positive/Negative Intervals", "Use x-intercepts to determine where outputs are above or below zero."),
      skill("end-behavior", "End Behavior", "Describe what happens as x approaches positive or negative infinity."),
      skill("absolute-models", "Absolute Value Models", "Interpret the vertex as a target, midpoint, or minimum/maximum in context.")
    ], [
      { title: "Vertex form", summary: "For g(x)=a|x-h|+k, the vertex is (h,k) and the line of symmetry is x=h.", keyIdeas: ["a>0 opens upward and has a minimum", "a<0 opens downward and has a maximum", "|a|>1 is narrower", "0<|a|<1 is wider"] },
      { title: "Behavior and sign", summary: "The vertex is the turning point. X-intercepts divide intervals where the graph may be positive or negative.", keyIdeas: ["Upward V: decreasing before h, increasing after h", "Downward V: increasing before h, decreasing after h", "Above x-axis means positive; below means negative"] },
      { title: "End behavior", summary: "Both arms of an absolute value graph move in the same vertical direction. The sign of a determines whether they rise or fall.", keyIdeas: ["If a>0, g(x)→∞ as x→±∞", "If a<0, g(x)→-∞ as x→±∞", "The domain is all real numbers unless a context restricts it"] }
    ], [
      { prompt: "Analyze y=-2|x-3|+8.", steps: ["Vertex: (3,8); axis: x=3.", "a=-2, so it opens down and is vertically stretched.", "Set y=0: |x-3|=4, so x=-1 or 7."], answer: "Maximum 8 at x=3; range y≤8; x-intercepts -1 and 7." },
      { prompt: "Write a V-shaped model with vertex (-2,5) opening upward and twice as steep as |x|.", steps: ["Use h=-2, so write x+2 inside.", "Use k=5 and a=2."], answer: "y=2|x+2|+5" }
    ], "vertex-explorer"),

    section("1.6", "Piecewise Functions", "Choose, evaluate, graph, and write rules that apply on different parts of a domain.", [
      skill("piecewise-evaluation", "Piecewise Evaluation", "Choose the condition containing the input before evaluating."),
      skill("piecewise-graphing", "Piecewise Graphing", "Graph each rule only on its allowed interval."),
      skill("endpoints", "Open/Closed Endpoints", "Match < or > with open circles and ≤ or ≥ with closed circles."),
      skill("piecewise-characteristics", "Piecewise Domain/Range", "Combine the domains and outputs of all pieces."),
      skill("step-functions", "Step Functions", "Model constant outputs over successive intervals."),
      skill("absolute-piecewise", "Absolute Value as Piecewise", "Split an absolute value rule where its inside expression changes sign.")
    ], [
      { title: "Select the rule first", summary: "A piecewise function has multiple equations, but only one rule applies to a particular input. Test the input against the conditions before substituting.", keyIdeas: ["Highlight the true condition", "Use only its matching equation", "A boundary with ≤ or ≥ is included"] },
      { title: "Graphing pieces", summary: "Graph each equation only across its assigned interval. Endpoint circles communicate whether the boundary point belongs to that piece.", keyIdeas: ["< or > → open circle", "≤ or ≥ → closed circle", "Two pieces may meet, jump, or leave a gap"] },
      { title: "Step and absolute value functions", summary: "A step function uses constant outputs on intervals. Absolute value is piecewise because the expression changes rule where its inside equals zero.", keyIdeas: ["|x|=-x for x<0 and x for x≥0", "For |x-h|, the split is x=h", "Pricing tiers often create step functions"] }
    ], [
      { prompt: "Evaluate f(-2) when f(x)=x+4 for x<1 and 2x-3 for x≥1.", steps: ["-2 satisfies x<1, so select x+4.", "Substitute: -2+4=2."], answer: "f(-2)=2" },
      { prompt: "Convert 3|x-2|+1 to piecewise form.", steps: ["Split at x=2.", "For x<2, |x-2|=-(x-2).", "For x≥2, |x-2|=x-2.", "Simplify each rule."], answer: "f(x)=-3x+7 for x<2; f(x)=3x-5 for x≥2." }
    ], "piecewise-selector")
  ];

  const flashcards = [
    card("family", "1.1", "Function family", "A group of functions with a shared rule pattern and graph shape.", "Linear functions form a family of straight-line graphs.", "Function Families"),
    card("parent", "1.1", "Parent function", "The simplest representative of a function family.", "f(x)=|x| is the absolute value parent.", "Parent Functions"),
    card("translation", "1.1", "Translation", "A shift of a graph without changing its shape or orientation.", "f(x-3)+2 shifts right 3 and up 2.", "Translations"),
    card("reflection", "1.1", "Reflection", "A flip of a graph across a line such as an axis.", "-f(x) reflects across the x-axis.", "Reflections"),
    card("vstretch", "1.1", "Vertical stretch", "A vertical scaling that moves nonzero outputs farther from the x-axis.", "2f(x) stretches vertically by 2.", "Vertical Stretches/Shrinks"),
    card("vshrink", "1.1", "Vertical shrink", "A vertical scaling that moves outputs closer to the x-axis.", "0.4f(x) shrinks vertically by 0.4.", "Vertical Stretches/Shrinks"),
    card("hscale", "1.2", "Horizontal scale factor", "The reciprocal 1/|b| in g(x)=f(bx).", "f(5x) shrinks horizontally by 1/5.", "Horizontal Stretches/Shrinks"),
    card("general", "1.2", "General transformation form", "g(x)=a·f(b(x-h))+k, where each parameter controls a graph change.", "a controls vertical scale; h controls horizontal shift.", "Writing Transformations"),
    card("slope", "1.3", "Slope", "The rate of change Δy/Δx.", "A slope of 4 dollars per ticket means cost rises $4 per ticket.", "Slope & Intercepts"),
    card("yint", "1.3", "y-intercept", "The output when x=0, often an initial value.", "A $12 starting fee is the y-intercept.", "Slope & Intercepts"),
    card("pointslope", "1.3", "Point-slope form", "y-y₁=m(x-x₁), useful when slope and one point are known.", "Through (2,5) with slope 3: y-5=3(x-2).", "Linear Models"),
    card("fit", "1.3", "Line of fit", "A reasonable student-drawn linear model for scatter data.", "Balance the number of points above and below the line.", "Lines of Fit"),
    card("bestfit", "1.3", "Line of best fit", "A regression line calculated to model data.", "Technology may produce y=1.8x+4.2.", "Linear Regression"),
    card("absineq", "1.4", "Absolute value inequality", "An inequality comparing a distance with a boundary.", "|x-6|≤2 means x is within 2 of 6.", "Absolute Value Inequalities"),
    card("andor", "1.4", "AND vs OR", "Less-than absolute inequalities describe a between/AND region; greater-than describe outside/OR regions.", "|x|>3 means x<-3 or x>3.", "AND vs OR"),
    card("endpoint", "1.4", "Endpoint", "A boundary value of an interval.", "x≤4 includes the endpoint 4.", "Interval Notation"),
    card("bounded", "1.4", "Bounded interval", "An interval with two finite endpoints.", "[-2,7) is bounded.", "Interval Notation"),
    card("unbounded", "1.4", "Unbounded interval", "An interval extending indefinitely in at least one direction.", "(5,∞) is unbounded.", "Interval Notation"),
    card("deviation", "1.4", "Absolute deviation", "The absolute distance from a reference value, written |x-center|.", "|t-20|≤1.5 describes temperatures within 1.5° of 20°.", "Absolute Deviation"),
    card("vertexform", "1.5", "Absolute value vertex form", "g(x)=a|x-h|+k.", "In 2|x-3|+1, the vertex is (3,1).", "Absolute Value Vertex Form"),
    card("symmetry", "1.5", "Line of symmetry", "A vertical line dividing an absolute value graph into mirror halves.", "For a|x-h|+k, the line is x=h.", "Absolute Value Characteristics"),
    card("piecewise", "1.6", "Piecewise function", "A function using different rules on different domain intervals.", "A delivery charge can use one rule below 10 miles and another above it.", "Piecewise Evaluation"),
    card("step", "1.6", "Step function", "A piecewise function with a constant output on each interval.", "Parking prices that jump after each hour form steps.", "Step Functions"),
    card("openclosed", "1.6", "Open and closed circles", "Open means an endpoint is excluded; closed means it is included.", "x<2 uses an open circle at 2.", "Open/Closed Endpoints")
  ];

  const randint = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = items => items[randint(0, items.length - 1)];
  const shuffled = items => [...items].sort(() => Math.random() - 0.5);
  const mc = (base, choices, answer) => ({ ...base, inputType: "choice", choices: shuffled(choices), answer: String(answer) });
  const entry = (base, answer) => ({ ...base, inputType: "text", answer: String(answer) });
  const normalize = value => String(value ?? "").toLowerCase().replace(/\s+/g, "").replace(/−/g, "-").replace(/∞/g, "infinity").replace(/∪/g, "u");
  const accepted = (question, value) => (question.accept || [question.answer]).some(answer => normalize(answer) === normalize(value));
  const base = (id, topic, concept, type, difficulty, prompt, hints, explanation, mistakeCategory) => ({ id, subject: "algebra2", unit: "1", topic, concept, type, difficulty, prompt, hints, explanation, mistakeCategory });

  const generators = {
    "1.1": [
      () => { const item = pick([{ rule: "f(x)=7", family: "Constant" }, { rule: "f(x)=x", family: "Linear" }, { rule: "f(x)=|x|", family: "Absolute value" }, { rule: "f(x)=x²", family: "Quadratic" }]); return mc(base("alg11-family", "1.1", "Function Families", "identify family", "easy", `Which parent family matches ${item.rule}?`, ["Look at the operation applied to x.", "A V suggests absolute value; a U suggests quadratic."], `${item.rule} is the ${item.family.toLowerCase()} parent rule.`, "Misidentified the parent family"), ["Constant", "Linear", "Absolute value", "Quadratic"], item.family); },
      () => { const h = randint(2, 7), right = Math.random() > .5; const expression = right ? `f(x-${h})` : `f(x+${h})`; const answer = right ? `Right ${h}` : `Left ${h}`; return mc(base("alg11-horizontal", "1.1", "Translations", "horizontal translation", "medium", `Describe the horizontal translation in g(x)=${expression}.`, ["The change is inside the function.", "Inside signs point opposite the written sign."], `${expression} shifts the graph ${answer.toLowerCase()}.`, "Horizontal translation sign reversed"), [`Right ${h}`, `Left ${h}`, `Up ${h}`, `Down ${h}`], answer); },
      () => mc(base("alg11-reflection", "1.1", "Reflections", "reflection", "easy", "What transformation changes f(x) to -f(x)?", ["The negative changes outputs.", "Changing outputs flips vertical position."], "A negative outside reflects the graph across the x-axis.", "Confused x-axis vs y-axis reflection"), ["Reflect across x-axis", "Reflect across y-axis", "Shift left 1", "Vertical stretch"], "Reflect across x-axis"),
      () => { const a = pick([2, 3, .5, .25]); const answer = a > 1 ? `Vertical stretch by ${a}` : `Vertical shrink by ${a}`; return mc(base("alg11-vscale", "1.1", "Vertical Stretches/Shrinks", "vertical scale", "medium", `Describe the scale from f(x) to g(x)=${a}f(x).`, ["The factor is outside.", "Compare the factor with 1."], `The outside factor acts directly on outputs, giving a ${answer.toLowerCase()}.`, "Confused stretch and shrink"), [`Vertical stretch by ${a}`, `Vertical shrink by ${a}`, `Horizontal stretch by ${a}`, `Horizontal shrink by ${a}`], answer); },
      () => mc(base("alg11-combined", "1.1", "Combined Transformations", "combined decoder", "hard", "Decode g(x)=-|x-3|+4.", ["Start with the absolute value parent.", "Read the negative outside, then h and k."], "The graph uses the absolute value parent, reflects across the x-axis, shifts right 3, and moves up 4.", "Missed one combined transformation"), ["Reflect x-axis; right 3; up 4", "Reflect y-axis; left 3; up 4", "Right 4; down 3", "Vertical stretch 3; up 4"], "Reflect x-axis; right 3; up 4"),
      () => mc(base("alg11-table", "1.1", "Function Families", "model family from table", "medium", "A table has x: -2,-1,0,1,2 and y: 4,1,0,1,4. Which family is most reasonable?", ["Look for symmetry around x=0.", "The outputs are squares of the inputs."], "The y-values follow y=x², so a quadratic family is reasonable.", "Misread the table pattern"), ["Constant", "Linear", "Absolute value", "Quadratic"], "Quadratic"),
      () => mc(base("alg11-domain-range", "1.1", "Parent Functions", "parent domain and range", "easy", "Which domain and range belong to f(x)=|x|?", ["The V extends left and right forever.", "Its lowest output is zero."], "The domain is all real numbers and the range is y≥0.", "Confused the domain and range"), ["Domain: all real; range: y≥0", "Domain: x≥0; range: all real", "Domain: all real; range: y=1", "Domain: x≤0; range: y≤0"], "Domain: all real; range: y≥0"),
      () => { const k=pick([-6,-4,3,5]); const direction=k>0?`Up ${k}`:`Down ${-k}`; return mc(base("alg11-vertical", "1.1", "Translations", "vertical translation", "easy", `How does g(x)=f(x)${k>0?`+${k}`:k} move f?`, ["The number is outside f.", "Outside changes move outputs vertically."], `The graph moves ${direction.toLowerCase()}.`, "Moved an outside change horizontally"), [`Up ${Math.abs(k)}`,`Down ${Math.abs(k)}`,`Left ${Math.abs(k)}`,`Right ${Math.abs(k)}`], direction); },
      () => mc(base("alg11-yreflect", "1.1", "Reflections", "input reflection", "medium", "What transformation changes f(x) to f(-x)?", ["The negative changes inputs.", "Input changes affect horizontal orientation."], "A negative inside reflects across the y-axis.", "Confused x-axis vs y-axis reflection"), ["Reflect across y-axis", "Reflect across x-axis", "Shift down 1", "Vertical shrink"], "Reflect across y-axis")
    ],
    "1.2": [
      () => { const b = pick([2, 3, 4]); return mc(base("alg12-hscale", "1.2", "Horizontal Stretches/Shrinks", "horizontal scale", "medium", `What horizontal scaling occurs in g(x)=f(${b}x)?`, ["The factor is inside.", "Use its reciprocal."], `The horizontal scale factor is 1/${b}, so the graph shrinks horizontally.`, "Forgot reciprocal for horizontal scaling"), [`Shrink by 1/${b}`, `Stretch by ${b}`, `Shrink by ${b}`, `Stretch by 1/${b}`], `Shrink by 1/${b}`); },
      () => mc(base("alg12-write", "1.2", "Writing Transformations", "write translation", "medium", "Which rule shifts f left 6 and down 2?", ["Left uses x+6 inside.", "Down subtracts 2 outside."], "g(x)=f(x+6)-2 uses the opposite inside sign and a direct outside change.", "Horizontal translation sign reversed"), ["f(x+6)-2", "f(x-6)-2", "f(x+2)-6", "f(x-2)+6"], "f(x+6)-2"),
      () => mc(base("alg12-reflect", "1.2", "Input vs Output Reflections", "input reflection", "easy", "Which rule reflects f across the y-axis?", ["A y-axis reflection changes horizontal orientation.", "Change the input sign."], "f(-x) changes input signs and reflects across the y-axis.", "Confused x-axis vs y-axis reflection"), ["-f(x)", "f(-x)", "f(x)+1", "f(x-1)"], "f(-x)"),
      () => { const scale = pick([2, 3, .5]); const value = randint(2, 8); return entry(base("alg12-table", "1.2", "Transformations from Tables", "table output scale", "medium", `At x=2, f(2)=${value}. If g(x)=${scale}f(x), what is g(2)?`, ["The input stays 2.", `Multiply the output ${value} by ${scale}.`], `g(2)=${scale}(${value})=${scale * value}.`, "Applied the scale to the input"), scale * value); },
      () => mc(base("alg12-combined", "1.2", "Order of Transformations", "combined transformations", "hard", "Decode g(x)=-2f(x-5)+1.", ["Read the outside factor first for vertical effects.", "Then read h and k."], "It reflects across the x-axis, stretches vertically by 2, shifts right 5, and up 1.", "Missed one combined transformation"), ["Reflect x-axis; vertical stretch 2; right 5; up 1", "Reflect y-axis; horizontal stretch 2; left 5; down 1", "Vertical shrink 1/2; right 1; up 5", "Right 2; down 5"], "Reflect x-axis; vertical stretch 2; right 5; up 1"),
      () => mc(base("alg12-context", "1.2", "Writing Transformations", "real-world transformation", "medium", "Revenue is R(x). Profit equals 75% of revenue minus a $240 fixed expense. Which model works?", ["75% multiplies the output.", "A fixed expense subtracts from the result."], "P(x)=0.75R(x)-240 is a vertical shrink followed by a downward translation.", "Misinterpreted a contextual transformation"), ["P(x)=0.75R(x)-240", "P(x)=R(0.75x)-240", "P(x)=1.75R(x)+240", "P(x)=R(x-240)+0.75"], "P(x)=0.75R(x)-240"),
      () => mc(base("alg12-vscale", "1.2", "Vertical Stretches/Shrinks", "vertical scale", "easy", "What does g(x)=0.25f(x) do vertically?", ["The factor is outside f.", "Compare 0.25 with 1."], "Every output becomes one fourth as large, a vertical shrink by 1/4.", "Used the inside reciprocal rule on an outside factor"), ["Shrink by 1/4", "Stretch by 4", "Horizontal shrink by 1/4", "Shift down 1/4"], "Shrink by 1/4"),
      () => mc(base("alg12-sequence", "1.2", "Order of Transformations", "stated order", "medium", "Start with f(x). First shrink vertically by 1/2, then translate up 7. Which final rule works?", ["The shrink multiplies the entire output.", "The translation is added after the shrink."], "g(x)=0.5f(x)+7 shows the two stated steps in order.", "Applied the transformations in the wrong locations"), ["0.5f(x)+7", "f(0.5x+7)", "7f(x)+0.5", "0.5f(x+7)"], "0.5f(x)+7"),
      () => mc(base("alg12-describe", "1.2", "Writing Transformations", "describe transformed rule", "hard", "Which rule reflects f across the x-axis, stretches horizontally by 3, and shifts right 2?", ["An x-axis reflection puts a negative outside.", "A horizontal stretch by 3 uses (x-2)/3 inside."], "g(x)=-f((x-2)/3) has all three changes.", "Forgot reciprocal for horizontal scaling"), ["-f((x-2)/3)", "f(-3(x+2))", "-3f(x-2)", "-f(3(x-2))"], "-f((x-2)/3)")
    ],
    "1.3": [
      () => { const m = randint(2, 6), b = randint(3, 12); return mc(base("alg13-form", "1.3", "Linear Models", "slope-intercept equation", "easy", `Which equation has slope ${m} and y-intercept ${b}?`, ["Use y=mx+b.", "Put the slope on x and the intercept by itself."], `Substitution into y=mx+b gives y=${m}x+${b}.`, "Confused slope and y-intercept"), [`y=${m}x+${b}`, `y=${b}x+${m}`, `y=${m}(x+${b})`, `y=${m + b}x`], `y=${m}x+${b}`); },
      () => { const m = randint(2, 5), x = randint(1, 4), y = randint(5, 15); return mc(base("alg13-point", "1.3", "Linear Models", "point-slope equation", "medium", `Which point-slope equation has slope ${m} and passes through (${x},${y})?`, ["Use y-y₁=m(x-x₁).", "Both coordinate signs appear as subtraction."], `The correct setup is y-${y}=${m}(x-${x}).`, "Used the wrong point-slope signs"), [`y-${y}=${m}(x-${x})`, `y+${y}=${m}(x+${x})`, `y-${x}=${m}(x-${y})`, `y=${x}x+${y}`], `y-${y}=${m}(x-${x})`); },
      () => { const x1=randint(0,3), x2=x1+pick([2,3,4]), m=pick([2,3,-2]), y1=randint(1,7), y2=y1+m*(x2-x1); return entry(base("alg13-slope", "1.3", "Slope & Intercepts", "slope from two points", "medium", `Find the slope through (${x1},${y1}) and (${x2},${y2}).`, ["Use (y₂-y₁)/(x₂-x₁).", `Compute (${y2}-${y1})/(${x2}-${x1}).`], `m=(${y2}-${y1})/(${x2}-${x1})=${m}.`, "Incorrect slope calculation"), m); },
      () => mc(base("alg13-interpret", "1.3", "Slope & Intercepts", "interpret slope", "easy", "A taxi model is C(m)=2.4m+5. What does 2.4 mean?", ["It multiplies miles m.", "Slope is output change per one input unit."], "The trip cost rises $2.40 for each mile.", "Confused slope and y-intercept"), ["$2.40 per mile", "$5 per mile", "The initial fee is $2.40", "The trip lasts 2.4 minutes"], "$2.40 per mile"),
      () => entry(base("alg13-intersection", "1.3", "Comparing Linear Models", "model intersection", "hard", "Plans cost A(x)=3x+18 and B(x)=5x+8. At what x are the costs equal?", ["Set A(x)=B(x).", "Solve 3x+18=5x+8.", "Subtract 3x and add 8."], "3x+18=5x+8 gives 10=2x, so x=5.", "Did not set the models equal"), 5),
      () => { const m=pick([1.5,2,2.5]), b=pick([3,4,6]), x=pick([6,8,10]); return entry(base("alg13-regression", "1.3", "Linear Regression", "regression prediction", "medium", `A regression model is y=${m}x+${b}. Predict y when x=${x}.`, ["Substitute the given x.", `Compute ${m}(${x})+${b}.`], `The prediction is ${m*x+b}.`, "Substitution error in regression model"), m*x+b); },
      () => mc(base("alg13-intercept", "1.3", "Slope & Intercepts", "interpret intercept", "easy", "A water tank model is V(t)=-4t+68. What does 68 mean?", ["The y-intercept is the output at t=0.", "Connect V to volume and t to elapsed time."], "The tank begins with 68 units of water.", "Confused slope and y-intercept"), ["Initial volume is 68", "It drains 68 per minute", "It empties after 68 minutes", "The initial time is 4"], "Initial volume is 68"),
      () => mc(base("alg13-compare", "1.3", "Comparing Linear Models", "compare slopes", "medium", "Model A is y=4x+9. Model B has x: 0,2,4 and y: 12,18,24. Which grows faster?", ["Find Model B's rate from the table.", "Its slope is (18-12)/(2-0)."], "Model B has slope 3, while Model A has slope 4, so A grows faster.", "Compared intercepts instead of slopes"), ["Model A", "Model B", "They grow equally", "Not enough information"], "Model A"),
      () => mc(base("alg13-fit", "1.3", "Lines of Fit", "line of fit", "medium", "When drawing a reasonable line of fit, which approach is best?", ["The line models the overall trend.", "Think about balance rather than connecting dots."], "Aim for roughly balanced points above and below, then choose two points on the fitted line.", "Treated a line of fit like connect-the-dots"), ["Balance points above and below", "Connect every data point", "Force the line through the origin", "Use the two farthest data points only"], "Balance points above and below")
    ],
    "1.4": [
      () => { const c=randint(3,8); return mc(base("alg14-and", "1.4", "AND vs OR", "less-than inequality", "easy", `Which statement is equivalent to |x|<${c}?`, ["Less than means within the distance.", "Within means between, joined by AND."], `-${c}<x<${c}.`, "Used OR instead of AND"), [`-${c}<x<${c}`, `x<-${c} or x>${c}`, `x>${c}`, `x<${c}`], `-${c}<x<${c}`); },
      () => { const c=randint(2,7); return mc(base("alg14-or", "1.4", "AND vs OR", "greater-than inequality", "easy", `Which statement is equivalent to |x|>${c}?`, ["Greater than means farther than the boundary.", "Farther means outside, joined by OR."], `x<-${c} or x>${c}.`, "Used AND instead of OR"), [`x<-${c} or x>${c}`, `-${c}<x<${c}`, `x>${c} and x<-${c}`, `x<${c}`], `x<-${c} or x>${c}`); },
      () => entry({ ...base("alg14-isolate", "1.4", "Absolute Value Inequalities", "isolate then solve", "hard", "Solve 2|x-1|+3≤11. Give interval notation.", ["Subtract 3 before splitting.", "Divide by 2: |x-1|≤4.", "Write -4≤x-1≤4, then add 1."], "The solution is -3≤x≤5, or [-3,5].", "Forgot to isolate absolute value"), accept:["[-3,5]","-3≤x≤5","-3<=x<=5"] }, "[-3,5]"),
      () => mc(base("alg14-special-none", "1.4", "Special Cases", "no solution", "medium", "Solve |3x+2|<-1.", ["Absolute value is a distance.", "Can a nonnegative distance be less than -1?"], "No absolute value can be negative, so there is no solution.", "Missed absolute-value special case"), ["No solution", "All real numbers", "x<-1", "x>-1"], "No solution"),
      () => mc(base("alg14-special-all", "1.4", "Special Cases", "all real numbers", "medium", "Solve |2x-7|≥-4.", ["Absolute value is always at least zero.", "Every nonnegative number is greater than or equal to -4."], "The statement is true for every real x.", "Missed absolute-value special case"), ["All real numbers", "No solution", "x≥-4", "x≤-4"], "All real numbers"),
      () => mc(base("alg14-interval", "1.4", "Interval Notation", "interval conversion", "medium", "Write x≤-2 or x>5 in interval notation.", ["Use a union for two outside pieces.", "Include -2 with a bracket; exclude 5 with a parenthesis."], "The interval is (-∞,-2]∪(5,∞).", "Used incorrect open/closed endpoint"), ["(-∞,-2]∪(5,∞)", "[-2,5)", "(-∞,-2)∪[5,∞)", "[-2,∞)"], "(-∞,-2]∪(5,∞)"),
      () => mc(base("alg14-deviation", "1.4", "Absolute Deviation", "deviation model", "medium", "A temperature must stay within 1.5°C of 22°C. Which inequality models this?", ["Use distance from the center 22.", "Within means less than or equal to the tolerance."], "|t-22|≤1.5 models the allowed deviation.", "Built the deviation model incorrectly"), ["|t-22|≤1.5", "|t+22|≥1.5", "|t-1.5|≤22", "|t-22|>1.5"], "|t-22|≤1.5"),
      () => mc(base("alg14-bounded", "1.4", "Interval Notation", "bounded versus unbounded", "easy", "Which interval is bounded?", ["A bounded interval has two finite endpoints.", "Infinity signals an unbounded direction."], "[-3,8) has two finite endpoints, so it is bounded.", "Confused bounded and unbounded intervals"), ["[-3,8)", "(4,∞)", "(-∞,2]", "(-∞,∞)"], "[-3,8)"),
      () => mc(base("alg14-numberline", "1.4", "Interval Notation", "number line endpoints", "medium", "A number line is shaded between -5 and 2, closed at -5 and open at 2. Which interval matches?", ["Closed means included and uses a bracket.", "Open means excluded and uses a parenthesis."], "The interval is [-5,2).", "Used incorrect open/closed endpoint"), ["[-5,2)", "(-5,2]", "[-5,2]", "(-∞,-5]∪(2,∞)"], "[-5,2)"),
      () => entry({ ...base("alg14-greater-solve", "1.4", "Absolute Value Inequalities", "solve greater inequality", "hard", "Solve |x+2|≥5. Give inequality form.", ["Greater than means outside and OR.", "Write x+2≤-5 OR x+2≥5.", "Subtract 2 in both parts."], "The solution is x≤-7 or x≥3.", "Used AND instead of OR"), accept:["x≤-7orx≥3","x<=-7orx>=3","x≥3orx≤-7","x>=3orx<=-7"] }, "x≤-7 or x≥3")
    ],
    "1.5": [
      () => { const h=randint(-5,5), k=randint(-4,7), inside=h<0?`x+${-h}`:`x-${h}`; return mc(base("alg15-vertex", "1.5", "Absolute Value Vertex Form", "vertex from equation", "easy", `What is the vertex of y=2|${inside}|${k<0?k:`+${k}`}?`, ["Compare with a|x-h|+k.", "The inside sign is opposite h; k is direct."], `The vertex is (${h},${k}).`, "Reversed the vertex sign"), [`(${h},${k})`, `(${-h},${k})`, `(${h},${-k})`, `(2,${k})`], `(${h},${k})`); },
      () => mc(base("alg15-opening", "1.5", "Absolute Value Characteristics", "opening and width", "easy", "Describe y=-0.5|x+2|+6 compared with y=|x|.", ["The sign of a controls opening.", "Compare |a|=0.5 with 1."], "It opens downward and is wider because it is vertically shrunk by 0.5.", "Misread the role of a"), ["Opens down and wider", "Opens up and narrower", "Opens down and narrower", "Opens up and wider"], "Opens down and wider"),
      () => mc(base("alg15-range", "1.5", "Absolute Value Characteristics", "range", "medium", "What is the range of y=3|x-1|-4?", ["Find the vertex y-value.", "The graph opens upward, so the vertex is a minimum."], "The minimum output is -4, so y≥-4.", "Used the wrong range direction"), ["y≥-4", "y≤-4", "y≥1", "All real numbers"], "y≥-4"),
      () => mc(base("alg15-behavior", "1.5", "Increasing/Decreasing", "behavior intervals", "medium", "For y=|x-5|+1, where is the graph decreasing?", ["The turning point is x=5.", "An upward V decreases before its vertex."], "It decreases on (-∞,5).", "Reversed increasing and decreasing intervals"), ["(-∞,5)", "(5,∞)", "(-∞,1)", "All real numbers"], "(-∞,5)"),
      () => mc(base("alg15-end", "1.5", "End Behavior", "end behavior", "medium", "What is the end behavior of y=-2|x|+3?", ["The graph opens downward.", "Both arms fall as |x| grows."], "As x→∞ or x→-∞, y→-∞.", "Misread absolute-value end behavior"), ["As x→±∞, y→-∞", "As x→±∞, y→∞", "As x→∞, y→∞ only", "y approaches 3"], "As x→±∞, y→-∞"),
      () => mc(base("alg15-context", "1.5", "Absolute Value Models", "context vertex", "medium", "A model C(t)=4|t-6|+12 gives cost based on hours from a target time. What does (6,12) mean?", ["The vertex occurs when t=6.", "Because a>0, the vertex is a minimum."], "At 6 hours, the minimum modeled cost is $12.", "Misinterpreted the vertex in context"), ["At 6 hours, minimum cost is $12", "At 12 hours, cost is $6", "Cost rises $6 each hour", "The maximum cost is $12"], "At 6 hours, minimum cost is $12"),
      () => mc(base("alg15-write", "1.5", "Absolute Value Vertex Form", "equation from vertex", "medium", "Which equation has vertex (-3,4), opens downward, and is vertically stretched by 2?", ["Use a|x-h|+k.", "h=-3 creates x+3; downward makes a negative."], "y=-2|x+3|+4 has the stated vertex and opening.", "Reversed the vertex sign"), ["y=-2|x+3|+4", "y=2|x-3|-4", "y=-2|x-3|+4", "y=2|x+3|+4"], "y=-2|x+3|+4"),
      () => mc(base("alg15-intercepts", "1.5", "Absolute Value Characteristics", "x intercepts", "hard", "What are the x-intercepts of y=|x-2|-5?", ["Set y=0.", "Solve |x-2|=5 using two cases."], "x-2=±5, so x=-3 or x=7.", "Solved only one absolute-value case"), ["-3 and 7", "2 and 5", "-7 and 3", "No x-intercepts"], "-3 and 7"),
      () => mc(base("alg15-sign", "1.5", "Positive/Negative Intervals", "positive interval", "hard", "For y=|x|-4, where is the function positive?", ["Positive means above the x-axis.", "Solve |x|-4>0, or |x|>4."], "The graph is above the x-axis for x<-4 or x>4.", "Used the between region for a greater-than inequality"), ["x<-4 or x>4", "-4<x<4", "x≤-4 or x≥4", "All real numbers"], "x<-4 or x>4")
    ],
    "1.6": [
      () => { const x=pick([-4,-2,0,3,5]), first=x<1, answer=first?x+4:2*x-1; return entry(base("alg16-evaluate", "1.6", "Piecewise Evaluation", "evaluate piecewise", "medium", `For f(x)={x+4 if x<1; 2x-1 if x≥1}, find f(${x}).`, ["Test the input against x<1 and x≥1.", `Use the ${first?"first":"second"} rule.`, first?`Compute ${x}+4.`:`Compute 2(${x})-1.`], `The correct condition selects ${first?"x+4":"2x-1"}, giving ${answer}.`, "Used wrong piece of piecewise function"), answer); },
      () => mc(base("alg16-endpoint", "1.6", "Open/Closed Endpoints", "endpoint type", "easy", "A piece is defined for x<3. How should its endpoint at x=3 be drawn?", ["The inequality is strict.", "Strict inequalities do not include the endpoint."], "Use an open circle at x=3.", "Used closed endpoint instead of open"), ["Open circle", "Closed circle", "No endpoint", "Vertical line"], "Open circle"),
      () => mc(base("alg16-rule", "1.6", "Piecewise Evaluation", "choose correct piece", "easy", "Which condition contains x=-1 in {3x if x≤-1; x+2 if x>-1}?", ["Test equality carefully.", "The first condition includes -1 because it uses ≤."], "x≤-1 is the correct condition.", "Used wrong piece of piecewise function"), ["x≤-1", "x>-1", "Both pieces", "Neither piece"], "x≤-1"),
      () => mc(base("alg16-step", "1.6", "Step Functions", "step model", "medium", "A garage charges $6 for up to 1 hour, $10 for over 1 up to 2 hours, and $14 for over 2 up to 3 hours. What type of model fits?", ["The output stays constant within each time interval.", "Then it jumps at the boundary."], "A step function fits the tiered prices.", "Did not recognize a step function"), ["Step function", "Linear function", "Quadratic function", "Absolute value function"], "Step function"),
      () => mc(base("alg16-abs", "1.6", "Absolute Value as Piecewise", "absolute to piecewise", "hard", "Which piecewise form equals |x-3|?", ["Split where x-3=0.", "For x<3, negate x-3; for x≥3, keep it."], "|x-3|=3-x for x<3 and x-3 for x≥3.", "Split absolute value at wrong boundary"), ["3-x if x<3; x-3 if x≥3", "x-3 for all x", "-x-3 if x<0; x+3 if x≥0", "x+3 if x<3; 3-x if x≥3"], "3-x if x<3; x-3 if x≥3"),
      () => mc(base("alg16-domain", "1.6", "Piecewise Domain/Range", "domain", "medium", "A piecewise graph has rules for x<-2, -2≤x<4, and x≥4. What is its domain?", ["Combine all three input intervals.", "Check whether any x-values are missing."], "The intervals cover every real number.", "Combined piecewise domains incorrectly"), ["All real numbers", "[-2,4)", "x<-2 only", "(-∞,4)"], "All real numbers"),
      () => mc(base("alg16-range", "1.6", "Piecewise Domain/Range", "range", "medium", "A step function outputs only 5, 9, and 13 across its domain. What is its range?", ["Range lists possible outputs.", "Do not include every value between separate steps."], "The range is {5,9,13}.", "Included outputs the step function never reaches"), ["{5,9,13}", "[5,13]", "All real numbers", "{1,2,3}"], "{5,9,13}"),
      () => mc(base("alg16-from-graph", "1.6", "Piecewise Graphing", "write from graph", "hard", "A graph shows y=x+1 for x<2 with an open circle, and y=6 for x≥2 with a closed circle. Which piecewise rule matches?", ["Match each graph rule to its interval.", "Open at 2 uses <; closed at 2 uses ≥."], "The first rule is x+1 for x<2 and the second is 6 for x≥2.", "Used incorrect open/closed endpoint"), ["x+1 if x<2; 6 if x≥2", "x+1 if x≤2; 6 if x>2", "6 if x<2; x+1 if x≥2", "x+1 for all x"], "x+1 if x<2; 6 if x≥2"),
      () => mc(base("alg16-step-context", "1.6", "Step Functions", "real-world step function", "medium", "A delivery fee is $8 for up to 3 miles and $12 for over 3 through 6 miles. What is the fee at exactly 3 miles?", ["Find which interval includes equality at 3.", "‘Up to 3’ includes the boundary."], "Exactly 3 miles uses the first step, so the fee is $8.", "Used wrong piece of piecewise function"), ["$8", "$12", "$20", "Not defined"], "$8")
    ]
  };

  const generate = (topic, options = {}) => {
    const pool = generators[topic] || Object.values(generators).flat();
    const preferred = options.concept ? pool.filter(factory => factory().concept === options.concept) : pool;
    const question = pick(preferred.length ? preferred : pool)();
    const hints = question.hints.length >= 3 ? question.hints : [...question.hints, "Write the relevant rule with the given values, then simplify one operation at a time."];
    return { ...question, hints, generatedAt: Date.now(), check(value) { return accepted(question, value); } };
  };

  const chapter1 = {
    id: "algebra2-chapter1",
    subjectKey: "algebra2",
    subject: "Algebra 2 Honors",
    title: "Chapter 1 — Functions and Transformations",
    topics: sections,
    sections,
    vocabulary: flashcards,
    termsForTopic(id) { return flashcards.filter(item => item.topic === id); },
    section(id) { return sections.find(item => item.id === id); }
  };

  globalThis.ALGEBRA2_CHAPTER1 = {
    subjectKey: "algebra2",
    title: "Algebra 2 Honors",
    chapter1,
    sections,
    flashcards,
    generatorTypes: Object.fromEntries(Object.entries(generators).map(([id, list]) => [id, list.length])),
    generate,
    generateSet(topic, count = 10, options = {}) { return Array.from({ length: count }, () => generate(topic, options)); },
    section(id) { return sections.find(item => item.id === id); },
    termsForTopic(id) { return flashcards.filter(item => item.topic === id); }
  };
})();
