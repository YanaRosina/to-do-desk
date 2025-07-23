import  CardList from "@/components/CardsList";
export default function HomePage() {
  return (
    <div className="flex flex-col  min-h-screen bg-background">
      <h1 className="text-3xl font-bold mx-auto py-2 text-white">To-Do Desk</h1>
      <CardList />
    </div>
  );
}
