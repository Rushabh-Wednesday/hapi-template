module.exports = {
    up: queryInterface => {
        const arr = [
            {
                id: 1,
                first_name: 'Sharan',
                last_name: 'Salian',
                email: 'sharan@wednesday.is',
                mobile_no: '8585959522',
                gender: 'male'
            },
            {
                id: 2,
                first_name: 'mac',
                last_name: 'mac',
                email: 'mac@wednesday.is',
                mobile_no: '8585959523',
                gender: 'male'
            }
        ];
        return queryInterface.bulkInsert('users', arr, {});
    },
    down: queryInterface => queryInterface.bulkDelete('users', null, {})
};
