// import React, { useState, useRef, useEffect } from "react";
// import LangLogo from "./assets/lang.svg";
// import closeLogo from "./assets/close.svg";
// import menuLogo from "./assets/menu.svg";

// export default function College() {
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       from: "bot",
//       text: "Hi, I'm AskBot! Feel free to ask me anything about this college.",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);

//   // auto-scroll on new message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (input.trim() === "") return;

//     const userMsg = { from: "user", text: input };
//     setMessages((prev) => [...prev, userMsg]);

//     const currentInput = input; // preserve before clearing
//     setInput("");

//     const payload = {
//     query: input.trim(),
//     context: messages,
//     user_language: "hi"
//   }
//   const sendData = new FormData();
//   sendData.append("payload", JSON.stringify(payload));

//     try {
//         const response = await fetch("/api/chat", {
//             method: "POST",
//             body: sendData
//         });

//         if (!response.ok) {
//             throw new Error("Network response was not ok");
//         }

//         const data = await response.json();  // Parse JSON
//         const botMsg = { from: "bot", text: data.message }; // Use .message field

//         setMessages((prev) => [...prev, botMsg]);

//     } catch (err) {
//         console.error("Network error:", err);
//         setMessages((prev) => [
//             ...prev,
//             { from: "bot", text: "⚠️ Sorry, something went wrong." },
//         ]);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
//       {/* Navbar */}
//       <header className="w-full shadow-md bg-white fixed top-0 z-20">
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
//           <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
//             🎓 MyCollege
//           </div>
//           <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
//             <a href="#about" className="hover:text-blue-600">
//               About
//             </a>
//             <a href="#courses" className="hover:text-blue-600">
//               Courses
//             </a>
//             <a href="#admissions" className="hover:text-blue-600">
//               Admissions
//             </a>
//             <a href="#contact" className="hover:text-blue-600">
//               Contact
//             </a>
//           </nav>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="flex flex-col md:flex-row items-center justify-between text-center md:text-left px-6 mt-24 md:mt-32 max-w-7xl mx-auto">
//         <div className="md:w-1/2">
//           <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
//             Welcome to <span className="text-blue-600">MyCollege</span>
//           </h1>
//           <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-xl">
//             Shaping the future through excellence in education, innovation, and
//             community.
//           </p>
//           <div className="mt-6 flex gap-4 justify-center md:justify-start">
//             <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md">
//               Apply Now
//             </button>
//             <button className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100">
//               Learn More
//             </button>
//           </div>
//         </div>
//         <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
//           <img
//             src="https://d1gtq9mqg5x3oe.cloudfront.net/images/_articles/communications/releases/2023/08-august/princeton-review-2024/image-Folders-By-Ratio/promo/Gen-Campus_kp4_promo-4-660x371.jpg"
//             // scr={`https://placehold.co?text=College`}
//             alt="College campus"
//             className="rounded-xl shadow-lg"
//           /> 
//         </div>
//       </section>

//        {/* Courses Section */}
//        <section id="courses" className="max-w-7xl mx-auto mt-24 px-6">
//          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
//            Our Popular Courses
//          </h2>
//          <div className="grid md:grid-cols-3 gap-8">
//            {["Engineering", "Business", "Arts"].map((course, idx) => (
//             <div
//               key={idx}
//               className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
//              >
//               <img
//                 src={`https://placehold.co/400x250.png?text=${course}`}
//                 alt={course}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-4">
//                 <h3 className="font-bold text-lg text-gray-800">{course}</h3>
//                 <p className="text-gray-600 mt-2 text-sm">
//                   Learn more about our {course} programs designed to prepare you for the future.
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//        {/* About Section */}
//        <section id="about" className="max-w-6xl mx-auto mt-24 px-6">
//          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">About Us</h2>
//          <p className="text-gray-600 leading-relaxed">
//            MyCollege is committed to delivering world-class education, fostering innovation,
//            and building leaders of tomorrow. With a legacy of excellence, we provide students
//            with the tools they need to succeed in an ever-changing world.
//          </p>
//        </section>

