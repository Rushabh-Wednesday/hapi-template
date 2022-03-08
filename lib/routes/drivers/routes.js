import { Sequelize } from 'sequelize';
import Joi from '@hapi/joi';
import {
    addDriver,
    updateDriver,
    addDriverLocation,
    acceptBooking,
    updateBookingAttempts
} from 'daos/driverDao';
import {
    emailSchema,
    idAllowedSchema,
    stringSchema
} from 'utils/validationUtils';

module.exports = [
    {
        method: 'POST',
        path: '/add',
        options: {
            description: 'register new driver.',
            notes: 'POST drivers API',
            tags: ['api', 'drivers'],
            cors: true,
            auth: false,
            validate: {
                payload: Joi.object({
                    firstName: stringSchema,
                    lastName: stringSchema,
                    mobileNo: stringSchema,
                    email: emailSchema,
                    gender: Joi.string().valid('male', 'female', 'other'),
                    cabTypeId: idAllowedSchema,
                    cabNumber: stringSchema
                })
            }
        },
        handler: async (request, h) => {
            try {
                let driver = await addDriver(request.payload);
                return h.response(driver).code(200);
            } catch (error) {
                return h.response(error.message).code(400);
            }
        }
    },
    {
        method: 'PUT',
        path: '/profile/update',
        options: {
            description: 'update driver profile.',
            notes: 'PUT drivers API',
            tags: ['api', 'drivers'],
            cors: true,
            auth: false,
            validate: {
                payload: Joi.object({
                    id: idAllowedSchema,
                    firstName: stringSchema,
                    lastName: stringSchema,
                    mobileNo: stringSchema,
                    email: emailSchema,
                    gender: Joi.string().valid('male', 'female', 'other'),
                    cabTypeId: idAllowedSchema,
                    cabNumber: stringSchema
                })
            }
        },
        handler: async (request, h) => {
            try {
                await updateDriver(request.payload);
                return h
                    .response('Driver profile updated successfully.')
                    .code(200);
            } catch (error) {
                return h.response(error.message).code(400);
            }
        }
    },
    {
        method: 'POST',
        path: '/add_location',
        options: {
            description: 'add driver location.',
            notes: 'POST drivers API',
            tags: ['api', 'drivers'],
            cors: true,
            auth: false,
            validate: {
                payload: Joi.object({
                    driverId: idAllowedSchema,
                    currentLocation: Joi.array().items(Joi.number()),
                    status: Joi.string().valid('active')
                })
            }
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
                return h.response(error.message).code(400);
            }
        }
    },
    {
        method: 'POST',
        path: '/accept_ride',
        options: {
            description: ' accept the booking.',
            notes: 'POST drivers API',
            tags: ['api', 'drivers'],
            cors: true,
            auth: false,
            validate: {
                payload: Joi.object({
                    driverId: idAllowedSchema,
                    bookingAttemptId: idAllowedSchema
                })
            }
        },
        handler: async (request, h) => {
            try {
                let booking = await acceptBooking(request.payload);
                let bookingAttemptPayload = {
                    bookingAttemptId: request.payload.bookingAttemptId,
                    rideStatus: 'accepted'
                };
                await updateBookingAttempts(bookingAttemptPayload);
                return h.response(booking).code(200);
            } catch (error) {
                return h.response(error.message).code(400);
            }
        }
    }
];
