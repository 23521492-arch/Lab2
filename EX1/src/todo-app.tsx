// src/todo-app.tsx
/** @jsx createElement */
import { createElement, useState, VNode } from './jsx-runtime';
// VNode được import để dùng trong các interface

// TODO: Define TypeScript interfaces [cite: 218]
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

interface TodoItemProps {
    // Optional `key` to allow JSX usage like <TodoItem key={...} />
    // Key is reserved by JSX but including it here prevents TypeScript errors
    key?: number | string;
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

interface AddTodoFormProps {
    onAdd: (text: string) => void;
}

// src/todo-app.tsx (tiếp)

// TODO: Implement TodoItem component [cite: 229]
const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps): VNode => {
    // Sử dụng conditional style cho strikethrough nếu hoàn thành
    const style = todo.completed ? { textDecoration: 'line-through', color: '#888' } : {};
    
    // Sử dụng input type="checkbox" để xử lý toggle
    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`} style={style}>
            <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={() => onToggle(todo.id)} 
            />
            <span>{todo.text}</span>
            <button onClick={() => onDelete(todo.id)}>Delete</button>
        </div>
    );
};

// src/todo-app.tsx (tiếp)

// TODO: Implement AddTodoForm component [cite: 238]
const AddTodoForm = ({ onAdd }: AddTodoFormProps): VNode => {
    // STEP 1: Use useState for input value [cite: 240]
    // Lưu ý: Đây là state cục bộ (local state) cho input
    const [getInputValue, setInputValue] = useState('');
    let inputValue = getInputValue();
    
    const handleSubmit = (event: Event) => {
        // Ngăn form tải lại trang
        (event as any).preventDefault(); 
        
        if (inputValue.trim()) {
            onAdd(inputValue.trim());
            setInputValue(''); // Reset input value
        }
    };
    
    const handleInputChange = (e: any) => {
        // LƯU Ý: Đây là một input handler đơn giản, có thể cần type casting
        setInputValue(e.target.value); 
    }

    // STEP 3: Return JSX with input and submit button [cite: 244]
    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Thêm todo mới..." 
                value={inputValue} 
                onInput={handleInputChange} // Sử dụng onInput hoặc onChange
            />
            <button type="submit">Add</button>
        </form>
    );
};

// src/todo-app.tsx (tiếp)

// TODO: Implement main TodoApp component [cite: 247]
const TodoApp = () => {
    // STEP 1: State for todos array [cite: 249]
    const [getTodos, setTodos] = useState<Todo[]>([]);
    let todos = getTodos(); 
    
    // STEP 2: Functions to add, toggle, delete todos [cite: 250]
    const addTodo = (text: string) => {
        const newTodo: Todo = {
            id: Date.now(), // Tạo ID duy nhất [cite: 274]
            text,
            completed: false,
        };
        setTodos([...todos, newTodo]);
    };
    
    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };
    
    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };
    
    const completedCount = todos.filter(t => t.completed).length;

    // STEP 3: Return JSX structure [cite: 251]
    return (
        <div className="todo-app-container">
            <h1>Todo List Application</h1>
            
            <AddTodoForm onAdd={addTodo} />
            
            <div className="todo-list">
                {/* Sử dụng Array.map() để render items [cite: 273] */}
                {todos.map(todo => (
                    <TodoItem 
                        key={todo.id} // Key là cần thiết cho các list
                        todo={todo} 
                        onToggle={toggleTodo} 
                        onDelete={deleteTodo} 
                    />
                ))}
            </div>
            
            {/* Summary [cite: 255] */}
            <div className="summary">
                Total: {todos.length} | Completed: {completedCount}
            </div>
        </div>
    );
};

export { TodoApp };