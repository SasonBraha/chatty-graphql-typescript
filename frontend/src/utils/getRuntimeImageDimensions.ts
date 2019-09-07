const getRuntimeImageDimensions = (
	maxWidth: number,
	maxHeight: number,
	imageNaturalWidth: number,
	imageNaturalHeight: number
) => {
	const ratio = Math.min(
		1,
		maxWidth / imageNaturalWidth,
		maxHeight / imageNaturalHeight
	);

	return {
		width: imageNaturalWidth * ratio,
		height: imageNaturalHeight * ratio
	};
};

export default getRuntimeImageDimensions;
