// src/types.ts
export type RootStackParamList = {
    Home: undefined;
    Quiz: undefined;
    FunFacts: undefined;
    Settings: undefined;
    Results: { correctAnswers: number; incorrectAnswers: number };
  };