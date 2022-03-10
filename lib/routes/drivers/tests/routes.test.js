import { resetAndMockDB } from 'utils/testUtils';

const payload = {
    firstName: 'Jhon',
    lastName: 'Wick',
    email: 'wick@jhon.is',
    mobileNo: '8585959524',
    cabTypeId: 1,
    cabNumber: 'MH 20 9211',
    gender: 'male'
};

const payloadForLocation = {
    driverId: 1,
    currentLocation: [18.52043, 73.856743],
    status: 'active'
};

const payloadForAccepting = {
    driverId: 1,
    bookingAttemptId: 1
};

describe('/drivers route  tests', () => {
    let server;
    beforeEach(async () => {
        server = await resetAndMockDB(async allDbs => {});
    });

    it('should return 200', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/drivers',
            payload
        });
        expect(res.statusCode).toEqual(200);
        const { result } = res;
        expect(result.first_name).toEqual(payload.firstName);
        expect(result.last_name).toEqual(payload.lastName);
        expect(result.email).toEqual(payload.email);
        expect(result.mobile_no).toEqual(payload.mobileNo);
        expect(result.gender).toEqual(payload.gender);
    });

    it('should return 400', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/drivers'
        });
        expect(res.statusCode).toEqual(400);
    });

    it('should return 200', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/drivers/profile/1',
            payload
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should return 400', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/drivers/profile/1',
            payload: {}
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Invalid request payload input');
    });

    it('should return 200', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/drivers/add/location',
            payload: payloadForLocation
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should return 400', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/drivers/add/location',
            payload: {}
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Invalid request payload input');
    });

    it('should return 200', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/drivers/accept',
            payload: payloadForAccepting
        });
        expect(res.statusCode).toEqual(200);
    });
});
