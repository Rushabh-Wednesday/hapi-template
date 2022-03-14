import { drivers, driver_location, bookings, booking_attempts } from 'models';
import { convertDbResponseToRawResponse } from 'utils/transformerUtils';

/**
 * create dao method to add new driver.
 * @author rushabh
 * @date 2022-03-07
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @param {string} mobileNo
 * @param {number} cabTypeId
 * @param {string} cabNumber
 * @param {Enumerator('male','female','other')} gender
 * @returns {any}
 */
export const addDriver = async driverDetail => {
    try {
        let driver = await drivers.create(driverDetail);
        return convertDbResponseToRawResponse(driver);
    } catch (error) {
        throw error;
    }
};

/**
 * update dao method to update driver details.
 * @author rushabh
 * @date 2022-03-07
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @param {string} mobileNo
 * @param {number} cabTypeId
 * @param {string} cabNumber
 * @param {Enumerator('male','female','other')} gender
 * @returns {any}
 */
export const updateDriver = async driverDetail => {
    const { id, ...restDetails } = driverDetail;

    return drivers.update(
        {
            ...restDetails
        },
        {
            where: {
                id
            }
        }
    );
};

/**
 * create dao method to add location of driver.
 * @author rushabh
 * @date 2022-03-07
 * @param {number} driverId
 * @param {Array} currentLocation
 * @param {Enumerator(active,inactive)} status
 * @returns {any}
 */
export const addDriverLocation = async driverDetail =>
    driver_location.create(driverDetail);

/**
 * create dao method to accept rides.
 * @author rushabh
 * @date 2022-03-07
 * @param {number}} driver_id
 * @param {number} bookingAttemptId
 * @returns {any}
 */
export const acceptBooking = async bookingDetail =>
    bookings.create(bookingDetail);

/**
 * update dao method to update driver details.
 * @author rushabh
 * @date 2022-03-07
 * @param {Enumerator('pending','accepted','completed','cancelled')} rideStatus
 * @param {Date} rideStarted_at
 * @param {Date} rideEndedAt
 * @returns {any}
 */
export const updateBookingAttempts = async bookingDetail => {
    const { bookingAttemptId, ...restDetail } = bookingDetail;
    return booking_attempts.update(
        {
            ...restDetail
        },
        {
            where: {
                id: bookingAttemptId
            }
        }
    );
};

/**
 * update dao method to update driver details.
 * @author rushabh
 * @date 2022-03-07
 * @param {number} bookingAttemptId
 * @returns {any}
 */
export const findBookingAttempt = async bookingAttemptId => {
    try {
        const bookingAttempt = await booking_attempts.findByPk(
            bookingAttemptId,
            {
                attributes: ['userId', 'fare', 'pickupLocation', 'dropLocation']
            }
        );
        const bookingAttemptRecord =
            convertDbResponseToRawResponse(bookingAttempt);
        bookingAttemptRecord.dropLocation =
            bookingAttemptRecord.dropLocation.coordinates;
        bookingAttemptRecord.pickupLocation =
            bookingAttemptRecord.pickupLocation.coordinates;

        return bookingAttemptRecord;
    } catch (error) {
        throw error;
    }
};
