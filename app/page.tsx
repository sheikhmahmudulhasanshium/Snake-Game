import Header from "./components/header";
import SnakeGame from "./components/game";

export default function Home() {
  return (
    <main className="flex justify-center items-center flex-col pt-4">
      <Header/>
      <SnakeGame/>
    </main>
      );
}
