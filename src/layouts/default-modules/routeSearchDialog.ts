export const useRouteSearchDialog = createGlobalState(() => {
    const { t } = useTypedI18n();
    const {
        dialogVisible,
        dialogPropData,
        open,
        events,
        handleAfterLeave,
        handleAfterEnter,
        dialogTitle,
    } = useDialogStates({
        title: () => t('page.global.page_search'),
    });

    return {
        dialogVisible,
        dialogPropData,
        open,
        events,
        handleAfterLeave,
        handleAfterEnter,
        dialogTitle,
    };
});

export const routerSearchName = Symbol('routerSearch')