//       {/* Footer */}
//       <footer className="mt-24 bg-gray-100 py-6 text-center text-gray-600 text-sm">
//         © {new Date().getFullYear()} MyCollege. All Rights Reserved.
//       </footer>

//       {/* Floating Ask AI Button */}
//       <button
//         onClick={() => setIsChatOpen(true)}
//         className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg font-semibold hover:bg-blue-700"
//       >
//         Ask AI
//       </button>

//       {/* Chat Popup */}
//       {isChatOpen && (
//         <div className="fixed bottom-20 right-6 w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col overflow-hidden border">
//           {/* Header */}
//           <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
//             <span className="font-semibold flex relative">AskBot <img src={menuLogo} className="absolute left-57 p-1 rounded-sm cursor-pointer h-6 hover:border hover:border-blue-400" alt="Lang Logo" /></span>
//             <button
//               onClick={() => setIsChatOpen(false)}
//               className="text-black hover:text-gray-200 cursor-pointer "
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-6 h-6 text-white hover:text-red-500 cursor-pointer"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//             </button>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm flex flex-col">
//             {messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`p-2 rounded-lg max-w-[80%] ${
//                   msg.from === "bot"
//                     ? "bg-gray-100 text-gray-700 self-start"
//                     : "bg-blue-600 text-white self-end"
//                 }`}
//               >
//                 {msg.text}
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input */}
//           <div className="border-t flex items-center p-2">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 p-2 text-sm outline-none"
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useRef, useEffect } from "react";
import closeLogo from "./assets/close.svg";
import menuLogo from "./assets/menu.svg";

export default function College() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi, I'm AskBot! Feel free to ask me anything about this college.",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Language states
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showLangList, setShowLangList] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const languages = ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Gujarati"];

  // Contact Staff button visibility
  const [showContactBtn, setShowContactBtn] = useState({ visible: false, color: "bg-blue-600 hover:bg-blue-700", text: 'Contact Staff?' });

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function contactStaff(){
    const contactStaffPayload = new FormData();
    contactStaffPayload.append("payload", JSON.stringify(messages));
    try {
        await fetch("/api/contact-staff", {
            method: "POST",
            body: contactStaffPayload
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Network response not ok");
            setShowContactBtn({ visible: true, color: "bg-green-600 hover:bg-green-700", text: 'Request Recieved!!' });
            return data;
        })
        .then(data => console.log(data.message))
        .catch(err => console.log(`Error: ${err}`));
    } catch (err) {
        console.log(e);
    }
}

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    if (!showContactBtn) setShowContactBtn({ visible: true, color: "bg-blue-600 hover:bg-blue-700", text: 'Contact Staff?'  });

    const payload = {
      query: input.trim(),
      context: messages,
      user_language: selectedLang,
    };

    const sendData = new FormData();
    sendData.append("payload", JSON.stringify(payload));
    setInput("");

    try {
        setShowContactBtn({ visible: false, color: "bg-blue-600 hover:bg-blue-700", text: 'Contact Staff?'  });
        const response = await fetch("/api/chat", {
            method: "POST",
            body: sendData
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();  // Parse JSON
        const botMsg = { from: "bot", text: data.message }; // Use .message field

        setMessages((prev) => [...prev, botMsg]);
        setShowContactBtn({ visible: true, color: "bg-blue-600 hover:bg-blue-700", text: 'Contact Staff?'  });

    }  catch (err) {
      setShowContactBtn({ visible: true, color: "bg-blue-600 hover:bg-blue-700", text: 'Contact Staff?'  });
      console.error("Network error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Sorry, something went wrong." },
      ]);
    }
  };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
