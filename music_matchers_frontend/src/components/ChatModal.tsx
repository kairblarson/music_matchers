import React from "react";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import CustomButton from "./CustomButton";
import { motion } from "framer-motion";
import UserType from "../types/UserType";

//now for some reason no alerts pop up when you send a message to someone
//i want to incorporate notifs for messages and band invites*

type ChatModalProps = {
    state: boolean;
    to: UserType | null;
    toggleModal: () => void;
    handleNextUser: () => void;
    togglePopup: (message: string | null, variant: string | null) => void;
    key: string;
};

export default function ChatModal(props: ChatModalProps) {
    const [message, setMessage] = useState("Im interested! Wanna chat?");

    const handleMessage = () => {
        fetch(`http://localhost:8081/api/v1/users/send-message`, {
            method: "post",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify({
                reciever: props?.to?._id,
                content: message,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status == 201) {
                    console.log(data);
                    props.togglePopup(
                        `Message sent to ${props?.to?.name} successfully.`,
                        "success"
                    );
                    setTimeout(() => {
                        props.togglePopup(null, null);
                    }, 3000);
                } else {
                    // props.togglePopup(
                    //     `Unable to send message to ${props.to.name}.`
                    // );
                    // setTimeout(() => {
                    //     props.togglePopup(null);
                    // }, 3000);
                }
                console.log(data);
            })
            .catch((error) => {
                props.togglePopup(
                    `Unable to send message to ${props?.to?.name}.`,
                    null
                );
                setTimeout(() => {
                    props.togglePopup(null, null);
                }, 3000);
                console.log("ERROR:", error);
            });
        //add clean transitions to messages and cards and modals

        props.handleNextUser();
        props.toggleModal();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setMessage(() => value);
    };

    return (
        <motion.div
            className="chatmodal"
            onClick={(e) => e.stopPropagation()}
            animate={{ y: -100, scale: 1 }}
            initial={{ scale: 0 }}
            exit={{ scale: 0, opacity: 0 }}
        >
            <h1>Send a message to {props?.to?.name}!</h1>
            <input
                className="input"
                onClick={(e) => e.stopPropagation()}
                value={message}
                onChange={handleChange}
                style={{
                    width: "100%",
                }}
            />
            <div className="chatmodal--buttons">
                <CustomButton
                    text="Cancel"
                    variant="danger"
                    onClick={() => props.toggleModal()}
                />
                <CustomButton text="Send" onClick={handleMessage} />
            </div>
        </motion.div>
    );
}
