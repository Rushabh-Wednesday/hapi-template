import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

describe('users dao test', () => {
    const { MOCK_USER } = mockData;
    const attributes = [
        'id',
        'first_name',
        'last_name',
        'email',
        'oauth_client_id'
    ];

    describe('findOneUser', () => {
        it('should find a user by ID', async () => {
            const { findOneUser } = require('daos/userDao');
            const testUser = await findOneUser(1);
            expect(testUser.id).toEqual(1);
            expect(testUser.firstName).toEqual(MOCK_USER.firstName);
            expect(testUser.lastName).toEqual(MOCK_USER.lastName);
            expect(testUser.email).toEqual(MOCK_USER.email);
        });
        it('should call findOne with the correct parameters', async () => {
            let spy;
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.users, 'findOne');
            });
            const { findOneUser } = require('daos/userDao');

            let userId = 1;
            await findOneUser(userId);
            expect(spy).toBeCalledWith({
                attributes,
                underscoredAll: false,
                where: {
                    id: userId
                }
            });

            jest.clearAllMocks();
            userId = 2;
            await findOneUser(userId);
            expect(spy).toBeCalledWith({
                attributes,
                underscoredAll: false,
                where: {
                    id: userId
                }
            });
        });
    });

    describe('findAllUser ', () => {
        let spy;
        const where = {};
        let page = 1;
        let limit = 10;
        let offset = (page - 1) * limit;

        it('should find all the users', async () => {
            const { findAllUser } = require('daos/userDao');
            const { allUsers } = await findAllUser(1, 10);
            const firstUser = allUsers[0];
            expect(firstUser.id).toEqual(1);
            expect(firstUser.firstName).toEqual(MOCK_USER.firstName);
            expect(firstUser.lastName).toEqual(MOCK_USER.lastName);
            expect(firstUser.email).toEqual(MOCK_USER.email);
        });

        it('should call findAll with the correct parameters', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.users, 'findAll');
            });
            const { findAllUser } = require('daos/userDao');
            await findAllUser(page, limit);
            expect(spy).toBeCalledWith({
                attributes,
                where,
                offset,
                limit
            });
            jest.clearAllMocks();
            page = 2;
            limit = 10;
            offset = (page - 1) * limit;
            await findAllUser(page, limit);
            expect(spy).toBeCalledWith({
                attributes,
                where,
                offset,
                limit
            });
        });
        it('should call count with an empty object', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.users, 'count');
            });
            const { findAllUser } = require('daos/userDao');
            await findAllUser(page, limit);
            expect(spy).toBeCalledWith({ where });
        });
    });

    describe('createUser', () => {
        it('should call create of users', async () => {
            let spy;
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.users, 'create');
            });
            const { registerUser } = require('daos/userDao');
            await registerUser(MOCK_USER);

            await expect(spy).toBeCalledWith(
                expect.objectContaining(MOCK_USER)
            );
        });
    });

    describe('updateUser', () => {
        let spy;
        it('should call update of users', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.users, 'update');
            });
            const { updateUser } = require('daos/userDao');
            const { id, ...restDetail } = MOCK_USER;
            await updateUser(MOCK_USER);
            expect(spy).toBeCalledWith(
                expect.objectContaining({
                    ...restDetail
                }),
                expect.objectContaining({
                    where: {
                        id
                    }
                })
            );
        });
    });
});
