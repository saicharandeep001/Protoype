export type CoachEntry = {
  id: string;
  lesson: string;
  title: string;
  prompts: string[];
  keywords: string[];
  explanation: string;
  followUp: string;
};
// Authored development material. No external model is invoked.
export const coachEntries: CoachEntry[] = [
  {
    id: "ratio-constant",
    lesson: "proportions",
    title: "The constant in direct proportion",
    prompts: [
      "What stays constant in a proportion?",
      "Explain proportional reasoning simply",
    ],
    keywords: ["proportion", "constant", "ratio", "rate", "simply", "basics"],
    explanation:
      "In direct proportion, the amount per unit stays the same. If 4 servings need 300 g of flour, each serving needs 75 g. For any number x of equal servings, the flour amount is y = 75x. The invariant is y/x, not the difference y − x. This assumes the portion size and recipe balance stay fixed.",
    followUp: "If both quantities triple, what happens to their ratio?",
  },
  {
    id: "ratio-fixed",
    lesson: "proportions",
    title: "Why a fixed fee changes the relationship",
    prompts: [
      "Why isn't every straight line a proportion?",
      "What happens when there is a fixed fee?",
    ],
    keywords: [
      "fee",
      "intercept",
      "straight",
      "line",
      "origin",
      "fixed",
      "cost",
    ],
    explanation:
      "Direct proportion has the form y = kx and passes through the origin. A relationship y = b + kx with b ≠ 0 includes a fixed starting amount. Its unit rate is y/x = b/x + k, which changes with x. For example, a ₹20 delivery fee plus ₹10 per item gives a different cost per item for one item than for five items.",
    followUp:
      "Which part of the unit rate becomes smaller as the order gets larger?",
  },
  {
    id: "ratio-scale",
    lesson: "proportions",
    title: "Scale lengths without confusing them with areas",
    prompts: [
      "Why does area scale differently from length?",
      "How do I find a scale factor?",
    ],
    keywords: ["scale", "factor", "area", "length", "shape", "width", "height"],
    explanation:
      "Find a length scale factor by dividing a new length by its corresponding original length. Multiply every other corresponding length by that factor. Area has two length dimensions, so it scales by the factor squared; volume scales by its cube. A rectangle scaled by 3 has three times the width and three times the height, so its area is 9 times as large.",
    followUp:
      "If the length factor is 2, what would you predict for surface area and volume?",
  },
  {
    id: "ratio-units",
    lesson: "proportions",
    title: "Use units to choose the operation",
    prompts: ["How do units help me solve a rate problem?"],
    keywords: ["units", "rate", "minutes", "divide", "multiply", "conversion"],
    explanation:
      "Write the unit rate with its units. If a machine makes 8 parts/min, multiplying by a time in minutes gives parts. Dividing a target number of parts by parts/min gives minutes. Units do not prove a model is correct, but they catch many incorrect operations.",
    followUp:
      "What units would you get if you multiplied parts by parts/min instead?",
  },
  {
    id: "projectile-components",
    lesson: "projectiles",
    title: "Two components, one shared time",
    prompts: [
      "Why can horizontal and vertical motion be separated?",
      "Explain projectile motion simply",
    ],
    keywords: [
      "component",
      "horizontal",
      "vertical",
      "separate",
      "motion",
      "simply",
      "vector",
    ],
    explanation:
      "In this no-drag model, gravity acts only vertically. Horizontal velocity stays u cos θ, while vertical velocity changes from u sin θ by −gt. Both components belong to the same object and share the same time. Solve the vertical motion for the relevant event, then use that time in the horizontal equation.",
    followUp:
      "If gravity is vertical, which component of velocity remains constant?",
  },
  {
    id: "projectile-top",
    lesson: "projectiles",
    title: "Velocity and acceleration at the highest point",
    prompts: ["Is acceleration zero at the highest point?"],
    keywords: ["acceleration", "highest", "top", "peak", "zero", "gravity"],
    explanation:
      "At the highest point, the vertical component of velocity is momentarily zero. Gravity has not switched off: acceleration is still g downward. Unless the launch is exactly vertical, horizontal velocity is nonzero too. Zero velocity in one direction at an instant does not mean zero acceleration in that direction.",
    followUp:
      "What would the ball do after the top if its acceleration really became zero?",
  },
  {
    id: "projectile-range",
    lesson: "projectiles",
    title: "When the standard range formula applies",
    prompts: [
      "When can I use the range formula?",
      "Why do complementary angles give the same range?",
    ],
    keywords: [
      "range",
      "angle",
      "complementary",
      "height",
      "ledge",
      "landing",
      "formula",
    ],
    explanation:
      "R = u² sin(2θ)/g assumes constant downward acceleration, no air resistance, and equal launch and landing heights. At fixed u and g, complementary angles have the same sin(2θ), giving the same range in this model. If the landing height differs, use y = u sin θ · t − ½gt² to find the correct positive flight time, then use x = u cos θ · t.",
    followUp:
      "Can two trajectories have the same range but different maximum heights?",
  },
  {
    id: "projectile-time",
    lesson: "projectiles",
    title: "Deriving the flight time",
    prompts: ["How is the flight time derived?"],
    keywords: ["time", "derive", "derivation", "root", "flight", "equation"],
    explanation:
      "For a return to the launch height, set vertical displacement to zero: 0 = u sin θ · t − ½gt². Factor t to get t(u sin θ − ½gt) = 0. The first root t = 0 is the launch event. The later root is T = 2u sin θ/g. Use the later root only for a landing at the launch height.",
    followUp: "What physical event does each root describe?",
  },
  {
    id: "mole-mass",
    lesson: "stoichiometry",
    title: "Mole ratios are not mass ratios",
    prompts: [
      "Why aren't equation coefficients mass ratios?",
      "What is a mole?",
    ],
    keywords: [
      "mass",
      "mole",
      "coefficient",
      "ratio",
      "molar",
      "gram",
      "particles",
    ],
    explanation:
      "A mole counts specified entities. Balanced coefficients compare entity counts and therefore mole amounts. Mass also depends on the mass of each entity. For 2H₂ + O₂ → 2H₂O, the reactant mole ratio is 2:1. Using rounded molar masses of 2 and 32 g/mol, those amounts have masses 4 g and 32 g, a 1:8 mass ratio. Convert mass to moles before applying coefficients.",
    followUp:
      "Why can equal mole amounts of two substances have different masses?",
  },
  {
    id: "mole-limiting",
    lesson: "stoichiometry",
    title: "Finding the limiting reactant",
    prompts: [
      "How do I find the limiting reactant?",
      "Why does adding more reactant stop increasing the product?",
    ],
    keywords: [
      "limiting",
      "excess",
      "remaining",
      "reactant",
      "runs",
      "out",
      "product",
    ],
    explanation:
      "For each reactant, divide its available mole amount by its balanced coefficient. The smaller value limits how far the reaction proceeds. For A + 2B → C, 3 mol A and 4 mol B give 3/1 = 3 and 4/2 = 2, so B limits the reaction and at most 2 mol C forms. Extra A cannot replace the missing B.",
    followUp: "After that reaction, how much A is left?",
  },
  {
    id: "mole-cooking",
    lesson: "stoichiometry",
    title: "The cooking connection and its limits",
    prompts: ["How does this connect to cooking?"],
    keywords: ["cooking", "batter", "baking", "bicarbonate", "gas", "recipe"],
    explanation:
      "In the simplified reaction HCO₃⁻ + H⁺ → CO₂ + H₂O, one mole of each reactant can form one mole of CO₂. This connects gas production to a balanced equation. It does not predict how much a cake rises: temperature, reaction rates, gas retention, and other ingredients also matter.",
    followUp: "Which real cooking outcomes are outside this chemical model?",
  },
  {
    id: "gene-genotype",
    lesson: "inheritance",
    title: "Genotype and phenotype",
    prompts: [
      "What is the difference between genotype and phenotype?",
      "Explain inheritance simply",
    ],
    keywords: [
      "genotype",
      "phenotype",
      "dominant",
      "recessive",
      "inheritance",
      "simply",
      "allele",
    ],
    explanation:
      "Genotype describes the allele combination, such as TT, Tt, or tt. Phenotype describes an observable characteristic. In this one-gene complete-dominance model, TT and Tt show the dominant phenotype, while tt shows the recessive phenotype. Dominant does not mean more common, stronger, or better; it describes the relationship between alleles in this model.",
    followUp:
      "Could two organisms with the same phenotype have different genotypes?",
  },
  {
    id: "gene-probability",
    lesson: "inheritance",
    title: "Expected ratios are not a birth schedule",
    prompts: [
      "Does a 3:1 ratio guarantee one recessive offspring?",
      "Do previous offspring change the next probability?",
    ],
    keywords: [
      "ratio",
      "guarantee",
      "probability",
      "previous",
      "next",
      "offspring",
      "four",
      "chance",
      "schedule",
    ],
    explanation:
      "For Tt × Tt, the equally likely gamete combinations are TT, Tt, tT, and tt. Under complete dominance, three combinations have the dominant phenotype. This gives a probability of 3/4, not a guarantee about every group of four offspring. Assuming independent events, previous outcomes do not change the next offspring's probability.",
    followUp:
      "Why might a small sample differ noticeably from the expected ratio?",
  },
  {
    id: "gene-punnett",
    lesson: "inheritance",
    title: "Constructing a Punnett square",
    prompts: [
      "How do I build a Punnett square?",
      "What changes in a test cross?",
    ],
    keywords: ["punnett", "square", "gamete", "cross", "heterozygous", "test"],
    explanation:
      "Write one parent's possible gametes across the columns and the other's down the rows. Combine one allele from each parent in every cell. In Tt × tt, the first parent contributes T or t, while the second always contributes t. The outcomes are Tt or tt with equal probability under the stated assumptions.",
    followUp: "What changes in the square if the first parent is TT instead?",
  },
  {
    id: "gene-limits",
    lesson: "inheritance",
    title: "Where the simple model stops",
    prompts: ["Does this model explain all traits?"],
    keywords: [
      "all",
      "traits",
      "environment",
      "gene",
      "many",
      "limits",
      "complex",
    ],
    explanation:
      "The lesson assumes one autosomal gene, complete dominance, equal gamete probabilities, and no viability differences. Real traits can involve many genes, environmental effects, incomplete dominance, codominance, linkage, or other mechanisms. A monohybrid calculation is a foundation for those later models, not an explanation of every trait.",
    followUp:
      "Which assumptions would you check before using this model for a new trait?",
  },
];
const stopWords = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "it",
  "what",
  "how",
  "why",
  "do",
  "does",
  "i",
  "my",
  "me",
  "this",
  "that",
  "in",
  "to",
  "of",
  "for",
  "and",
  "can",
  "you",
  "please",
  "explain",
  "with",
]);
function tokens(text: string) {
  return [
    ...new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length > 1 && !stopWords.has(t))
        .map((t) => (t.length > 4 && t.endsWith("s") ? t.slice(0, -1) : t)),
    ),
  ];
}
export function findCoachEntry(lessonId: string, question: string) {
  const query = tokens(question);
  if (!query.length) return null;
  const ranked = coachEntries
    .filter((e) => e.lesson === lessonId)
    .map((entry) => {
      const keywords = new Set(tokens(entry.keywords.join(" ")));
      const vocabulary = new Set(
        tokens(`${entry.title} ${entry.prompts.join(" ")}`),
      );
      const matches = query.filter((t) => keywords.has(t) || vocabulary.has(t));
      const score = matches.reduce((s, t) => s + (keywords.has(t) ? 2 : 1), 0);
      return { entry, score, coverage: matches.length / query.length };
    })
    .sort((a, b) => b.score - a.score);
  const best = ranked[0];
  return best && best.score >= 2 && best.coverage >= 0.35 ? best.entry : null;
}
export type CoachExchange = {
  id: number;
  question: string;
  reply: string;
  source: string;
  follow_up: string;
  supported: number;
  created_at: number;
};
