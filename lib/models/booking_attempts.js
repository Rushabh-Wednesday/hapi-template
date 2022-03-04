module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'booking_attempts',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            userId: {
                filed: 'user_id',
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            pickupLocation: {
                field: 'pickup_location',
                type: DataTypes.GEOMETRY,
                allowNull: false
            },
            dropLocation: {
                field: 'drop_location',
                type: DataTypes.GEOMETRY,
                allowNull: false
            },
            rideStatus: {
                field: 'ride_status',
                type: DataTypes.ENUM(
                    'pending',
                    'accepted',
                    'completed',
                    'cancelled'
                ),
                allowNull: true
            },
            fare: {
                type: DataTypes.DECIMAL(7, 2),
                allowNull: true
            },
            rideStartedAt: {
                field: 'ride_started_at',
                type: DataTypes.DATE,
                allowNull: true
            },
            rideEndedAt: {
                field: 'ride_ended_at',
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            sequelize,
            tableName: 'booking_attempts',
            timestamps: true,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }]
                },
                {
                    name: 'user_id',
                    using: 'BTREE',
                    fields: [{ name: 'user_id' }]
                }
            ]
        }
    );
};