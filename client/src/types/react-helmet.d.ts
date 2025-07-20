declare module 'react-helmet' {
  import { Component } from 'react';

  interface HelmetProps {
    title?: string;
    titleTemplate?: string;
    defaultTitle?: string;
    meta?: Array<{
      name?: string;
      content?: string;
      property?: string;
      httpEquiv?: string;
      charset?: string;
    }>;
    link?: Array<{
      rel?: string;
      href?: string;
      type?: string;
      sizes?: string;
    }>;
    script?: Array<{
      src?: string;
      type?: string;
      innerHTML?: string;
    }>;
    style?: Array<{
      type?: string;
      cssText?: string;
    }>;
    base?: {
      target?: string;
      href?: string;
    };
    children?: React.ReactNode;
  }

  export class Helmet extends Component<HelmetProps> {}
  export default Helmet;
}