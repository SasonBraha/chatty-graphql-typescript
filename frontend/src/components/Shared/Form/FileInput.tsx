import React from 'react';
import styled from 'styled-components/macro';
import { setGenericModal } from '../../../redux/actions';
import { connect } from 'react-redux';

interface IProps {
	maxFileSize?: number;
	onChange: (file: File | null) => void;
	onBlur?: any;
	setGenericModal: typeof setGenericModal;
}

const validateFile = (
	props: IProps,
	event: React.FormEvent<HTMLInputElement>,
	file: File
) => {
	const resetFile = () => {
		const fileInput = event.target as HTMLInputElement;
		fileInput.value = '';
		props.onChange(null);
	};

	if (!file) {
		return resetFile();
	}

	if (props.maxFileSize) {
		const maxFileSize = props.maxFileSize;
		const fileSize = Math.floor(file.size / 1024);

		if (fileSize > maxFileSize) {
			resetFile();
			const isLimitOver1MB = maxFileSize >= 1024;
			return props.setGenericModal(
				'error',
				//prettier-ignore
				`הקובץ שנבחר גדול מדי, הגודל המירבי הניתן להעלאה הינו ${isLimitOver1MB ? Math.ceil(maxFileSize / 1024) : maxFileSize}${isLimitOver1MB ? 'MB' : 'KB'}`
			);
		}

		props.onChange(file);
	}
};

const FileInput = (props: IProps) => {
	return (
		<StyledFileInput
			type='file'
			onChange={e => validateFile(props, e, e.target.files![0])}
			onBlur={props.onBlur}
		/>
	);
};

const StyledFileInput = styled.input`
	display: none;
`;

export default connect(
	null,
	{ setGenericModal }
)(FileInput);
