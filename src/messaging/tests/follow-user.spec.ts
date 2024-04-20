describe('Feature: Following a user', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
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

const createFixture = () => {
  return {
    givenUserFollower({ user, followees }: { user: string, followees: string[]}){},
    async whenUserFollows({ user, userToFollow}: { user: string, userToFollow: string}){},
    async thenUserFollows({ user, followees }: { user: string, followees: string[]}) {},
  };
}

type Fixture = ReturnType<typeof createFixture>;
