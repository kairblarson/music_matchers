import React from "react";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ChatPreview from "./ChatPreview";
import { ColorRing } from "react-loader-spinner";
import { motion, AnimatePresence } from "framer-motion";
import ChatroomType from "../types/ChatroomType";
import UserType from "../types/UserType";

export default function ChatUsers() {
    const [chatrooms, setChatrooms] = useState<ChatroomType[]>([]);
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [numOfUnreadChats, setNumOfUnreadChats] = useState(0);
    const [numOfUnreadReqs, setNumOfUnreadReqs] = useState(0);
    const [tab, setTab] = useState("messages");

    useEffect(() => {
        fetch("http://localhost:8081/api/v1/users/user-details", {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            mode: "cors",
        })
            .then((res) => {
                if (res.status == 401)
                    window.location.href = "http://localhost:3000/login";
                return res.json();
            })
            .then((res) => {
                setCurrentUser(res);
                setIsLoaded(true);
            });
    }, []);

    useEffect(() => {
        setChatrooms([]);
        if (tab == "messages") {
            fetch(
                "http://localhost:8081/api/v1/users/chatrooms?accepted=true",
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    mode: "cors",
                }
            )
                .then((res) => res.json())
                .then((res) => {
                    setChatrooms(res);
                })
                .catch(
                    () =>
                        (window.location.href =
                            "http://localhost:3000/login?error=true")
                );
        } else {
            //have this load the chats you havent accpeted yet
            fetch(
                "http://localhost:8081/api/v1/users/chatrooms?accepted=false",
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    mode: "cors",
                }
            )
                .then((res) => res.json())
                .then((res) => {
                    if (res[0] == null) {
                        setChatrooms([]);
                    } else {
                        setChatrooms(res);
                    }
                })
                .catch(
                    () =>
                        (window.location.href =
                            "http://localhost:3000/login?error=true")
                );
        }
    }, [tab]);

    function resetChats(chats: ChatroomType[]) {
        setChatrooms(chats);
    }

    function handleSearch() {}

    return (
        <motion.div
            initial="outScreen"
            animate="inScreen"
            exit="outScreen"
            className="chatusers"
        >
            <Header />
            {isLoaded ? (
                <div className="chatusers--content">
                    <div className="chatusers--searchbar">
                        <input
                            className="input searchbar"
                            placeholder="Search Messages..."
                            onChange={handleSearch}
                            style={{
                                width: "100%",
                            }}
                        />
                    </div>
                    <div className="chatusers--tabs">
                        <div
                            className={`tab${
                                tab == "messages" ? "-selected" : ""
                            }`}
                            onClick={() => setTab("messages")}
                        >
                            Messages
                        </div>
                        <div
                            className={`tab${
                                tab == "requests" ? "-selected" : ""
                            }`}
                            onClick={() => setTab("requests")}
                        >
                            Requests
                        </div>
                    </div>
                    <div className="chatusers--main">
                        {chatrooms.length > 0 &&
                            chatrooms.map((details: ChatroomType, key) => {
                                let viewed = false;
                                let chatWith = null;
                                let bandMembers = false;
                                details.users.forEach((user: UserType) => {
                                    if (user._id != currentUser?._id) {
                                        chatWith = user;
                                        if (
                                            user.band === currentUser?.band?._id
                                        ) {
                                            bandMembers = true;
                                        }
                                    }
                                });
                                details.messages[
                                    details.messages.length - 1
                                ].viewedBy.forEach((user: UserType | null) => {
                                    if (user?._id == currentUser?._id) {
                                        viewed = true;
                                    }
                                });

                                return (
                                    <ChatPreview
                                        key={key}
                                        index={key}
                                        details={details}
                                        chatWith={chatWith}
                                        accepted={
                                            tab === "messages" ? true : false
                                        }
                                        resetChats={resetChats}
                                        viewed={viewed}
                                        bandMembers={bandMembers}
                                    />
                                );
                            })}
                    </div>
                </div>
            ) : (
                <div className="chatusers--content loading">
                    <ColorRing
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                        colors={[
                            "rgba(59, 136, 245, .9)",
                            "rgba(59, 136, 245, .7)",
                            "rgba(59, 136, 245, .5)",
                            "rgba(59, 136, 245, .3)",
                            "rgba(59, 136, 245, .1)",
                        ]}
                    />
                </div>
            )}
            <Footer />
        </motion.div>
    );
}
