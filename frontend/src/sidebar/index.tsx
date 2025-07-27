import { useState } from "react";

export default function Sidebar() {
  const [server, setServer] = useState("");
  const ping = async () => {
    const res = await fetch("http://localhost:8000/health");
    const json = await res.json();
    setServer(JSON.stringify(json));
  };
  return (
    <div className="p-4 w-64 text-sm">
      <button onClick={ping} className="border px-2 py-1 rounded">
        Ping backend
      </button>
      <pre>{server}</pre>
    </div>
  );
}
