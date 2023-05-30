declare module '*.png' {
    import { ImageSourcePropType } from 'react-native';

    const content: ImageSourcePropType;

    export default content;
}

declare module '*.svg' {
    import { SvgProps } from 'react-native-svg';
    const content: React.StatelessComponent<SvgProps>;
    export default content;
}