/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_HOMEPAGE: string;
    readonly VITE_HOMEPAGE_FALLBACK: string;
    readonly VITE_S3_BUCKET: string;
    readonly VITE_S3_DIR: string;
    readonly VITE_S3_REGION: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
