import type { GetObjectOutput, ListObjectsOutput, PutObjectOutput } from '@aws-sdk/client-s3';

export type S3Response = {
    status: number;
    msg: string;
    data:
        | PutObjectOutput
        | GetObjectOutput
        | ListObjectsOutput
        | { name: string; key: string; id?: string }
        | null;
};
