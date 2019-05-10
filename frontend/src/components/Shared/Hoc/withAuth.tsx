import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IUser } from '../../../types/interfaces';
import { IReducerState } from '../../../redux/reducers';
import { setGenericModal } from '../../../redux/actions';

interface IProps {
	currentUser: IUser | null;
	setGenericModal: typeof setGenericModal;
}

export default (WrappedComponent: any) => {
	const mapStateToProps = ({ currentUser }: IReducerState) => ({ currentUser });
	@connect(
		mapStateToProps,
		{ setGenericModal }
	)
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
			const { currentUser, setGenericModal } = this.props;
			if (!currentUser) {
				setGenericModal('error', 'עליך להתחבר על מנת לגשת לדף זה');
			}
		};

		render() {
			//prettier-ignore
			return (
				this.props.currentUser && <WrappedComponent {...this.props} />
			);
		}
	}
	return ComposedComponent;
};
