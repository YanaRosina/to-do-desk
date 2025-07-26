// src/app/task/[id]/page.tsx
import { TaskModalProvider } from '@/components/TaskModalProvider';
import { HomePage } from '@/views/home-page';

interface TaskPageProps {
  params: {
    id: string;
  };
}

export default function TaskPage({ params }: TaskPageProps) {
  // Эта страница отображает ту же HomePage, но модальное окно
  // будет открыто автоматически благодаря useTaskModal хуку,
  // который отслеживает URL и определяет, что нужно показать модал
  
  return (
    <TaskModalProvider>
      <HomePage />
    </TaskModalProvider>
  );
}