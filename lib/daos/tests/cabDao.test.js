import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

describe('cab dao test', () => {
    const { MOCK_BOOKING_ATTEMPT } = mockData;
    describe('createBookingAttempt', () => {
        let spy;

        it('should call create of booking_attempts', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.booking_attempts, 'create');
            });
            const { attemptToBookCab } = require('daos/cabDao');
            await attemptToBookCab(MOCK_BOOKING_ATTEMPT);
            expect(spy).toBeCalledWith(
                expect.objectContaining(MOCK_BOOKING_ATTEMPT)
            );
        });
    });
});
