/// <reference types="react-scripts" />

declare module "places.js";

declare module "*.mp4" {
  const src: string;
  export default src;
}

declare module "react-images";

declare module "material-ui-phone-number";

declare module "react-redux/es/connect/connect";

declare global {
  interface String {
    capitalize(): string;
  }
}
