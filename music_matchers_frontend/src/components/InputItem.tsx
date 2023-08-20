import { useState, useEffect } from "react";
import { RxCrossCircled } from "react-icons/rx";

type InputItemType = {
    name: string;
    onClick?: (name: string) => void;
};

export default function InputItem({ name, onClick }: InputItemType) {
    const [exitHover, setExitHover] = useState(false);
    return (
        <div className="inputitem">
            <RxCrossCircled
                onClick={() => onClick?.(name)}
                style={{
                    cursor: exitHover ? "pointer" : "default",
                }}
                onMouseEnter={() => setExitHover((prev) => !prev)}
                onMouseLeave={() => setExitHover((prev) => !prev)}
            />
            {name}
        </div>
    );
}

//add some framer motion to these
//make the signup page look a little better
//also figure out why the top gets cut off when you add pics
//make adding pics nicer too
