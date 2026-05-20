import { createHmac, randomBytes } from 'node:crypto'
import * as JWT from 'jsonwebtoken';
import { db, eq } from '@repo/database';
import { usersTable } from '@repo/database/models/user';

import { type CreateUserWithEmailAndPasswordInputType, GenerateUserTokenPayloadType, createUserWithEmailAndPasswordInput, generateUserTokenPayload, signInUserWithEmailAndPasswordInput, type SignInUserWithEmailAndPasswordInputType } from "./model"
import { env } from '../env';
import { create } from 'node:domain';

class UserService {

    private async getUserByEmail(email: string) {
        const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if(!result || result.length === 0) return null;
        return result[0];
    }

    private async generateUserToken( payload: GenerateUserTokenPayloadType) {
        const { id } = await generateUserTokenPayload.parseAsync(payload);
        // Implementation for generating user token
        const token = JWT.sign({ id }, env.JWT_SECRET)
        return { token };
    };

    private async generateHash(salt: string, password: string) {
        return createHmac('sha256', salt).update(password).digest('hex');
    }

    public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
        const { fullName, email, password } = await createUserWithEmailAndPasswordInput.parseAsync(payload);

        // Check if the user already exists
        const existingUser = await this.getUserByEmail(email);
        if (existingUser) throw new Error(`User with this email ${email} already exists`);
        
        //calculate the hash and salt for the password
        const salt = randomBytes(16).toString('hex');
        const hash = await this.generateHash(salt, password);

        //create the user in the database
        const userInsertResult = await db.insert(usersTable).values({ email, fullName, password: hash, salt }).returning({
            id: usersTable.id,
        });

        if(!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) throw new Error('Failed to create user');

        const userId = userInsertResult[0].id;
        const {token} = await this.generateUserToken({ id: userId });

        return{
            id: userId,
            token
        }

    }

    public async signInWithEmailAndPassword(payload: SignInUserWithEmailAndPasswordInputType) {
        const { email, password } = await signInUserWithEmailAndPasswordInput.parseAsync(payload);
        const existingUser = await this.getUserByEmail(email);
        if(!existingUser) throw new Error(`User with this email ${email} does not exist`);

        if(!existingUser.password || !existingUser.salt) throw new Error(`Invalid authentication method`);

        const hash = await this.generateHash(existingUser.salt, password);

        if(hash !== existingUser.password) throw new Error(`Invalid email or password`);

        const {token} = await this.generateUserToken({ id: existingUser.id });

        return {
            id: existingUser.id,
            token
        }
    }
}

export default UserService