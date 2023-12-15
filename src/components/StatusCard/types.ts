import type { ExtractPropTypes, FunctionalComponent, PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export type StatusCardProps = ExtractPropTypes<{
    icon: PropType<FunctionalComponent>
    data: PropType<StatusCardItem | [StatusCardItem, StatusCardItem]>
}>

export interface StatusCardItem { name: string, value: string | number, to: RouteLocationRaw }