//       {/* Navbar */}
//       <header className="w-full shadow-md bg-white fixed top-0 z-20">
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
//           <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
//             🎓 MyCollege
//           </div>
//           <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
//             <a href="#about" className="hover:text-blue-600">
//               About
//             </a>
//             <a href="#courses" className="hover:text-blue-600">
//               Courses
//             </a>
//             <a href="#admissions" className="hover:text-blue-600">
//               Admissions
//             </a>
//             <a href="#contact" className="hover:text-blue-600">
//               Contact
//             </a>
//           </nav>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="flex flex-col md:flex-row items-center justify-between text-center md:text-left px-6 mt-24 md:mt-32 max-w-7xl mx-auto">
//         <div className="md:w-1/2">
//           <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
//             Welcome to <span className="text-blue-600">MyCollege</span>
//           </h1>
//           <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-xl">
//             Shaping the future through excellence in education, innovation, and
//             community.
//           </p>
//           <div className="mt-6 flex gap-4 justify-center md:justify-start">
//             <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md">
//               Apply Now
//             </button>
//             <button className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100">
//               Learn More
//             </button>
//           </div>
//         </div>
//         <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
//           <img
//             src="https://d1gtq9mqg5x3oe.cloudfront.net/images/_articles/communications/releases/2023/08-august/princeton-review-2024/image-Folders-By-Ratio/promo/Gen-Campus_kp4_promo-4-660x371.jpg"
//             alt="College campus"
//             className="rounded-xl shadow-lg"
//           />
//         </div>
//       </section>

//       {/* Courses Section */}
//       <section id="courses" className="max-w-7xl mx-auto mt-24 px-6">
//         <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
//           Our Popular Courses
//         </h2>
//         <div className="grid md:grid-cols-3 gap-8">
//           {["Engineering", "Business", "Arts"].map((course, idx) => (
//             <div
//               key={idx}
//               className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
//             >
//               <img
//                 src={`https://placehold.co/400x250.png?text=${course}`}
//                 alt={course}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-4">
//                 <h3 className="font-bold text-lg text-gray-800">{course}</h3>
//                 <p className="text-gray-600 mt-2 text-sm">
//                   Learn more about our {course} programs designed to prepare
//                   you for the future.
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* About Section */}
//       <section id="about" className="max-w-6xl mx-auto mt-24 px-6">
//         <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
//           About Us
//         </h2>
//         <p className="text-gray-600 leading-relaxed">
//           MyCollege is committed to delivering world-class education, fostering
//           innovation, and building leaders of tomorrow. With a legacy of
//           excellence, we provide students with the tools they need to succeed
//           in an ever-changing world.
//         </p>
//       </section>

//       {/* Footer */}
//       <footer className="mt-24 bg-gray-100 py-6 text-center text-gray-600 text-sm">
//         © {new Date().getFullYear()} MyCollege. All Rights Reserved.
//       </footer>

//       <button
//         onClick={() => setIsChatOpen(true)}
//         className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg font-semibold hover:bg-blue-700"
//       >
//         Ask AI
//       </button>

      

//       {isChatOpen && (
//         <div className="fixed bottom-20 right-6 w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col overflow-hidden ">
//           <div className="relative">
//             {!showLangMenu && !showLangList && (
//               <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2 rounded-t-lg shadow-md">
//                 <span className="font-semibold">AskBot</span>

//                 <img
//                   src={menuLogo}
//                   alt="Menu"
//                   className="h-6 w-6 ml-43 cursor-pointer hover:opacity-80"
//                   onClick={() => setShowLangMenu(true)}
//                 />

//                 <button
//                   onClick={() => setIsChatOpen(false)}
//                   className="text-white hover:text-gray-200 ml-2"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-6 h-6"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             )}

