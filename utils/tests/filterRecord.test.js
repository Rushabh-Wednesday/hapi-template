describe('testing filterRecord function', () => {
    const record = {
        dataValues: {
            userId: 1,
            firstName: 'Test',
            lastName: ' Record',
            createdAt: '2022-03-11 06:49:39'
        }
    };
    it('should throw an error when proper payload is not provided', async () => {
        const { filterRecord } = require('utils/transformerUtils');
        expect(() => {
            filterRecord('createdAt', record);
        }).toThrow('The required type should be an object(array)');
    });

    it('should remove the keys from the record', async () => {
        const { filterRecord } = require('utils/transformerUtils');
        filterRecord(['createdAt'], record);
        expect.objectContaining({
            dataValues: {
                userId: 1,
                firstName: 'Test',
                lastName: ' Record'
            }
        });
    });
});
