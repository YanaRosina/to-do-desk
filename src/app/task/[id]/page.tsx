
import { TaskModalProvider } from '@/components/TaskModalProvider';
import { HomePage } from '@/views/home-page';


export default function TaskPage() {

  return (
    <TaskModalProvider>
      <HomePage />
    </TaskModalProvider>
  );
}