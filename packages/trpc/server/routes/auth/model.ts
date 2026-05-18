import { z } from 'zod';

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().describe("The full name of the user"),
    email: z.string().describe("The email address of the user"),
    password: z.string().describe("The password for the user account"),
});


export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("id of the user created"),
});