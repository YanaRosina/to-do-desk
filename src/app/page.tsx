import { TaskModalProvider } from '@/components/TaskModalProvider';
import {HomePage }  from '@/views/home-page';

export default function Page() {
  return (
    <TaskModalProvider>
      <HomePage />
    </TaskModalProvider>
  );
}
