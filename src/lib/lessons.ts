import type { Lesson } from "./types";

export const lessons: Lesson[] = [
  {
    id: "inheritance",
    title: "Patterns of inheritance",
    subtitle: "Predict a pattern without predicting an individual.",
    subject: "Biology",
    grade: 10,
    chapter: "Heredity",
    minutes: 30,
    version: 1,
    objective:
      "Use a monohybrid cross to distinguish genotype from phenotype and interpret expected ratios as probabilities.",
    prerequisites: [
      "Cells, chromosomes, and genes",
      "Fractions and simple probability",
      "Sexual reproduction and gametes",
    ],
    contexts: [
      {
        interest: "Nature",
        title: "A pattern in a garden",
        story:
          "In a simplified pea-plant model, T is a dominant allele for tall stems and t is recessive. Two Tt plants are crossed.",
        decision:
          "Could two tall plants produce a short offspring? How often would you expect it?",
        connection:
          "Each parent contributes one allele through a gamete. Combining the possible gametes reveals the inheritance pattern.",
        boundary:
          "This model assumes a single autosomal gene, complete dominance, equal gamete probabilities, and no viability differences. Many real traits are influenced by several genes and the environment.",
      },
      {
        interest: "Gaming",
        title: "Design an inheritance system",
        story:
          "You are modelling plant breeding in a simulation game. A single gene has alleles T and t, with T completely dominant.",
        decision:
          "How should the game sample offspring so that its results follow the genetic model?",
        connection:
          "Sampling one allele from each parent reproduces the probabilities in a Punnett square.",
        boundary:
          "A designed one-gene game system represents a narrow biological model. It cannot explain every real inherited trait.",
      },
    ],
    concept: {
      title: "Separate the alleles from the appearance",
      paragraphs: [
        "A genotype describes the alleles at a locus: TT, Tt, or tt in this model. A phenotype is an observable characteristic. With complete dominance, TT and Tt have the dominant phenotype, while tt has the recessive phenotype.",
        "A heterozygous Tt parent produces gametes carrying T or t with equal probability. Fertilisation combines one gamete from each parent. A Punnett square lists the possible combinations; its boxes do not represent a compulsory order of births.",
        "For Tt × Tt, the four equally likely combinations are TT, Tt, tT, and tt. Tt and tT describe the same genotype. The genotype ratio is 1:2:1, and the expected phenotype ratio is 3:1.",
        "Probabilities describe long-run expectations. Four offspring need not include exactly one recessive individual. Under independent inheritance events, the probability for the next offspring is unchanged by earlier outcomes.",
      ],
      formula: "P(TT)=\\frac14,\\quad P(Tt)=\\frac12,\\quad P(tt)=\\frac14",
      terms:
        "T: dominant allele · t: recessive allele · Tt: heterozygous genotype",
    },
    worked: {
      problem:
        "For Tt × Tt, find the probability of a recessive phenotype and its expected count among 80 offspring.",
      steps: [
        "Each parent contributes t with probability 1/2.",
        "A recessive phenotype requires tt: (1/2) × (1/2) = 1/4.",
        "The expected count is 80 × 1/4 = 20.",
        "The actual count can differ from 20 because offspring outcomes are sampled, not scheduled.",
      ],
      answer:
        "Probability 1/4; expected count 20. Neither is a guarantee about a particular family.",
    },
    simulation: "inheritance",
    extension:
      "Further objectives include test crosses, dihybrid inheritance, incomplete dominance, codominance, and molecular explanations. These require their own prerequisites, reviewed lessons, and NEET-oriented question banks.",
    questions: [
      {
        id: "gene-d",
        kind: "diagnostic",
        prompt:
          "A Tt parent produces T and t gametes with equal probability. What is the probability that one randomly chosen gamete carries t? Enter a fraction or decimal.",
        answer: 0.5,
        tolerance: 0.0001,
        hint: "There are two equally likely allele choices.",
        explanation:
          "One of the two equally likely possibilities is t, so the probability is 1/2.",
      },
      {
        id: "gene-g",
        kind: "guided",
        prompt:
          "For Tt × Tt, what is the probability of a tt offspring under the stated model?",
        answer: 0.25,
        tolerance: 0.0001,
        hint: "Each parent contributes t with probability 1/2. Multiply the independent probabilities.",
        explanation: "P(tt) = 1/2 × 1/2 = 1/4.",
      },
      {
        id: "gene-i1",
        kind: "independent",
        prompt:
          "For Tt × Tt, what fraction of offspring are expected to have the dominant phenotype under complete dominance?",
        answer: 0.75,
        tolerance: 0.0001,
        hint: "Both TT and Tt express the dominant phenotype.",
        explanation:
          "TT has probability 1/4 and Tt has probability 1/2. Their sum is 3/4.",
      },
      {
        id: "gene-i2",
        kind: "independent",
        prompt:
          "Two Tt parents have already produced three offspring with the dominant phenotype. What is the probability the next offspring is tt, assuming independent events?",
        answer: 0.25,
        tolerance: 0.0001,
        hint: "Previous outcomes do not change the parents' gamete probabilities.",
        explanation:
          "The probability remains 1/4. A 3:1 expected ratio does not enforce an order of offspring.",
      },
      {
        id: "gene-t",
        kind: "transfer",
        prompt:
          "In a different single-gene system, a heterozygous Bb organism is crossed with bb. Assuming complete dominance and equal gamete probabilities, what fraction of offspring are expected to be bb?",
        answer: 0.5,
        tolerance: 0.0001,
        hint: "The bb parent always contributes b; the Bb parent contributes b half the time.",
        explanation: "P(bb) = 1 × 1/2 = 1/2. This is a test-cross pattern.",
      },
      {
        id: "gene-r",
        kind: "delayed",
        prompt:
          "Under the same single-gene model, TT is crossed with tt. What fraction of offspring are heterozygous?",
        answer: 1,
        tolerance: 0.0001,
        hint: "One parent always contributes T and the other always contributes t.",
        explanation: "All offspring are Tt, so the fraction is 1 (100%).",
      },
    ],
  },
  {
    id: "proportions",
    title: "Ratios & proportional reasoning",
    subtitle: "When one quantity changes, what must stay the same?",
    subject: "Mathematics",
    grade: 8,
    chapter: "Comparing quantities",
    minutes: 25,
    version: 1,
    objective:
      "Recognise direct proportion, preserve a ratio, and explain when a proportional model fails.",
    prerequisites: [
      "Multiplication and division",
      "Fractions and equivalent fractions",
      "Units of measurement",
    ],
    contexts: [
      {
        interest: "Cooking",
        title: "A recipe for a bigger table",
        story:
          "A recipe uses 300 g of flour for 4 servings. You are preparing 10 servings with the same portion size and ingredient balance.",
        decision:
          "How much flour should you use, and what else needs to scale?",
        connection:
          "Keeping the amount per serving constant creates a direct proportion.",
        boundary:
          "Ingredient amounts can scale proportionally. Cooking time, heat transfer, and pan dimensions do not necessarily scale the same way.",
      },
      {
        interest: "Design",
        title: "One design. Different dimensions.",
        story:
          "A printed design is 4 cm wide and 3 cm tall. A client needs a version 10 cm wide without distortion.",
        decision: "Which height preserves the shape?",
        connection: "Uniform scaling preserves the width-to-height ratio.",
        boundary:
          "Lengths scale by the same factor; areas scale by its square. Do not apply a length factor directly to area.",
      },
      {
        interest: "Business",
        title: "Price a larger order",
        story:
          "Four identical notebooks cost ₹300. A supplier quotes the same per-unit price for an order of ten.",
        decision: "What should the order cost?",
        connection:
          "A fixed unit price makes total cost proportional to quantity.",
        boundary:
          "A delivery charge or bulk discount changes the model. The unit-price assumption must be checked.",
      },
    ],
    concept: {
      title: "Find the invariant",
      paragraphs: [
        "Two positive quantities are in direct proportion when their ratio stays constant. If y is proportional to x, then y = kx, where k is the amount of y for one unit of x.",
        "Dividing both quantities by the same nonzero number preserves their ratio. Multiplying both quantities by a scale factor does the same. You can solve by finding the unit rate or by using equivalent ratios.",
        "A graph of y = kx is a straight line through the origin. A straight line with a nonzero intercept is not direct proportion. Always check the relationship before using a proportional shortcut.",
      ],
      formula:
        "y = kx, \\qquad k=\\frac{y_1}{x_1}, \\qquad y_2=y_1\\frac{x_2}{x_1}",
      terms: "x: number of units · y: total amount · k: amount per unit",
    },
    worked: {
      problem:
        "A recipe uses 300 g of flour for 4 servings. Find the flour for 10 equal servings.",
      steps: [
        "Identify the invariant: flour per serving is constant.",
        "Find the unit rate: 300 ÷ 4 = 75 g per serving.",
        "Scale to the required servings: 75 × 10 = 750 g.",
        "Check: 750 ÷ 10 = 75, the same ratio as 300 ÷ 4.",
      ],
      answer:
        "750 g of flour. This calculation does not determine the cooking time.",
    },
    simulation: "ratio",
    extension:
      "Extend proportional reasoning to similar figures, unit conversion, mixture calculations, and dimensional checks. These connections are foundations, not a claim of complete entrance-exam preparation.",
    questions: [
      {
        id: "ratio-d",
        kind: "diagnostic",
        prompt:
          "Four identical packets weigh 300 g altogether. What does one packet weigh?",
        unit: "g",
        answer: 75,
        tolerance: 0.001,
        hint: "Divide the total mass equally among the four packets.",
        explanation: "300 ÷ 4 = 75 g. This is the unit rate.",
      },
      {
        id: "ratio-g",
        kind: "guided",
        prompt:
          "A recipe needs 300 g of flour for 4 servings. How much is needed for 6 servings?",
        unit: "g",
        answer: 450,
        tolerance: 0.001,
        hint: "Find grams per serving, then multiply by six.",
        explanation:
          "The unit rate is 75 g per serving. Six servings need 6 × 75 = 450 g.",
      },
      {
        id: "ratio-i1",
        kind: "independent",
        prompt:
          "A scale drawing is 6 cm wide and 4 cm tall. Its width becomes 15 cm. Find its height if the shape is preserved.",
        unit: "cm",
        answer: 10,
        tolerance: 0.001,
        hint: "The width scale factor is 15 ÷ 6. Apply it to the height.",
        explanation:
          "The scale factor is 2.5, so the height is 4 × 2.5 = 10 cm.",
      },
      {
        id: "ratio-i2",
        kind: "independent",
        prompt:
          "A service costs C = 40 + 5n rupees for n items. Find C/n when n = 10. Compare this mentally with C/n at n = 5: is the relationship proportional?",
        unit: "rupees/item",
        answer: 9,
        tolerance: 0.001,
        hint: "First calculate C at n = 10, then divide by 10. A fixed fee changes the unit cost.",
        explanation:
          "C = 90 and C/n = 9. At n = 5, C/n = 13. The ratio changes, so this is not direct proportion.",
      },
      {
        id: "ratio-t",
        kind: "transfer",
        prompt:
          "A machine produces 84 identical parts in 7 minutes at a constant rate. How long will 180 parts take?",
        unit: "minutes",
        answer: 15,
        tolerance: 0.001,
        hint: "Find parts per minute, then divide the target count by that rate.",
        explanation:
          "The rate is 84 ÷ 7 = 12 parts/min. The required time is 180 ÷ 12 = 15 min.",
      },
      {
        id: "ratio-r",
        kind: "delayed",
        prompt:
          "A map scale represents 18 km by 3 cm. What actual distance is represented by 8.5 cm?",
        unit: "km",
        answer: 51,
        tolerance: 0.001,
        hint: "Work out the distance represented by one centimetre.",
        explanation:
          "Each centimetre represents 6 km. Therefore 8.5 × 6 = 51 km.",
      },
    ],
  },
  {
    id: "projectiles",
    title: "Projectile motion",
    subtitle: "One trajectory. Two independent components.",
    subject: "Physics",
    grade: 11,
    chapter: "Motion in a plane",
    minutes: 35,
    version: 1,
    objective:
      "Resolve initial velocity, model horizontal and vertical motion, and state the conditions for the range formula.",
    prerequisites: [
      "Vectors and components",
      "Basic trigonometry",
      "Constant-acceleration equations",
    ],
    contexts: [
      {
        interest: "Cricket",
        title: "Read the flight of a ball",
        story:
          "A ball leaves the bat at 20 m/s. Change its launch angle and investigate its ideal flight before it returns to launch height.",
        decision:
          "Which angle gives the greatest horizontal range in this model?",
        connection:
          "The ball's initial velocity splits into horizontal and vertical components, linked by one flight time.",
        boundary:
          "The model ignores air resistance, spin and wind. Real cricket trajectories can differ, and landing at a different height changes the range formula.",
      },
      {
        interest: "Gaming",
        title: "Build a believable trajectory",
        story:
          "You are designing a game's projectile system with a constant downward acceleration of 10 m/s² and a launch speed of 20 m/s.",
        decision:
          "How can two different launch angles reach the same horizontal target?",
        connection:
          "The trajectory can be calculated from independent component equations.",
        boundary:
          "This is a constant-gravity point-particle model. It does not include drag, moving targets, collision geometry, or custom game physics.",
      },
      {
        interest: "Robotics",
        title: "Plan a launcher",
        story:
          "A simulated robot releases a ball at 20 m/s toward a receiver at the same height.",
        decision:
          "Choose an angle and predict where the receiver should be placed.",
        connection:
          "The receiver position follows from the shared time of horizontal and vertical motion.",
        boundary:
          "This is a simulation. The model omits launcher mechanics, drag, and engineering tolerances.",
      },
    ],
    concept: {
      title: "Separate the motion, keep the time",
      paragraphs: [
        "Resolve the initial velocity u into u cos θ horizontally and u sin θ vertically. Neglecting air resistance, horizontal acceleration is zero while vertical acceleration is −g.",
        "Use x = u cos θ · t and y = u sin θ · t − ½gt², measuring displacement from the launch point. Both equations describe the same time t.",
        "For a landing at launch height, put y = 0 and select the nonzero time: T = 2u sin θ / g. Substitute this into x to obtain R = u² sin(2θ) / g. At fixed speed, sin(2θ) is largest at θ = 45°.",
        "At the highest point, vertical velocity is zero, but horizontal velocity and downward acceleration remain. For different landing heights, solve the vertical equation instead of using the equal-height range formula.",
      ],
      formula:
        "x=u\\cos\\theta\\,t,\\quad y=u\\sin\\theta\\,t-\\frac{gt^2}{2},\\quad R=\\frac{u^2\\sin(2\\theta)}{g}",
      terms:
        "u: initial speed (m/s) · θ: launch angle · g: downward acceleration (m/s²)",
    },
    worked: {
      problem:
        "A projectile launches at 20 m/s and 30°. Take g = 10 m/s² and equal launch and landing heights. Find its flight time.",
      steps: [
        "Find the vertical component: 20 sin 30° = 10 m/s.",
        "Write 0 = 10t − 5t² for the return to launch height.",
        "Factor: 5t(2 − t) = 0. The roots are 0 and 2 seconds.",
        "Discard t = 0 (launch). Flight time is 2 s. Horizontal motion continues throughout.",
      ],
      answer: "T = 2 s. The horizontal range is 20 cos 30° × 2 = 20√3 m.",
    },
    simulation: "projectile",
    extension:
      "Next objectives include unequal launch and landing heights, trajectory equations, complementary angles, and multi-step constraints. Those extensions need additional reviewed lessons and question banks.",
    questions: [
      {
        id: "projectile-d",
        kind: "diagnostic",
        prompt:
          "A vector of magnitude 20 m/s makes 30° with the horizontal. Given sin 30° = 0.5, find its vertical component.",
        unit: "m/s",
        answer: 10,
        tolerance: 0.01,
        hint: "Multiply the magnitude by the sine of the angle.",
        explanation: "uᵧ = u sin θ = 20 × 0.5 = 10 m/s.",
      },
      {
        id: "projectile-g",
        kind: "guided",
        prompt:
          "A projectile has initial vertical velocity 15 m/s. With g = 10 m/s², how long does it take to reach its highest point?",
        unit: "s",
        answer: 1.5,
        tolerance: 0.001,
        hint: "At the top, vᵧ = 0. Use vᵧ = uᵧ − gt.",
        explanation:
          "0 = 15 − 10t, so t = 1.5 s. Acceleration is still downward.",
      },
      {
        id: "projectile-i1",
        kind: "independent",
        prompt:
          "A projectile launches at 10 m/s at 45° and returns to its launch height. With g = 10 m/s², calculate its range.",
        unit: "m",
        answer: 10,
        tolerance: 0.01,
        hint: "Use R = u² sin(2θ)/g. Here sin 90° = 1.",
        explanation:
          "R = 100 × 1 ÷ 10 = 10 m. The equal-height assumption is essential.",
      },
      {
        id: "projectile-i2",
        kind: "independent",
        prompt:
          "At a projectile's highest point, what is the magnitude of its acceleration? Ignore air resistance and take g = 10 m/s².",
        unit: "m/s²",
        answer: 10,
        tolerance: 0.001,
        hint: "Zero vertical velocity at an instant does not mean zero acceleration.",
        explanation:
          "Gravity acts throughout the flight. The acceleration has magnitude 10 m/s² downward.",
      },
      {
        id: "projectile-t",
        kind: "transfer",
        prompt:
          "A particle leaves a horizontal ledge at 8 m/s. The ground is 20 m below. With g = 10 m/s² and no drag, how far horizontally does it travel before hitting the ground?",
        unit: "m",
        answer: 16,
        tolerance: 0.01,
        hint: "Solve 20 = ½gt² first, then use x = 8t. The equal-height range formula does not apply.",
        explanation:
          "20 = 5t² gives t = 2 s. Horizontal displacement is 8 × 2 = 16 m.",
      },
      {
        id: "projectile-r",
        kind: "delayed",
        prompt:
          "A projectile has horizontal velocity 12 m/s and initial vertical velocity 10 m/s. It lands at launch height. With g = 10 m/s², find the horizontal range.",
        unit: "m",
        answer: 24,
        tolerance: 0.01,
        hint: "Find the total flight time from vertical motion, then multiply by horizontal speed.",
        explanation: "T = 2 × 10 ÷ 10 = 2 s; R = 12 × 2 = 24 m.",
      },
    ],
  },
  {
    id: "stoichiometry",
    title: "Moles & reaction ratios",
    subtitle: "Count particles through a balanced equation.",
    subject: "Chemistry",
    grade: 11,
    chapter: "Basic concepts of chemistry",
    minutes: 30,
    version: 1,
    objective:
      "Interpret balanced coefficients as mole ratios and distinguish amount ratios from mass ratios.",
    prerequisites: [
      "Balanced chemical equations",
      "Proportions",
      "Molar mass and units",
    ],
    contexts: [
      {
        interest: "Cooking",
        title: "The chemistry behind a rising batter",
        story:
          "In a simplified acid–bicarbonate reaction, one mole of hydrogen carbonate reacts with one mole of hydrogen ions to produce one mole of carbon dioxide.",
        decision: "How much CO₂ can form when one reactant runs out first?",
        connection:
          "Gas production follows the balanced reaction HCO₃⁻ + H⁺ → CO₂ + H₂O, not the mass ratio of recipe ingredients.",
        boundary:
          "Actual batter chemistry, gas retention, temperature, and leavening mixtures are more complex. This is a conceptual simulation, not a cooking prediction or experimental procedure.",
      },
      {
        interest: "Space",
        title: "Account for reaction products",
        story:
          "An idealised reaction model uses 2H₂ + O₂ → 2H₂O to track the amounts of reactants and products.",
        decision: "Which reactant limits the amount of water that can form?",
        connection:
          "Balanced coefficients determine mole ratios and make material accounting possible.",
        boundary:
          "This is a symbolic model only. It does not specify fuel handling, ignition, reaction conditions, or propulsion performance.",
      },
    ],
    concept: {
      title: "Coefficients count entities",
      paragraphs: [
        "A mole is an amount containing exactly 6.02214076 × 10²³ specified entities. The molar mass M connects mass m to amount n through n = m/M.",
        "Balancing an equation conserves atoms of each element. Coefficients give ratios of molecules and moles, not generally ratios of masses. For 2H₂ + O₂ → 2H₂O, two moles of H₂ react with one mole of O₂ to form two moles of H₂O.",
        "When both reactants have limited amounts, compare each available amount divided by its coefficient. The smaller result determines the maximum reaction extent. Multiply that extent by a product's coefficient to obtain the theoretical product amount.",
        "Use rounded molar masses only when stated. These examples assume complete conversion of the limiting reactant and no competing reactions; actual yield may be lower.",
      ],
      formula:
        "n=\\frac{m}{M},\\qquad \\xi_{\\max}=\\min\\left(\\frac{n_A}{a},\\frac{n_B}{b}\\right),\\qquad n_P=p\\xi_{\\max}",
      terms:
        "n: amount (mol) · m: mass (g) · M: molar mass (g/mol) · a, b, p: balanced coefficients",
    },
    worked: {
      problem:
        "For 2H₂ + O₂ → 2H₂O, you have 3 mol H₂ and 2 mol O₂. Find the theoretical amount of water.",
      steps: [
        "Divide available amounts by their coefficients: H₂ gives 3/2 = 1.5; O₂ gives 2/1 = 2.",
        "The smaller value is 1.5, so H₂ is the limiting reactant.",
        "Multiply by the water coefficient: 2 × 1.5 = 3 mol H₂O.",
        "O₂ consumed is 1 × 1.5 = 1.5 mol; 0.5 mol O₂ remains.",
      ],
      answer:
        "3 mol H₂O, assuming complete conversion of H₂ and no side reactions.",
    },
    simulation: "stoichiometry",
    extension:
      "Further objectives include percentage yield, purity, solution concentration, and multi-reaction calculations. Each requires its own formal instruction and assessment.",
    questions: [
      {
        id: "mole-d",
        kind: "diagnostic",
        prompt:
          "For 2H₂ + O₂ → 2H₂O, how many moles of O₂ are required for 6 mol H₂?",
        unit: "mol",
        answer: 3,
        tolerance: 0.001,
        hint: "The ratio H₂:O₂ is 2:1.",
        explanation: "6 mol H₂ requires 6 × 1/2 = 3 mol O₂.",
      },
      {
        id: "mole-g",
        kind: "guided",
        prompt:
          "Using a molar mass of 18 g/mol, how many moles are in 36 g of water?",
        unit: "mol",
        answer: 2,
        tolerance: 0.001,
        hint: "Use n = m/M. Check that the units reduce to moles.",
        explanation: "36 g ÷ 18 g/mol = 2 mol.",
      },
      {
        id: "mole-i1",
        kind: "independent",
        prompt:
          "For 2H₂ + O₂ → 2H₂O, 5 mol H₂ reacts with 2 mol O₂. What is the maximum amount of H₂O formed?",
        unit: "mol",
        answer: 4,
        tolerance: 0.001,
        hint: "Compare 5/2 with 2/1 to find the limiting reactant.",
        explanation:
          "O₂ limits the reaction: min(2.5, 2) = 2. Water formed = 2 × 2 = 4 mol.",
      },
      {
        id: "mole-i2",
        kind: "independent",
        prompt:
          "For 2H₂ + O₂ → 2H₂O, use M(H₂) = 2 g/mol and M(O₂) = 32 g/mol. How many grams of O₂ react with 4 g H₂?",
        unit: "g",
        answer: 32,
        tolerance: 0.001,
        hint: "Convert hydrogen mass to moles, use the coefficient ratio, then convert oxygen moles to mass.",
        explanation:
          "4 g H₂ is 2 mol. It requires 1 mol O₂, which is 32 g. The 2:1 coefficients are not a mass ratio.",
      },
      {
        id: "mole-t",
        kind: "transfer",
        prompt:
          "In N₂ + 3H₂ → 2NH₃, 2 mol N₂ and 3 mol H₂ are available. Find the theoretical amount of NH₃ formed.",
        unit: "mol",
        answer: 2,
        tolerance: 0.001,
        hint: "Compare each available amount divided by its coefficient. Then multiply the smaller value by 2.",
        explanation:
          "min(2/1, 3/3) = 1. H₂ limits the reaction and 2 × 1 = 2 mol NH₃ can form.",
      },
      {
        id: "mole-r",
        kind: "delayed",
        prompt:
          "For CaCO₃ → CaO + CO₂, how many moles of CO₂ form from 0.75 mol CaCO₃ if decomposition is complete?",
        unit: "mol",
        answer: 0.75,
        tolerance: 0.001,
        hint: "Use the 1:1 mole ratio in the balanced equation.",
        explanation:
          "The reactant and product coefficients are both 1, so 0.75 mol CaCO₃ forms 0.75 mol CO₂.",
      },
    ],
  },
];
export function getLesson(id: string) {
  return lessons.find((lesson) => lesson.id === id);
}
