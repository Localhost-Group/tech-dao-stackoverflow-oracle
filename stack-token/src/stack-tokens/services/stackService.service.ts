import { Injectable } from '@nestjs/common';
import {
  IAnswerData,
  IDataAboutQuestion,
  IDataForCreateTokens,
  IDataToCalculateUserTokens,
} from 'src/types';

import { TagsService } from './stack-tags.service';
import { UserService } from './stack-user.service';

@Injectable()
export class StackService {
  constructor(
    private userService: UserService,
    private tagService: TagsService,
  ) {}

  public async handleGeneretingStackTokens(
    authToken: string,
  ): Promise<IDataForCreateTokens> {
    const { userAnswers, userId } = await this.userService.collectDataAboutUser(
      authToken,
    );
    const answersTags = await this.tagService.getTagsForEachAnswer(userAnswers);
    const dataForCreateTokens = this.mapCollectedData(userAnswers, answersTags);
    return { userId, dataForCreateTokens };
  }
  private mapCollectedData(
    answersOfUser: Array<IAnswerData>,
    questionsData: Array<IDataAboutQuestion>,
  ): Array<IDataToCalculateUserTokens> {
    const arrWithMappedData: Array<IDataToCalculateUserTokens> = [];
    answersOfUser.forEach((answer) => {
      const { question_id, is_accepted, score } = answer;
      const answerTags = questionsData.find((question) => {
        return question.question_id === question_id;
      });
      if (answerTags) {
        const { tags } = answerTags;
        arrWithMappedData.push({ tags, answerWasAccepted: is_accepted, score });
      }
    });
    return arrWithMappedData;
  }
}
