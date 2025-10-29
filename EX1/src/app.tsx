// src/app.tsx
/** @jsx createElement */
import { createElement } from './jsx-runtime';
import { TestButton } from './test-button'; 
import { Counter } from './counter';       
import { TodoApp } from './todo-app';      
import { Dashboard } from './dashboard';   

const App = () => {
    return (
        <div className="app-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '10px' }}>Demo Tích Hợp Lab 2</h1>
            
            {/* ----------------- PHẦN 1: TEST CƠ BẢN (KHÔNG STATE) ----------------- */}
            <section style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                <h2 style={{ color: '#007bff' }}>1. JSX/DOM Test</h2>
                <TestButton />
            </section>

            {/* ----------------- PHẦN 2: COUNTER (SỬ DỤNG HOOKS) ----------------- */}
            {/* VÌ CÓ XUNG ĐỘT STATE: Khi bạn click nút Counter, nó reset state của TodoApp */}
            <section style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                <h2 style={{ color: '#28a745' }}>2. State Test - Counter</h2>
                <Counter initialCount={0} key="counter-component" /> 
            </section>

            {/* ----------------- PHẦN 3: TODO APP (SỬ DỤNG HOOKS) ----------------- */}
            <section style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                <h2 style={{ color: '#dc3545' }}>3. Complex State - Todo App</h2>
                <TodoApp key="todo-component" />
            </section>

            {/* ----------------- PHẦN 4: DASHBOARD ----------------- */}
            <section style={{ marginTop: '30px' }}>
                <Dashboard />
            </section>
        </div>
    );
};

export { App };
