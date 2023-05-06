export interface PageListResponse<T> {
    records: T;
    pages: number;
    total: number;
    current: number;
}

export type CreateAndUpdateDateProps = {
    createBy: string;
    createDate: number;
    updateBy: string;
    updateDate: number;
};
