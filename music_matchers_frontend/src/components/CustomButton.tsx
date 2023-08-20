import React from "react";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

export default function CustomButton(props: any) {
    const [buttonColor, setButtonColor] = useState(null || String);
    const [buttonHover, setButtonHover] = useState(false);

    useEffect(() => {
        switch (props.variant) {
            case "primary":
                setButtonColor("rgb(59, 136, 245)");
                break;
            case "secondary":
                setButtonColor("gray");
                break;
            case "danger":
                setButtonColor("rgb(224, 50, 50)");
                break;
            case "warning":
                setButtonColor("rgb(252, 186, 3)");
                break;
            default:
                setButtonColor("rgb(59, 136, 245)");
        }
    }, []);

    const buttonStyle = {
        background: buttonColor,
        outline: buttonHover ? `3px solid ${buttonColor}` : "none",
        outlineOffset: "3px",
        cursor: buttonHover ? "pointer" : "default",
        transition: "all linear .12s",
        color: "white",
    };

    return (
        <button
            className="button"
            onClick={(e) => {
                e.stopPropagation();
                props?.onClick();
            }}
            style={buttonStyle}
            onMouseEnter={() => setButtonHover((prev) => !prev)}
            onMouseLeave={() => setButtonHover((prev) => !prev)}
        >
            {props.text}
        </button>
    );
}
