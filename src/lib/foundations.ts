type Foundation = { title: string; explanation: string; example: string; check: string };
// Different worked values from the diagnostic; these are draft teaching notes.
export const foundations: Record<string, Foundation> = {
  proportions: {
    title: "Find the amount for one unit",
    explanation: "When identical units share a total equally, divide the total by the number of units. Keep the unit in your reasoning: grams divided by packets gives grams per packet.",
    example: "Five identical components weigh 120 g together. One component weighs 120 ÷ 5 = 24 g. Check by multiplying: 5 × 24 = 120 g.",
    check: "Which quantity is the total, and how many equal units share it? After dividing, can you recover the original total by multiplying?",
  },
  projectiles: {
    title: "Resolve a vector into components",
    explanation: "Draw the vector as the hypotenuse of a right triangle. For an angle measured from the horizontal, the vertical side is opposite the angle: vertical component = magnitude × sin(angle). The horizontal component uses cosine. These rules swap if the angle is measured from the vertical.",
    example: "A speed of 12 m/s at 30° above the horizontal has vertical component 12 × 0.5 = 6 m/s. It is smaller than the full speed, as a component should be.",
    check: "Where is the angle measured from? Label the opposite side before choosing sine or cosine.",
  },
  stoichiometry: {
    title: "Read a balanced equation as a mole ratio",
    explanation: "Coefficients in a balanced equation compare particle counts and therefore moles. They do not directly compare masses. Scale every coefficient by the same factor to preserve the reaction ratio.",
    example: "For N₂ + 3H₂ → 2NH₃, 2 mol of N₂ needs 2 × 3 = 6 mol of H₂. The ratio 1:3 is unchanged. This assumes the stated reaction and sufficient other reactant.",
    check: "Write the required-to-given mole ratio first. Do the chemical labels cancel so the result refers to the substance you need?",
  },
  inheritance: {
    title: "Count equally likely outcomes",
    explanation: "For equally likely outcomes, probability is favourable outcomes divided by all possible outcomes. For a heterozygous parent in the simple Mendelian model, the two alleles segregate into gametes with equal probability. This model assumes normal segregation without selection or distortion.",
    example: "A fair spinner has four equal sectors, one blue. The probability of blue is 1/4 = 0.25. If sectors were unequal, counting sectors alone would not be enough.",
    check: "List the possible gamete alleles. Which outcomes match the question, and why can they be treated as equally likely?",
  },
};
