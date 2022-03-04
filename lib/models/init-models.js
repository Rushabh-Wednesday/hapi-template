var DataTypes = require('sequelize').DataTypes;
var _SequelizeMeta = require('./SequelizeMeta');
var _booking_attempts = require('./booking_attempts');
var _bookings = require('./bookings');
var _cab_types = require('./cab_types');
var _driver_location = require('./driver_location');
var _drivers = require('./drivers');
var _users = require('./users');

function initModels(sequelize) {
    var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
    var booking_attempts = _booking_attempts(sequelize, DataTypes);
    var bookings = _bookings(sequelize, DataTypes);
    var cab_types = _cab_types(sequelize, DataTypes);
    var driver_location = _driver_location(sequelize, DataTypes);
    var drivers = _drivers(sequelize, DataTypes);
    var users = _users(sequelize, DataTypes);

    bookings.belongsTo(booking_attempts, {
        as: 'booking_attempt',
        foreignKey: 'booking_attempt_id'
    });
    booking_attempts.hasOne(bookings, {
        as: 'booking',
        foreignKey: 'booking_attempt_id'
    });
    drivers.belongsTo(cab_types, { as: 'cab_type', foreignKey: 'cab_type_id' });
    cab_types.hasMany(drivers, { as: 'drivers', foreignKey: 'cab_type_id' });
    bookings.belongsTo(drivers, { as: 'driver', foreignKey: 'driver_id' });
    drivers.hasMany(bookings, { as: 'bookings', foreignKey: 'driver_id' });
    driver_location.belongsTo(drivers, {
        as: 'driver',
        foreignKey: 'driver_id'
    });
    drivers.hasMany(driver_location, {
        as: 'driver_locations',
        foreignKey: 'driver_id'
    });
    booking_attempts.belongsTo(users, { as: 'user', foreignKey: 'user_id' });
    users.hasMany(booking_attempts, {
        as: 'booking_attempts',
        foreignKey: 'user_id'
    });

    return {
        SequelizeMeta,
        booking_attempts,
        bookings,
        cab_types,
        driver_location,
        drivers,
        users
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
