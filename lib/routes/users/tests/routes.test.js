import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

const { CREATE_USER_PAYLOAD: createUserPayload, MOCK_USER: user } = mockData;
describe('/user route tests ', () => {
    let server;
    beforeEach(async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.users.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return user;
                }
            });
        });
    });

    it('should return 200', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/users/1'
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should return 404', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/users/2'
        });
        expect(res.statusCode).toEqual(404);
        expect(res.result.message).toEqual('No user was found for id 2');
    });

    it('should return all the users ', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.users.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return user;
                }
            });
        });
        const res = await server.inject({
            method: 'GET',
            url: '/users'
        });
        expect(res.statusCode).toEqual(200);
        const userOne = res.result.results[0];
        expect(userOne.id).toEqual(user.id);
        expect(userOne.first_name).toEqual(user.first_name);
        expect(userOne.last_name).toEqual(user.last_name);
        expect(userOne.email).toEqual(user.email);
        expect(res.result.total_count).toEqual(1);
    });

    it('should return notFound if no users are found', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.users.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return null;
                }
            });
            allDbs.users.findAll = () => null;
        });
        const res = await server.inject({
            method: 'GET',
            url: '/users'
        });
        expect(res.statusCode).toEqual(404);
    });

    it('should return badImplementation if findAllUsers fails', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.users.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return null;
                }
            });
            allDbs.users.findAll = () =>
                new Promise((resolve, reject) => {
                    reject(new Error());
                });
        });
        const res = await server.inject({
            method: 'GET',
            url: '/users'
        });
        expect(res.statusCode).toEqual(500);
    });
    it('should return 200 and add user in db when proper payload is provided', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/users',
            payload: createUserPayload
        });
        expect(res.statusCode).toEqual(200);
        const { result } = res;
        expect(result.first_name).toEqual(createUserPayload.firstName);
        expect(result.last_name).toEqual(createUserPayload.lastName);
        expect(result.email).toEqual(createUserPayload.email);
        expect(result.mobile_no).toEqual(createUserPayload.mobileNo);
        expect(result.gender).toEqual(createUserPayload.gender);
    });

    it('should return 400 when proper payload is not provided', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/users'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Invalid request payload input');
    });

    it('should return 400 when there is an error from db', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.users.create = () =>
                new Promise((resolve, reject) => {
                    reject(new Error('Test Error'));
                });
        });

        const res = await server.inject({
            method: 'POST',
            url: '/users',
            payload: createUserPayload
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Test Error');
    });

    it('should return 200 and update user profile when proper payload is provided', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/users/profile/1',
            payload: createUserPayload
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should return 400 when invalid payload is provided', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/users/profile/1'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Invalid request payload input');
    });

    it('should return 400 when there is an error from db', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.users.update = () =>
                new Promise((resolve, reject) => {
                    reject(new Error('Test Error'));
                });
        });
        const res = await server.inject({
            method: 'PUT',
            url: '/users/profile/1',
            payload: createUserPayload
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Test Error');
    });
});
