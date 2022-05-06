export interface NavDataOrigin {
    key?: number | string | symbol;
    children?: NavDataOrigin[];
    label?: string | JSX.Element;
    path?: string;
    parent?: { label?: string; children?: NavDataOrigin[] } | NavDataOrigin;
    name?: string;
}

export const routerMap = new Map<string, NavDataOrigin>();

export const formatRoutes = <T = Record<string, unknown>>(source: T[], parentName?: string) => {
    for (let i = 0; i < source.length; i++) {
        const item = (source as NavDataOrigin[])[i];
        if (parentName) item.label = `${parentName}-${item.path}`;
        else item.label = `${item.path}`;
        item.key = item.name ?? item.path as string;
        routerMap.set(item.key, item);
        if (item.children) {
            formatRoutes(item.children, item.path);
        }
    }
    return source as NavDataOrigin[];
};
