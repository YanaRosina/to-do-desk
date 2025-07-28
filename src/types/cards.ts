// types/cards.ts

export type TCardItemProps = {
  title: string;
  description: string;
  date: string;
  priority: "low" | "medium" | "high";
  status: string; 
  order?: number;
}

export type TCardData = {
  id: string;
} & TCardItemProps;

