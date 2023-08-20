import { ChangeEvent } from "react";
import { useEffect, useState, useRef } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import axios from "axios";
import InputItem from "../components/InputItem";
import CustomButton from "../components/CustomButton";
import ImagePreview from "../components/ImagePreview";
import Popup from "../components/Popup";
import { AnimatePresence } from "framer-motion";
import { Dropdown } from "rsuite";

export default function Signup() {
    const [images, setImages] = useState<(File | null)[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [audios, setAudios] = useState<(File | null)[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [genres, setGenres] = useState("");
    const [finalGenres, setFinalGenres] = useState<string[]>([]);
    const [lookingFor, setLookingFor] = useState("");
    const [finalLookingFor, setFinalLookingFor] = useState<string[]>([]);
    const [type, setType] = useState("Select");
    const [popupState, setPopupState] = useState(false);
    const [success, setSuccess] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [typeMenuState, setTypeMenuState] = useState(false);

    async function handleUserSignup() {
        const formData = new FormData();

        for (let i = 0; i < (images ? images.length : 0); i++) {
            images[i] ? formData.append("images", images[i] as File) : null;
        }
        for (let i = 0; i < (audios ? audios.length : 0); i++) {
            images[i] ? formData.append("audios", audios[i] as File) : null;
        }
        formData.append("lookingFor", JSON.stringify(finalLookingFor));
        formData.append("genres", JSON.stringify(finalGenres));
        formData.append("email", email);
        formData.append("name", name);
        formData.append("password", password);
        formData.append("city", city);
        formData.append("state", state);
        formData.append("type", type);

        //implement the ability to lazy load on the frontend now
        //create a new person for slash to match with to test 
        await axios({
            url: `http://localhost:8081/api/v1/auth/register/user`,
            withCredentials: true,
            method: "POST",
            data: formData,
        })
            .then((res) => {
                if (res.data.message == "please fill out all the fields") {
                    setPopupMessage("Please fill out all the fields.");
                    setPopupState(true);
                    setTimeout(() => {
                        setPopupState(false);
                    }, 3000);
                } else if (
                    res.data.message ==
                    "user with those credentials already exists"
                ) {
                    setPopupMessage(
                        "User with those credentials already exists."
                    );
                    setPopupState(true);
                    setTimeout(() => {
                        setPopupState(false);
                    }, 3000);
                } else if (res.data.message === "3 image limit") {
                    setPopupMessage("Users are limited to 3 images maximum.");
                    setPopupState(true);
                    setTimeout(() => {
                        setPopupState(false);
                    }, 3000);
                } else {
                    //show a screen that says account created successfully
                    //have a button that takes you to the login
                    setSuccess(true);
                }
            })
            .catch((err) => console.error(err));
    }

    function handleFormReset() {
        //reset form
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            fetch(`http://localhost:8081/api/v1/users/current-location`, {
                method: "post",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                mode: "cors",
                body: JSON.stringify({
                    LATITUDE: position.coords.latitude,
                    LONGITUDE: position.coords.longitude,
                }),
            })
                .then((res) => {
                    if (res.status == 401)
                        window.location.href = "http://localhost:3000/login";
                    return res.json();
                })
                .then((res) => {
                    setCity(res.city);
                    setState(res.state);
                })
                .catch((err) => {
                    console.log("ERROR:", err.error);
                });
        });
    }, []);

    function removeItemFromGenres(name: string) {
        const newArray = finalGenres.filter(function (item) {
            return item !== name;
        });

        setFinalGenres([...newArray]);
    }

    function removeItemFromLookingFor(name: string) {
        const newArray = finalLookingFor.filter(function (item) {
            return item !== name;
        });

        setFinalLookingFor([...newArray]);
    }

    function removeFromImagePreviews(index: number) {
        const before = imagePreviews.slice(0, index);
        const after = imagePreviews.slice(index + 1, imagePreviews.length + 1);
        const combined = before.concat(after);
        setImagePreviews([...combined]);
        //this removes the files visually but not actually so work on that next
    }

    return (
        <div className="signup">
            <Header />
            {success ? (
                <div className="signup--content">
                    <h1>Registration Complete!</h1>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "20px",
                        }}
                    >
                        <h2>Click here to login</h2>
                        <CustomButton
                            text="Login!"
                            onClick={() =>
                                (window.location.href =
                                    "http://localhost:3000/login")
                            }
                        />
                    </div>
                </div>
            ) : (
                <div className="signup--content">
                    <AnimatePresence mode="wait">
                        {popupState && <Popup text={popupMessage} />}
                    </AnimatePresence>

                    <div className="signup--container">
                        <h1>Sign up today!</h1>
                        <div className="signup--inputs">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "20px",
                                }}
                            >
                                <input
                                    className="input"
                                    value={name}
                                    placeholder="Enter name"
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ width: "100%" }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        position: "relative",
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            setTypeMenuState((prev) => !prev)
                                        }
                                        className="button"
                                        style={{
                                            border: "2px solid gray",
                                            color: "gray",
                                            background: "white",
                                        }}
                                    >
                                        {type}
                                    </button>
                                    {typeMenuState && (
                                        <div
                                            className="signup--types"
                                            onClick={() =>
                                                setTypeMenuState(
                                                    (prev) => !prev
                                                )
                                            }
                                        >
                                            <p onClick={() => setType("Band")}>
                                                Band
                                            </p>
                                            <p
                                                onClick={() =>
                                                    setType("Singer")
                                                }
                                            >
                                                Singer
                                            </p>
                                            <p
                                                onClick={() =>
                                                    setType("Guitarist")
                                                }
                                            >
                                                Guitarist
                                            </p>
                                            <p
                                                onClick={() =>
                                                    setType("Drummer")
                                                }
                                            >
                                                Drummer
                                            </p>
                                            <p
                                                onClick={() =>
                                                    setType("Bassist")
                                                }
                                            >
                                                Bassist
                                            </p>
                                            <p
                                                onClick={() =>
                                                    setType("Pianist")
                                                }
                                            >
                                                Pianist
                                            </p>
                                            <p
                                                onClick={() =>
                                                    setType("Producer")
                                                }
                                            >
                                                Producer
                                            </p>
                                            <p
                                                onClick={() =>
                                                    setType("Engineer")
                                                }
                                            >
                                                Engineer
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <input
                                className="input"
                                value={email}
                                placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                            />
                            <input
                                className="input"
                                value={password}
                                placeholder="Enter password"
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                            />
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "20px",
                                }}
                            >
                                <input
                                    className="input"
                                    value={city}
                                    placeholder="Enter city"
                                    onChange={(e) => setCity(e.target.value)}
                                    style={{ width: "100%" }}
                                />
                                <input
                                    className="input"
                                    value={state}
                                    placeholder="Enter state"
                                    onChange={(e) => setState(e.target.value)}
                                    style={{ width: "80%" }}
                                />
                            </div>
                            <div className="signup--genres">
                                {finalGenres.length > 0 &&
                                    finalGenres.map((item, index) => {
                                        return (
                                            <InputItem
                                                name={item}
                                                onClick={removeItemFromGenres}
                                                key={index}
                                            />
                                        );
                                    })}
                            </div>
                            <input
                                name="genres"
                                className="input"
                                value={genres}
                                placeholder="Enter genres"
                                onChange={(e) => setGenres(e.target.value)}
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" &&
                                        genres.trim() !== ""
                                    ) {
                                        setGenres("");
                                        const target =
                                            e.target as HTMLInputElement;
                                        setFinalGenres((prev: string[]) => [
                                            ...prev,
                                            target?.value,
                                        ]);
                                    }
                                }}
                            />
                            <div className="signup--lookingfor">
                                {finalLookingFor.length > 0 &&
                                    finalLookingFor.map((item, index) => {
                                        return (
                                            <InputItem
                                                name={item}
                                                onClick={
                                                    removeItemFromLookingFor
                                                }
                                                key={index}
                                            />
                                        );
                                    })}
                            </div>
                            <input
                                name="lookingfor"
                                className="input"
                                value={lookingFor}
                                placeholder="Looking for?"
                                onChange={(e) => setLookingFor(e.target.value)}
                                onKeyDown={(e) => {
                                    if (
                                        e.key == "Enter" &&
                                        lookingFor.trim() != ""
                                    ) {
                                        setLookingFor("");
                                        const target =
                                            e.target as HTMLInputElement;
                                        setFinalLookingFor((prev: string[]) => [
                                            ...prev,
                                            target.value,
                                        ]);
                                    }
                                }}
                            />
                            <div>
                                <label htmlFor="audio-input">
                                    Select your demo
                                </label>
                                <input
                                    type="file"
                                    id="audio-input"
                                    name="audio-input"
                                    onChange={(e) => {
                                        const target =
                                            e.target as HTMLInputElement;
                                        setAudios(
                                            Array.from(target.files || [])
                                        );
                                    }}
                                    accept=".mp3, .wav"
                                />
                            </div>
                            <div>
                                <label htmlFor="image-input">
                                    Select your images
                                </label>
                                <input
                                    type="file"
                                    id="image-input"
                                    name="image-input"
                                    onChange={(e) => {
                                        const target =
                                            e.target as HTMLInputElement;
                                        setImages(
                                            Array.from(target.files || [])
                                        );
                                        let imageArray: string[] = [];
                                        for (
                                            let i = 0;
                                            i <
                                            (target.files
                                                ? target.files.length
                                                : 0);
                                            i++
                                        ) {
                                            target.files
                                                ? imageArray.push(
                                                      URL.createObjectURL(
                                                          target.files[i]
                                                      )
                                                  )
                                                : null;
                                        }
                                        setImagePreviews([...imageArray]);
                                    }}
                                    multiple
                                    accept=".jpg, .png"
                                />
                            </div>
                        </div>
                        <div className="previews">
                            {imagePreviews.length > 0 &&
                                imagePreviews.map((image, index) => {
                                    return (
                                        <ImagePreview
                                            src={image}
                                            className="img-preview"
                                            key={index}
                                            onClick={removeFromImagePreviews}
                                            index={index}
                                        />
                                    );
                                })}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                width: "80%",
                                justifyContent: "space-evenly",
                                gap: "20px",
                                maxWidth: "600px",
                            }}
                        >
                            {/* <button className="button" onClick={handleFormReset}>
                            Clear
                        </button>
                        <button className="button" onClick={handleUserSignup}>
                            Sign up!
                        </button> */}
                            <CustomButton
                                text="Clear"
                                onClick={handleUserSignup}
                                variant="warning"
                            />
                            <CustomButton
                                text="Sign up!"
                                onClick={handleUserSignup}
                            />
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
