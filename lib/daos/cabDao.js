import { booking_attempts, sequelize } from 'models';
import { convertDbResponseToRawResponse } from 'utils/transformerUtils';

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
export const attemptToBookCab = async bookingDetail => {
    try {
        let bookingAttempt = await booking_attempts.create(bookingDetail);
        return convertDbResponseToRawResponse(bookingAttempt);
    } catch (error) {
        throw error;
    }
};

/**
 * create dao method to book a cab.
 * @author rushabh
 * @date 2022-03-07
 * @param {any} pickupLocation
 * @returns {any}
 */
export const findCab = async pickupLocation => {
    const driverLocation = await sequelize.query(
        `SELECT *,ST_Distance_Sphere(
            driver_location.current_location,
            point(${pickupLocation[0]}, ${pickupLocation[1]}))*0.001 AS distance FROM driver_location WHERE (driver_id, id) IN
         ( SELECT driver_id , MAX(id)
           FROM driver_location
           GROUP BY driver_id
         ) ORDER BY distance  LIMIT 5`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    return driverLocation;
};
