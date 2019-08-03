import React from 'react';
import styled from 'styled-components/macro';
import { setGenericModal } from '../../../apollo/actions';

interface IProps {
	maxFileSizeInKB?: number;
	onChange: (file: File | null) => void;
	onBlur?: any;
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

	if (props.maxFileSizeInKB) {
		const maxFileSize = props.maxFileSizeInKB;
		const fileSize = Math.floor(file.size / 1024);

		if (fileSize > maxFileSize) {
			resetFile();
			const isLimitOver1MB: boolean = maxFileSize >= 1024;
			return setGenericModal(
				'error',
				// prettier-ignore
				`הקובץ שנבחר גדול מדי, הגודל המירבי הניתן להעלאה הינו ${isLimitOver1MB ? Math.ceil(maxFileSize / 1024) : maxFileSize}${isLimitOver1MB ? 'MB' : 'KB'}`
			);
		}

		props.onChange(file);
	}
};

const FileInput = (props: IProps) => {
	return (
		<S.FileInput
			type='file'
			onChange={e => validateFile(props, e, e.target.files![0])}
			onBlur={props.onBlur}
		/>
	);
};

const S: any = {};
S.FileInput = styled.input`
	display: none;
`;

export default FileInput;
