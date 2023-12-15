export function useThemeditorVisible() {
    const localFlagShowThemeEditor = useStorage(
        'localFlagShowThemeEditor',
        true,
        window.localStorage,
    )
    const showThemeEditor = ['development', 'theme'].includes(import.meta.env.MODE)

    return {
        showThemeEditor,
        localFlagShowThemeEditor,
    }
}
