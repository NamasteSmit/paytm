const zod = require('zod');


const UserValidateSchema = zod.object({
    firstname : zod
    .string({required_error : "firstname is required"})
    .trim()
    .min(3,{message : "firstname must be at least 3 characters"})
    .max(50,{message : "firstname must be at most 50 characters"}),

    lastname : zod
    .string({required_error : "lastname is required"})
    .trim()
    .min(3,{message : "lastname must be at least 3 characters"})
    .max(50,{message : "lastname must be at most 50 characters"}),

    email : zod
    .string({required_error : "email is required"})
    .trim()
    .email({message : "email must be valid"})
    .endsWith("@gmail.com"),

    password : zod
    .string({required_error : "password is required"})
    .trim()
    .min(8,{message : "password must be at least 8 characters"})
    .max(100,{message : "password must be at most 100 characters"}),
})

module.exports = UserValidateSchema;