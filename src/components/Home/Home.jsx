import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../../../suppliers/zustand";
import { useRouter } from "next/router";
import socket from "../../../utils/socket";

const Home = () => {
  const {
    user,
    checkUserAlreadyAuthenticated,
    users,
    logout,
    chats,
    createChatIndividual,
    getChats,
    availableUsers,
    createChatGroup,
    updateUsers,
    getUsers,
  } = useStore();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const chatContainerRef = useRef(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupChatName, setGroupChatName] = useState("");

  useEffect(() => {
    socket.emit("join me", user?._id);
  }, [user]);

  useEffect(() => {
    socket.emit("joinRoom", currentChat?._id);
    if (currentChat) {
      setMessages((prevMessages) => [
        ...prevMessages,
        ...currentChat?.messages,
      ]);
    }
  }, [currentChat?._id]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: message.message,
          timestamp: message.timestamp,
          user: {
            _id: message.user_id,
            username: message.username,
          },
        },
      ]);
    });

    socket.on("new message", ({ user_id }) => {
      getChats();
    })

  }, []);

  useEffect(() => {
    if (user) {
      socket.on("new chat", ({user_id, type}) => {
        if (type === "individual") {
          getUsers();
          getChats();
        } else {
          alert("New group chat created");
          getChats();
        }
      });
    }
  }, [user]);

  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: currentMessage,
          timestamp: Date.now(),
          user: {
            _id: user._id,
            username: user.username,
          },
        },
      ]);
      setCurrentMessage("");
      socket.emit("message", {
        message: currentMessage,
        chat_id: currentChat._id,
        user_id: user._id,
        username: user.username,
      });
      socket.emit("new message", {
        my_user_id: user._id,
        user_id: currentChat.members.filter(
          (member) => member._id !== user._id
        )[0]._id,
      });
    }
  };

  // useEffect(() => {})

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const logOut = () => {
    logout();
    checkUserAlreadyAuthenticated();
  };

  const handleCreateGroup = () => {
    setIsCreatingGroup(true);
  };

  const handleAddUserToGroup = (userId) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleCreateChatGroup = () => {
    // Logic to create group chat with selected users
    createChatGroup([selectedUsers, user._id].flat(), groupChatName);
    setIsCreatingGroup(false);
    setSelectedUsers([]);
    setGroupChatName("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white p-4 space-y-2">
      {/* Top bar */}
      <div className="border-b-2 border-gray-300 rounded-3xl p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Chat App</h1>
        <div className="flex flex-row space-x-4 justify-center items-center">
          <h1 className="text-2xl font-bold text-gray-800">{user?.username}</h1>
          <button
            onClick={logOut}
            className="bg-red-500 px-6 py-3 rounded-3xl text-white ml-3 hover:bg-red-600 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row space-x-2">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 border-2 border-gray-300 rounded-3xl text-black my-4 md:my-0">
          <div className="p-4">
            <div className="w-full flex flex-row justify-between items-center">
              <input
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                type="text"
                placeholder="Create a Group"
                className="w-full px-4 py-2 text-lg focus:outline-none focus:border-blue-500 border-2 border-gray-300 rounded-xl appearance-none"
              />
              <button
                onClick={handleCreateGroup}
                className="bg-blue-500 px-5 py-3 rounded-full text-white ml-3 hover:bg-blue-600 transition-colors"
              >
                +
              </button>
            </div>
            {isCreatingGroup && (
              <div>
                <h1 className="text-2xl font-bold mb-4">Available Users</h1>
                <div className="flex flex-col space-y-2 mb-2">
                  {availableUsers.length > 0 &&
                    availableUsers?.map((_user, index) => (
                      <div
                        key={index}
                        onClick={() => handleAddUserToGroup(_user._id)}
                        className={`flex flex-row items-center space-x-2 cursor-pointer ${
                          selectedUsers.includes(_user._id) ? "bg-gray-200" : ""
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-green-300"></div>
                        <h1 className="text-lg font-semibold">
                          {_user.username}
                        </h1>
                      </div>
                    ))}
                </div>
                <button
                  onClick={handleCreateChatGroup}
                  className="bg-blue-500 px-5 py-3 rounded-full text-white ml-3 hover:bg-blue-600 transition-colors"
                >
                  OK
                </button>
              </div>
            )}
            {users && users.length > 0 && (
              <h1 className="text-2xl font-bold mb-4">Users</h1>
            )}
            <div className="flex flex-col space-y-2 mb-2">
              {users.length > 0 &&
                users?.map((_user, index) => (
                  <button
                    onClick={() => {
                      createChatIndividual([_user._id, user._id]);
                    }}
                    key={index}
                    className="flex flex-row items-center space-x-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-300"></div>
                    <h1 className="text-lg font-semibold">{_user.username}</h1>
                  </button>
                ))}
            </div>
            <h1 className="text-2xl font-bold mb-4">Chats</h1>
            <div className="flex flex-col space-y-2">
              {chats.length > 0 &&
                chats.map((chat, index) => (
                  <button
                    disabled={currentChat?._id === chat._id}
                    onClick={() => {
                      setCurrentChat(chat);
                      getChats();
                      setMessages([]);
                    }}
                    key={index}
                    className="flex flex-row items-center space-x-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-300 flex justify-center items-center font-bold">
                      {chat?.name ? "Grp" : undefined}
                    </div>
                    <h1 className="text-lg font-semibold">
                      {chat.name ?? chat.members[0].username}
                    </h1>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Chat container */}
        <div className="w-full md:w-3/4 flex flex-col border-2 border-gray-300 rounded-3xl p-3">
          {currentChat ? (
            <>
              {/* Chat header */}
              <div className="flex items-center p-3 border-b-2 border-gray-300 rounded-3xl">
                <div className="w-12 h-12 rounded-full bg-green-300 mr-4"></div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {currentChat?.name ?? currentChat?.members[0].username}
                  </h2>
                  {currentChat?.name ? (
                    <h3 className="text-lg font-semibold text-gray-800">
                      {currentChat?.members
                        .map((member) => member.username)
                        .join(", ")}
                    </h3>
                  ) : undefined}
                </div>
              </div>

              {/* Chat messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-4 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 350px)" }}
              >
                {messages?.map((message, index) => (
                  <div key={index} className="my-2 flex flex-col items-start">
                    {message.user._id !== user._id && (
                      <h1
                        className="text-sm font-semibold"
                        style={{
                          alignSelf:
                            message.user._id === user._id
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        {message.user.username}
                      </h1>
                    )}
                    <div
                      className="bg-blue-500 text-white max-w-xs py-2 px-4 rounded-lg mb-2"
                      style={{
                        alignSelf:
                          message.user._id === user._id
                            ? "flex-end"
                            : "flex-start",
                        backgroundColor:
                          message.user._id === user._id ? "#3B82F6" : "#000",
                      }}
                    >
                      {message?.message}
                    </div>
                    <p
                      className="text-xs text-gray-500"
                      style={{
                        alignSelf:
                          message.user._id === user._id
                            ? "flex-end"
                            : "flex-start",
                      }}
                    >
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Message input */}
              <div className="bg-white flex items-center border-t-2 border-gray-300 rounded-3xl p-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full p-4 text-lg focus:outline-none focus:border-blue-500 border-2 border-gray-300 rounded-3xl appearance-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 px-6 py-3 rounded-3xl text-white ml-3 hover:bg-blue-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div
              className="
            flex-1 flex flex-col justify-center items-center"
            >
              <h1 className="text-2xl font-bold text-gray-800">
                Select a chat to start messaging
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
