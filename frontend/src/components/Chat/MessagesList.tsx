import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';

interface IProps extends RouteComponentProps<{}> {}

class MessagesList extends Component<IProps> {
	constructor(props: IProps) {
		super(props);
		this.init();
	}

	private init() {}

	componentDidUpdate(prevProps: IProps) {}

	render() {
		return <div />;
	}
}

export default MessagesList;
