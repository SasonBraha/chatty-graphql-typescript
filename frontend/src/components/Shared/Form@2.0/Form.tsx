import React, { Ref } from 'react';
import {
	Form as FormikForm,
	Formik,
	FormikConfig,
	FormikProps,
	FormikValues
} from 'formik';

interface IProps extends FormikConfig<any> {
	children: React.ReactNode;
	ref?: Ref<any>;
}

const Form: React.FC<IProps> = React.forwardRef((props, ref: Ref<any>) => {
	return (
		<Formik {...props}>
			{(formikProps: FormikProps<FormikValues>) => {
				// @ts-ignore
				ref.current = formikProps;
				return <FormikForm noValidate>{props.children}</FormikForm>;
			}}
		</Formik>
	);
});

export default Form;
