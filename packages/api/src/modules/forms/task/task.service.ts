import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Submission, Task } from 'src/modules/database';
import { DuckFeedSubmissionInfo } from 'src/types/submission.data';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,
  ) {}

  public async createTask(submissionId: string) {
    const task = this.taskRepo.create();

    const submission = await this.submissionRepo.findOneOrFail(submissionId);
    const feedData: DuckFeedSubmissionInfo = submission.data
      .formData as DuckFeedSubmissionInfo;
    task.submission = submission;
    task.label = `Task to feed ${feedData.food} at [time: ${feedData.feedTime} and location: ${feedData.lake}]`;
    await this.taskRepo.save(task);
    return task;
  }

  public async getTask(submissionId: string) {
    return this.taskRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.submission', 'submission')
      .where('submission.id = :submissionId', { submissionId })
      .getOne();
  }
}
