export {}

declare global {
  interface Window {
    tinymce: {
      activeEditor?: TinyMCEEditor
    }
    env?: {
      API_URL?: string
      [key: string]: any
    }
  }

  interface TinyMCEEditor {
    editorUpload: {
      blobCache: TinyMCEBlobCache
    }
  }

  interface TinyMCEBlobCache {
    create: (id: string, file: File, base64: string) => TinyMCEBlobInfo
    add: (blobInfo: TinyMCEBlobInfo) => void
  }

  interface TinyMCEBlobInfo {
    id(): string
    filename(): string
    blob(): Blob
    base64(): string
    blobUri(): string
  }

  interface ImportMetaEnv {
    readonly VITE_API_URL?: string
    readonly NODE_ENV?: 'development' | 'production' | 'test'
    readonly [key: string]: string | undefined
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

// CSS Module declarations
// src/global.d.ts
declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}
declare module '*.module.sass' {
  const classes: { [key: string]: string }
  export default classes
}
declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}
