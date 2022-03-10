import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

describe('drivers Dao tests', () => {
    const {
        MOCK_DRIVER_DETAILS,
        MOCK_DRIVER_LOCATION,
        MOCK_BOOKINGS,
        MOCK_BOOKING_ATTEMPT
    } = mockData;
    describe('createDriver', () => {
        let spy;
        it('should call create  of drivers', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.drivers, 'create');
            });
            const { addDriver } = require('daos/driverDao');
            await addDriver(MOCK_DRIVER_DETAILS);

            await expect(spy).toBeCalledWith(
                expect.objectContaining(MOCK_DRIVER_DETAILS)
            );
        });
    });

    describe('updateDriver', () => {
        let spy;

        it('should call update of drivers', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.drivers, 'update');
            });

            const { updateDriver } = require('daos/driverDao');
            const { id, ...restParam } = MOCK_DRIVER_DETAILS;
            await updateDriver(MOCK_DRIVER_DETAILS);
            expect(spy).toBeCalledWith(
                expect.objectContaining({
                    ...restParam
                }),
                expect.objectContaining({
                    where: {
                        id
                    }
                })
            );
        });
    });

    describe('addDriverLocation', () => {
        let spy;

        it('should call create of driver_location', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.driver_location, 'create');
            });
            const { addDriverLocation } = require('daos/driverDao');
            await addDriverLocation(MOCK_DRIVER_LOCATION);
            await expect(spy).toBeCalledWith(
                expect.objectContaining(MOCK_DRIVER_LOCATION)
            );
        });
    });

    describe('acceptBooking', () => {
        let spy;

        it('should call create of bookings', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.bookings, 'create');
            });

            const { acceptBooking } = require('daos/driverDao');
            await acceptBooking(MOCK_BOOKINGS);
            await expect(spy).toBeCalledWith(
                expect.objectContaining(MOCK_BOOKINGS)
            );
        });

        it('should call update of booking_attempt', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.booking_attempts, 'update');
            });
            const { updateBookingAttempts } = require('daos/driverDao');
            const booking_attempt_id = MOCK_BOOKING_ATTEMPT.id;
            await updateBookingAttempts({
                ...MOCK_BOOKING_ATTEMPT,
                booking_attempt_id
            });

            expect(spy).toBeCalledWith(
                expect.objectContaining(MOCK_BOOKING_ATTEMPT),
                expect.objectContaining({
                    where: {
                        id: booking_attempt_id
                    }
                })
            );
        });
    });
});
