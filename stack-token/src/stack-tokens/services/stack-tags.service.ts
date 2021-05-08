import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { IAnswerData, IDataAboutQuestion } from 'src/types';

@Injectable()
export class TagsService {
  private stackApiUrl: string = 'https://api.stackexchange.com/2.2/questions/';
  private STACK_KEY: string;
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.STACK_KEY = this.configService.get<string>('STACK_KEY');
  }

  public async getTagsForEachAnswer(
    answersData: IAnswerData[],
  ): Promise<Array<IDataAboutQuestion>> {
    let accumulator = [];
    const arrOfStringsIds = this.prepareArrayOfQuestionsIdsForRequest(
      answersData,
    );
    const lenghts = this.prepareLenghtOfIdsArgumentForEachRequest(
      arrOfStringsIds.length,
    );
    for (const lenght of lenghts) {
      const requestIds = this.prepareStringWithIdsOfQuestions(
        arrOfStringsIds,
        lenght,
      );
      const items = await this.requestQuestionTags(requestIds);

      accumulator = accumulator.concat(items);
    }
    return accumulator.map((item) => {
      const { question_id, tags } = item;
      return { question_id, tags };
    });
  }

  private requestQuestionTags(questiondId: string) {
    return this.httpService
      .get(
        this.stackApiUrl +
          `${questiondId}?&site=stackoverflow&pagesize=25&key=${this.STACK_KEY}`,
      )
      .pipe(map((res) => res.data.items))
      .toPromise();
  }
  private prepareArrayOfQuestionsIdsForRequest(answersData: IAnswerData[]) {
    return answersData.reduce((accumulator, currVal) => {
      const { question_id } = currVal;
      if (!accumulator.includes(question_id)) {
        accumulator.push(question_id);
      }
      return accumulator;
    }, []);
  }
  private prepareStringWithIdsOfQuestions(
    questionsIds: Array<string>,
    amountOfIdsForRequest: number,
  ) {
    const stringWithIdToRequest = questionsIds
      .splice(0, amountOfIdsForRequest)
      .reduce((accumulator, currVal) => {
        return (accumulator += currVal + ';');
      }, '');
    return stringWithIdToRequest.slice(0, questionsIds.length - 1);
  }
  private prepareLenghtOfIdsArgumentForEachRequest(lenght: number) {
    const arrToReturn: Array<number> = [];
    const maxRequestPage = 100;
    while (lenght > 0) {
      if (lenght <= maxRequestPage) {
        arrToReturn.push(lenght);
        break;
      }
      lenght -= maxRequestPage;
      arrToReturn.push(maxRequestPage);
    }
    return arrToReturn;
  }
}
