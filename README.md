# PeduC

**Context Before Content:** help students in grades 8–12 enter mathematics, chemistry, and physics through interests that have a real connection to the concept.

PeduC is an early interactive prototype led by Venkata Sai Charan Deep. It starts with a familiar situation, lets a student explore a model, introduces the underlying idea, and then asks the student to apply that idea in different settings. The aim is to study whether this sequence can make rigorous learning more approachable while keeping conceptual understanding and assessment at the centre.

[Read the project purpose](PROJECT_PURPOSE.txt) · [Open the existing private demo](https://peduc-context-lab.saicharandeep01.chatgpt.site)

The current hosted demo requires the owner's ChatGPT account. This repository does not grant reviewers access to that demo; a separate access arrangement is needed before a pitch or pilot.

## The problem and the approach

A student may meet an equation before understanding what it helps them explain. Familiarity with a formula is useful, but it does not always show whether the student can apply it, reverse it, or reason about its assumptions.

PeduC explores a different entry point:

1. **Choose a meaningful connection.** A student selects a subject and an available interest. The application excludes pairings without a developed, relevant context.
2. **Explore before receiving the rule.** The student adjusts a variable, observes a model, and makes a prediction.
3. **Name and examine the concept.** A concise explanation introduces the relationship, assumptions, and a common misconception.
4. **Transfer and practise.** The student answers varied questions in familiar and unfamiliar settings, moving from foundations toward more demanding reasoning.

For example, a learner can explore magnetic force through a simplified loudspeaker voice coil, or use carbon isotopes to discuss dating manuscript material. Both models state their assumptions; neither claims to represent every detail of the real-world system.

## What the prototype includes

| Component | Current implementation |
| --- | --- |
| Subjects | Mathematics, chemistry, and physics; 10 topic paths in each subject |
| Connections | 10 interest categories with 72 curated topic–interest connections; the list is deliberately sparse |
| Assessment | 214 original questions, including direct, derive, reverse, unknown-variable, conceptual, competitive-style, graph, and single-digit integer problems |
| Support | Hints, worked explanations, answer checks, and separate counts for solved and reviewed questions |
| Navigation | Subject and grade filters, topic search, a connection map, and a responsive interface |
| Progress | An optional display name and progress stored in the current browser's local storage |

The exam-style questions were informed by selected visible formats in a Class 9 sample paper. They are independently written for this prototype, are not official JEE questions, and do not establish exam readiness. Counts refer to the current committed content and may change as the curriculum is reviewed.

## Run locally

**Requirements:** a modern browser, Python 3 to serve the static files, and Node.js 18 or later to run the validation script. No package installation or API key is needed.

```bash
git clone https://github.com/saicharandeep001/Protoype.git
cd Protoype
python3 -m http.server 8000
```

Open `http://localhost:8000/`. The root page redirects to `dist/`, which contains the actual application source and assets. Keep the server running while using the site; press `Ctrl+C` in the terminal to stop it.

To run the checks:

```bash
node validate.cjs
```

The script checks content counts and structure, answer-checking behavior, model outputs, grade and interest filters, route recovery, and selected examples. These checks do **not** replace subject-matter review, accessibility testing with users, classroom research, or a complete independent verification of every answer.

## Project layout

```text
.
├── README.md                  Project overview and setup
├── PROJECT_PURPOSE.txt        Purpose and pitch context
├── THIRD_PARTY_NOTICES.md     Font and image notices
├── index.html                 Redirect to the application
├── dist/
│   ├── index.html             Application shell
│   ├── data.js                Mathematics, chemistry, interests, and base questions
│   ├── curation.js            Allowed and removed interest mappings
│   ├── physics.js             Physics topics, models, and questions
│   ├── stretch.js             Additional exam-style practice
│   ├── app.js                 Interface, models, navigation, scoring, and local progress
│   ├── styles.css             Responsive visual design
│   └── assets/                Local images, fonts, credits, and font licenses
├── validate.cjs               Dependency-free validation script
└── validation.json            Latest checked validation summary
```

`dist/` is the editable source for this buildless prototype, not generated output. Scripts are loaded in the order specified in `dist/index.html`. Interest mappings should be added only when the selected context explains a concept the learner is actually studying, and each new question should include a checked answer, hint, solution, and clear assumptions.

## Hosting and privacy

The application is a static site. It has **no built-in authentication, backend, AI service, analytics, teacher dashboard, or cross-device sync**. The optional name and progress remain in browser local storage and may disappear if site data is cleared or a different device or browser is used.

The existing owner-only demo relies on its hosting service for access control. A copy of this repository hosted elsewhere does not inherit that protection. GitHub Pages commonly publishes sites publicly, including in circumstances where the repository is private; do not enable it until the desired visibility and plan are understood and public release is approved. The repository is prepared for static hosting, but no public deployment is configured here.

## What still needs work

- **Educational review:** educators and subject specialists should review topic coverage, question accuracy, explanations, grade placement, and the quality of each interest mapping.
- **Evidence of learning:** the prototype does not yet establish that Context Before Content improves outcomes. A small, well-designed pilot could compare pre-learning knowledge, immediate understanding, transfer, and later retention alongside student and teacher feedback.
- **Product and engineering:** explore teacher tools, accessible content, richer simulations, account-based progress, content authoring, and dependable deployment only after the learning experience has been tested.
- **AI as a future direction:** the current prototype uses authored content and deterministic answer checks. Adaptive sequencing or AI-assisted support would require a separate design, evaluation, safeguards, and educator oversight.
- **Broader readiness:** it is not a complete grade 8–12 curriculum, an official exam-preparation product, or a substitute for a teacher, laboratory instruction, or a comprehensive JEE preparation programme.

PeduC is seeking conversations with educators, learning-science researchers, engineers, and innovation teams about research design, product development, potential pilots, mentorship, and appropriate funding as evidence develops.

## Credits and permissions

Photo source links are listed in [`dist/assets/photo-credits.txt`](dist/assets/photo-credits.txt). DM Sans and Space Grotesk are distributed with their respective font license texts in `dist/assets/`. See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) before redistributing assets.

No open-source license has been selected for the original application code or learning content. Contact the project owner before reuse or redistribution; third-party assets retain their own terms.
