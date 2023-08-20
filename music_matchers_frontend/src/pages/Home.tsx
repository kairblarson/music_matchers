import React from "react";
import { useEffect, useState, useMemo } from "react";
import Card from "../components/Card";
import ChatModal from "../components/ChatModal";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Popup from "../components/Popup";
import { motion, AnimatePresence } from "framer-motion";
import { ColorRing } from "react-loader-spinner";
import UserType from "../types/UserType";

export default function Home() {
    const [cardDetails, setCardDetails] = useState<UserType | null>(null);
    const [chatModalState, setChatModalState] = useState(false);
    const [popupState, setPopupState] = useState(false);
    const [popupMessage, setPopupMessage] = useState<string | null>("");
    const [popupVariant, setPopupVariant] = useState<string | null>("success");
    const [rendered, setRendered] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        fetch("http://localhost:8081/api/v1/users/last-viewed", {
            signal,
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            mode: "cors",
        })
            .then((res) => {
                if (res.status == 401) {
                    window.location.href =
                        "http://localhost:3000/login?error=true";
                }
                return res.json();
            })
            .then((res) => {
                console.log(res);
                if (res.additionalInfo == "swipe limit reached") {
                    setPopupMessage(
                        "could not find a new match due to swipe limit."
                    );
                    setPopupState(true);
                    setPopupVariant("danger");
                    setTimeout(() => {
                        togglePopup(null, null);
                    }, 3000);
                }
                setCardDetails(res);
                setIsLoaded(true);
            })
            .catch(
                (err) =>
                    (window.location.href =
                        "http://localhost:3000/login?error=true")
            );

        return () => {
            console.log("Last viewed aborted...");
            abortController.abort();
        };
    }, []);

    const handleNextUser = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        setRendered(false);
        setIsLoaded(false);
        console.log("getting next user...");
        fetch("http://localhost:8081/api/v1/users/next-user", {
            signal,
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            mode: "cors",
        })
            .then((res) => {
                if (res.status == 401) {
                    window.location.href = "http://localhost:3000/login";
                }
                return res.json();
            })
            .then((res) => {
                console.log(res);
                if (res.additionalInfo == "swipe limit reached") {
                    setPopupMessage("Swipe limit reached.");
                    setPopupState(true);
                    setPopupVariant("danger");
                    setTimeout(() => {
                        togglePopup(null, null);
                    }, 3000);
                    //if prev card details is null then return "user not found"
                }
                setCardDetails(res);
                setIsLoaded(true);
            });

        return () => {
            console.log("Next user aborted...");
            abortController.abort();
        };
    };

    useEffect(() => {
        setRendered(true);
    }, [cardDetails]);

    function toggleChatModal() {
        setChatModalState((prev) => !prev);
    }

    function togglePopup(message: string | null, variant: string | null) {
        console.log("popup toggled");
        setPopupMessage(message);
        setPopupVariant(variant);
        setPopupState((prev) => !prev);
    }

    return (
        <motion.div
            className="home"
            initial="outScreen"
            animate="inScreen"
            exit="outScreen"
        >
            <Header />
            <AnimatePresence mode="wait">
                {chatModalState && (
                    <div className="modal-overlay" onClick={toggleChatModal}>
                        <ChatModal
                            state={chatModalState}
                            to={cardDetails}
                            toggleModal={toggleChatModal}
                            handleNextUser={handleNextUser}
                            togglePopup={togglePopup}
                            key="modal"
                        />
                    </div>
                )}
            </AnimatePresence>
            {isLoaded ? (
                <div className="home--content">
                    <AnimatePresence mode="wait">
                        {popupState && (
                            <Popup
                                text={popupMessage}
                                key="popup"
                                variant={popupVariant}
                            />
                        )}
                    </AnimatePresence>
                    {rendered && cardDetails && (
                        <Card
                            cardDetails={cardDetails}
                            setChatModalState={toggleChatModal}
                            handleNextUser={handleNextUser}
                            matched={false}
                        />
                    )}
                </div>
            ) : (
                <div className="home--content loading">
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
