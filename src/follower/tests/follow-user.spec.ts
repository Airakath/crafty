import {createFollowFixture, Fixture} from "./follow.fixture";
import {FollowUserCommand} from "../application/usecases/follow-user.usecase";

describe('Feature: Following a user', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFollowFixture();
  });

  test('Alice can follow Bob', async () => {
    fixture.givenUserFollower({
      user: 'Alice',
      followees: ['Charlie'],
    });

    await fixture.whenUserFollows({
      user: 'Alice',
      userTofollow: 'Bob',
    });

    await fixture.thenUserFollowsAre({
      user: 'Alice',
      followees: ['Charlie', 'Bob'],
    })
  });
});


