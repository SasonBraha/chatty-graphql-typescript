import React from 'react';
import styled from 'styled-components/macro';
import { GenericModalTypesEnum } from '../../../types/enums';
import {
	_SetGenericModalMutationFn,
	use_SetGenericModalMutation
} from '../../../__generated__/graphql';
import i18n from '../../../locale';

interface IProps {
	maxFileSizeInKB?: number;
	onChange: (file: File | null) => void;
	onBlur?: any;
}

const validateFile = (
	props: IProps,
	event: React.FormEvent<HTMLInputElement>,
	file: File,
	setGenericModal: _SetGenericModalMutationFn
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
			const isLimitOver1MB = maxFileSize >= 1024;
			setGenericModal({
				variables: {
					data: {
						show: true,
						type: GenericModalTypesEnum.ERROR,
						text: i18n.t('global.errors.fileSizeLimitExceeded', {
							// prettier-ignore
							maxFileSize: `${isLimitOver1MB ? Math.ceil(maxFileSize / 1024) : maxFileSize}${isLimitOver1MB ? 'MB' : 'KB'}`
						})
					}
				}
			});
			return;
		}

		props.onChange(file);
	}
};

const FileInput: React.FC<IProps> = props => {
	const [setGenericModal] = use_SetGenericModalMutation();
	return (
		<S.FileInput
			type='file'
			onChange={e =>
				validateFile(props, e, e.target.files![0], setGenericModal)
			}
			onBlur={props.onBlur}
		/>
	);
};

const S: any = {};
S.FileInput = styled.input`
	display: none;
`;

export default FileInput;
