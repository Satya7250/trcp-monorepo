import { z } from 'zod';

export const createUserWithEmailAndPasswordInput = z.object({
    fullName: z.string().describe('Full name of the user'),
    email: z.email().describe('Email address of the user'),
    password: z.string().min(6, 'Password must be at least 6 characters long').describe('Password of the user')
});

export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>;