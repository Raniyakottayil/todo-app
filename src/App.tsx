import { useState } from "react";
import { useEffect } from "react";
import TodoColumns from "./components/TodoColumns";
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

type Todos = {
	id: number;
	text: string;
	completed: boolean;
	column: string;
};

function App() {
	const getInitialTodos = (): Todos[] => {
		const stored = localStorage.getItem("todos");
		return stored ? JSON.parse(stored) : [];
	};

	const [input, setInput] = useState<string>("");
	const [todos, setTodos] = useState<Todos[]>(getInitialTodos);

	const [editId, setEditId] = useState<number | null>(null);

	const columns = ["To Do", "In Progress", "Done"];
	const sensors = useSensors(useSensor(PointerSensor));

	const addOrUpdateTodo = () => {
		if (!input.trim()) return;

		if (editId !== null) {
			setTodos((prev) =>
				prev.map((todo) =>
					todo.id === editId ? { ...todo, text: input } : todo
				)
			);
			setEditId(null);
		} else {
			const newTodo = {
				id: Date.now(),
				text: input,
				completed: false,
				column: "To Do",
			};
			setTodos((prev) => [...prev, newTodo]);
		}

		setInput("");
	};

	const handleEdit = (id: number, text: string) => {
		setEditId(id);
		setInput(text);
	};

	const deleteTodo = (id: number) => {
		setTodos(todos.filter((todo) => todo.id !== id));
		if (editId === id) {
			setEditId(null);
			setInput("");
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const activeTodo = todos.find((t) => t.id === active.id);
		if (!activeTodo) return;

		const overTodo = todos.find((t) => t.id === over.id);
		const columnNames = ["To Do", "In Progress", "Done"];

		if (overTodo && activeTodo.column === overTodo.column) {
			const columnTodos = todos.filter((t) => t.column === activeTodo.column);
			const oldIndex = columnTodos.findIndex((t) => t.id === active.id);
			const newIndex = columnTodos.findIndex((t) => t.id === over.id);

			const newColumnTodos = [...columnTodos];
			const [moved] = newColumnTodos.splice(oldIndex, 1);
			newColumnTodos.splice(newIndex, 0, moved);

			const newTodos = [
				...todos.filter((t) => t.column !== activeTodo.column),
				...newColumnTodos,
			];
			setTodos(newTodos);
		} else if (!overTodo && columnNames.includes(over.id as string)) {
			setTodos((prev) =>
				prev.map((todo) =>
					todo.id === active.id ? { ...todo, column: over.id as string } : todo
				)
			);
		} else if (overTodo && activeTodo.column !== overTodo.column) {
			setTodos((prev) =>
				prev.map((todo) =>
					todo.id === active.id ? { ...todo, column: overTodo.column } : todo
				)
			);
		}
	};
	useEffect(() => {
	localStorage.setItem("todos", JSON.stringify(todos));
}, [todos]);

	return (
		<div className='bg-gray-900 min-h-screen p-4'>
			<h1 className='text-center text-white text-3xl sm:text-4xl font-bold mb-4'>
				<span className='text-4xl'>T</span>odo{" "}
				<span className='text-4xl'>L</span>ist📝
			</h1>
			<div className='bg-indigo-400 p-6 w-full max-w-[500px] mx-auto my-6 rounded-lg shadow-lg'>
				<div className='flex gap-3 items-center'>
					<input
						type='text'
						placeholder='Add a todo'
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className='flex-3 p-2 placeholder: text-gray-600 bg-white   rounded-lg focus:outline-none focus:border-2 focus:border-blue-700 focus:text-black'
					/>
					<button
						className=' p-2 flex-1 text-white bg-blue-700 cursor-pointer rounded-md hover:bg-blue-400 hover:text-black  transition'
						onClick={addOrUpdateTodo}
					>
						{editId ? "Update" : "Add"}
					</button>
				</div>
			</div>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
					{columns.map((col) => (
						<TodoColumns
							key={col}
							title={col}
							todos={todos.filter((todo) => todo.column === col)}
							deleteTodo={deleteTodo}
							onEdit={handleEdit}
						/>
					))}
				</div>
			</DndContext>
		</div>
	);
}

export default App;
