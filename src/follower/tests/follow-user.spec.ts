import {createFollowFixture, Fixture} from "./follow.fixture";

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
      userToFollow: 'Bob',
    });

    await fixture.thenUserFollows({
      user: 'Alice',
      followees: ['Charlie, Bob'],
    })
  });
});


