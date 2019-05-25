import React from 'react';

interface IProps {
	icon: string;
	className?: string;
	width?: number;
	height?: number;
	color?: string;
}

const Icon = (props: IProps) => (
	<svg
		className={props.className}
		style={{ width: props.width, height: props.height, fill: props.color }}
	>
		<use xlinkHref={`/images/sprite.svg#${props.icon}`} />
	</svg>
);

Icon.defaultProps = {
	width: 30,
	height: 30
};

export default Icon;
