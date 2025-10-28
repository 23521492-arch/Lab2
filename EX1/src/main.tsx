// src/main.tsx
/** @jsx createElement */
import { createElement, mount } from './jsx-runtime';
import { App } from './app'; // <-- IMPORT component App mới

const root = document.getElementById('root') || document.getElementById('app'); 

if (root) {
    // Mount component App
    mount(<App />, root as HTMLElement);
}