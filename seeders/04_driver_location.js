module.exports = {
    up: (queryInterface, Sequelize) => {
        const arr = [
            {
                id: 1,
                driver_id: 1,
                current_location: Sequelize.fn(
                    'ST_GeomFromText',
                    'POINT(18.520430 73.856743)'
                ),
                status: 'active'
            },
            {
                id: 2,
                id: 2,
                driver_id: 2,
                current_location: Sequelize.fn(
                    'ST_GeomFromText',
                    'POINT(18.452459 73.767113)'
                ),
                status: 'active'
            }
        ];
        return queryInterface.bulkInsert('driver_location', arr, {});
    },
    down: queryInterface =>
        queryInterface.bulkDelete('driver_location', null, {})
};
