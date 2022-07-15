import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    fonts: {
      light: string;
      regular: string;
      bold: string;
      boldItalic: string;
      italic: string;
    };
    colors: {
      background: string;
      foreground: string;
      text: string;
      primary: string;
      placeholder: string;
    };
  }
}
