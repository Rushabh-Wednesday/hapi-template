module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'cab_types',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            cab_type: {
                field: 'cab_type',
                type: DataTypes.ENUM('AUTO', 'BIKE', 'SEDAN', 'PRIME'),
                allowNull: true,
                unique: 'cab_type'
            }
        },
        {
            sequelize,
            tableName: 'cab_types',
            timestamps: true,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }]
                },
                {
                    name: 'cab_type',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'cab_type' }]
                }
            ]
        }
    );
};
