import { drivers, driver_location, bookings, booking_attempts } from 'models';

/**
 * create dao method to add new driver.
 * @author rushabh
 * @date 2022-03-07
 * @param {any} first_name
 * @param {any} last_name
 * @param {any} email
 * @param {any} mobile_no
 * @param {any} cab_type_id
 * @param {any} cab_number
 * @param {'male','female','other'} gender
 * @returns {any}
 */
export const addDriver = async driverDetail => drivers.create(driverDetail);

/**
 * update dao method to update driver details.
 * @author rushabh
 * @date 2022-03-07
 * @param {any} first_name
 * @param {any} last_name
 * @param {any} email
 * @param {any} mobile_no
 * @param {any} cab_type_id
 * @param {any} cab_number
 * @param {'male','female','other'} gender
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
 * @param {any} driver_id
 * @param {any} current_location
 * @param {active,inactive} status
 * @returns {any}
 */
export const addDriverLocation = async driverDetail =>
    driver_location.create(driverDetail);

/**
 * create dao method to accept rides.
 * @author rushabh
 * @date 2022-03-07
 * @param {any} driver_id
 * @param {any} booking_attempt_id
 * @returns {any}
 */
export const acceptBooking = async bookingDetail =>
    bookings.create(bookingDetail);

/**
 * update dao method to update driver details.
 * @author rushabh
 * @date 2022-03-07
 * @param {any} ride_status
 * @param {any} ride_statrted_at
 * @param {any} ride_ended_at
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
