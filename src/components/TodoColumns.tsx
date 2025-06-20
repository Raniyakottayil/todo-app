import Todocard from "./Todocard";
import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type Todo = {
	id: number;
	text: string;
	completed: boolean;
};

type TodoColumnProps = {
	title: string;
	todos: Todo[];

	deleteTodo: (id: number) => void;
	onEdit: (id: number, text: string) => void;
};

const getTitleBgColor = (title: string) => {
	switch (title) {
		case "To Do":
			return "bg-blue-500";
		case "In Progress":
			return "bg-yellow-500";
		case "Done":
			return "bg-green-500";
		default:
			return "bg-gray-500";
	}
};

const TodoColumns = ({ todos, title, onEdit, deleteTodo }: TodoColumnProps) => {
	const { setNodeRef } = useDroppable({ id: title });

	return (
		<div
			ref={setNodeRef}
			className='bg-indigo-400 p-8 max-w-[500px] h-[90%] my-8 mx-8 rounded-lg shadow-md'
		>
			<h1
				className={`text-center font-bold text-black py-2 p-4 mb-4 rounded-full ${getTitleBgColor(
					title
				)}`}
			>
				{title}
			</h1>
			<SortableContext
				items={todos.map((todo) => todo.id)}
				strategy={verticalListSortingStrategy}
			>
				{todos.map((todo) => (
					<Todocard
						key={todo.id}
						todo={todo}
						onEdit={(id, text) => onEdit(id, text)}
						deleteTodo={deleteTodo}
					/>
				))}
			</SortableContext>
		</div>
	);
};

export default TodoColumns;
