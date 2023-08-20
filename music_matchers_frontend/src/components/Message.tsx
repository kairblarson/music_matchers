import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import UserType from "../types/UserType";

type MessageProps = {
    index: number;
    content: string;
    overAnHour: boolean;
    firstMessage: boolean;
    isSelf: boolean;
    formattedDate: string | null;
    sentAt: string | null;
    overFiveMin: boolean;
    consecutive: boolean;
};

export default function Message(props: MessageProps) {
    return (
        <motion.div
            initial={{ y: -300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            className={`message--wrapper-${props.isSelf ? "self" : "user"} ${
                props.overFiveMin || !props.consecutive ? "extendGap" : ""
            }`}
        >
            {props.firstMessage && (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <p style={{ fontFamily: "Work Sans", marginBlock: "10px" }}>
                        {props.formattedDate}
                    </p>
                </div>
            )}
            {props.overAnHour && (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <p style={{ fontFamily: "Work Sans", marginBlock: "10px" }}>
                        {props.formattedDate}
                    </p>
                </div>
            )}
            <div className={`message--${props.isSelf ? "self" : "user"}`}>
                <p className="message--content">{props.content}</p>
            </div>
            {props.index === 0 && (
                <div
                    style={{
                        fontFamily: "Work Sans",
                        marginBlock: "10px",
                        marginInline: "15px",
                    }}
                >
                    Sent at {props.sentAt}
                </div>
            )}
        </motion.div>
    );
}
