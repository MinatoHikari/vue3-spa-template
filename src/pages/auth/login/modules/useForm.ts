import { useLoginRequests } from '~/pages/auth/login/modules/requests'

export const useFormState = createGlobalState(() => {
    const mode = import.meta.env.MODE
    const { required } = useVuelidateRules()
    const { formData, v$, resetForm } = useFormCreator({
        defaultData: {
            password: mode === 'development' ? '' : '',
            username: mode === 'development' ? '' : '',
            code: '',
            verCodeKey: '',
        },
        scope: Symbol('login-form'),
        rules: {
            password: { required },
            username: { required },
            code: { required },
        },
    })

    return {
        v$,
        formData,
        resetForm,
    }
})

export function useForm() {
    const request = useLoginRequests()

    const { v$, formData, resetForm } = useFormState()

    const login = async () => {
        v$.value.$touch()
        if (!v$.value.$error) {
            await request.login({
                ...formData.value,
            })
        }
    }

    resetForm()

    return {
        formData,
        login: useThrottleFn(login, 1000),
        onLoginError: request.onLoginError,
    }
}
