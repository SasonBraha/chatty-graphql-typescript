import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components/macro';

interface IProps extends RouteComponentProps<{}> {}

class MessagesList extends Component<IProps> {
	constructor(props: IProps) {
		super(props);
		this.init();
	}

	private init() {}

	componentDidUpdate(prevProps: IProps) {}

	render() {
		return <ScMessagesList>hello</ScMessagesList>;
	}
}

const ScMessagesList = styled.div`
	flex: 1;
	background: ${props => props.theme.gray30};
`;

export default MessagesList;
