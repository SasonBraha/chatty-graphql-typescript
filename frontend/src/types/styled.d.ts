import 'styled-components';

declare module 'styled-components' {
	export interface DefaultTheme {
		gray10: string;
		gray20: string;
		gray30: string;

		headerHeight: string;
		navWidth: string;
		navBackground: string;

		boxShadow: string;

		roomsListBackground: string;
		activeUsersBackground: string;
		ownMessageBackground: string;

		success: string;
		error: string;
		warning: string;
		info: string;

		lightBlue: string;
	}
}
