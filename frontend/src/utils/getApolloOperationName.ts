const getApolloOperationName = (selectionSet: any): string => {
	return selectionSet.selections[0].name.value;
};

export default getApolloOperationName;
