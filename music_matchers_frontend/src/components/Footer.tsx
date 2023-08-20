import React from "react";
import { useEffect, useState } from "react";
import { BsSearch, BsPersonFill, BsRocketTakeoff } from "react-icons/bs";
import { FaHome, FaEnvelope } from "react-icons/fa";
import useFetch from "../hooks/useFetch";
import { CgMusicSpeaker } from "react-icons/cg";

export default function Footer() {
    const [unreadMessages, setUnreadMessages] = useState(0);
    const { data: invites } = useFetch(
        "http://localhost:8081/api/v1/users/band-requests",
        "GET"
    );

    useEffect(() => {
        fetch(`http://localhost:8081/api/v1/users/messages/unread`, {
            method: "get",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            mode: "cors",
        })
            .then((res) => {
                if (res.status == 401) setUnreadMessages(0);
                return res.json();
            })
            .then((res) => {
                setUnreadMessages(res.unreadMessages);
            })
            .catch((err) => {
                console.log("ERROR:", err.error);
            });
    }, [unreadMessages]);

    return (
        <div className="footer">
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    padding: "10px",
                    height: "40px",
                    width: "40px",
                }}
            >
                <FaHome
                    onClick={() =>
                        (window.location.href = "http://localhost:3000/home")
                    }
                    className="icon"
                />
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    padding: "10px",
                    height: "40px",
                    width: "40px",
                }}
            >
                <BsPersonFill
                    onClick={() =>
                        (window.location.href = "http://localhost:3000/profile")
                    }
                    className="icon"
                />
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    padding: "10px",
                    height: "40px",
                    width: "40px",
                }}
            >
                <CgMusicSpeaker
                    onClick={() =>
                        (window.location.href =
                            "http://localhost:3000/bandpage")
                    }
                    className="icon"
                />
                {invites && (
                    <>
                        {invites.length > 0 && (
                            <p
                                style={{
                                    position: "absolute",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "22px",
                                    height: "22px",
                                    top: 0,
                                    right: 0,
                                    background: "red",
                                    borderRadius: "10px",
                                    backgroundColor: "black",
                                    fontSize: "14px",
                                }}
                            >
                                {invites.length >= 20 ? "20+" : invites.length}
                            </p>
                        )}
                    </>
                )}
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    padding: "10px",
                    height: "40px",
                    width: "40px",
                }}
            >
                <FaEnvelope
                    onClick={() =>
                        (window.location.href = "http://localhost:3000/chat")
                    }
                    className="icon"
                />
                {unreadMessages > 0 && (
                    <p
                        style={{
                            position: "absolute",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "22px",
                            height: "22px",
                            top: 0,
                            right: 0,
                            background: "red",
                            borderRadius: "10px",
                            backgroundColor: "black",
                            fontSize: "14px",
                        }}
                    >
                        {unreadMessages >= 20 ? "20+" : unreadMessages}
                    </p>
                )}
            </div>
        </div>
    );
}
