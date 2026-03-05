import Nav from "./Nav";

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--ui-bg)]">
      <Nav />

      <main className="boiby-container flex items-center justify-center min-h-screen">
        <p className="text-[var(--ui-text-secondary)] text-sm">
          Page content goes here.
        </p>
      </main>
    </div>
  );
}