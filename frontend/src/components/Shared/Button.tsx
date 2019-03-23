import styled from 'styled-components/macro';

const StyledButton = styled.button`
	border: none;
	outline: none;
	border-radius: 0.5rem;
	transition: 0.3s;
	cursor: pointer;
	background: transparent;
	padding: 1rem 2rem;
	color: white;
	font-size: 1.6rem;
	position: relative;

	&:hover {
		background: rgba(255, 255, 255, 0.15);
	}
`;

export default StyledButton;
