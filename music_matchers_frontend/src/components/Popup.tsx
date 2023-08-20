import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type PopupProps = {
    text: string | null;
    variant?: string | null;
};

export default function Popup(props: PopupProps) {
    const [text, setText] = useState(props.text ? props.text : "Alert");

    return (
        <motion.div
            className="popup"
            animate={{ scale: 1 }}
            initial={{ scale: 0 }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
            style={{
                background:
                    props.variant == "success"
                        ? "rgba(120, 164, 242, 1)"
                        : props.variant == "warning"
                        ? "rgba(230, 192, 5, .9)"
                        : "rgba(255, 150, 150, 1)",
                border:
                    props.variant == "success"
                        ? "2px solid rgba(25, 134, 242, 1)"
                        : props.variant == "warning"
                        ? "2px solid rgba(230, 192, 5, 1)"
                        : "2px solid rgba(224, 50, 50, 1)",
            }}
        >
            {text}
        </motion.div>
    );
}

//work with the colors to make them match the red