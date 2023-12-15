export function useMapBaseGlobalStates<T>(fn: () => T) {
    const stateMap = new Map<symbol, () => T>()

    const generateGlobalState = (key: symbol) => {
        const mergedKey = key ?? Symbol('globalState')
        if (!stateMap.has(key)) {
            const value = createGlobalState(fn)

            stateMap.set(mergedKey, value)
        }
        const res = stateMap.get(mergedKey) as () => T

        return {
            key: mergedKey,
            useStateOfKey: res,
        }
    }

    return {
        stateMap,
        generateGlobalState,
    }
}
