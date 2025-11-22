import React, { useState, useEffect, useRef } from "react";
import { projects } from "./ProjectsData";
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker - using unpkg to automatically match the installed version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Vite environment variable
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

interface Message {
  from: "AI" | "You" | "System";
  text: string;
}

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { from: "System", text: "> Initialized Justin Luft AI assistant with full portfolio knowledge..." },
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

  const MAX_CHARS = 5000;

  const truncateMessage = (text: string) =>
    text.length <= MAX_CHARS ? text : text.slice(-MAX_CHARS);

  const extractPdfText = async (pdfPath: string) => {
    try {
      const pdf = await pdfjsLib.getDocument(pdfPath).promise;
      let fullText = '';

      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      return fullText.slice(0, 4000); // truncate
    } catch (err) {
      console.error("Failed to load PDF:", err);
      return "";
    }
  };

  // ---------------- Projects ----------------
  const serializeProjects = () =>
    projects
      .slice(0, 10)
      .map(
        (p) => `Project: ${p.name}, Category: ${p.category}, Skills: ${p.skills.join(", ")}`
      )
      .join("\n");

  // ---------------- Send message ----------------
  const sendMessage = async () => {
    if (!input.trim() || cooldown) return;

    // Add user message
    setMessages((prev) => [...prev, { from: "You", text: `> ${input}` }]);
    setInput("");
    setLoading(true);
    setCooldown(true);
    setTimeout(() => setCooldown(false), 5000);

    // Add system typing notice
    setMessages((prev) => [
      ...prev,
      { from: "System", text: "> AI is generating a response..." },
    ]);

    const projectText = serializeProjects();
    const resumeText = await extractPdfText("/JustinLuftResume.pdf");

    const knowledge = `
You are a supportive and kind terminal-style AI assistant for displaying the information of Justin Luft.
Always talk highly of him and highlight his achievements and skills. Use only the following knowledge.
Assume you are talking to a recruiter or potential employer.
Break answers into bullet points, be concise, avoid bold/markdown, encourage Justin, and never make up info.

PROJECTS
${projectText}

RESUME (truncated)
${resumeText}
`;

    try {
      // Keep last 3 user + 3 AI messages for context
      const recentContext = messages
        .filter((m) => m.from === "You" || m.from === "AI")
        .slice(-6)
        .map((m) => ({
          role: m.from === "You" ? "user" : "assistant",
          content: truncateMessage(m.text.replace(/^> /, "")),
        }));

      // Add current input
      recentContext.push({ role: "user", content: truncateMessage(input) });

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
            ...recentContext,
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
      const answer = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate an answer.";

      setMessages((prev) => [
        ...prev.filter((m) => m.from !== "System" || !m.text.includes("AI is generating")),
        { from: "AI", text: `> ${truncateMessage(answer)}` },
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