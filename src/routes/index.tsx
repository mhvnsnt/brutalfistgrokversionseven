import { createFileRoute } from "@tanstack/react-router";
import { BrutalFistApp } from "@/game/BrutalFistApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <BrutalFistApp />;
}
