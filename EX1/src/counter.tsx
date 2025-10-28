// src/counter.tsx
/** @jsx createElement */
import { createElement, useState, VNode, ComponentProps } from './jsx-runtime';
// VNode, ComponentProps có thể không cần thiết nếu bạn đã sử dụng chúng trong các interface

// TODO: Define ButtonProps interface [cite: 164]
// src/counter.tsx
interface ButtonProps {
    onClick: (event: Event) => void;
    children?: (VNode | string | number) | (VNode | string | number)[]; 
    className?: string;
}

// TODO: Create a Button component [cite: 168]
const Button = (props: ButtonProps): VNode => {
    return (
        <button className={props.className} onClick={props.onClick}>
            {props.children}
        </button>
    );
};

// TODO: Define CounterProps interface [cite: 174]
interface CounterProps {
    initialCount?: number;
    key?: number | string;
}

// TODO: Create Counter component [cite: 178]
const Counter = (props: CounterProps) => {
    // STEP 1: Use useState for count value [cite: 180]
    const [getCount, setCount] = useState(props.initialCount ?? 0);
    let count = getCount();

    // STEP 2: Create increment, decrement, reset functions [cite: 183]
    const increment = () => { setCount(getCount() + 1); };
    const decrement = () => { setCount(getCount() - 1); };
    const reset = () => { setCount(props.initialCount ?? 0); };

    // STEP 3: Return JSX structure [cite: 185]
    return (
        <div className="counter">
            <h2>Count: {count}</h2>
            <div className="buttons">
                <Button onClick={increment}>+</Button>
                <Button onClick={decrement}>-</Button>
                <Button onClick={reset}>Reset</Button>
            </div>
        </div>
    );
};

// TODO: Export Counter component [cite: 189]
export { Counter };