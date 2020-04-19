import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {AuditionQuestion} from "./AuditionQuestion.entity";
import {AuditionAnswers} from "./AuditionAnswer.entity";

@Injectable()
export class AuditionQuestionsService {
    constructor(
        @InjectRepository(AuditionQuestion)
        private readonly auditionQuestionsRepo: Repository<AuditionQuestion>,
        @InjectRepository(AuditionAnswers)
        private readonly auditionAnswersRepo: Repository<AuditionAnswers>,
    ) {
    }

    async updateAnswer(answerId: string, text: string) {
        return await this.auditionAnswersRepo.update(answerId, {text});
    }

    async getAnswersWithQuestionsForAudition(auditionId: string, userId: string) {
        const questions = await this.auditionQuestionsRepo
            .createQueryBuilder("question")
            .innerJoinAndSelect("question.answers", "answer", "answer.userId = :userId", {userId})
            .where("question.auditionId = :auditionId", {auditionId})
            .getMany();

        const formatted = questions.map((question: AuditionQuestion) => {
            return {
                id: question.id,
                text: question.text,
                answer: {
                    id: question.answers[0].id,
                    text: question.answers[0].text,
                },
            };
        });
        return formatted;
    }

}
