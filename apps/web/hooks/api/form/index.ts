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

export const useMyForms = () => {
    const { data: forms, error, isFetched, isFetching, isLoading, status } = trpc.form.listMyForms.useQuery();

    return {
        forms,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    }
}

export const useForm = (id: string) => {
    const { data: form, error, isFetched, isFetching, isLoading, status } = trpc.form.getFormById.useQuery({ id }, {
        enabled: !!id
    });

    return {
        form,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    }
}

export const useFormByFormId = (formId: string) => {
    const { data: form, error, isFetched, isFetching, isLoading, status } = trpc.form.getFormByFormId.useQuery(
        { formId },
        { enabled: !!formId }
    );

    return {
        form,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    }
}

export const useAllForms = () => {
    const { data: forms, error, isFetched, isFetching, isLoading, status } = trpc.form.listForms.useQuery();

    return {
        forms,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    }
}

export const useFormSubmissions = (formId: string) => {
    const { data: submissions, error, isFetched, isFetching, isLoading, status } =
        trpc.form.getFormSubmissions.useQuery({ formId }, { enabled: !!formId });

    return {
        submissions,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};
