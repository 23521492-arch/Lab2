// src/test-button.tsx
/** @jsx createElement */
import { createElement, VNode } from './jsx-runtime';

const TestButton = (): VNode => {
    // Logic của nút test bài 1
    const vnode = (
        <button
            style={{ backgroundColor: 'yellow', padding: '10px', fontSize: '16px' }}
            onClick={() => alert('Test Button Clicked!')}
        >
            Click Me (Test Bài 1)
        </button>
    );
    return vnode;
};

export { TestButton };