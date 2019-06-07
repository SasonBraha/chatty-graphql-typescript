interface IHTMLElement extends HTMLElement {
	createTextRange?: () => any;
}

const placeCaretAtEnd = (el: HTMLElement) => {
	if (!(el instanceof HTMLElement)) {
		throw new Error(
			'The value passed to { placeCaretAtEnd(HTMLElement) } is not an HTMLElement'
		);
	}

	el.focus();
	if (window.getSelection && document.createRange) {
		const range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);

		const sel = window.getSelection();
		sel!.removeAllRanges();
		sel!.addRange(range);
	} else if ((document.body as IHTMLElement).createTextRange) {
		const textRange = (document.body as IHTMLElement).createTextRange!();
		textRange.moveToElementText(el);
		textRange.collapse(false);
		textRange.select();
	}
};

export default placeCaretAtEnd;
