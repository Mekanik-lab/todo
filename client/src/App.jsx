
import { useState, useEffect } from "react";
import Header from './components/Header';
import Form from './components/Form';
import List from './components/List';

function App() {
    const [todos, setTodos] = useState([]);

    const fetchTodos = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/todos");

            if (!response.ok) {
                throw new Error("Błąd pobierania zadań");
            }

            const data = await response.json();
            setTodos(data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <>
            <Header />
            <Form onTodoAdded={fetchTodos} />
            <List
                todos={todos}
                onDelete={fetchTodos}
            />
        </>
    );
}

export default App;
