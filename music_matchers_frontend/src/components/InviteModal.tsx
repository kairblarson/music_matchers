import React from "react";
import { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import { motion } from "framer-motion";
import UserType from "../types/UserType";
import BandType from "../types/BandType";

type ChatModalProps = {
    state: boolean;
    to: UserType | null;
    toggleModal: () => void;
    togglePopup: (message: string | null, variant: string | null) => void;
    key: string;
    band: BandType | null;
};

export default function InviteModal(props: ChatModalProps) {
    const [bandName, setBandName] = useState<String | null>(
        props.band ? props.band.name : null
    );

    const handleInvite = () => {
        fetch(`http://localhost:8081/api/v1/users/band-request`, {
            method: "post",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify({
                receiver: props?.to?._id,
                band: bandName,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status == 200) {
                    console.log(data);
                    props.togglePopup(
                        `Invite sent to ${props?.to?.name} successfully.`,
                        "success"
                    );
                    setTimeout(() => {
                        props.togglePopup(null, null);
                    }, 3000);
                } else {
                    props.togglePopup(
                        `Unable to send message to ${props?.to?.name}.`,
                        "danger"
                    );
                    setTimeout(() => {
                        props.togglePopup(null, null);
                    }, 3000);
                }
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

        props.toggleModal();
    };

    const handleContinue = () => {
        const { value } = document.getElementById(
            "band-input"
        ) as HTMLInputElement;
        setBandName((prev) => value);
    };

    //check if an invite has already been sent to the user to disallow
    //you from sending another invite
    //AND
    //check if the user is already in the same band as you
    return (
        <motion.div
            className="chatmodal"
            onClick={(e) => e.stopPropagation()}
            animate={{ y: -100, scale: 1 }}
            initial={{ scale: 0 }}
            exit={{ scale: 0, opacity: 0 }}
        >
            {bandName ? (
                <>
                    <h2>
                        Are you sure you want to invite {props?.to?.name} to{" "}
                        {bandName}?
                    </h2>
                    <div className="chatmodal--buttons">
                        <CustomButton
                            text="Back"
                            variant="danger"
                            onClick={() => {
                                setBandName((prev) =>
                                    props.band ? props.band.name : ""
                                );
                                props.toggleModal();
                            }}
                        />
                        <CustomButton text="Send" onClick={handleInvite} />
                    </div>
                </>
            ) : (
                <>
                    <h1>Choose a name for your band!</h1>
                    <input
                        id="band-input"
                        className="input"
                        placeholder="Enter band name here"
                        style={{ width: "80%" }}
                    />
                    <div style={{ display: "flex", gap: "20px" }}>
                        <button
                            className="button"
                            onClick={() => props.toggleModal()}
                        >
                            Cancel
                        </button>
                        <button className="button" onClick={handleContinue}>
                            Continue
                        </button>
                    </div>
                </>
            )}
        </motion.div>
    );
}
