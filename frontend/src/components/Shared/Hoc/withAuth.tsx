import React, { Component } from 'react';
import { IUser } from '../../../types/interfaces';
import { Redirect } from 'react-router';
import withLocalCache from './withLocalCache';
import { USER_ENTITY_FRAGMENT } from '../../../apollo/fragments';
import { setGenericModal } from '../../../apollo/actions';
import { withTranslation } from './index';

interface IProps {
	currentUser: IUser | null;
	t: any;
}

export default (WrappedComponent: any) => {
	@withLocalCache(`
		currentUser {
			${USER_ENTITY_FRAGMENT}
		}
	`)
	@withTranslation()
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
				setGenericModal(
					'error',
					this.props.t('global.youMustBeLoggedInToViewThisPage')
				);
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
