import React from 'react';
import {
	Form as FormikForm,
	Formik,
	FormikConfig,
	FormikProps,
	FormikValues
} from 'formik';

interface IProps extends FormikConfig<any> {
	children: React.ReactNode;
}

const Form: React.FC<IProps> = props => {
	return (
		<Formik
			{...props}
			render={(formikProps: FormikProps<FormikValues>) => (
				<FormikForm noValidate>{props.children}</FormikForm>
			)}
		/>
	);
};

export default Form;
