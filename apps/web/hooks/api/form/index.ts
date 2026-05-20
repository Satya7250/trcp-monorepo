import { trpc } from "~/trpc/client"

export const useCreateForm = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: createFormAsync,
        mutate: createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status
    } = trpc.form.createForm.useMutation({
        onSuccess: async () => {
            // If there was a list of forms, we would invalidate it here
            await utils.form.invalidate()
        }
    });

    return {
        createFormAsync,
        createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status
    }
}
