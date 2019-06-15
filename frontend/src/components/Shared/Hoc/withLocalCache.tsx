import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const buildQuery = (dataToFetch: string) => gql`
    query {
        client @client {
            ${dataToFetch}
        }
    }
`;

const withLocalCache = (dataToFetch: string) => (
	WrappedComponent: any
): typeof WrappedComponent => {
	return class ComposedComponent extends Component<any, any> {
		render() {
			return (
				<Query query={buildQuery(dataToFetch)}>
					{({ data }) => <WrappedComponent {...this.props} {...data.client} />}
				</Query>
			);
		}
	};
};
export default withLocalCache;
