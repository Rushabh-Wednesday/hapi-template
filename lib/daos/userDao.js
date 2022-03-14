import { users } from 'models';
import { convertDbResponseToRawResponse } from 'utils/transformerUtils';

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
