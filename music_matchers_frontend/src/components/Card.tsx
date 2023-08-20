import { useEffect, useState, useRef } from "react";
import { BsPatchCheckFill, BsRocketTakeoff } from "react-icons/bs";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import {
    MdPlayCircleOutline,
    MdChevronLeft,
    MdChevronRight,
    MdPauseCircleOutline,
} from "react-icons/md";
import { motion } from "framer-motion";
import UserType from "../types/UserType";
import { LazyLoadImage } from "react-lazy-load-image-component";

type CardProps = {
    cardDetails: UserType;
    setChatModalState?: () => void;
    handleNextUser?: () => void;
    matched: boolean;
};

//display how many swipes a user has left?
export default function Card(props: CardProps) {
    const [cardDetails, setCardDetails] = useState(props.cardDetails);
    const { setChatModalState } = props;
    const [imageIndex, setImageIndex] = useState(0);
    const [leftChevHover, setLeftChevHover] = useState(false);
    const [rightChevHover, setRightChevHover] = useState(false);
    const [declineHover, setDeclineHover] = useState(false);
    const [playHover, setPlayHover] = useState(false);
    const [pauseHover, setPauseHover] = useState(false);
    const [confirmHover, setConfirmHover] = useState(false);
    const track = document.getElementById("track") as HTMLAudioElement;
    const [pausePlay, togglePausePlay] = useState(false);
    const [imageWidth, setImageWidth] = useState(0);
    const [imageOffset, setImageOffset] = useState(imageWidth);

    function toggleDemo() {
        if (track.paused) {
            track.play();
            togglePausePlay(true);
        } else {
            track.pause();
            togglePausePlay(false);
        }
    }

    const leftChevStyle = {
        fontSize: leftChevHover ? "55px" : "50px",
        color: "rgb(167, 167, 167)",
        opacity: leftChevHover ? "100%" : "70%",
        filter: leftChevHover
            ? "drop-shadow(0px 0px 10px rgba(0, 0, 0, .5))"
            : "none",
        transition: "all linear .1s",
        cursor: leftChevHover ? "pointer" : "default",
    };

    const rightChevStyle = {
        fontSize: rightChevHover ? "55px" : "50px",
        color: "rgb(167, 167, 167)",
        opacity: rightChevHover ? "100%" : "70%",
        filter: rightChevHover
            ? "drop-shadow(0px 0px 10px rgba(0, 0, 0, .5))"
            : "none",
        transition: "all linear .1s",
        cursor: rightChevHover ? "pointer" : "default",
    };

    const playButtonStyle = {
        fontSize: playHover ? "65px" : "60px",
        color: "rgb(167, 167, 167)",
        filter: playHover
            ? "drop-shadow(0px 0px 10px rgba(0, 0, 0, 1))"
            : "none",
        opacity: playHover ? "100%" : "70%",
        transition: "all linear .1s",
        cursor: playHover ? "pointer" : "default",
    };

    const pauseButtonStyle = {
        fontSize: pauseHover ? "65px" : "60px",
        color: "rgb(167, 167, 167)",
        opacity: pauseHover ? "100%" : "70%",
        transition: "all linear .1s",
        cursor: pauseHover ? "pointer" : "default",
        filter: pauseHover
            ? "drop-shadow(0px 0px 10px rgba(0, 0, 0, 1))"
            : "none",
    };

    const confirmButtonStyle = {
        color: confirmHover ? "rgba(43, 163, 29, .8)" : "rgba(43, 163, 29, .3)",
        fontSize: "45px",
        cursor: confirmHover ? "pointer" : "default",
        transition: "all linear .1s",
        filter: confirmHover
            ? "drop-shadow(0px 0px 10px rgba(43, 163, 29, .5))"
            : "none",
    };

    const declineButtonStyle = {
        color: declineHover ? "rgba(224, 50, 50, .8)" : "rgba(224, 50, 50, .3)",
        fontSize: "45px",
        filter: declineHover
            ? "drop-shadow(0px 0px 10px rgba(224, 50, 50, .5))"
            : "none",
        cursor: declineHover ? "pointer" : "default",
        transition: "all linear .1s",
    };

    useEffect(() => {
        if (cardDetails.type != "error") {
            let initialImage = document.getElementById(
                "image-0"
            ) as HTMLImageElement;
            setImageWidth(initialImage.offsetWidth);
        }
    }, [cardDetails]);

    useEffect(() => {
        if (cardDetails.type != "error") {
            if (cardDetails.images.length == 4)
                setImageOffset(imageWidth + 200);
            else if (cardDetails.images.length == 3) setImageOffset(imageWidth);
            else if (cardDetails.images.length == 2)
                setImageOffset(imageWidth - 200);
            else if (cardDetails.images.length == 1) setImageOffset(0);
            //so basically with each pic you need to add 200
        }
    }, [imageWidth]);

    console.log(cardDetails.band);

    //cant figure out how to lazy load these images

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
        >
            {cardDetails.name === "user not found" &&
            cardDetails.type === "error" ? (
                <div className="card">
                    <h1 style={{ color: "gray" }}>Could not find a match:/</h1>
                    <h2 style={{ color: "gray" }}>Try again later.</h2>
                </div>
            ) : (
                <div className="card">
                    <div className="card--top">
                        <div className="card--image-overlay">
                            {cardDetails.verified && (
                                <BsPatchCheckFill className="card--verify" />
                            )}
                            <MdChevronLeft
                                className="card--chevron"
                                onClick={() => {
                                    if (imageIndex != 0) {
                                        setImageOffset(
                                            (prev) => prev + imageWidth
                                        );
                                        setImageIndex((prev) => prev - 1);
                                    }
                                }}
                                onMouseEnter={() =>
                                    setLeftChevHover((prev) => !prev)
                                }
                                onMouseLeave={() =>
                                    setLeftChevHover((prev) => !prev)
                                }
                                style={leftChevStyle}
                            />
                            {!pausePlay ? (
                                <MdPlayCircleOutline
                                    style={playButtonStyle}
                                    onMouseEnter={() =>
                                        setPlayHover((prev) => !prev)
                                    }
                                    onMouseLeave={() =>
                                        setPlayHover((prev) => !prev)
                                    }
                                    onClick={toggleDemo}
                                />
                            ) : (
                                <MdPauseCircleOutline
                                    style={pauseButtonStyle}
                                    onMouseEnter={() =>
                                        setPauseHover((prev) => !prev)
                                    }
                                    onMouseLeave={() =>
                                        setPauseHover((prev) => !prev)
                                    }
                                    onClick={toggleDemo}
                                />
                            )}
                            <MdChevronRight
                                className="card--chevron"
                                onClick={() => {
                                    if (
                                        imageIndex !=
                                        cardDetails.images.length - 1
                                    ) {
                                        setImageOffset(
                                            (prev) => prev - imageWidth
                                        );
                                        setImageIndex((prev) => prev + 1);
                                    }
                                }}
                                onMouseEnter={() =>
                                    setRightChevHover((prev) => !prev)
                                }
                                onMouseLeave={() =>
                                    setRightChevHover((prev) => !prev)
                                }
                                style={rightChevStyle}
                            />
                        </div>
                        {cardDetails.images && (
                            <div className="card--image-container">
                                {cardDetails.images.map((value, index) => {
                                    const image = value;
                                    const extension = image.slice(
                                        image.length - 4,
                                        image.length
                                    );
                                    const slicedImage = image.slice(
                                        0,
                                        image.indexOf(extension)
                                    );
                                    const lazyImage = slicedImage.concat(
                                        "-lazy".concat(extension)
                                    );

                                    return (
                                        <img
                                            src={value}
                                            className="card--image"
                                            key={index}
                                            id={`image-${index}`}
                                            style={{
                                                translate: `${imageOffset}px`,
                                                transition:
                                                    "all 1s cubic-bezier(0.25, 0.3, 0.4, 1.1)",
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="card--tabs">
                        {cardDetails.images.map((value, key) => {
                            return (
                                <div
                                    className="card--tab"
                                    key={key}
                                    style={{
                                        background:
                                            imageIndex === key
                                                ? "gray"
                                                : "rgb(190, 190, 190)",
                                        transition: "all linear .2s",
                                    }}
                                ></div>
                            );
                        })}
                    </div>
                    <div className="card--bottom">
                        <div className="card--title">
                            <span>
                                <h1>{cardDetails.name}</h1>
                            </span>
                            <h2 className="card--type">
                                {cardDetails.type
                                    .charAt(0)
                                    .toUpperCase()
                                    .concat(
                                        cardDetails.type.slice(
                                            1,
                                            cardDetails.type.length
                                        )
                                    )}
                            </h2>
                        </div>
                        <div className="card--sub">
                            <h2>
                                {cardDetails.location.city},{" "}
                                {cardDetails.location.state}
                            </h2>
                            {cardDetails.distanceBetweenUsers && (
                                <>
                                    <small>•</small>
                                    <p>
                                        {Math.round(
                                            cardDetails.distanceBetweenUsers
                                        )}
                                        mi
                                    </p>
                                </>
                            )}
                        </div>
                        <section className="card--content">
                            <span>
                                <h4>Looking for:</h4>
                                {cardDetails.lookingFor.map((value, key) => (
                                    <p key={key} className="card--items">
                                        {value}
                                        {cardDetails.lookingFor.length - 1 >
                                            key && ","}
                                    </p>
                                ))}
                            </span>
                            <span>
                                <h4>Genre:</h4>
                                {cardDetails.genre.map((value, key) => (
                                    <p key={key} className="card--items">
                                        {value}
                                        {cardDetails.genre.length - 1 > key &&
                                            ","}
                                    </p>
                                ))}
                            </span>
                            {cardDetails.type.toLowerCase() === "band" ? (
                                <span className="card--members">
                                    <h4>Members:</h4>
                                    {cardDetails.members.map(
                                        (value: UserType, key) => (
                                            <p
                                                key={key}
                                                className="card--items"
                                            >
                                                {value.name}
                                                {cardDetails.members.length -
                                                    1 >
                                                    key && ","}
                                            </p>
                                        )
                                    )}
                                </span>
                            ) : (
                                <span className="card--members">
                                    <h4>Band:</h4>
                                    <p className="card--items">
                                        {cardDetails.band
                                            ? cardDetails.band.name
                                            : "None"}
                                    </p>
                                </span>
                            )}
                        </section>
                        <div className="card--buttons">
                            {!props.matched && (
                                <FaRegThumbsDown
                                    style={declineButtonStyle}
                                    onMouseEnter={() =>
                                        setDeclineHover((prev) => !prev)
                                    }
                                    onMouseLeave={() =>
                                        setDeclineHover((prev) => !prev)
                                    }
                                    onClick={() => props.handleNextUser?.()}
                                />
                            )}
                            <BsRocketTakeoff
                                style={{ color: "rgba(150, 150, 150, .8)" }}
                            />
                            {!props.matched && (
                                <FaRegThumbsUp
                                    style={confirmButtonStyle}
                                    onMouseEnter={() =>
                                        setConfirmHover((prev) => !prev)
                                    }
                                    onMouseLeave={() =>
                                        setConfirmHover((prev) => !prev)
                                    }
                                    onClick={() => setChatModalState?.()}
                                />
                            )}
                        </div>
                    </div>
                    {cardDetails.demos && (
                        <audio id="track">
                            <source
                                src={cardDetails.demos[0]}
                                type="audio/mpeg"
                            ></source>
                        </audio>
                    )}
                </div>
            )}
        </motion.div>
    );
}

//make the x and check glow and give a tool tip over the check mark
