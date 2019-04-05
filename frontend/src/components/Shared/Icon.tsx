import React from 'react';

interface IProps {
	icon: string;
	className?: string;
}

const Icon = (props: IProps) => (
	<svg className={props.className}>
		<use xlinkHref={`/images/sprite.svg#${props.icon}`} />
	</svg>
);

export default Icon;
