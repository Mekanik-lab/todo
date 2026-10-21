function Item({ todo, onDelete }) {

    const handleDelete = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/todos/${todo.id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Błąd usuwania zadania");
            }

            onDelete();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <li className="
            flex
            justify-between
            items-center
            bg-neutral-100
            p-4 rounded-lg
            mb-3
            w-80
        ">
            {todo.title}

            <button
                onClick={handleDelete}
                className="
                    bg-red-500
                    hover:bg-red-600
                    active:scale-95
                    transition-transform
                    duration-200
                    text-white
                    px-3 py-1 rounded-lg
                "
            >
                Usuń
            </button>
        </li>
    );
}

export default Item;