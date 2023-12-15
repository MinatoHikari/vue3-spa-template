import { createDiscreteApi } from 'naive-ui'
import theme from '../styles/naive-ui-theme-overrides.json'

export const {
    message: globalMessage,
    notification,
    dialog,
    loadingBar: globalLoadingBar,
} = createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar'], {
    configProviderProps: {
        themeOverrides: theme,
    },
})
