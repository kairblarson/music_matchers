import React from "react";
import { useEffect, useState } from "react";
import { BsPersonFill, BsPatchCheckFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { FaTrashAlt } from "react-icons/fa";
import ChatroomType from "../types/ChatroomType";
import UserType from "../types/UserType";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { CgMusicSpeaker } from "react-icons/cg";

type ChatPreviewProps = {
    key: number;
    index: number;
    details: ChatroomType;
    chatWith: UserType | null;
    accepted: boolean;
    resetChats: (chats: ChatroomType[]) => void;
    viewed: boolean;
    bandMembers: boolean;
};

export default function ChatPreview(props: ChatPreviewProps) {
    const [chatDetails, setChatDetails] = useState(props.details);
    const [declineHover, setDeclineHover] = useState(false);
    const [confirmHover, setConfirmHover] = useState(false);
    const [previewHover, setPreviewHover] = useState(false);
    const [lazyImage, setLazyImage] = useState<string>("");

    useEffect(() => {
        if (props.chatWith) {
            const image = props.chatWith.images[0];
            const extension = image.slice(image.length - 4, image.length);
            const slicedImage = image.slice(0, image.indexOf(extension));
            setLazyImage(slicedImage.concat("-lazy".concat(extension)));
        }
    }, [props?.chatWith?.images[0]]);

    const declineButtonStyle = {
        color: declineHover ? "rgba(224, 50, 50, .8)" : "gray",
        fontSize: "30px",
        filter: declineHover
            ? "drop-shadow(0px 0px 10px rgba(224, 50, 50, .5))"
            : "none",
        cursor: declineHover ? "pointer" : "default",
        transition: "all linear .1s",
    };

    const handleDecline = () => {
        fetch(
            `http://localhost:8081/api/v1/users/chatroom/${chatDetails._id}/declined?accepted=${props.accepted}`,
            {
                method: "get",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                mode: "cors",
            }
        )
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                console.log(res);
                props.resetChats(res);
                // window.location.href = res.url;
            })
            .catch((err) => {
                console.log("ERROR:", err.error);
            });
    };

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            style={{ display: "flex", width: "100%", gap: "10px" }}
            onMouseEnter={() => setPreviewHover((prev) => !prev)}
            onMouseLeave={() => setPreviewHover((prev) => !prev)}
        >
            <div
                className="chatpreview"
                onClick={() =>
                    (window.location.href = `http://localhost:3000/chat/${chatDetails._id}`)
                }
            >
                {!props.viewed && <div className="unread--icon">New</div>}
                <section className="chatpreview--left">
                    {props.chatWith && (
                        <LazyLoadImage
                            src={props.chatWith.images[0]}
                            alt="image not available:/"
                            className="chatpreview--img"
                            placeholder={
                                <img
                                    src={lazyImage}
                                    className="imagepreview--img blur"
                                ></img>
                            }
                        />
                    )}
                </section>
                <section className="chatpreview--right">
                    <div className="chatpreview--title">
                        <h1>
                            {props.chatWith
                                ? props.chatWith.name
                                : "unknown user"}
                        </h1>
                        {props.chatWith && (
                            <>
                                {props.chatWith.verified ? (
                                    <BsPatchCheckFill className="chatpreview--verify" />
                                ) : null}
                            </>
                        )}
                        {
                            props.bandMembers && (
                                <CgMusicSpeaker className="chatpreview--members" />
                            ) /*display better way*/
                        }
                    </div>
                    <p>
                        {
                            chatDetails.messages[
                                chatDetails.messages.length - 1
                            ].content
                        }
                    </p>
                </section>
            </div>
            <div
                style={{
                    display: previewHover
                        ? "flex"
                        : window.innerWidth > 500
                        ? "none"
                        : "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    justifyContent: "space-evenly",
                }}
            >
                <FaTrashAlt
                    style={declineButtonStyle}
                    onMouseEnter={() => setDeclineHover((prev) => !prev)}
                    onMouseLeave={() => setDeclineHover((prev) => !prev)}
                    onClick={handleDecline}
                />
            </div>
        </motion.div>
    );
}
