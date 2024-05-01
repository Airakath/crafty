import {createFollowingFixture, FollowingFixture} from "./following.fixture";

describe('Feature: Following a user', () => {
  let fixture: FollowingFixture;

  beforeEach(() => {
    fixture = createFollowingFixture();
  });

  test('Alice can follow Bob', async () => {
    fixture.givenUserFollowees({
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


