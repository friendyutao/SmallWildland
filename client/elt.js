'use strict'

function elt(name, props, ...children) {
	const dom = document.createElement(name);
	props && Object.assign(dom, props);
	for (let child of children) {
		if (typeof child == 'string') {
			child = document.createTextNode(child);
		}
		dom.appendChild(child);
	}
	return dom;
}
