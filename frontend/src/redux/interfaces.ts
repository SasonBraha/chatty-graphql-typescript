import { IMessage } from '../models';
import React from 'react';

export interface IMessageContextMenu {
	isOpen: boolean;
	message?: IMessage | null;
	position?: {
		x: number;
		y: number;
	};
	setEditable?: (value: boolean) => void;
}
