import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { GiSpeaker } from "react-icons/gi";
import { FaMicrophone } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import {
  addMessage,
  setChat,
  setError,
  setLoading,
} from "../../store/slices/patientSlice";
import Chats from "./Chats.jsx";

const AISymptomsChecker = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { loading, chatHistory } = useSelector((state) => state.patient);
  const { language } = useSelector((state) => state.language);

  const promptRef = useRef(null);
  const recognitionRef = useRef(null);

  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  /* ================= AUTH + LOAD CHAT ================= */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchMessages = async () => {
      try {
        dispatch(setLoading(true));
        const res = await fetch(
          `https://farishtaa.onrender.com/api/patient/symptoms/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        dispatch(setChat(data.chats || [])); // use chats array from response
      } catch (err) {
        dispatch(setError("Failed to load chat"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchMessages();
  }, [userId, token, dispatch, navigate]);

  /* ================= SPEECH RECOGNITION ================= */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    const langMap = {
      en: "en-US",
      hi: "hi-IN",
      or: "or-IN",
    };
    recognition.lang = langMap[language] || "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      promptRef.current.value =
        (promptRef.current.value || "") + " " + transcript;
    };

    recognitionRef.current = recognition;
  }, [language]);

  /* ================= AUTO SPEAK LATEST AI MESSAGE ================= */
  useEffect(() => {
    if (!voiceEnabled) return;
    if (!chatHistory || chatHistory.length === 0) return;
    if (!window.speechSynthesis) return;

    const lastMessage = chatHistory[chatHistory.length - 1];
    if (lastMessage.role !== "assistant") return; // assistant = AI

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lastMessage.content);

    const langMap = {
      en: "en-US",
      hi: "hi-IN",
      or: "or-IN",
    };
    utterance.lang = langMap[language] || "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }, [chatHistory, voiceEnabled, language]);

  /* ================= HANDLERS ================= */
  const handleMicClick = () => recognitionRef.current?.start();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = promptRef.current.value.trim();
    if (!text) return;

    try {
      dispatch(setLoading(true));
      dispatch(addMessage({ role: "patient", content: text }));

      const res = await fetch(
        `https://farishtaa.onrender.com/api/patient/symptoms/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userPrompt: text, language }),
        }
      );
   
      const data = await res.json();
     console.log("AI Response Data:", data);  
      if (data.chats && data.chats.length > 0) {
        dispatch(addMessage(data.chats.at(-1)));
      }
      if(res.status===401){
        alert("Session expired. Please log in again.");
        navigate("/login");
      }
      promptRef.current.value = "";
    } catch (err) {
      dispatch(setError("Message failed"));
      navigate("/login");
    } finally {
      dispatch(setLoading(false));
    }
  };

  /* ================= UI ================= */
  return (
    <div className="h-screen flex flex-col bg-[#fafafa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center font-sans shadow-sm">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition font-semibold"
          >
            <MdArrowBack size={20} />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="flex flex-col items-center">
          <h1 className="font-bold text-lg text-gray-900">AI Symptoms Checker</h1>
          <p className="text-xs text-gray-500 mt-0.5">Get instant health insights</p>
        </div>

        <button
          onClick={() => {
            setVoiceEnabled(true);
            const u = new SpeechSynthesisUtterance("Voice enabled");
            window.speechSynthesis.speak(u);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-semibold"
        >
          <GiSpeaker size={18} />
          Listen
        </button>
      </header>

      {/* Chat */}
      <main className="flex-1 overflow-y-auto p-3">
        <Chats />
      </main>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t bg-white p-3 flex gap-2 items-center"
      >
        <button
          type="button"
          onClick={handleMicClick}
          className={`${
            listening ? "bg-red-200" : "bg-gray-200"
          }`}
        >
        <FaMicrophone />   
        </button>

        <input
          ref={promptRef}
          className="flex-1 border rounded-full px-4 py-2"
          placeholder="Describe your symptoms..."
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 bg-red-600 text-white rounded-full"
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default AISymptomsChecker;