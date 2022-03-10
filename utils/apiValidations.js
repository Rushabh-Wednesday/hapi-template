import Joi from '@hapi/joi';
import {
    emailSchema,
    idAllowedSchema,
    stringSchema
} from 'utils/validationUtils';

export const users = {
    create: {
        payload: Joi.object({
            firstName: stringSchema,
            lastName: stringSchema,
            mobileNo: stringSchema,
            email: emailSchema,
            gender: Joi.string().valid('male', 'female', 'other')
        })
    },
    profile: {
        params: Joi.object({
            id: idAllowedSchema
        }),
        payload: Joi.object({
            firstName: stringSchema,
            lastName: stringSchema,
            mobileNo: stringSchema,
            email: emailSchema,
            gender: Joi.string().valid('male', 'female', 'other')
        })
    },
    findCab: {
        payload: Joi.object({
            pickupLocation: Joi.array().items(Joi.number())
        })
    },
    attemptBooking: {
        params: Joi.object({
            userId: idAllowedSchema
        }),
        payload: Joi.object({
            pickupLocation: Joi.array().items(Joi.number()),
            dropLocation: Joi.array().items(Joi.number()),
            fare: Joi.number().required(),
            rideStatus: Joi.string().valid('pending')
        })
    }
};

export const drivers = {
    create: {
        payload: Joi.object({
            firstName: stringSchema,
            lastName: stringSchema,
            mobileNo: stringSchema,
            email: emailSchema,
            gender: Joi.string().valid('male', 'female', 'other'),
            cabTypeId: idAllowedSchema,
            cabNumber: stringSchema
        })
    },
    profile: {
        params: Joi.object({
            driverId: idAllowedSchema
        }),
        payload: Joi.object({
            firstName: stringSchema,
            lastName: stringSchema,
            mobileNo: stringSchema,
            email: emailSchema,
            gender: Joi.string().valid('male', 'female', 'other'),
            cabTypeId: idAllowedSchema,
            cabNumber: stringSchema
        })
    },
    location: {
        payload: Joi.object({
            driverId: idAllowedSchema,
            currentLocation: Joi.array().items(Joi.number()),
            status: Joi.string().valid('active')
        })
    },
    accept: {
        payload: Joi.object({
            driverId: idAllowedSchema,
            bookingAttemptId: idAllowedSchema
        })
    }
};
