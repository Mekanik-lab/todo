
import { useState } from "react";

const Form = ({ onTodoAdded }) => {
    const [title, setTitle] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) return;

        try {
            const response = await fetch("http://localhost:3000/api/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title: title })
            });

            if (!response.ok) {
                throw new Error("Błąd dodawania zadania");
            }

            await response.json();

            setTitle("");

            // Ponowne pobranie listy po dodaniu zadania
            await onTodoAdded();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form
            className="flex justify-center items-center mt-10"
            onSubmit={handleSubmit}
        >
            <input
                className="border-b text-xl outline-none p-2 m-2"
                type="text"
                placeholder="Wpisz zadanie..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <button
                type="submit"
                className="m-2 text-xl cursor-pointer bg-neutral-100 p-3 rounded-full active:scale-95 transition-transform duration-100 ease-in-out"
            >
                Dodaj
            </button>
        </form>
    );
};

export default Form;