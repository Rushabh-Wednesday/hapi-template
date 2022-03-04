module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'bookings',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            driverId: {
                field: 'driver_id',
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'drivers',
                    key: 'id'
                }
            },
            bookingAttemptId: {
                field: 'booking_attempt_id',
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'booking_attempts',
                    key: 'id'
                },
                unique: 'booking_attempt_id'
            }
        },
        {
            sequelize,
            tableName: 'bookings',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }]
                },
                {
                    name: 'booking_attempt_id',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'booking_attempt_id' }]
                },
                {
                    name: 'fk_driver_id',
                    using: 'BTREE',
                    fields: [{ name: 'driver_id' }]
                }
            ]
        }
    );
};
