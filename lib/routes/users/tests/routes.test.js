import { resetAndMockDB } from 'utils/testUtils';

const payload = {
    firstName: 'Sharan',
    lastName: 'Salian',
    email: 'sharan@wednesday.is',
    mobileNo: '8585959522',
    gender: 'male'
};

const payloadForBooking = {
    pickupLocation: [18.47763, 73.88786],
    dropLocation: [18.48763, 73.89786],
    rideStatus: 'pending',
    fare: 73
};

const payloadForFindingCab = {
    pickupLocation: [18.47763, 73.88786]
};

describe('/user route tests ', () => {
    let server;
    beforeEach(async () => {
        server = await resetAndMockDB(async allDbs => {});
    });

    it('should return 200', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/users',
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
            url: '/users'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Invalid request payload input');
    });

    it('should return 200', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/users/profile/1',
            payload
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should return 400', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/users/profile/1'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Invalid request payload input');
    });

    it('should return 200', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/users/attempt/1/booking',
            payload: payloadForBooking
        });
        expect(res.statusCode).toEqual(200);
    });
    it('should return 400', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/users/attempt/1/booking',
            payload
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Invalid request payload input');
    });

    it('should find near by cab ', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/users/find/cab',
            payload: payloadForFindingCab
        });

        expect(res.statusCode).toEqual(200);
    });
});
