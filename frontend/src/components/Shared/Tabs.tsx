import React, { useState } from 'react';
import styled from 'styled-components/macro';

interface IProps {
	categories: Array<string>;
	onIndexChange?: (index: number) => any;
}

const Tabs: React.FC<IProps> = props => {
	const [index, setIndex] = useState(0);

	return (
		<S.Container>
			<S.CategoriesContainer>
				{props.categories.map((category, index) => (
					<S.Category
						onClick={() => {
							typeof props.onIndexChange == 'function' &&
								props.onIndexChange(index);
							setIndex(index);
						}}
						key={index}
					>
						{category}
					</S.Category>
				))}
			</S.CategoriesContainer>

			<S.SliderLine>
				<S.SlideIndicator
					style={{
						width: `${100 / props.categories.length}%`,
						marginRight: `${(index * 100) / props.categories.length}%`
					}}
				></S.SlideIndicator>
			</S.SliderLine>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.div`
	width: 100%;
`;

S.CategoriesContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

S.Category = styled.div`
	cursor: pointer;
	flex: 1;
	text-align: center;
	user-select: none;
`;

S.SliderLine = styled.div`
	width: 100%;
	height: 1px;
	position: relative;
	background: ${props => props.theme.gray30};
`;

S.SlideIndicator = styled.div`
	position: absolute;
	right: 0;
	height: 200%;
	transition: 0.2s;
	background: ${props => props.theme.lightBlue};
`;

export default Tabs;
