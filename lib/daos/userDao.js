import { users, booking_attempts, driver_location } from 'models';
import { Sequelize } from 'sequelize';
import {
    convertDbResponseToRawResponse,
    transformDbArrayResponseToRawResponse
} from 'utils/transformerUtils';

const attributes = [
    'id',
    'first_name',
    'last_name',
    'email',
    'oauth_client_id'
];

export const findOneUser = async userId =>
    users.findOne({
        attributes,
        where: {
            id: userId
        },
        underscoredAll: false
    });

export const findAllUser = async (page, limit) => {
    const where = {};
    const totalCount = await users.count({ where });
    const allUsers = await users.findAll({
        attributes,
        where,
        offset: (page - 1) * limit,
        limit
    });
    return { allUsers, totalCount };
};

/**
 * create dao method to add new user.
 * @author rushabh
 * @date 2022-03-07
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @param {string} mobileNo
 * @param {enum('male','female','other')} gender
 * @returns {any}
 */
export const registerUser = async userDetails => {
    try {
        let user = await users.create(userDetails);
        return convertDbResponseToRawResponse(user);
    } catch (error) {
        throw error;
    }
};

/**
 * create dao method to update user.
 * @author rushabh
 * @date 2022-03-07
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @param {string} mobileNo
 * @param {enum('male','female','other')} gender
 * @returns {any}
 */
export const updateUser = async userDetails => {
    const { id, ...restDetail } = userDetails;
    return users.update(
        {
            ...restDetail
        },
        {
            where: {
                id
            }
        }
    );
};

/**
 * create dao method to book a cab.
 * @author rushabh
 * @date 2022-03-07
 * @param {number} userId
 * @param {Array} pickupLocation
 * @param {Array} dropLocation
 * @param {enum('pending')} rideStatus
 * @param {number} fare
 * @returns {any}
 */
export const attemptToBookCab = async bookingDetail =>
    booking_attempts.create(bookingDetail);

/**
 * create dao method to book a cab.
 * @author rushabh
 * @date 2022-03-07
 * @param {any} pickupLocation
 * @returns {any}
 */
export const findCab = async pickupLocation => {
    const location = Sequelize.literal(
        `ST_GeomFromText('POINT(${pickupLocation[0]} ${pickupLocation[1]})')`
    );

    const current_location = Sequelize.fn(
        'ST_Distance_Sphere',
        Sequelize.col('current_location'),
        location
    );
    let driverLocation = await driver_location.findAll({
        order: [current_location, ['id', 'DESC']],
        limit: 5
    });
    return transformDbArrayResponseToRawResponse(driverLocation);
};
