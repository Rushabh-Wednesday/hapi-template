import { Sequelize } from 'sequelize';
import get from 'lodash/get';
import { notFound, badImplementation } from 'utils/responseInterceptors';
import { server } from 'root/server.js';
import {
    convertDbResponseToRawResponse,
    transformDbArrayResponseToRawResponse
} from 'utils/transformerUtils';
import {
    findAllUser,
    registerUser,
    updateUser,
    findCab,
    attemptToBookCab
} from '../../daos/userDao';
import Joi from '@hapi/joi';
import {
    emailSchema,
    idAllowedSchema,
    stringSchema
} from 'utils/validationUtils';

module.exports = [
    {
        method: 'GET',
        path: '/{userId}',
        options: {
            description: 'get one user by ID',
            notes: 'GET users API',
            tags: ['api', 'users'],
            cors: true
        },
        handler: async request => {
            const userId = request.params.userId;
            return server.methods.findOneUser(userId).then(user => {
                if (!user) {
                    return notFound(`No user was found for id ${userId}`);
                }
                return user;
            });
        }
    },
    {
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            const { page, limit } = request.query;
            return findAllUser(page, limit)
                .then(users => {
                    if (get(users.allUsers, 'length')) {
                        const totalCount = users.totalCount;
                        const allUsers = transformDbArrayResponseToRawResponse(
                            users.allUsers
                        ).map(user => user);

                        return h.response({
                            results: allUsers,
                            totalCount
                        });
                    }
                    return notFound('No users found');
                })
                .catch(error => badImplementation(error.message));
        },
        options: {
            description: 'get all users',
            notes: 'GET users API',
            tags: ['api', 'users'],
            plugins: {
                pagination: {
                    enabled: true
                },
                query: {
                    pagination: true
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/register',
        options: {
            description: 'register new user.',
            notes: 'POST users API',
            tags: ['api', 'users'],
            cors: true,
            auth: false,
            validate: {
                payload: Joi.object({
                    firstName: stringSchema,
                    lastName: stringSchema,
                    mobileNo: stringSchema,
                    email: emailSchema,
                    gender: Joi.string().valid('male', 'female', 'other')
                })
            }
        },
        handler: async (request, h) => {
            try {
                let user = await registerUser(request.payload);
                return h.response(user).code(200);
            } catch (error) {
                return h.response({ message: error.message }).code(400);
            }
        }
    },
    {
        method: 'PUT',
        path: '/profile/update',
        options: {
            description: 'update user profile.',
            notes: 'PUT users API',
            tags: ['api', 'users'],
            cors: true,
            auth: false,
            validate: {
                payload: Joi.object({
                    id: idAllowedSchema,
                    firstName: stringSchema,
                    lastName: stringSchema,
                    mobileNo: stringSchema,
                    email: emailSchema,
                    gender: Joi.string().valid('male', 'female', 'other')
                })
            }
        },
        handler: async (request, h) => {
            try {
                await updateUser(request.payload);
                return h
                    .response({ message: 'User updated successfully.' })
                    .code(200);
            } catch (error) {
                return h.response(error.message).code(400);
            }
        }
    },
    {
        method: 'POST',
        path: '/find/cab',
        options: {
            description: 'find nearby cabs',
            notes: 'POST users API',
            tags: ['api', 'users'],
            cors: true,
            auth: false,
            validate: {
                payload: Joi.object({
                    pickupLocation: Joi.array().items(Joi.number())
                })
            }
        },
        handler: async (request, h) => {
            try {
                let cab = transformDbArrayResponseToRawResponse(
                    await findCab(request.payload.pickupLocation)
                );
                return h.response(cab).code(200);
            } catch (error) {
                return h.response(error.message).code(400);
            }
        }
    },
    {
        method: 'POST',
        path: '/attempt_to_book_cab',
        options: {
            description: 'attempt to book a cab',
            notes: 'POST users API',
            tags: ['api', 'users'],
            cors: true,
            auth: false,
            validate: {
                payload: Joi.object({
                    userId: idAllowedSchema,
                    pickupLocation: Joi.array().items(Joi.number()),
                    dropLocation: Joi.array().items(Joi.number()),
                    fare: Joi.number().required(),
                    rideStatus: Joi.string().valid('pending')
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { pickupLocation, dropLocation } = request.payload;
                request.payload.pickupLocation = Sequelize.fn(
                    'ST_GeomFromText',
                    `POINT(${pickupLocation[0]} ${pickupLocation[1]})`
                );
                request.payload.dropLocation = Sequelize.fn(
                    'ST_GeomFromText',
                    `POINT(${dropLocation[0]} ${dropLocation[1]})`
                );
                let attemptToBook = convertDbResponseToRawResponse(
                    await attemptToBookCab(request.payload)
                );
                return h.response(attemptToBook).code(200);
            } catch (error) {
                return h.response(error.message).code(400);
            }
        }
    }
];
