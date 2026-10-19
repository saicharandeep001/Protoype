# PeduC — from local pilot to a full learning application

## Product boundary

English-language mathematics, physics, chemistry, and biology for grades 8–12. Teach CBSE foundations and map additional depth and assessment requirements separately for JEE Main, JEE Advanced, NEET, BITSAT, CUET, TS/AP EAMCET, and KCET.

SchoolAI and Yoodli are experience references. This build uses a guided lesson flow with feedback alongside the learner's work; it does not claim to reproduce their interfaces or proprietary features.

## Increment delivered

A Next.js/React/TypeScript application with reusable components, server actions, authenticated persistence, curriculum browsing, lesson state, interactive models, a bounded authored text coach, and an evidence dashboard. Four deliberately bounded lessons exercise the complete instructional sequence across all four subjects. Planned topics are explicitly distinguishable from available lessons. Local trial accounts, stored feedback, and private evaluation exports support sponsor testing without a domain, email service, or paid API.

These lessons are development content, not educator-approved teaching material. Completion, independent first-pass answers, transfer answers, and delayed recall are recorded separately. A numerical transfer answer is limited evidence; it does not demonstrate proof quality or mastery of a whole topic.

## Architecture now

Browser → React learning components → validated server actions → account-scoped domain queries → local SQLite.

Typed instructional content is held in source files. Answer keys and hint contents are selected on the server; only prompts and lesson explanations are passed to the browser. Authentication uses salted password hashes and opaque session cookies. Native SQLite provides a repeatable, credential-free development environment.

The choice of Next.js does not by itself make the platform scalable. Current storage and authentication are a development implementation, not a production identity or database service. Synchronous local SQLite and password hashing need replacement or appropriate isolation for high concurrency.

## Work required for a production foundation

1. Move persistence to managed PostgreSQL with a versioned migration history, pooling, backups, and restore validation. Convert the database access layer and affected actions to asynchronous queries.
2. Use managed authentication with verification and recovery, appropriate session revocation, role-based access, and abuse controls. Add authorization tests for teacher, school, parent, and reviewer relationships if those roles are selected.
3. Introduce immutable published content versions. Progress and assessments must refer to the version used; a revised question cannot inherit prior mastery evidence. The initial build records a content version on attempts but does not yet implement full version lifecycle or migration of progress/hints.
4. Move curriculum objects, contexts, content reviews, and question banks into a controlled authoring and publishing system with provenance and rollback.
5. Provision persistent assets, environment-specific configuration, operational monitoring, and CI deployment gates. Check that no learner database, credentials, or unnecessary source artifacts are bundled into deployable output.
6. Define load targets from expected usage, then test account isolation, grading throughput, tutor latency, data recovery, and cost under those targets.

## Curriculum and assessment work

1. Ingest and review current official syllabus inventories. Grade 8–10 science is organised as a combined school subject; the product's physics/chemistry/biology navigation must map back to those source chapters without inventing official divisions.
2. Create granular objectives with prerequisites, misconceptions, approved mappings, and exam-specific extensions. Current roadmap placements are proposed, not verified.
3. Build adequate banks of distinct diagnostic, guided, independent, multi-concept, transfer, and delayed questions for every objective. Do not inflate coverage with repeated prompts.
4. Add reviewed explanation and derivation assessment. The current grader accepts finite numeric inputs and simple fractions only; conceptual prose and proofs are not automatically graded.
5. Validate progression and remediation. The local learning route prioritizes due reviews, unresolved diagnostic checks, and unfinished sequences; it uses grade and JEE/NEET subject priorities for new content. Four short foundation explanations offer a worked example before a retry and record assistance. This is not yet a complete prerequisite lesson graph, a broad diagnostic, or enforced readiness gating. Programme-dependent entrance subject combinations still need explicit selection and official verification.
6. Add mixed revision and examination modes with the appropriate question types, timing, scoring, negative marking where relevant, and current patterns. A goal selector does not deliver an exam-specific pathway.
7. Have subject specialists verify content and measure comprehension, transfer, and retention in a supervised pilot before making efficacy claims.

## AI tutoring, if selected

Add AI as a service constrained by the objective, approved materials, current learner evidence, and known misconceptions. Keep authoritative grading separate. Implement requests, cost budgets, response validation, review/reporting, and appropriate handling of student data. Clearly distinguish authored explanations from generated assistance.

The current text coach matches questions to authored explanations, identifies its lesson source, stores conversations, and reports when it has no confident match. It does not invoke an AI model. Assistance during assessment steps is recorded separately from independent evidence. No AI credential has been requested, no model response is fabricated, and speech functionality is outside the user's scope.

January–February 2027 is the requested pilot target. The brand is PeduC; applying the actual logo requires a directly attached image because its signed reference URL is not accessible. A source register prioritises NCERT, CBSE, and official exam authorities; it is not a claim that live references or 2027 syllabi have been verified.

## Scaling the interest catalog

Use a many-to-many relation between objectives and reviewed contexts. Each mapping stores the actual conceptual relationship, familiarity prerequisites, activity, assumptions, and transfer task. Do not infer suitability from shared words or force a full Cartesian product.

Cooking can support ratios, thermal physics, and some chemical processes; it does not automatically support all of mathematics, physics, or chemistry. Biology examples must reflect the relevant biological mechanism, not merely attach an animal or plant name to a generic exercise.

Expand contexts after reviewing their instructional value. A direct conceptual route always remains available. The curriculum objective—not popularity of an interest—determines required learning.

## Definition of a complete initial release

- The agreed subject/grade/exam inventory is source-verified and its coverage is measurable.
- Required objectives have approved instruction, practice, transfer, and retention checks.
- Appropriate prerequisites and remediation are implemented.
- Persistent accounts, role boundaries, recovery, backups, and deployed storage work under the intended load.
- Exam pathways reflect current official requirements and distinguish school foundations from extension content.
- Accessibility, mobile use, assessment accuracy, and data isolation are validated with realistic workflows.
- Remaining coverage gaps are visible and do not appear as completed lessons or readiness claims.

No publication or new-task snapshot restoration is claimed by this build. Deployment, production-scale validation, complete syllabus authoring, and educator approval remain open work.
