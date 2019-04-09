export const getOperationName = (selectionSet: any): string => {
	return selectionSet.selections[0].name.value;
};
