import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { io } from "socket.io-client";
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

    // Fetch current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found. Redirecting to login...");
                    return router.push("/login");
                }

                const response = await axios.get("http://localhost:5000/api/chat/current-user", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setCurrentUser(response.data);
            } catch (error) {
                console.error("Error fetching current user:", error);
                if (error.response?.status === 401) {
                    router.push("/login");
                }
            }
        };

        fetchCurrentUser();
    }, []);

    // Initialize WebSocket
    useEffect(() => {
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);

        // Listen for incoming messages
        newSocket.on("receiveMessage", (data) => {
            console.log("Message received:", data);
            setMessages((prevMessages) => {
                // Only update messages if the sender/receiver matches the selected contact
                if (
                    (data.sender === selectedContact?.email && data.receiver === currentUser?.email) ||
                    (data.receiver === selectedContact?.email && data.sender === currentUser?.email)
                ) {
                    return [...prevMessages, data];
                }
                return prevMessages; // No updates if unrelated message
            });
        });

        // Listen for typing updates
        newSocket.on("userTyping", (data) => {
            if (data.sender === selectedContact?.email) {
                setTypingIndicator(`${data.senderName} is typing...`);
            }
        });

        newSocket.on("stopTyping", () => {
            setTypingIndicator("");
        });

        return () => {
            newSocket.disconnect();
        };
    }, [selectedContact, currentUser]);

    // Fetch contact list
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/chat/contacts");
                setContacts(response.data);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        };
        fetchContacts();
    }, []);

    // Fetch chat history
    const fetchChatHistory = async (contact) => {
        try {
            const response = await axios.get("http://localhost:5000/api/chat/history", {
                params: { sender: currentUser?.email, receiver: contact.email },
            });
            setMessages(
                response.data.map((msg) => ({
                    ...msg,
                    direction: msg.sender === currentUser?.email ? "outgoing" : "incoming",
                }))
            );
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    // Handle typing indicator
    const handleTyping = (e) => {
        const value = e.target.value;
        setUserInput(value);

        if (socket) {
            clearTimeout(typingTimeout);
            socket.emit("userTyping", { sender: currentUser?.email, receiver: selectedContact?.email });

            typingTimeout = setTimeout(() => {
                socket.emit("stopTyping", { sender: currentUser?.email, receiver: selectedContact?.email });
            }, 1000);
        }
    };

    // Send a message
    const sendMessage = async () => {
        if (!userInput.trim() || !selectedContact) return;

        const newMessage = {
            sender: currentUser.email,
            receiver: selectedContact.email,
            message: userInput,
            type: "text",
        };

        setMessages((prevMessages) => [
            ...prevMessages,
            { ...newMessage, direction: "outgoing" },
        ]);

        try {
            if (selectedContact.role === "bot") {
                // Send the message to the bot API with the required `action` field
                const botResponse = await axios.post("http://127.0.0.1:5000/bot-api/webhook", {
                    action: "processMessage", // Specify the action
                    message: userInput,
                    userId: currentUser.email,
                });

                // Append the bot's response to the chat
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        sender: selectedContact.name,
                        receiver: currentUser.email,
                        message: botResponse.data.reply, // Assuming bot API responds with `reply`
                        direction: "incoming",
                    },
                ]);
            } else {
                // Send the message to the chat API for regular contacts
                await axios.post("http://localhost:5000/api/chat/send", newMessage);

                // Emit the message via WebSocket for real-time updates
                socket.emit("sendMessage", newMessage);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }

        setUserInput(""); // Clear input box
    };

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
        fetchChatHistory(contact);
    };

    // Filter contacts
    const filteredContacts = useMemo(() => {
        return contacts.filter((contact) => contact.role !== "User");
    }, [contacts]);

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h3>Contacts</h3>
                <ul>
                    {filteredContacts.map((contact) => (
                        <li
                            key={contact._id}
                            className={selectedContact?.email === contact.email ? "active" : ""}
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
                            <div className="typing-indicator">{typingIndicator}</div>
                        </div>
                        <div className="chat-history">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`chat-message ${msg.direction === "outgoing" ? "user-message" : "bot-message"}`}
                                >
                                    {msg.message}
                                </div>
                            ))}
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
