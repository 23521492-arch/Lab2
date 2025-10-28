import { createElement } from './jsx-runtime';

const vnode = createElement('div', { className: 'test' }, 'Hello World');
console.log(vnode);

