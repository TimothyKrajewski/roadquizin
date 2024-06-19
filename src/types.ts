// types.ts
export type RootStackParamList = {
  Home: undefined;
  SelectQuiz: undefined;
  Quiz: { quizData: any; quizName: string }; 
  Results: { correctAnswers: number; incorrectAnswers: number; quizName: string };
  FunFacts: undefined;
  Settings: undefined;
  QuizHistory: undefined;
};