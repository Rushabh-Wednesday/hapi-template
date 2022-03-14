import { Sequelize } from 'sequelize';
import { attemptToBookCab, findCab } from 'daos/cabDao';
import { users } from 'utils/apiValidations';

module.exports = [
    {
        method: 'POST',
        path: '/attempt-booking/{userId}',
        options: {
            description: 'attempt to book a cab',
            notes: 'POST cabs API',
            tags: ['api', 'cabs'],
            cors: true,
            auth: false,
            validate: users.attemptBooking
        },
        handler: async (request, h) => {
            try {
                const userId = request.params.userId;
                request.payload.userId = userId;
                const { pickupLocation, dropLocation } = request.payload;
                request.payload.pickupLocation = Sequelize.fn(
                    'ST_GeomFromText',
                    `POINT(${pickupLocation[0]} ${pickupLocation[1]})`
                );
                request.payload.dropLocation = Sequelize.fn(
                    'ST_GeomFromText',
                    `POINT(${dropLocation[0]} ${dropLocation[1]})`
                );
                let attemptToBook = await attemptToBookCab(request.payload);
                delete attemptToBook['createdAt'];
                delete attemptToBook['rideStatus'];
                delete attemptToBook.pickupLocation.fn;
                delete attemptToBook.dropLocation.fn;
                attemptToBook.dropLocation = attemptToBook.dropLocation.args[0];
                attemptToBook.pickupLocation =
                    attemptToBook.pickupLocation.args[0];
                return h.response(attemptToBook).code(200);
            } catch (error) {
                return h
                    .response({ status: 400, message: error.message })
                    .code(400);
            }
        }
    },
    {
        method: 'POST',
        path: '/find',
        options: {
            description: 'find nearby cabs',
            notes: 'POST cabs API',
            tags: ['api', 'cabs'],
            cors: true,
            auth: false,
            validate: users.findCab
        },
        handler: async (request, h) => {
            try {
                let cab = await findCab(request.payload.pickupLocation);
                return h.response(cab).code(200);
            } catch (error) {
                return h
                    .response({ status: 400, message: error.message })
                    .code(400);
            }
        }
    }
];
