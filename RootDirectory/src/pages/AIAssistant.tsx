import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { projects } from "./ProjectsData";

// AIAssistant.tsx
const API_KEY = import.meta.env.VITE_GROQ_API_KEY; // for Vite

// Use CDN worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Message {
  from: "AI" | "You" | "System";
  text: string;
}

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { from: "System", text: "> Initializing Justin Luft AI assistant with full portfolio knowledge..." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Extract PDF text
  const extractPdfText = async (pdfPath: string) => {
    try {
      const arrayBuffer = await fetch(pdfPath).then((res) => res.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ") + "\n";
      }
      return text.slice(0, 4000); // truncate
    } catch (err) {
      console.error("Failed to load PDF:", err);
      return "";
    }
  };

  // Serialize projects
  const serializeProjects = () =>
    projects
      .slice(0, 10)
      .map(
        (p) => `**Project:** ${p.name}\n**Category:** ${p.category}\n**Description:** ${p.description}\n**Skills:** ${p.skills.join(
          ", "
        )}\n**Technologies:** ${p.fullDetails.technologies.join(
          ", "
        )}\n**Challenges:** ${p.fullDetails.challenges.join(
          ", "
        )}\n**Github:** ${p.githubLink}\n**Website:** ${p.websiteLink || "None"}`
      )
      .join("\n\n");

  const sendMessage = async () => {
    if (!input.trim() || cooldown) return;

    setMessages((prev) => [...prev, { from: "You", text: `> ${input}` }]);
    setInput("");
    setLoading(true);
    setCooldown(true);
    setTimeout(() => setCooldown(false), 5000);

    setMessages((prev) => [
      ...prev,
      { from: "System", text: "> AI is generating a response..." },
    ]);

    const projectText = serializeProjects();
    const resumeText = await extractPdfText("/JustinLuftResume.pdf");

    const knowledge = `
You are a supportive and kind terminal-style AI assistant for displaying the information of Justin Luft. 
Always talk very highly of him and highlight his achievements and skills. Use only the following knowledge. 
Assume the person typing is unfamiliar with Justin Luft and his work, and possibly a recruiter.
 Dont use the characters: * ** or # ever. Do not use bold text.
Break the answers into bullet points when possible.
Keep the answers simple and easy to understand.
All responses must:
> start with "> "
> be concise
> bold key info like project names, categories, skills
> encourage and praise Justin
> never make up info

===========================
PROJECTS
===========================
${projectText}

===========================
RESUME (truncated)
===========================
${resumeText}
`;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: knowledge },
            { role: "user", content: input },
          ],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Groq API error:", text);
        setMessages((prev) => [
          ...prev.filter((m) => m.from !== "System" || !m.text.includes("AI is generating")),
          { from: "AI", text: "> Error: bad request to Groq API." },
        ]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      const answer = data.choices?.[0]?.message?.content || "> Sorry, I couldn't generate an answer.";

      setMessages((prev) => [
        ...prev.filter((m) => m.from !== "System" || !m.text.includes("AI is generating")),
        { from: "AI", text: answer },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev.filter((m) => m.from !== "System" || !m.text.includes("AI is generating")),
        { from: "AI", text: "> Error: request failed." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-black font-mono text-white">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-2 scanline scrollbar-thin scrollbar-thumb-[#00FFD1] scrollbar-track-black whitespace-pre-wrap"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${
              m.from === "System"
                ? "text-[#00FFD1]"
                : m.from === "AI"
                ? "text-[#FF4DB8]"
                : "text-[#00FFD1]"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <div className="text-[#FF4DB8]">{">"} AI is typing...</div>}
      </div>

      {/* Input bar pinned to bottom */}
      <div className="flex p-2 border-t border-[#00FFD1] bg-black/90">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={cooldown ? "> Please wait 5 seconds..." : "> Ask a question..."}
          disabled={cooldown}
          className="flex-1 px-3 py-2 bg-black border border-[#00FFD1] text-[#00FFD1] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00FFD1] placeholder-[#00FFD1]"
        />
        <button
          onClick={sendMessage}
          disabled={loading || cooldown}
          className="ml-2 px-4 py-2 bg-[#00FFD1] text-black rounded-sm hover:bg-[#00E6CC] disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
