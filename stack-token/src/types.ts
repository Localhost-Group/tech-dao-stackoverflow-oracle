export interface IAnswerData {
  answer_id: number;
  is_accepted: boolean;
  score: number;
  question_id: number;
  tags: Array<string>;
}
export interface ILanguageToken {
  language: string;
  amountOfExp: number;
}
export interface IUserWithTokens {
  userId: string;
  userTokens: Array<ILanguageToken>;
}

export interface IDataToCalculateUserTokens {
  answerWasAccepted: boolean;
  score: number;
  tags: Array<string>;
}
export interface IDataAboutQuestion {
  question_id: number;
  tags: Array<string>;
}
export interface IDataForCreateTokens {
  userId: string;
  dataForCreateTokens: IDataToCalculateUserTokens[];
}

export interface IDataAboutUserAnswers {
  userId: string;
  userAnswers: Array<IAnswerData>;
}
