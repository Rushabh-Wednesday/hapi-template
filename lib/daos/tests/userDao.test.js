import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';
import { Sequelize } from 'sequelize';

describe('users dao test', () => {
    const { MOCK_USER, MOCK_BOOKING_ATTEMPT } = mockData;

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

    describe('updaetUser', () => {
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

    describe('createBookingAttempt', () => {
        let spy;

        it('should call create of booking_attempts', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.booking_attempts, 'create');
            });
            const { attemptToBookCab } = require('daos/userDao');
            await attemptToBookCab(MOCK_BOOKING_ATTEMPT);
            expect(spy).toBeCalledWith(
                expect.objectContaining(MOCK_BOOKING_ATTEMPT)
            );
        });
    });

    describe('findAllCab', () => {
        let spy;
        let pickupLocation = [18.52043, 73.85674299999999];
        const location = Sequelize.literal(
            `ST_GeomFromText('POINT(${pickupLocation[0]} ${pickupLocation[1]})')`
        );

        const current_location = Sequelize.fn(
            'ST_Distance_Sphere',
            Sequelize.col('current_location'),
            location
        );

        it('should call findAll of driver_location', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.driver_location, 'findAll');
            });

            const { findCab } = require('daos/userDao');
            await findCab(pickupLocation);
            expect(spy).toBeCalledWith(
                expect.objectContaining({
                    order: current_location,
                    limit: 5
                })
            );
        });
    });
});
