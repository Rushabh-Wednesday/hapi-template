module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'users',
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
            gender: {
                type: DataTypes.ENUM('male', 'female', 'others'),
                allowNull: true
            }
        },
        {
            sequelize,
            tableName: 'users',
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
                }
            ]
        }
    );
};
