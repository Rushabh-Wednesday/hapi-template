import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

const {
    CREATE_USER_PAYLOAD: createUserPayload,
    BOOKING_PAYLOAD: bookingPayload,
    FINDING_CAB_PAYLOAD: findingCabPayload
} = mockData;
describe('/user route tests ', () => {
    let server;
    beforeEach(async () => {
        server = await resetAndMockDB(async allDbs => {});
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

    it('should return 200 and add booking in db', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/users/attempt/1/booking',
            payload: bookingPayload
        });
        expect(res.statusCode).toEqual(200);
    });
    it('should return 400 when invalid payload is provided', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/users/attempt/1/booking',
            payload: {}
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Invalid request payload input');
    });

    it('should return 400 when there is an error from db', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.booking_attempts.create = () =>
                new Promise((resolve, reject) => {
                    reject(new Error('Test Error'));
                });
        });
        const res = await server.inject({
            method: 'POST',
            url: '/users/attempt/1/booking',
            payload: bookingPayload
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Test Error');
    });

    it('should find near by cab and return status 200 ', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/users/find/cab',
            payload: findingCabPayload
        });

        expect(res.statusCode).toEqual(200);
    });

    it('should return 400 when there is an error from db', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.driver_location.findAll = () =>
                new Promise((resolve, reject) => {
                    reject(new Error('Test Error'));
                });
        });
        const res = await server.inject({
            method: 'POST',
            url: '/users/find/cab',
            payload: findingCabPayload
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Test Error');
    });
});
