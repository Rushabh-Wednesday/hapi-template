import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';
const {
    BOOKING_PAYLOAD: bookingPayload
    //FINDING_CAB_PAYLOAD: findingCabPayload
} = mockData;

describe('/cabs routes test', () => {
    let server;
    beforeEach(async () => {
        server = await resetAndMockDB(async allDbs => {});
    });

    it('should return 200 and add booking in db', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/cabs/booking-attempt/1',
            payload: bookingPayload
        });
        expect(res.statusCode).toEqual(200);
    });
    it('should return 400 when invalid payload is provided', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/cabs/booking-attempt/1',
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
            url: '/cabs/booking-attempt/1',
            payload: bookingPayload
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Test Error');
    });
    // it('should find near by cab and return status 200 ', async () => {
    //     const res = await server.inject({
    //         method: 'POST',
    //         url: '/cabs/find',
    //         payload: findingCabPayload
    //     });
    //     console.log("res",res.result)
    //     //expect(res.statusCode).toEqual(200);
    // });

    // it('should return 400 when there is an error from db', async () => {
    //     server = await resetAndMockDB(async allDbs => {
    //         allDbs.driver_location.findAll = () =>
    //             new Promise((resolve, reject) => {
    //                 reject(new Error('Test Error'));
    //             });
    //     });
    //     const res = await server.inject({
    //         method: 'POST',
    //         url: '/users/find/cab',
    //         payload: findingCabPayload
    //     });
    //     expect(res.statusCode).toEqual(400);
    //     expect(res.result.message).toEqual('Test Error');
    // });
});
