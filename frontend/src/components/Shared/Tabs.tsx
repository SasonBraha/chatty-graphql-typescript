import React, { useState } from 'react';
import styled from 'styled-components/macro';

interface IProps {
	categories: Array<string>;
	onIndexChange?: () => any;
}

const Tabs: React.FC<IProps> = props => {
	const [index, setIndex] = useState(0);

	return (
		<S.Container>
			<S.CategoriesContainer>
				{props.categories.map((category, index) => (
					<S.Category key={index}>{category}</S.Category>
				))}
			</S.CategoriesContainer>

			<S.SliderLine>
				<S.SlideIndicator
					width={(index / (props.categories.length - 1)) * 100}
				></S.SlideIndicator>
			</S.SliderLine>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.div``;

S.CategoriesContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

S.Category = styled.div``;

S.SliderLine = styled.div`
	width: 100%;
	height: 6px;
`;

S.SlideIndicator = styled.div`
	position: absolute;
	right: 0;
	height: 100%;
	width: ${({ width }: { width: number }) => width}%;
	background: red;
`;

export default Tabs;
