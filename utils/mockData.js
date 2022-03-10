import {
    GRANT_TYPE,
    SCOPE_TYPE,
    OAUTH_CLIENT_ID,
    DEFAULT_METADATA_OPTIONS
} from './constants';

export const mockMetadata = (
    scope = SCOPE_TYPE.ADMIN,
    resourceType = OAUTH_CLIENT_ID
) => ({
    oauth_client_scope: {
        get: () => ({
            id: 1,
            oauth_client_id: 1,
            scope
        })
    },
    oauth_client_resources: [
        {
            get: () => ({
                id: 1,
                oauth_client_id: 1,
                resource_type: resourceType,
                resource_id: 1
            })
        }
    ]
});

export const mockData = {
    MOCK_USER: {
        id: 1,
        first_name: 'Sharan',
        last_name: 'Salian',
        email: 'sharan@wednesday.is',
        mobile_no: '8585959522',
        gender: 'male'
    },
    MOCK_OAUTH_CLIENTS: (metadataOptions = DEFAULT_METADATA_OPTIONS) => ({
        id: 1,
        clientId: 'TEST_CLIENT_ID_1',
        clientSecret: 'TEST_CLIENT_SECRET',
        grantType: GRANT_TYPE.CLIENT_CREDENTIALS,
        ...mockMetadata(metadataOptions.scope, metadataOptions.resourceType)
    }),
    MOCK_OAUTH_CLIENT_TWO: {
        id: 1,
        clientId: 'TEST_CLIENT_ID_1',
        clientSecret: 'TEST_CLIENT_SECRET',
        grantType: GRANT_TYPE.CLIENT_CREDENTIALS,
        ...mockMetadata(SCOPE_TYPE.USER)
    },
    MOCK_OAUTH_CLIENT_SUPER_USER: {
        id: 1,
        clientId: 'TEST_CLIENT_ID_1',
        clientSecret: 'TEST_CLIENT_SECRET',
        grantType: GRANT_TYPE.CLIENT_CREDENTIALS,
        ...mockMetadata(SCOPE_TYPE.SUPER_ADMIN)
    },
    MOCK_OAUTH_CLIENT_RESOURCES: [
        {
            id: 1,
            oauthClientId: 'TEST_CLIENT_ID_1',
            resourceType: 'OAUTH_CLIENT_ID',
            resourceId: 1
        },
        {
            id: 1,
            oauthClientId: 'TEST_CLIENT_ID_1',
            resourceType: 'OAUTH_CLIENT_ID',
            resourceId: 1
        }
    ],
    MOCK_OAUTH_CLIENT_SCOPES: {
        id: 1,
        oauthClientId: 'TEST_CLIENT_ID_1',
        scope: SCOPE_TYPE.SUPER_ADMIN
    },
    MOCK_DRIVER_DETAILS: {
        id: 1,
        first_name: 'Jhon',
        last_name: 'Wick',
        email: 'wick@jhon.is',
        mobile_no: '8585959524',
        cab_type_id: 1,
        cab_number: 'MH 20 9211',
        gender: 'male'
    },
    MOCK_DRIVER_LOCATION: {
        id: 1,
        driver_id: 1,
        current_location: [18.52043, 73.856743],
        status: 'active'
    },
    MOCK_BOOKING_ATTEMPT: {
        id: 1,
        user_id: 1,
        pickup_location: [18.47763, 73.88786],
        drop_location: [18.48763, 73.89786],
        ride_status: 'pending',
        fare: 73
    },
    MOCK_BOOKINGS: {
        id: 1,
        booking_attempt_id: 1,
        driver_id: 1
    },
    MOCK_USER_: {
        //id: 1,
        firstName: 'Sharan',
        lastName: 'Salian',
        email: 'sharan@wednesday.is',
        mobileNo: '8585959522',
        gender: 'male'
    },
    MOCK_BOOKING_ATTEMPT_: {
        id: 1,
        userId: 1,
        pickupLocation: [18.47763, 73.88786],
        dropLocation: [18.48763, 73.89786],
        rideStatus: 'accepted',
        fare: 73
    }
};

export const createMockTokenWithScope = (
    scope,
    resourceType = OAUTH_CLIENT_ID
) => ({
    oauthClientId: 'TEST_CLIENT_ID_1',
    metadata: {
        scope: mockMetadata(scope).oauth_client_scope.get(),
        resources: [
            mockMetadata(scope, resourceType).oauth_client_resources[0].get()
        ]
    }
});
