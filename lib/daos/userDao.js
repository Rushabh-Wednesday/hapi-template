import { users, booking_attempts, driver_location } from 'models';
import { Sequelize } from 'sequelize';

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
 * @param {any} first_name
 * @param {any} last_name
 * @param {any} email
 * @param {any} mobile_no
 * @param {'male','female','other'} gender
 * @returns {any}
 */
export const registerUser = async userDetails => users.create(userDetails);

/**
 * create dao method to update user.
 * @author rushabh
 * @date 2022-03-07
 * @param {any} first_name
 * @param {any} last_name
 * @param {any} email
 * @param {any} mobile_no
 * @param {'male','female','other'} gender
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
 * @param {any} user_id
 * @param {any} pickup_location
 * @param {any} drop_location
 * @param {'pending'} ride_status
 * @param {any} fare
 * @returns {any}
 */
export const attemptToBookCab = async bookingDetail =>
    booking_attempts.create(bookingDetail);

/**
 * create dao method to book a cab.
 * @author rushabh
 * @date 2022-03-07
 * @param {any} pickup_location
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
    return driver_location.findAll({
        order: current_location,
        limit: 5
    });
};
