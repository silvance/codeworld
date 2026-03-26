export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>CodeWorld</h1>
      <p>Experiments in code, cyber, and automation.</p>

      <div style={{ marginTop: "2rem" }}>
        <ul>
          <li><a href="/playground">Coding Playground</a></li>
          <li><a href="/forensics">Forensics Notes</a></li>
          <li><a href="/ai-lab">AI Lab</a></li>
          <li><a href="/toolkit">Operator Toolkit</a></li>
        </ul>
      </div>
    </main>
  );
}
