import type { NLayoutSider } from 'naive-ui';

type LayoutSiderThemeOverrides = NonNullable<
    InstanceType<typeof NLayoutSider>['$props']['themeOverrides']
>;

export const layoutSiderThemeOverrides: LayoutSiderThemeOverrides = {
    siderColorInverted: '#29384F',
};

export const tabStyle = 'border-bottom:1px solid var(--n-tab-border-color)';

export const panClass = 'menu-tab';
