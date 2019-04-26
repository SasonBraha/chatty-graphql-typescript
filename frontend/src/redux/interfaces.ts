import { IMessage } from '../models';

export interface IMessageContextMenu {
	isOpen: boolean;
	message?: IMessage | null;
	position?: {
		x: number;
		y: number;
	};
}
