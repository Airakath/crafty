import path from 'node:path';
import * as fs from "node:fs";
import {
  FolloweeFileSystemRepositoryAdapter
} from '../../infrastructure/persistance/file/followee-file-system-repository.adapter';
import { FolloweeEntity } from '../../domain/entities/followee.entity';


const testFolloweesPath = path.join(__dirname, 'followees-test.json')


describe('FileSystemFolloweeRepository', () => {

  beforeEach(async () => {
    await fs.promises.writeFile(testFolloweesPath, JSON.stringify({}));
  });

  test('saveFollowee() should save a new followee when there was no followees befor', async () => {

    const followeeRepository = new FolloweeFileSystemRepositoryAdapter(testFolloweesPath);

    await fs.promises.writeFile(testFolloweesPath, JSON.stringify({
      Bob: ['Charlie'],
    }));

    await followeeRepository.saveFollowee(FolloweeEntity.fromData({
      user: 'Alice',
      followee: 'Charlie',
    }));


    const followeesData = await fs.promises.readFile(testFolloweesPath);
    const followeesJson = JSON.parse(followeesData.toString());

    expect(followeesJson).toEqual({
      Alice: ['Charlie'],
      Bob: ['Charlie'],
    });
  });

  test('saveFollowee() should save a new followee', async () => {

    const followeeRepository = new FolloweeFileSystemRepositoryAdapter(testFolloweesPath);

    await fs.promises.writeFile(testFolloweesPath, JSON.stringify({
      Alice: ['Bob'],
      Bob: ['Charlie'],
    }));

    await followeeRepository.saveFollowee(FolloweeEntity.fromData({
      user: 'Alice',
      followee: 'Charlie',
    }));


    const followeesData = await fs.promises.readFile(testFolloweesPath);
    const followeesJson = JSON.parse(followeesData.toString());

    expect(followeesJson).toEqual({
      Alice: ['Bob', 'Charlie'],
      Bob: ['Charlie'],
    });
  });

  test('gestFolloweesOf() should return the user followees', async () => {
    const followeeRepository = new FolloweeFileSystemRepositoryAdapter(testFolloweesPath);

    await fs.promises.writeFile(testFolloweesPath, JSON.stringify({
      Alice: ['Bob', 'Charlie'],
      Bob: ['Charlie'],
    }));

    const [aliceFollowees, bobFollowees] = await Promise.all([
      followeeRepository.getFolloweesOf('Alice'),
      followeeRepository.getFolloweesOf('Bob'),
    ]);

    expect(aliceFollowees).toEqual(['Bob', 'Charlie']);
    expect(bobFollowees).toEqual(['Charlie']);
  });

});
