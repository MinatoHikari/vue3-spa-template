import type { ComponentPublicInstance } from 'vue'

export const enhanceTableCommonCellProps = {
    revertOnBlur: Boolean,
    isEditing: Boolean,
}

export const enhanceTableCommonCellEmits = {
    editingUpdate: (v: boolean) => true,
    refUpdate: (v: ComponentPublicInstance) => true,
}
