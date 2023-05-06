import { NIcon } from 'naive-ui';
import RenewIcon from '~icons/carbon/renew';

export const usePageRefreshButton = (
    name: Symbol,
    onClick: (e?: MouseEvent) => void | Promise<void>,
) => {
    const { t } = useTypedI18n();

    const { addPageButton } = useTabSuffix();
    const initRefreshButton = () => {
        addPageButton({
            name,
            onClick,
            renderIcon: () =>
                h(
                    NIcon,
                    {},
                    {
                        default: () => h(RenewIcon),
                    },
                ),
            toolTipContent: computed(() => t('button.refresh')),
        });
    };
    onMounted(() => {
        initRefreshButton();
    });
    onActivated(() => {
        initRefreshButton();
    });
};
