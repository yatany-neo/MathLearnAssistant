
export enum MathTopic {
  FRACTIONS = '分数加减法',
  DECIMALS = '小数乘除法',
  EQUATIONS = '简易方程',
  GEOMETRY = '图形与几何',
  WORD_PROBLEMS = '解决问题（应用题）',
}

export interface Step {
  title: string;
  explanation: string;
  question: string;
  hint: string;
  correctAnswer: string;
}

export interface MathModel {
  id: string;
  topic: MathTopic;
  title: string;
  description: string;
  exampleProblem: string;
  steps: Step[];
  followUpProblem: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
