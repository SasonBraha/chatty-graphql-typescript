import React from 'react';
import styled from 'styled-components/macro';

interface IProps {
	src: string;
	alt: string;
	className?: string;
}

const Image: React.FC<IProps> = props => {
	return <S.Image {...props} loading='lazy' />;
};

const S: any = {};
S.Image = styled.img``;

export default Image;
