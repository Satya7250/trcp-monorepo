import { createHmac, randomBytes } from 'node:crypto'
import { db, eq } from '@repo/database';
import { usersTable } from '@repo/database/models/user';

import { type CreateUserWithEmailAndPasswordInputType, createUserWithEmailAndPasswordInput } from "./model"

class UserService {

    private async getUserByEmail(email: string) {
        const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if(!result || result.length === 0) return null;
        return result[0];
    }

    public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
        const { fullName, email, password } = await createUserWithEmailAndPasswordInput.parseAsync(payload);

        // Check if the user already exists
        const existingUser = await this.getUserByEmail(email);
        if (existingUser) throw new Error(`User with this email ${email} already exists`);
        
        //calculate the hash and salt for the password
        const salt = randomBytes(16).toString('hex');
        const hash = createHmac('sha256', salt).update(password).digest('hex');

        //create the user in the database
        const userInsertResult = await db.insert(usersTable).values({ email, fullName, password: hash, salt }).returning({
            id: usersTable.id,
        });

        if(!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) throw new Error('Failed to create user');

        return{
            id: userInsertResult[0]?.id,
        }

    }
}

export default UserService