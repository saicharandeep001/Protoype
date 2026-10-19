export type Subject = "Mathematics" | "Physics" | "Chemistry" | "Biology";
export type QuestionKind =
  | "diagnostic"
  | "guided"
  | "independent"
  | "transfer"
  | "delayed";
export type Question = {
  id: string;
  kind: QuestionKind;
  prompt: string;
  unit?: string;
  answer: number;
  tolerance: number;
  hint: string;
  explanation: string;
};
export type Context = {
  interest: string;
  title: string;
  story: string;
  decision: string;
  connection: string;
  boundary: string;
};
export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  subject: Subject;
  grade: number;
  chapter: string;
  minutes: number;
  objective: string;
  prerequisites: string[];
  contexts: Context[];
  concept: {
    title: string;
    paragraphs: string[];
    formula: string;
    terms: string;
  };
  worked: { problem: string; steps: string[]; answer: string };
  questions: Question[];
  simulation: "ratio" | "projectile" | "stoichiometry" | "inheritance";
  extension: string;
  version: number;
};
export type Attempt = {
  id: number;
  lesson_id: string;
  question_id: string;
  correct: number;
  assisted: number;
  created_at: number;
  answer: string;
};
export type Learner = {
  is_demo: number;
  id: string;
  name: string;
  username: string;
  grade: number;
  goal: string;
  interests: string[];
};
