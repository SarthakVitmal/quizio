import z from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { hash, compare } from 'bcryptjs';
import { db } from '@/server/db';

// Custom error class for auth-specific errors
class AuthError extends Error {
    constructor(message: string, public type: string) {
        super(message);
        this.name = 'AuthError';
    }
}

export const authRouter = createTRPCRouter({
    signup: publicProcedure
        .input(
            z.object({
                name: z.string().min(1, "Name is required"),
                email: z.string().email("Invalid email address"),
                password: z.string().min(8, "Password must be at least 8 characters long"),
            })
        )
        .mutation(async ({ input }) => {
            const existingUser = await db.user.findUnique({ where: { email: input.email } });
            if (existingUser) {
                return {
                    success: false,
                    code: 'EMAIL_EXISTS',
                    message: 'Email already in use'
                };
            }

            const hashedPassword = await hash(input.password, 10);
            const user = await db.user.create({
                data: {
                    name: input.name,
                    email: input.email,
                    password: hashedPassword,
                },
            });

            return {
                success: true,
                user: { id: user.id }
            };
        }),

        login: publicProcedure
        .input(
          z.object({
            email: z.string().email("Invalid email address"),
            password: z.string().min(8, "Password must be at least 8 characters"),
          })
        )
        .mutation(async ({ input }) => {
          const { email, password } = input;
          
          const user = await db.user.findUnique({ where: { email } });
          if (!user) {
            return {
              success: false,
              code: 'USER_NOT_FOUND',
              message: 'No account found with this email'
            };
          }
      
          const isPasswordValid = await compare(password, user.password);
          if (!isPasswordValid) {
            return {
              success: false,
              code: 'INVALID_PASSWORD',
              message: 'Incorrect password'
            };
          }
      
          return {
            success: true,
            user: { id: user.id }
          };
        })
});