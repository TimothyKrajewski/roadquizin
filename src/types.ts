export type RootStackParamList = {
  Home: undefined;
  SelectQuiz: undefined;
  Quiz: { quizData: any, quizId: string };
  FunFacts: undefined;
  Settings: undefined;
  Results: { correctAnswers: number; incorrectAnswers: number; quizId: string };
};