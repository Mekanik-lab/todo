import Item from "./Item";

function List({ todos, onDelete }) {
    return (
        <ul className="list-none flex flex-col items-center mt-10">
            {todos.map((todo) => (
                <Item
                    key={todo.id}
                    todo={todo}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}

export default List;
