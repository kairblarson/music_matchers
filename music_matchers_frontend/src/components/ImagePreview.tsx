import { useState, useEffect } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import useLazyImages from "../hooks/useLazyImages";

type ImagePreviewProps = {
    name?: string;
    onClick?: (index: number) => void;
    src: string;
    className: string;
    index: number;
};

export default function ImagePreview({
    name,
    onClick,
    src,
    className,
    index,
}: ImagePreviewProps) {
    const [exitHover, setExitHover] = useState(false);
    const [lazyImage, setLazyImage] = useState<string>("");

    useEffect(() => {
        const image = src;
        const extension = image.slice(image.length - 4, image.length);
        const slicedImage = image.slice(0, image.indexOf(extension));
        setLazyImage(slicedImage.concat("-lazy".concat(extension)));
    }, [src]);

    return (
        <div className="imagepreview">
            {/* <RxCrossCircled
                onClick={() => onClick?.(index)}
                style={{
                    cursor: exitHover ? "pointer" : "default",
                    position: "absolute",
                    fontSize: "20px",
                    top: "4px",
                    left: "4px",
                    color: "gray",
                }}
                onMouseEnter={() => setExitHover((prev) => !prev)}
                onMouseLeave={() => setExitHover((prev) => !prev)}
            /> */}
            <LazyLoadImage
                src={src}
                alt="image not available:/"
                className="imagepreview--img"
                placeholder={
                    <img
                        src={lazyImage}
                        className="imagepreview--img blur"
                    ></img>
                }
            />
        </div>
    );
}
