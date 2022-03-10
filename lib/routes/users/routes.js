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
} from 'daos/userDao';
import { users } from 'utils/apiValidations';

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
        path: '/',
        options: {
            description: 'register new user.',
            notes: 'POST users API',
            tags: ['api', 'users'],
            cors: true,
            auth: false,
            validate: users.create
        },
        handler: async (request, h) => {
            try {
                let user = await registerUser(request.payload);
                ['createdAt', 'updatedAt'].forEach(key => delete user[key]);
                return h.response(user).code(200);
            } catch (error) {
                return h
                    .response({ status: 400, message: error.message })
                    .code(400);
            }
        }
    },
    {
        method: 'PUT',
        path: '/profile/{id}',
        options: {
            description: 'update user profile.',
            notes: 'PUT users API',
            tags: ['api', 'users'],
            cors: true,
            auth: false,
            validate: users.profile
        },
        handler: async (request, h) => {
            try {
                let id = request.params.id;
                request.payload.id = id;
                await updateUser(request.payload);
                return h
                    .response({ message: 'User updated successfully.' })
                    .code(200);
            } catch (error) {
                return h
                    .response({ status: 400, message: error.message })
                    .code(400);
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
    },
    {
        method: 'POST',
        path: '/attempt/{userId}/booking',
        options: {
            description: 'attempt to book a cab',
            notes: 'POST users API',
            tags: ['api', 'users'],
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
                let attemptToBook = convertDbResponseToRawResponse(
                    await attemptToBookCab(request.payload)
                );
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
    }
];
