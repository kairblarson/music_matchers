import { useState, useEffect } from "react";

type ReturnType = {
    lazyImage: string | null;
};

const useLazyImages = (fullImage: string): ReturnType => {
    const [lazyImage, setLazyImage] = useState<string | null>(null);

    useEffect(() => {
        const image = fullImage;
        const extension = image.slice(image.length - 4, image.length);
        const slicedImage = image.slice(0, image.indexOf(extension));
        setLazyImage(slicedImage.concat("-lazy".concat(extension)));
    }, [fullImage]);

    return { lazyImage };
};
//this is too slow to work for now, try using an even lower res image
export default useLazyImages;
