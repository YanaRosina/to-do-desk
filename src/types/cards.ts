export type TCardItemProps = {
  title: string;
  description: string;
  date: string;
  priority: "low" | "medium" | "high";
  status: "new" | "in-progress" | "tested" | "done";
};

// А для данных с id создайте отдельный тип:
export type TCardData = {
  id: string;
} & TCardItemProps;
