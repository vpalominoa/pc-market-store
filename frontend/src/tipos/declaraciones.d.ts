declare module '*.module.css' {
  const clases: { [clave: string]: string };
  export default clases;
}

declare module '*.css';

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
