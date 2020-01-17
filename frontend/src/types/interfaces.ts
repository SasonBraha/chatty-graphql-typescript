import { DefaultTheme } from 'styled-components';

export type PlainFunction<T = any> = (params?: T) => any;

export type StateUpdaterFunction<T> = React.Dispatch<React.SetStateAction<T>>;

export type DynamicObject<T> = { [key: string]: T };

export type DelegatedRef<T> = React.RefObject<T>;

export interface ITheme {
	theme: DefaultTheme;
}

export interface IPlainObject {
	[key: string]: any;
}

export interface IStyle {
	className: string;
}

export interface IChildren {
	children: React.ReactNode;
}

export interface IFunctionChildren<T> {
	children(params: T): React.ReactNode;
}

export interface IDynamicObject {
	[key: string]: any;
}
