module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'drivers',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            firstName: {
                field: 'first_name',
                type: DataTypes.STRING(32),
                allowNull: false
            },
            lastName: {
                field: 'last_name',
                type: DataTypes.STRING(32),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(32),
                allowNull: false,
                unique: 'email'
            },
            mobileNo: {
                field: 'mobile_no',
                type: DataTypes.STRING(12),
                allowNull: true,
                unique: 'mobile_no'
            },
            cabTypeId: {
                field: 'cab_type_id',
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'cab_types',
                    key: 'id'
                }
            },
            cabNumber: {
                field: 'cab_number',
                type: DataTypes.STRING(12),
                allowNull: true
            },
            gender: {
                type: DataTypes.ENUM('male', 'female', 'others'),
                allowNull: true
            },
            createdAt: {
                field: 'created_at',
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                field: 'updated_at',
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            }
        },
        {
            sequelize,
            tableName: 'drivers',
            timestamps: true,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }]
                },
                {
                    name: 'email',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'email' }]
                },
                {
                    name: 'mobile_no',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'mobile_no' }]
                },
                {
                    name: 'cab_type_id',
                    using: 'BTREE',
                    fields: [{ name: 'cab_type_id' }]
                }
            ]
        }
    );
};
