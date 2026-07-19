export type Category = "Synonym" | "Inverse" | "Meaning" | "Grammar";

export type Difficulty = "Easy" | "Medium" | "Hard" | "Very Hard";

export interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
