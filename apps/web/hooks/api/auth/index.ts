import { trpc } from "~/trpc/client"

export const useSignup = () => {
    const { 
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = 
    trpc.auth.createUserWithEmailAndPassword.useMutation();
    return {
        createUserWithEmailAndPasswordAsync,
        createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useSignIn = () => {
    const { 
        mutateAsync: signInWithEmailAndPasswordAsync,
        mutate: signInWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = 
    trpc.auth.signInWithEmailAndPassword.useMutation();
    return {
        signInWithEmailAndPasswordAsync,
        signInWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}