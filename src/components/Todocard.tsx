import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TodoProp = {
	todo: {
		id: number;
		text: string;
		completed: boolean;
	};

	deleteTodo: (id: number) => void;
	onEdit: (id: number, text: string) => void;
};

const Todocard = ({ todo, onEdit, deleteTodo }: TodoProp) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: todo.id,
		});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			style={style}
			className='flex justify-between items-center my-4 p-2 bg-white text-black rounded-md'
		>
			<p
				className={`break-words max-w-[250px] 
				`}
			>
				{todo.text}
			</p>
			<div className='flex items-center gap-3'>
				<button
					onClick={() => onEdit(todo.id, todo.text)}
					title='Edit Task'
					className='text-yellow-600'
				>
					<FaEdit />
				</button>
				<button
					onClick={() => deleteTodo(todo.id)}
					title='Delete Task'
					className='text-red-600'
				>
					<AiFillDelete />
				</button>
			</div>
		</div>
	);
};

export default Todocard;
