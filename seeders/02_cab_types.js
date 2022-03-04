module.exports = {
    up: queryInterface => {
        const arr = [
            {
                id: 1,
                cab_type: 'AUTO'
            },
            {
                id: 2,
                cab_type: 'BIKE'
            },
            {
                id: 3,
                cab_type: 'SEDAN'
            },
            {
                id: 4,
                cab_type: 'PRIME'
            }
        ];
        return queryInterface.bulkInsert('cab_types', arr, {});
    },
    down: queryInterface => queryInterface.bulkDelete('cab_types', null, {})
};
