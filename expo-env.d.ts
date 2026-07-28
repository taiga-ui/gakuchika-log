declare module "expo-router" {
  export const DarkTheme: any;
  export const DefaultTheme: any;
  export const ThemeProvider: any;
  const _default: any;
  export default _default;
}

declare module "expo-splash-screen";
declare module "expo-image";

declare module "react-native" {
  export function useColorScheme(): "light" | "dark" | null;
  export const Dimensions: any;
  export const StyleSheet: any;
  export const View: any;
  export const Image: any;
  export const Text: any;
  export const requireNativeComponent: any;
  const _default: any;
  export default _default;
}

declare module "react-native-reanimated";
declare module "react-native-worklets";

declare module "@/*";

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";

declare module "react/jsx-runtime" {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export function jsxDEV(type: any, props: any, key?: any): any;
}

declare module "react" {
  const React: any;
  export default React;
  export function createElement(
    type: any,
    props?: any,
    ...children: any[]
  ): any;
  export const Fragment: any;
}
