import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

const {
    CREATE_DRIVER_PAYLOAD: createDriverPayload,
    DRIVER_LOCATION_PAYLOAD: driverLocationPayload,
    ACCEPT_BOOKING_PAYLOAD: acceptBookingPayload
} = mockData;

describe('/drivers route  tests', () => {
    let server;
    beforeEach(async () => {
        server = await resetAndMockDB(async allDbs => {});
    });

    it('should return 200 and add driver when proper payload is provided', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/drivers',
            payload: createDriverPayload
        });
        expect(res.statusCode).toEqual(200);
        const { result } = res;
        expect(result.first_name).toEqual(createDriverPayload.firstName);
        expect(result.last_name).toEqual(createDriverPayload.lastName);
        expect(result.email).toEqual(createDriverPayload.email);
        expect(result.mobile_no).toEqual(createDriverPayload.mobileNo);
        expect(result.gender).toEqual(createDriverPayload.gender);
    });

    it('should return 400 when payload is not provided', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/drivers'
        });
        expect(res.statusCode).toEqual(400);
    });

    it('should return 400 when there is an error from db', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.drivers.create = () =>
                new Promise((resolve, reject) => {
                    reject(new Error('Test Error'));
                });
        });

        const res = await server.inject({
            method: 'POST',
            url: '/drivers',
            payload: createDriverPayload
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Test Error');
    });

    it('should return 200 and update driver profile when proper payload is provided', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/drivers/profile/1',
            payload: createDriverPayload
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should return 400 when wrong payload is provided.', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/drivers/profile/1',
            payload: {}
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Invalid request payload input');
    });

    it('should return 400 when there is an error from db', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.drivers.update = () =>
                new Promise((resolve, reject) => {
                    reject(new Error('Test Error'));
                });
        });

        const res = await server.inject({
            method: 'PUT',
            url: '/drivers/profile/1',
            payload: createDriverPayload
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Test Error');
    });

    it('should return 200 and add driver in db when proper payload is provided', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/drivers/add-location',
            payload: driverLocationPayload
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should return 400 when proper payload is not provided', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/drivers/add-location',
            payload: {}
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Invalid request payload input');
    });

    it('should return 400 when there is an error from db', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.driver_location.create = () =>
                new Promise((resolve, reject) => {
                    reject(new Error('Test Error'));
                });
        });

        const res = await server.inject({
            method: 'POST',
            url: '/drivers/add-location',
            payload: driverLocationPayload
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Test Error');
    });

    it('should return 200 and create a  entry for booking when proper payload is provided.', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/drivers/accept',
            payload: acceptBookingPayload
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should return 400 when there is an error from db ', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.bookings.create = () =>
                new Promise((resolve, reject) => {
                    reject(new Error('Test Error'));
                });
        });

        const res = await server.inject({
            method: 'POST',
            url: '/drivers/accept',
            payload: acceptBookingPayload
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Test Error');
    });
});
