export interface SyntaxColors {
  comment: string;
  string: string;
  number: string;
  keyword: string;
  function: string;
  variable: string;
  operator: string;
  type: string;
  tag: string;
  attr: string;
  default: string;
}

export interface BaseColors {
  primary: string;
  secondary: string;
  accent: string;

  success: string;
  warning: string;
  error: string;
  info: string;

  light: string;
  dark: string;
  muted: string;

  text: {
    primary: string;
    secondary: string;
    muted: string;
    light: string;
  };

  background: {
    primary: string;
    secondary: string;
    dark: string;
  };

  border: {
    light: string;
    dark: string;
  };

  highlight: string;

  syntax: SyntaxColors;
}

export interface Theme {
  name: string;
  colors: BaseColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontSize: {
      xs: number;
      sm: number;
      base: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  borderRadius: {
    sm: number;
    base: number;
    lg: number;
    xl: number;
  };
  boxShadow: {
    sm: string;
    base: string;
    lg: string;
  };
}
