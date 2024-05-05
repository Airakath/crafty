export class FolloweeEntity {
  constructor(
    private readonly _user: string,
    private readonly _followee: string,
  ) {}

  get user() {
    return this._user;
  }

  get followee() {
    return this._followee;
  }

  get data() {
    return {
      user: this.user,
      followee: this.followee
    }
  }

  static fromData(data: FolloweeEntity['data']) {
    return new FolloweeEntity(
      data.user,
      data.followee
    );
  }


}
