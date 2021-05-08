import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { IAnswerData, IDataAboutUserAnswers } from 'src/types';

@Injectable()
export class UserService {
  private STACK_KEY: string;
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.STACK_KEY = this.configService.get<string>('STACK_KEY');
  }

  public async collectDataAboutUser(
    authToken: string,
  ): Promise<IDataAboutUserAnswers> {
    const userId = await this.getUserId(authToken);

    const userAnswers = []; // await this.getUserAnswers(userId);
    return { userId, userAnswers };
  }

  private async getUserId(authToken: string): Promise<string> {
    return this.httpService
      .get(
        `https://api.stackexchange.com/2.2/me?access_token=${authToken}&key=${this.STACK_KEY}&site=stackoverflow`,
      )
      .pipe(map((result) => result.data.items[0].account_id))
      .toPromise();
  }

  private async getUserAnswers(userId: string): Promise<Array<IAnswerData>> {
    let allAnswers = [];
    let hasMore = true;
    let page = 1;
    while (hasMore) {
      try {
        const result = await this.httpService
          .get(
            `https://api.stackexchange.com/2.2/users/${userId}/answers?&site=stackoverflow&page=${page}&pagesize=100&key=${this.STACK_KEY}`,
          )
          .pipe(map((result) => result.data.account_id))
          .toPromise();
        const { items, has_more } = result;
        allAnswers = allAnswers.concat(items);
        hasMore = has_more;
        page++;
      } catch (err) {
        console.log(err);
      }
    }
    const arrOfFilteredAnswers = allAnswers.filter((item) => item.score > 0);

    return this.mapData(arrOfFilteredAnswers);
  }

  private mapData(arrToMap): Array<IAnswerData> {
    return arrToMap.map((item) => {
      const { score, is_accepted, question_id, answer_id } = item;
      return { score, is_accepted, question_id, tags: [], answer_id };
    });
  }
}
