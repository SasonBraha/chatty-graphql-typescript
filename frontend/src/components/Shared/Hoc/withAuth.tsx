import React, { Component } from 'react';
import { IUser } from '../../../types/interfaces';
import { Redirect } from 'react-router';
import withLocalCache from './withLocalCache';
import { USER_ENTITY_FRAGMENT } from '../../../apollo/fragments';
import { setGenericModal } from '../../../apollo/actions';

interface IProps {
	currentUser: IUser | null;
}

export default (WrappedComponent: any) => {
	@withLocalCache(`
		currentUser {
			${USER_ENTITY_FRAGMENT}
		}
	`)
	class ComposedComponent extends Component<IProps> {
		componentDidMount(): void {
			this.validateLoginState();
		}

		componentDidUpdate(
			prevProps: Readonly<IProps>,
			prevState: Readonly<{}>,
			snapshot?: any
		): void {
			if (prevProps.currentUser !== this.props.currentUser) {
				this.validateLoginState();
			}
		}

		private validateLoginState = () => {
			const { currentUser } = this.props;
			if (!currentUser) {
				setGenericModal('error', 'עליך להתחבר על מנת לגשת לדף זה');
			}
		};

		render() {
			return this.props.currentUser ? (
				<WrappedComponent {...this.props} />
			) : (
				<Redirect to='/login' />
			);
		}
	}
	return ComposedComponent;
};
