import { Sequelize } from 'sequelize';
import {
    addDriver,
    updateDriver,
    addDriverLocation,
    acceptBooking,
    updateBookingAttempts,
    findBookingAttempt
} from 'daos/driverDao';
import { convertDbResponseToRawResponse } from 'utils/transformerUtils';
import { drivers } from 'utils/apiValidations';

module.exports = [
    {
        method: 'POST',
        path: '/',
        options: {
            description: 'register new driver.',
            notes: 'POST drivers API',
            tags: ['api', 'drivers'],
            cors: true,
            auth: false,
            validate: drivers.create
        },
        handler: async (request, h) => {
            try {
                let driver = await addDriver(request.payload);
                ['createdAt', 'updatedAt'].forEach(key => delete driver[key]);
                return h.response(driver).code(200);
            } catch (error) {
                return h
                    .response({ status: 400, error: error.message })
                    .code(400);
            }
        }
    },
    {
        method: 'PUT',
        path: '/profile/{driverId}',
        options: {
            description: 'update driver profile.',
            notes: 'PUT drivers API',
            tags: ['api', 'drivers'],
            cors: true,
            auth: false,
            validate: drivers.profile
        },
        handler: async (request, h) => {
            try {
                const id = request.params.driverId;
                request.payload.id = id;
                await updateDriver(request.payload);
                return h
                    .response('Driver profile updated successfully.')
                    .code(200);
            } catch (error) {
                return h
                    .response({ status: 400, error: error.message })
                    .code(400);
            }
        }
    },
    {
        method: 'POST',
        path: '/add/location',
        options: {
            description: 'add driver location.',
            notes: 'POST drivers API',
            tags: ['api', 'drivers'],
            cors: true,
            auth: false,
            validate: drivers.location
        },
        handler: async (request, h) => {
            try {
                const { currentLocation } = request.payload;
                request.payload.currentLocation = Sequelize.fn(
                    'ST_GeomFromText',
                    `POINT(${currentLocation[0]} ${currentLocation[1]})`
                );
                let driverLocation = await addDriverLocation(request.payload);
                return h.response(driverLocation).code(200);
            } catch (error) {
                return h
                    .response({ status: 400, error: error.message })
                    .code(400);
            }
        }
    },
    {
        method: 'POST',
        path: '/accept',
        options: {
            description: ' accept the booking.',
            notes: 'POST drivers API',
            tags: ['api', 'drivers'],
            cors: true,
            auth: false,
            validate: drivers.accept
        },
        handler: async (request, h) => {
            try {
                await acceptBooking(request.payload);
                let bookingAttemptPayload = {
                    bookingAttemptId: request.payload.bookingAttemptId,
                    rideStatus: 'accepted'
                };
                await updateBookingAttempts(bookingAttemptPayload);
                let bookingAttempt = convertDbResponseToRawResponse(
                    await findBookingAttempt(
                        bookingAttemptPayload.bookingAttemptId
                    )
                );
                delete bookingAttempt.createdAt;
                delete bookingAttempt.pickupLocation.type;
                delete bookingAttempt.dropLocation.type;
                bookingAttempt.dropLocation =
                    bookingAttempt.dropLocation.coordinates;
                bookingAttempt.pickupLocation =
                    bookingAttempt.pickupLocation.coordinates;

                return h.response({ bookingAttempt }).code(200);
            } catch (error) {
                return h
                    .response({ status: 400, error: error.message })
                    .code(400);
            }
        }
    }
];
