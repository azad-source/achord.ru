/// <reference types="react-scripts" />
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production' | 'test';
        readonly PUBLIC_URL: string;
    }
}

declare module '*.scss' {
    const content: any;
    export default content;
}

declare module '*.css' {
    const content: any;
    export default content;
}

declare module '*.mp3' {
    const src: string;
    export default src;
}

declare module '*.webm' {
    const src: string;
    export default src;
}

declare module '*.ogg' {
    const src: string;
    export default src;
}

declare module '*.pdf' {
    const src: string;
    export default src;
}

declare interface GeneralObject {
    [key: string]: any;
}

declare interface TypedObject<T> {
    [key: string]: T;
}

declare type Nullable<T> = T | null | undefined;

declare type RewriteKeysType<T extends {}, V> = {
    [key in keyof T]: V;
};
