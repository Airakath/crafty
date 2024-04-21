import {FolloweeRepository} from "../../domain/ports/output/followeeRepository";

export class FollowUserUsecase {

  constructor(
    private readonly followeeRepository: FolloweeRepository
  ) {}
  async handle() {

  }

}
