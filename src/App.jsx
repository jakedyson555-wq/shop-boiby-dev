import Nav from "./components/Nav";

export default function App() {
  return (
    <div className="min-h-screen bg-boiby-grey-100">
      <Nav />
      <main className="boiby-container flex items-center justify-center min-h-screen">
        <p className="text-ui-text-secondary text-sm">page content goes here</p>
      </main>
    </div>
  );
}