import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import socket, { client_id } from "./Socket_Connector";

export default function College() {
    const CHAT_API = "https://myserver.com/api/chat";
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: "bot", text: "Hi, I'm AskBot! Feel free to ask me anything about this college." },
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const [selectedStream, setSelectedStream] = useState(null);
    const courses = {
        science: ["BSc Physics", "BSc Chemistry", "BSc Mathematics", "BSc Computer Science"],
        commerce: ["BCom", "BBA", "BMS", "BCom Accounting"],
        arts: ["BA English", "BA Psychology", "BA Economics", "BA Sociology"],
    };
    const streams = ["science", "commerce", "arts"];
    const [showStreamMenu, setShowStreamMenu] = useState(false);
    const [showStreamList, setShowStreamList] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [showLangList, setShowLangList] = useState(false);
    const [selectedLang, setSelectedLang] = useState("English");
    const languages = ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Gujarati"];
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [shouldShowStreamMenu, setShouldShowStreamMenu] = useState(false);
    const fileInputRef = useRef(null);

    // CONTACT STAFF / EMAIL PROMPT
    const [showContactBtn, setShowContactBtn] = useState({
        visible: false,
        color: "bg-blue-600 hover:bg-blue-700",
        text: "Contact Staff?",
    });
    const [emailPrompt, setEmailPrompt] = useState(false);
    
    // Auto-scroll on messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedStream]);

    useEffect(() => {
        socket.onopen = () => {
            console.log("Conn OPEN");
        }

        socket.onmessage = (event) => {
            console.log(event.data)
        }

        socket.onerror = (err) => {
            console.error("❌ WS ERROR", err);
        };
    }, [])

    function waitForSocketConnection() {
        return new Promise((resolve) => {
            if (socket.readyState === 1) return resolve();

            socket.onopen = () => resolve();
        });
    }

    const callChatApi = async (query, extra = {}) => {
        console.log({ query, extra })
        try {
            let res;
            if (extra?.files && extra.files.length > 0) {
                const fd = new FormData();
                fd.append("payload", JSON.stringify({
                    query,
                    context: extra.context || messages,
                    user_language: extra.language || selectedLang,
                    client_id
                }));
                extra.files.forEach((f, i) => fd.append(`file_${i}`, f));
                await waitForSocketConnection();
                res = await fetch("/api/new-v-chat", { method: "POST", body: fd });
            }
            else {
                const payload = new FormData();
                const sendData = {
                    query: query,
                    context: extra.context || messages,
                    user_language: extra.language || selectedLang,
                    client_id
                }
                console.log({ sendData })
                payload.append("payload", JSON.stringify(sendData))
                // console.log(payload.get("payload"))
                await waitForSocketConnection();
                res = await fetch("/api/new-v-chat", {
                    method: "POST",
                    body: payload,
                });
            }

            const data = await res.json();
            console.log(data)
            if (!res.ok) {
                // const data = await res.json();
                throw new Error(data.message || "Network response was not ok");
            }

            return data.message ?? "No response";
        } catch (err) {
            console.error("callChatApi error:", err.message);
            // throw err;
        }
    };

    const sendMessage = async () => {
        if (!input.trim() && uploadedFiles.length === 0) return;

        const text = input.trim();
        setMessages((prev) => [...prev, { from: "user", text: text || "(file)" }]);
        setInput("");
        if (!showContactBtn.visible) {
            setShowContactBtn({ visible: true, color: "bg-blue-600 hover:bg-blue-700", text: "Contact Staff?" });
        }

        try {
            const apiMessage = await callChatApi(text || "(file)", {
                files: uploadedFiles,
                context: messages,
                language: selectedLang,
            });
            setMessages((prev) => [...prev, { from: "bot", text: apiMessage }]);
            console.log(messages.length)
            // await new Promise(r => setTimeout(r, 500));
            if (
                messages.length === 1 &&
                !selectedStream &&
                text.toLowerCase().includes("hi") ||
                text.toLowerCase().includes("hello") ||
                text.toLowerCase().includes("hii")
            ) { console.log("true"); setShouldShowStreamMenu(true); }
            setShowContactBtn({ visible: true, color: "bg-blue-600 hover:bg-blue-700", text: "Contact Staff?" });
        } catch (err) {
            setMessages((prev) => [...prev, { from: "bot", text: "Sorry — failed to reach the server." }]);
            setShowContactBtn({ visible: true, color: "bg-blue-600 hover:bg-blue-700", text: "Contact Staff?" });
        } finally {
            setUploadedFiles([]);
        }
    };

    // CONTACT STAFF - posts messages array to /api/contact-staff (keeps as-is)
    async function contactStaff() {
        const contactStaffPayload = new FormData();
        contactStaffPayload.append("payload", JSON.stringify(messages));

        try {
            const res = await fetch("/api/contact-staff", { method: "POST", body: contactStaffPayload });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Network response not ok");
            setShowContactBtn({ visible: true, color: "bg-green-600 hover:bg-green-700", text: "Request Received!!" });
            setEmailPrompt(false);
        } catch (err) {
            console.error("contactStaff error:", err);
            setShowContactBtn({ visible: true, color: "bg-blue-600 hover:bg-blue-700", text: "Contact Staff?" });
        }
    }

    const handleCourseClick = async (course) => {
        const userText = `Tell me about ${course}`;
        setMessages((prev) => [...prev, { from: "user", text: userText }]);

        // ensure contact button becomes visible once user interacts
        if (!showContactBtn.visible) {
            setShowContactBtn({ visible: true, color: "bg-blue-600 hover:bg-blue-700", text: "Contact Staff?" });
        }

        try {
            setShouldShowStreamMenu(false);
            setSelectedStream(null);
            const botReply = await callChatApi(userText, { context: messages, language: selectedLang });
            setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
        } catch (err) {
            setMessages((prev) => [...prev, { from: "bot", text: "Sorry — couldn't fetch the course details." }]);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
            {/* NAVBAR */}
            <header className="w-full shadow-md bg-white fixed top-0 z-20">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">🎓 MyCollege</div>
                    <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
                        <a href="#about" className="hover:text-blue-600">About</a>
                        <a href="#courses" className="hover:text-blue-600">Courses</a>
                        <a href="#admissions" className="hover:text-blue-600">Admissions</a>
                        <a href="#contact" className="hover:text-blue-600">Contact</a>
                    </nav>
                </div>
            </header>

            {/* HERO */}
            <section className="flex flex-col md:flex-row items-center justify-between text-center md:text-left px-6 mt-24 md:mt-32 max-w-7xl mx-auto">
                <div className="md:w-1/2">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
                        Welcome to <span className="text-blue-600">MyCollege</span>
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-xl">
                        Shaping the future through excellence in education, innovation, and community.
                    </p>
                    <div className="mt-6 flex gap-4 justify-center md:justify-start">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md">Apply Now</button>
                        <button className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100">Learn More</button>
                    </div>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
                    <img
                        src="https://d1gtq9mqg5x3oe.cloudfront.net/images/_articles/communications/releases/2023/08-august/princeton-review-2024/image-Folders-By-Ratio/promo/Gen-Campus_kp4_promo-4-660x371.jpg"
                        alt="College campus"
                        className="rounded-xl shadow-lg"
                    />
                </div>
            </section>

            {/* MAIN (Courses grid + About) */}
            <main className="max-w-7xl mx-auto px-6 mt-12">
                <section id="courses" className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Our Popular Courses</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {["Engineering", "Business", "Arts"].map((course, idx) => (
                            <div key={idx} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
                                <img src={`https://placehold.co/400x250.png?text=${course}`} alt={course} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-800">{course}</h3>
                                    <p className="text-gray-600 mt-2 text-sm">Learn more about our {course} programs designed to prepare you for the future.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="about" className="max-w-6xl mx-auto mt-24 px-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">About Us</h2>
                    <p className="text-gray-600 leading-relaxed">MyCollege is committed to delivering world-class education, fostering innovation, and building leaders of tomorrow.</p>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="mt-24 bg-gray-100 py-6 text-center text-gray-600 text-sm">© {new Date().getFullYear()} MyCollege. All Rights Reserved.</footer>

            {/* FLOATING ASK AI BUTTON */}
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg font-semibold hover:bg-blue-700 z-30"
            >
                Ask AI
            </button>

            {/* COURSES BOX (OUTSIDE CHAT) - LEFT side */}
            {selectedStream && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-lg p-4 z-60 border">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold capitalize">{selectedStream} Courses</h3>
                        <button onClick={() => setSelectedStream(null)} className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">Close</button>
                    </div>

                    <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                        {courses[selectedStream].map((c, i) => (
                            <div key={i} className="p-2 bg-gray-50 rounded border flex justify-between items-center z-50">
                                <div>{c}</div>
                                <button onClick={() => handleCourseClick(c)} className="ml-3 text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Ask</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CHAT MODAL (bottom-right) */}
            {isChatOpen && (
                <div
                    className={`fixed bottom-6 right-6 w-96 bg-white shadow-xl rounded-lg z-50 flex flex-col ${isDragOver ? "ring-2 ring-blue-400 ring-opacity-60" : ""}`}
                    style={{ height: "420px" }}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDragOver(false);
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOver(false);
                        const files = Array.from(e.dataTransfer.files || []);
                        if (files.length) setUploadedFiles((prev) => [...prev, ...files]);
                    }}
                >
                    {/* HEADER */}
                    {/* {!showLangMenu && !showLangList && (
                        <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-3 rounded-t-lg">
                            <span className="font-semibold">AskBot</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setShowLangMenu(true)} className="p-1 rounded hover:bg-blue-500/20" title="Menu">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <button onClick={() => setIsChatOpen(false)} className="p-1 rounded hover:bg-blue-500/20" title="Close">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )} */}

                    {/* HEADER */}
                    {!showLangMenu && !showLangList && (
                        <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-3 rounded-t-lg">
                            <span className="font-semibold">AskBot</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setShowLangMenu(true)} className="p-1 rounded hover:bg-blue-500/20" title="Select Language and Stream">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <button onClick={() => setIsChatOpen(false)} className="p-1 rounded hover:bg-blue-500/20" title="Close">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* LANGUAGE MENU */}
                    {showLangMenu && !showLangList && !showStreamList && (
                        <div className="flex flex-col bg-white rounded-t-lg shadow-md">
                            <button onClick={() => setShowLangMenu(false)} className="text-blue-600 font-medium text-left px-4 py-3 hover:bg-gray-100 rounded-t-lg border-b">◀ Back</button>
                            <button onClick={() => { setShowLangList(true); }} className="px-4 py-3 text-left hover:bg-gray-100 font-semibold">Select Preferred Output Language</button>
                            <button onClick={() => { setShowStreamList(true); }} className="px-4 py-3 text-left hover:bg-gray-100 font-semibold">Select Preferred Stream</button>
                        </div>
                    )}

                    {/* STREAM MENU */}
                    {showStreamMenu && !showStreamList && (
                        <div className="flex flex-col bg-white rounded-t-lg shadow-md">
                            <button onClick={() => setShowStreamMenu(false)} className="text-blue-600 font-medium text-left px-4 py-3 hover:bg-gray-100 rounded-t-lg border-b">◀ Back</button>
                            <button onClick={() => { setShowStreamMenu(false); setShowStreamList(true); }} className="px-4 py-3 text-left hover:bg-gray-100 font-semibold">Select Preferred Stream</button>
                        </div>
                    )}

                    {/* LANGUAGE LIST */}
                    {showLangList && !showStreamList && (
                        <div className="flex flex-col bg-white rounded-t-lg shadow-md max-h-64 overflow-y-auto">

                            <div className="flex items-center justify-start px-4 py-2 border-b sticky top-0 bg-white">
                                <button onClick={() => setShowLangList(false)} className="text-blue-600 font-medium text-left px-4 py-3 hover:bg-gray-100 rounded-t-lg border-b">◀ Back</button>
                            </div>

                            {languages.map((lang, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        console.log("Language selected:", lang);
                                        setSelectedLang(lang);
                                        setShowLangList(false);
                                    }}
                                    className={`flex justify-between items-center text-left px-4 py-3 hover:bg-gray-100 ${selectedLang === lang ? "bg-blue-200 font-semibold" : ""}`}
                                >
                                    <span>{lang}</span>
                                    {selectedLang === lang && <span className="text-blue-600 font-bold ml-2">✓</span>}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* STREAM LIST */}
                    {showStreamList && (
                        <div className="flex flex-col bg-white rounded-t-lg shadow-md max-h-64 overflow-y-auto">

                            {/* Back Button */}
                            <div className="flex items-center justify-start px-4 py-2 border-b sticky top-0 bg-white">
                                <button onClick={() => setShowStreamList(false)} className="text-blue-600 font-medium text-left px-4 py-3 hover:bg-gray-100 rounded-t-lg border-b">◀ Back</button>
                            </div>

                            {/* Stream Options */}
                            {streams.map((stream, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        console.log("Stream selected:", stream);
                                        setSelectedStream(stream);
                                        setShowStreamList(false);
                                    }}
                                    className={`flex justify-between items-center text-left px-4 py-3 hover:bg-gray-100 ${selectedStream === stream ? "bg-blue-200 font-semibold" : ""}`}
                                >
                                    <span>{stream.charAt(0).toUpperCase() + stream.slice(1)}</span>
                                    {selectedStream === stream && <span className="text-blue-600 font-bold ml-2">✓</span>}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* LANGUAGE MENU */}
                    {/* {showLangMenu && !showLangList && (
                        <div className="flex flex-col bg-white rounded-t-lg shadow-md">
                            <button onClick={() => setShowLangMenu(false)} className="text-blue-600 font-medium text-left px-4 py-3 hover:bg-gray-100 rounded-t-lg border-b">◀ Back</button>
                            <button onClick={() => { setShowLangMenu(false); setShowLangList(true); }} className="px-4 py-3 text-left hover:bg-gray-100 font-semibold">Select Preferred Output Language</button>
                        </div>
                    )} */}

                    {/* LANGUAGE LIST */}
                    {/* {showLangList && (
                        <div className="flex flex-col bg-white rounded-t-lg shadow-md max-h-64 overflow-y-auto">
                            <div className="flex items-center justify-start px-4 py-2 border-b sticky top-0 bg-white">
                                <button onClick={() => { setShowLangList(false); setShowLangMenu(true); }} className="text-blue-600 font-medium hover:text-blue-800">◀ Back</button>
                            </div>
                            <div className="p-2 space-y-1">
                                {languages.map((lang) => (
                                    <div key={lang} className={`px-3 py-2 rounded-lg cursor-pointer border transition duration-150 ${lang === selectedLang ? "bg-blue-600 text-white border-blue-700 font-semibold" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-100"}`} onClick={() => { setSelectedLang(lang); setShowLangList(false); setShowLangMenu(false); }}>
                                        {lang} {lang === selectedLang && "✅"}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}

                    {/* CHAT CONTENT */}
                    {!showLangMenu && !showLangList && (
                        <>
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
                                {/* If greeting detected and no stream selected show stream menu inside chat */}
                                {(
                                    messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                                            <div className={`p-3 rounded-lg text-sm break-words inline-block max-w-[85%] ${msg.from === "bot" ? "bg-gray-100 font-medium text-gray-700" : "bg-blue-600 font-medium text-white"}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))
                                )}
                                {shouldShowStreamMenu && (
                                    <div className="flex flex-col gap-3 p-3">
                                        <button onClick={() => setSelectedStream("science")} className="p-3 bg-blue-200 rounded-xl hover:bg-blue-300">Science</button>
                                        <button onClick={() => setSelectedStream("commerce")} className="p-3 bg-green-200 rounded-xl hover:bg-green-300">Commerce</button>
                                        <button onClick={() => setSelectedStream("arts")} className="p-3 bg-yellow-200 rounded-xl hover:bg-yellow-300">Arts</button>
                                    </div>
                                )
                                    // (
                                    //     messages.map((msg, idx) => (
                                    //         <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                                    //             <div className={`p-3 rounded-lg text-sm break-words inline-block max-w-[85%] ${msg.from === "bot" ? "bg-gray-100 font-medium text-gray-700" : "bg-blue-600 font-medium text-white"}`}>
                                    //                 {msg.text}
                                    //             </div>
                                    //         </div>
                                    //     )))
                                }

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Contact Staff button */}
                            {showContactBtn.visible && (
                                <button onClick={() => setEmailPrompt(true)} className={`${showContactBtn.color} text-white py-1 px-2 rounded-md font-medium cursor-pointer mt-2 ml-3 w-auto`}>
                                    {showContactBtn.text}
                                </button>
                            )}

                            {/* Uploaded files preview */}
                            {uploadedFiles.length > 0 && (
                                <div className="px-3 pb-2 max-h-20 overflow-y-auto">
                                    <div className="space-y-1">
                                        {uploadedFiles.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded text-xs">
                                                <span className="truncate flex-1">{file.name}</span>
                                                <button onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0">✕</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Input Area */}
                            <div className="flex items-center gap-1 p-3 border-t bg-gray-50 rounded-b-lg">
                                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => {
                                    const files = e.target.files ? Array.from(e.target.files) : [];
                                    if (files.length) setUploadedFiles((prev) => [...prev, ...files]);
                                }} />

                                <button onClick={() => fileInputRef.current?.click()} className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-lg">📎</button>

                                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Type your message in ${selectedLang}...`} onKeyDown={(e) => e.key === "Enter" && sendMessage()} className="flex-1 p-2 text-sm outline-none rounded-md border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />

                                <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Send</button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* EMAIL PROMPT DIALOG */}
            {emailPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-2">Enter your email</h3>
                        <input type="email" placeholder="you@example.com" className="w-full p-2 rounded border mb-4" />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setEmailPrompt(false)} className="px-3 py-2 rounded bg-gray-200">Cancel</button>
                            <button onClick={contactStaff} className="px-3 py-2 rounded bg-blue-600 text-white">Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}