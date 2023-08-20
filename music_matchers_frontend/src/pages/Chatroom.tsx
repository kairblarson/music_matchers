import { useEffect, useState, useRef } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { FaChevronCircleLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Message from "../components/Message";
import InfiniteScroll from "react-infinite-scroll-component";
import { TbLocationFilled } from "react-icons/tb";
import MessageType from "../types/MessageType";
import UserType from "../types/UserType";
import InviteModal from "../components/InviteModal";
import Popup from "../components/Popup";
import { BsPatchCheckFill } from "react-icons/bs";
import { CgMusicSpeaker } from "react-icons/cg";

let socket: WebSocket | null = null;
export default function Chatroom() {
    const [popupState, setPopupState] = useState(false);
    const [popupMessage, setPopupMessage] = useState<string | null>("");
    const [popupVariant, setPopupVariant] = useState("success");
    const [modalState, setModalState] = useState(false);
    const [backButtonHover, setBackButtonHover] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [chatWith, setChatWith] = useState<UserType | null>(null);
    const [chatWithHover, setChatWithHover] = useState(false);
    const [page, setPage] = useState(0);
    const { room } = useParams();
    const messagesElement = document.getElementById("messages");
    const [chatHeight, setChatHeight] = useState(0);
    const [error, setError] = useState({
        message: "",
    });
    const [alreadySentInvite, setAlreadySendInvite] = useState<Boolean | null>(
        null
    );
    const [bandMembers, setBandMembers] = useState(false);

    useEffect(() => {
        window.addEventListener("resize", handleResize);

        if (messagesElement) {
            messagesElement.scrollTop = messagesElement.scrollHeight;
            setChatHeight(messagesElement.scrollHeight);
            setIsLoaded(true);
        }

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [messagesElement, messages, messagesElement?.scrollHeight]);

    function handleResize() {
        if (messagesElement) {
            setChatHeight(messagesElement.scrollHeight);
        }
    }

    useEffect(() => {
        socket = new WebSocket(`ws://localhost:8081/${room}`);
        socket.addEventListener("open", function (event) {
            // console.log("Connected to WS server");
        });
        socket.addEventListener("message", function (event) {
            // console.log(JSON.parse(event.data));
            setMessages((prev: MessageType[]) => {
                return [
                    {
                        content: event.data,
                        createdAt: new Date().getTime(),
                        viewedBy: [currentUser, chatWith],
                        sender: chatWith ? chatWith._id : null,
                        reciever: currentUser ? currentUser._id : null,
                    },
                    ...prev,
                ];
            });
        });

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

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
            .then((res) => setCurrentUser(res));
    }, []);

    useEffect(() => {
        if (chatWith) {
            fetch("http://localhost:8081/api/v1/users/band-request-status", {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                mode: "cors",
                body: JSON.stringify({
                    chatWith: chatWith._id,
                }),
                method: "POST",
            })
                .then((res) => {
                    if (res.status == 401)
                        window.location.href = "http://localhost:3000/login";
                    return res.json();
                })
                .then((res) => setAlreadySendInvite(res));
            if (chatWith.band === currentUser?.band?._id) {
                setBandMembers(true);
            }
        }
    }, [chatWith]);

    useEffect(() => {
        setIsLoaded(false);
        fetch(
            `http://localhost:8081/api/v1/users/chatroom/${room}?page=${page}`,
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
                if (res?.error === "unauthorized") {
                    setError((prev) => ({ ...prev, message: "unauthorized" }));
                } else {
                    setUsers(res.users);
                    if (messages.length > 0) {
                        setMessages((prev) => [...prev, ...res.messages]);
                    } else {
                        setMessages(res.messages);
                    }
                    if (res.messages.length < 10) {
                        setHasMore(false);
                    }
                }
                setIsLoaded(true);
            });
    }, [page]);

    function fetchMoreData() {
        console.log("Fetching more...");
        setPage((prev) => prev + 1);
    }

    useEffect(() => {
        users?.forEach((user: UserType) => {
            if (JSON.stringify(user._id) !== JSON.stringify(currentUser?._id)) {
                setChatWith(user);
            }
        });
    }, [users, currentUser]);

    const sendMessage = () => {
        if (message.trim() == "") return;

        fetch(`http://localhost:8081/api/v1/users/send-message`, {
            method: "post",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify({
                reciever: chatWith,
                content: message,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setMessages((prev: MessageType[]) => {
                    return [
                        {
                            content: message,
                            createdAt: new Date().getTime(),
                            viewedBy: [currentUser],
                            sender: currentUser ? currentUser._id : null,
                            reciever: chatWith ? chatWith._id : null,
                        },
                        ...prev,
                    ];
                });
            })
            .catch((error) => {
                window.location.href = "http://localhost:3000/login";
                console.log("ERROR:", error);
            });

        socket?.send(message);
        setMessage("");
    };

    const formatDate = (createdAt: number) => {
        let time = new Date(createdAt).toLocaleDateString("en-us", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        let todaysDate = new Date().toLocaleDateString("en-us", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        const date = new Date(createdAt);
        let hours = date.getHours();
        let minutes: string | number = date.getMinutes();
        let ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        const strTime = hours + ":" + minutes + " " + ampm;

        //do another check to determine if it was yesterday
        //you might have to take the year into consideration
        //if its different then add it in the string
        if (time === todaysDate) {
            const replacedText = time.slice(0, time.indexOf(","));
            time = "Today at ".concat(strTime);
        } else {
            time = time.replace(
                time.slice(0, time.indexOf(",")),
                time.slice(0, 3)
            );

            time = time.slice(0, time.length - 6).concat(" at ", strTime);
        }

        return [time, strTime];
    };

    const toggleModal = () => {
        setModalState((prev) => !prev);
    };

    const togglePopup = (message: string | null, variant: string | null) => {
        if (message) {
            setPopupVariant(variant ? variant : "");
            setPopupMessage(message);
            setPopupState((prev) => !prev);
            setAlreadySendInvite((prev) => !prev);
        } else {
            setPopupState(false);
        }
    };

    const backButtonStyle = {
        color: "black",
        opacity: backButtonHover ? "70%" : "100%",
        transition: "all linear .1s",
        cursor: backButtonHover ? "pointer" : "default",
    };

    const chatWithStyle = {
        textDecoration: chatWithHover ? "underline" : "none",
        transition: "all linear .1s",
        cursor: chatWithHover ? "pointer" : "default",
        fontSize: "clamp(25px, 4vw, 30px)",
    };

    return (
        <div className="chatroom">
            <Header />
            {error.message == "" ? (
                <div className="chatroom--content">
                    {modalState && (
                        <div className="modal-overlay" onClick={toggleModal}>
                            <InviteModal
                                key="modal"
                                state={true}
                                to={chatWith}
                                toggleModal={toggleModal}
                                togglePopup={togglePopup}
                                band={
                                    currentUser?.band ? currentUser.band : null
                                }
                            />
                        </div>
                    )}
                    {popupState && (
                        <Popup text={popupMessage} variant={popupVariant} />
                    )}
                    <header className="chatroom--header">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "20px",
                            }}
                        >
                            <FaChevronCircleLeft
                                onClick={() =>
                                    (window.location.href =
                                        "http://localhost:3000/chat")
                                }
                                style={backButtonStyle}
                                onMouseEnter={() =>
                                    setBackButtonHover((prev) => !prev)
                                }
                                onMouseLeave={() =>
                                    setBackButtonHover((prev) => !prev)
                                }
                            />
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "5px",
                                }}
                            >
                                {users.map((user: UserType, index) => {
                                    if (user._id != currentUser?._id) {
                                        return (
                                            <img
                                                key={index}
                                                src={user.images[0]}
                                                className="chatroom--header-img"
                                            ></img>
                                        );
                                    }
                                    return null;
                                })}
                                {users.map((user: UserType, index) => {
                                    if (user._id != currentUser?._id) {
                                        return (
                                            <p
                                                key={index}
                                                onClick={() =>
                                                    (window.location.href = `http://localhost:3000/user?id=${user._id}`)
                                                }
                                                onMouseOver={() =>
                                                    setChatWithHover(
                                                        (prev) => !prev
                                                    )
                                                }
                                                onMouseLeave={() =>
                                                    setChatWithHover(
                                                        (prev) => !prev
                                                    )
                                                }
                                                style={chatWithStyle}
                                            >
                                                {user.name}
                                            </p>
                                        );
                                    }
                                    return null;
                                })}
                                {chatWith?.verified && (
                                    <BsPatchCheckFill className="chatroom--verify" />
                                )}
                                {bandMembers && (
                                    <CgMusicSpeaker className="chatroom--members" />
                                )}
                            </div>
                        </div>
                        {bandMembers ? (
                            <h2 className="chatroom--member"></h2>
                        ) : (
                            <>
                                {alreadySentInvite ? (
                                    <button
                                        className="button"
                                        style={{ width: "200px" }}
                                        onClick={toggleModal}
                                    >
                                        {currentUser?.band
                                            ? "Invite to Band!"
                                            : "Start a Band!"}
                                    </button>
                                ) : (
                                    <button
                                        className="button"
                                        style={{ width: "200px" }}
                                        onClick={toggleModal}
                                        disabled={true}
                                    >
                                        Invite already sent.
                                    </button>
                                )}
                            </>
                        )}
                    </header>
                    <div
                        style={{
                            height: "100%",
                            width: "100%",
                            maxWidth: "800px",
                        }}
                        id="messages"
                    >
                        <InfiniteScroll
                            dataLength={messages.length}
                            next={fetchMoreData}
                            hasMore={hasMore}
                            className="chatroom--messages"
                            height={chatHeight - 10}
                            inverse={true}
                            loader={
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    Loading...
                                </div>
                            }
                        >
                            {currentUser &&
                                chatWith &&
                                messages.map((value, key) => {
                                    let consecutive = false;
                                    let overAnHour = false;
                                    let overFiveMin = false;
                                    let isSelf = false;
                                    let sentAt = null;
                                    let formattedDate = null;
                                    let firstMessage = false;
                                    let prevTime = messages[key + 1]?.createdAt;
                                    let prevSender = messages[key + 1]?.sender;

                                    if (prevSender === value.sender) {
                                        consecutive = true;
                                    }

                                    //all these if statements can be put into methods and the
                                    //values can be init with the values instead of making the
                                    //JSX messy

                                    if (prevTime + 3600000 < value.createdAt) {
                                        const [time, strTime] = formatDate(
                                            value.createdAt
                                        );

                                        formattedDate = time;
                                        overAnHour = true;
                                    }

                                    if (prevTime + 300000 < value.createdAt) {
                                        overFiveMin = true;
                                    }

                                    if (key === 0) {
                                        const [time, strTime] = formatDate(
                                            value.createdAt
                                        );
                                        sentAt = strTime;
                                    }

                                    if (
                                        key === messages.length - 1 &&
                                        !hasMore
                                    ) {
                                        const [time, strTime] = formatDate(
                                            value.createdAt
                                        );
                                        formattedDate = time;
                                        firstMessage = true;
                                    }

                                    if (
                                        JSON.stringify(value.sender) ===
                                        JSON.stringify(chatWith._id)
                                    ) {
                                        isSelf = false;
                                    } else if (
                                        JSON.stringify(value.sender) ===
                                        JSON.stringify(currentUser._id)
                                    ) {
                                        isSelf = true;
                                    }

                                    return (
                                        <Message
                                            key={key}
                                            index={key}
                                            content={value.content}
                                            overAnHour={overAnHour}
                                            firstMessage={firstMessage}
                                            isSelf={isSelf}
                                            formattedDate={formattedDate}
                                            sentAt={sentAt}
                                            overFiveMin={overFiveMin}
                                            consecutive={consecutive}
                                        />
                                    );
                                })}
                        </InfiniteScroll>
                    </div>
                    <div
                        className="chatroom--controls"
                        style={{
                            display: "flex",
                            gap: "0px",
                            marginBottom: "10px",
                        }}
                    >
                        <input
                            className="input"
                            placeholder="Send a message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{
                                width: "100%",
                                borderTopRightRadius: "0px",
                                borderBottomRightRadius: "0px",
                                height: "20px",
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                        ></input>
                        <TbLocationFilled
                            onClick={sendMessage}
                            style={{
                                fontSize: "20px",
                                padding: "10px",
                                minHeight: "20px",
                                color: "gainsboro",
                                background: "rgb(241, 241, 241)",
                                borderTopRightRadius: "15px",
                                borderBottomRightRadius: "15px",
                            }}
                            className="send-message"
                        />
                    </div>
                </div>
            ) : (
                <div className="chatroom--content error">
                    <h1>Unauthorized.</h1>
                </div>
            )}
            <Footer />
        </div>
    );
}
