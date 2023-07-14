/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WS_SERVER: string;
    readonly VITE_WS_PORT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module '*.vue' {
    import { defineComponent } from 'vue';
    const component: ReturnType<typeof defineComponent>;
    export default component;
}
