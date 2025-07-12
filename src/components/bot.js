import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "@/utils/api";
import { getSocket } from "@/utils/socket";
import { getBotUrl } from "@/utils/Bot";
import "./bot.css";

const Bot = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [typingIndicator, setTypingIndicator] = useState("");

  let typingTimeout;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return (window.location.href = "/login");

        const res = await axiosInstance.get("/chat/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(res.data);
      } catch (err) {
        if (err.response?.status === 401) window.location.href = "/login";
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket && currentUser?.email) {
      socket.emit("registerUser", currentUser.email);
    }
  }, [socket, currentUser]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (data) => {
      if (
        data.sender === selectedContact?.email &&
        data.receiver === currentUser?.email
      ) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...data, direction: "incoming" },
        ]);
      }
    });

    socket.on("userTyping", (data) => {
      if (data.sender === selectedContact?.email) {
        setTypingIndicator(`${data.senderName} is typing...`);
      }
    });

    socket.on("stopTyping", () => setTypingIndicator(""));

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("stopTyping");
    };
  }, [socket, selectedContact, currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axiosInstance.get("/chat/contacts");
        setContacts(res.data);
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
      }
    };
    fetchContacts();
  }, []);

  const fetchChatHistory = async (contact) => {
    try {
      const res = await axiosInstance.get("/chat/history", {
        params: { sender: currentUser?.email, receiver: contact.email },
      });
      const mapped = res.data.map((msg) => ({
        ...msg,
        direction: msg.sender === currentUser?.email ? "outgoing" : "incoming",
      }));
      setMessages(mapped);
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    }
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setUserInput(value);

    if (socket) {
      clearTimeout(typingTimeout);
      socket.emit("userTyping", {
        sender: currentUser?.email,
        receiver: selectedContact?.email,
        senderName: currentUser?.name,
      });

      typingTimeout = setTimeout(() => {
        socket.emit("stopTyping", {
          sender: currentUser?.email,
          receiver: selectedContact?.email,
        });
      }, 1000);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !selectedContact) return;

    const messageData = {
      sender: currentUser.email,
      receiver: selectedContact.email,
      message: userInput,
      type: "text",
    };

    setMessages((prev) => [...prev, { ...messageData, direction: "outgoing" }]);

    try {
      if (selectedContact.role === "bot") {
        const botRes = await axiosInstance.post(
          `${getBotUrl()}/bot-api/webhook`,
          {
            action: "processMessage",
            message: userInput,
            userId: currentUser.email,
          }
        );
        setMessages((prev) => [
          ...prev,
          {
            sender: selectedContact.name,
            receiver: currentUser.email,
            message: botRes.data.reply,
            direction: "incoming",
          },
        ]);
      } else {
        await axiosInstance.post("/chat/send", messageData);
        socket.emit("sendMessage", messageData);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }

    setUserInput("");
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    fetchChatHistory(contact);
  };

  const filteredContacts = useMemo(
    () => contacts.filter((c) => c.role !== "User"),
    [contacts]
  );

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h3>Contacts</h3>
        <ul>
          {filteredContacts.map((contact) => (
            <li
              key={contact._id}
              className={
                selectedContact?.email === contact.email ? "active" : ""
              }
              onClick={() => handleContactClick(contact)}
            >
              {contact.name} ({contact.role})
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-main">
        {selectedContact ? (
          <>
            <div className="chat-header">
              <h3>Chat with {selectedContact.name}</h3>
            </div>

            <div className="chat-history">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    msg.direction === "outgoing"
                      ? "user-message"
                      : "bot-message"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
              {typingIndicator && (
                <div className="typing-indicator">{typingIndicator}</div>
              )}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={userInput}
                onChange={handleTyping}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">
            <h3>Select a contact to start chatting</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bot;
