module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'driver_location',
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
            currentLocation: {
                field: 'current_location',
                type: DataTypes.GEOMETRY,
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive'),
                allowNull: true
            }
        },
        {
            sequelize,
            tableName: 'driver_location',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }]
                },
                {
                    name: 'current_location',
                    type: 'SPATIAL',
                    fields: [{ name: 'current_location', length: 32 }]
                },
                {
                    name: 'driver_id_fk',
                    using: 'BTREE',
                    fields: [{ name: 'driver_id' }]
                }
            ]
        }
    );
};
