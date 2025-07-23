import { TCardItemProps } from "@/types/cards";
import clsx from "clsx";
export const CardItem = ({
  title,
  description,
  date,
  priority,
  status
}: TCardItemProps) => {
    const borderColor = clsx({
    'border-3 border-red-700': priority === 'high',
    'border-3 border-yellow-500': priority === 'medium',
    'border-3 border-green-700': priority === 'low',
  });
  const priorityColors = {
    high: 'text-red-700',
    medium: 'text-yellow-600',
    low: 'text-green-700',
  };
  return (
  <div
      className={clsx(
        "bg-stone-300 shadow-md rounded-xl p-4 m-4 w-full max-w-sm mx-auto shadow-xl/30 hover:scale-105 duration-400",
       
        borderColor
      )}
     >
      <h2 className="text-xl font-semibold text-center text-gray-800 ">{title}</h2>

      <p className="text-gray-600 ">
        <span className="font-bold text-gray-700">Date:</span> {date}
      </p>
      <p className={clsx("text-gray-600", priorityColors[priority])}>
        <span className="font-bold text-gray-700">Priority: </span>
        {priority}
      </p>
      <p className="text-gray-600">
        <span className="font-bold text-gray-700">Status:</span> {status}
      </p>
      <p className="text-gray-600">{description}</p>
      <button className="mt-4 bg-[#4F4557]/35 px-4 py-2 text-white font-bold rounded hover:bg-[#4f4557] transition-colors cursor-pointer mx-auto block">
        Delite
      </button>
    </div>
  );
};
