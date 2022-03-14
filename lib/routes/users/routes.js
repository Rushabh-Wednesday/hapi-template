import get from 'lodash/get';
import { notFound, badImplementation } from 'utils/responseInterceptors';
import { server } from 'root/server.js';
import { transformDbArrayResponseToRawResponse } from 'utils/transformerUtils';
import { findAllUser, registerUser, updateUser } from 'daos/userDao';
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
    }
];
