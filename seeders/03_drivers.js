module.exports = {
    up: queryInterface => {
        const arr = [
            {
                id: 1,
                first_name: 'Jhon',
                last_name: 'Wick',
                email: 'wick@jhon.is',
                mobile_no: '8585959524',
                cab_type_id: 1,
                cab_number: 'MH 20 9211',
                gender: 'male'
            },
            {
                id: 2,
                first_name: 'Ross',
                last_name: 'Geller',
                email: 'ross@geller.is',
                mobile_no: '8585959525',
                gender: 'male',
                cab_type_id: 2,
                cab_number: 'MH 20 0420',
                gender: 'male'
            }
        ];
        return queryInterface.bulkInsert('drivers', arr, {});
    },
    down: queryInterface => queryInterface.bulkDelete('drivers', null, {})
};