//             {showLangMenu && !showLangList && (
//               <div className="flex flex-col bg-white rounded-t-lg shadow-md">
//                 <button
//                   onClick={() => setShowLangMenu(false)}
//                   className="text-blue-600 font-medium text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
//                 >
//                   ◀ Back
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowLangMenu(false);
//                     setShowLangList(true);
//                   }}
//                   className="px-4 py-2 text-left hover:bg-gray-100 border-t font-semibold"
//                 >
//                   Select Preferred Output Language
//                 </button>
//               </div>
//             )}

//             {showLangList && (
//               <div className="flex flex-col w-full bg-white border-t border-gray-200 rounded-b-lg shadow-inner p-2">
//                 <div className="flex items-center justify-start mb-3 border-b border-gray-300 pb-1">
//                   <button
//                     onClick={() => {
//                       setShowLangList(false);
//                       setShowLangMenu(true);
//                     }}
//                     className="flex items-center text-blue-600 font-medium hover:text-blue-800"
//                   >
//                     ◀ Back
//                   </button>
//                 </div>

//                 <div className="flex flex-col gap-2 mt-2">
//                   {languages.map((lang) => (
//                     <div
//                       key={lang}
//                       className={`px-4 py-2 rounded-lg cursor-pointer border ${
//                         lang === selectedLang
//                           ? "bg-blue-600 text-white border-blue-700 font-semibold"
//                           : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-100"
//                       } transition duration-150`}
//                       onClick={() => {
//                         setSelectedLang(lang);
//                         setShowLangList(false);
//                         setShowLangMenu(false);
//                       }}
//                     >
//                       {lang} {lang === selectedLang && "✅"}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {!showLangMenu && !showLangList && (
//             <div className="flex-1 flex flex-col p-2 border-t">
//               <div className="flex-1 overflow-y-auto space-y-2 text-sm flex flex-col">
//                 {messages.map((msg, idx) => (
//                   <div
//                     key={idx}
//                     className={`p-2 rounded-lg max-w-[80%] ${
//                       msg.from === "bot"
//                         ? "bg-gray-100 text-gray-700 self-start"
//                         : "bg-blue-600 text-white self-end"
//                     }`}
//                   >
//                     {msg.text}
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Contact Staff button above input */}
//               {showContactBtn && (
//                 <button className="bg-blue-600 text-white py-1 px-0 rounded-md font-medium hover:bg-blue-700 cursor-pointer mt-2 ml-37 w-38">
//                   Contact Staff?
//                 </button>
//               )}

             
//               <div className="flex items-center gap-2 mt-2">
//                 <input
//                   type="text"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   placeholder={`Type your message in ${selectedLang}...`}
//                   className="flex-1 p-2 text-sm outline-none rounded-md border border-gray-300 focus:border-blue-600"
//                   onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                 />
//                 <button
//                   onClick={sendMessage}
//                   className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 cursor-pointer"
//                 >
//                   Send
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );

    return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      {/* Navbar */}
      <header className="w-full shadow-md bg-white fixed top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            🎓 MyCollege
          </div>
          <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
            <a href="#about" className="hover:text-blue-600">
              About
            </a>
            <a href="#courses" className="hover:text-blue-600">
              Courses
            </a>
            <a href="#admissions" className="hover:text-blue-600">
              Admissions
            </a>
            <a href="#contact" className="hover:text-blue-600">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between text-center md:text-left px-6 mt-24 md:mt-32 max-w-7xl mx-auto">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
            Welcome to <span className="text-blue-600">MyCollege</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-xl">
            Shaping the future through excellence in education, innovation, and
            community.
          </p>
          <div className="mt-6 flex gap-4 justify-center md:justify-start">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md">
              Apply Now
            </button>
            <button className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100">
              Learn More
            </button>
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

      {/* Courses Section */}
      <section id="courses" className="max-w-7xl mx-auto mt-24 px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
          Our Popular Courses
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {["Engineering", "Business", "Arts"].map((course, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={`https://placehold.co/400x250.png?text=${course}`}
                alt={course}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{course}</h3>
                <p className="text-gray-600 mt-2 text-sm">
                  Learn more about our {course} programs designed to prepare
                  you for the future.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-6xl mx-auto mt-24 px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          About Us
        </h2>
        <p className="text-gray-600 leading-relaxed">
          MyCollege is committed to delivering world-class education, fostering
          innovation, and building leaders of tomorrow. With a legacy of
          excellence, we provide students with the tools they need to succeed
          in an ever-changing world.
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-24 bg-gray-100 py-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} MyCollege. All Rights Reserved.
      </footer>

      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg font-semibold hover:bg-blue-700 z-30"
      >
        Ask AI
      </button>

      {isChatOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white shadow-xl rounded-lg z-40 flex flex-col" style={{ height: '400px' }}>
          
          {/* Header - only show when not in menu modes */}
          {!showLangMenu && !showLangList && (
            <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-3 rounded-t-lg flex-shrink-0">
              <span className="font-semibold">AskBot</span>
              <div className="flex items-center gap-2">
                <img
                  src={menuLogo}
                  alt="Menu"
                  className="h-6 w-6 cursor-pointer hover:opacity-80"
                  onClick={() => setShowLangMenu(true)}
                />
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-white cursor-pointer hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Language Menu */}
          {showLangMenu && !showLangList && (
            <div className="flex flex-col bg-white rounded-t-lg shadow-md flex-shrink-0">
              <button
                onClick={() => setShowLangMenu(false)}
                className="text-blue-600 font-medium text-left px-4 py-3 hover:bg-gray-100 rounded-t-lg border-b"
              >
                ◀ Back
              </button>
              <button
                onClick={() => {
                  setShowLangMenu(false);
                  setShowLangList(true);
                }}
                className="px-4 py-3 text-left hover:bg-gray-100 font-semibold"
              >
                Select Preferred Output Language
              </button>
            </div>
          )}

          {/* Language List */}
          {showLangList && (
            <div className="flex flex-col bg-white rounded-t-lg shadow-md flex-shrink-0 max-h-80 overflow-y-auto">
              <div className="flex items-center justify-start px-4 py-2 border-b border-gray-300 sticky top-0 bg-white">
                <button
                  onClick={() => {
                    setShowLangList(false);
                    setShowLangMenu(true);
                  }}
                  className="text-blue-600 font-medium hover:text-blue-800"
                >
                  ◀ Back
                </button>
              </div>
              <div className="p-2 space-y-1">
                {languages.map((lang) => (
                  <div
                    key={lang}
                    className={`px-3 py-2 rounded-lg cursor-pointer border transition duration-150 ${
                      lang === selectedLang
                        ? "bg-blue-600 text-white border-blue-700 font-semibold"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-100"
                    }`}
                    onClick={() => {
                      setSelectedLang(lang);
                      setShowLangList(false);
                      setShowLangMenu(false);
                    }}
                  >
                    {lang} {lang === selectedLang && "✅"}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Content - only show when not in menu modes */}
          {!showLangMenu && !showLangList && (
            <>
              {/* Messages Area */}

              <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-3 rounded-lg text-sm break-words inline-block max-w-[85%] ${
                        msg.from === "bot"
                          ? "bg-gray-100 font-medium text-gray-700"
                          : "bg-blue-600 font-medium text-white"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Contact Staff button above input */}
              {showContactBtn.visible && (
                <button className={`${showContactBtn.color} text-white py-1 px-0 rounded-md font-medium cursor-pointer mt-2 mb-1 ml-37 w-38`} onClick={contactStaff}>
                  {showContactBtn.text}
                </button>
              )}

              {/* Input Area */}
              <div className="flex items-center gap-2 p-3 border-t bg-gray-50 rounded-b-lg flex-shrink-0">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Type your message in ${selectedLang}...`}
                  className="flex-1 p-2 text-sm outline-none rounded-md border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150 flex-shrink-0"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
