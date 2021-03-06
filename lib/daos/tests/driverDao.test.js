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
            const bookingAttemptId = MOCK_BOOKING_ATTEMPT.id;
            await updateBookingAttempts({
                ...MOCK_BOOKING_ATTEMPT,
                bookingAttemptId
            });

            expect(spy).toBeCalledWith(
                expect.objectContaining(MOCK_BOOKING_ATTEMPT),
                expect.objectContaining({
                    where: {
                        id: bookingAttemptId
                    }
                })
            );
        });

        it('should call findByPk of booking_attempt', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.booking_attempts, 'findByPk');
            });
            const bookingAttemptId = MOCK_BOOKING_ATTEMPT.id;
            const { findBookingAttempt } = require('daos/driverDao');
            await findBookingAttempt(bookingAttemptId);
            expect(bookingAttemptId).toBe(1);
            expect.objectContaining({
                attributes: ['userId', 'fare', 'pickupLocation', 'dropLocation']
            });
        });

        it('should throw an error if there is an error from db side', async () => {
            await resetAndMockDB(db => {
                db.booking_attempts.findByPk = () =>
                    new Promise((resolve, reject) => reject(new Error()));
            });
            const bookingAttemptId = MOCK_BOOKING_ATTEMPT.id;
            const { findBookingAttempt } = require('daos/driverDao');

            expect(findBookingAttempt(bookingAttemptId)).rejects.toThrow();
        });
    });
});
