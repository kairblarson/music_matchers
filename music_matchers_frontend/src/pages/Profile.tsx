import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { ColorRing } from "react-loader-spinner";
import { BsPatchCheckFill } from "react-icons/bs";
import CustomButton from "../components/CustomButton";
import InputItem from "../components/InputItem";
import ImagePreview from "../components/ImagePreview";
import useFetch from "../hooks/useFetch";

//make this page look better and have like a band invites tab somewhere,
//could maybe add another icon at the bottom to see band invites seperately
export default function Profile() {
    const [images, setImages] = useState([]);
    const [audios, setAudios] = useState([]);
    const { data: userDetails } = useFetch(
        "http://localhost:8081/api/v1/users/user-details",
        "GET"
    );

    function handleSubscription() {
        fetch(`http://localhost:8081/api/v1/users/subscribe`, {
            method: "get",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            mode: "cors",
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                console.log(res);
                window.location.href = res.url;
            })
            .catch((err) => {
                console.log("ERROR:", err.error);
            });
    }

    function handleUnSub() {
        //unsub logic
    }

    async function handleProfileUpdate() {
        const formData = new FormData();

        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }
        for (let i = 0; i < audios.length; i++) {
            formData.append("audios", audios[i]);
        }

        // await axios({
        //     url: `http://localhost:8081/api/v1/auth/register/user`,
        //     withCredentials: true,
        //     method: "POST",
        //     data: formData,
        // });
    }

    return (
        <div className="profile">
            <Header />
            {userDetails ? (
                <div className="profile--content">
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                            }}
                        >
                            <h1 style={{ fontSize: "3em" }}>
                                {userDetails.name}
                            </h1>
                            {userDetails.verified && (
                                <BsPatchCheckFill className="profile--verify" />
                            )}
                        </span>
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "1.5em",
                                    color: "rgb(165, 165, 165)",
                                }}
                            >
                                {userDetails.location.city},{" "}
                                {userDetails.location.state}
                            </p>
                        </span>
                    </div>
                    <div className="profile--images">
                        {userDetails.images.map(
                            (value: string, key: number) => {
                                //add an onClick to the below
                                return (
                                    <ImagePreview
                                        name={value}
                                        src={value}
                                        key={key}
                                        className="profile--img"
                                        index={key}
                                    />
                                );
                            }
                        )}
                    </div>
                    <audio controls>
                        <source src={userDetails.demos[0]}></source>
                    </audio>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <div style={{ display: "flex", gap: "10px" }}>
                            <h4 style={{ fontSize: "1.5em" }}>Looking for:</h4>
                            {userDetails.lookingFor.map(
                                (value: string, key: number) => (
                                    //add an onclick to the below
                                    <InputItem name={value} key={key} />
                                )
                            )}
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <h4 style={{ fontSize: "1.5em" }}>Genre:</h4>
                            {userDetails.genre.map(
                                (value: string, key: number) => (
                                    //add an onclick to the below
                                    <InputItem name={value} key={key} />
                                )
                            )}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                            }}
                        >
                            <h4 style={{ fontSize: "1.5em" }}>Band:</h4>
                            <p
                                className="card--items"
                                style={{ fontSize: "1.5em" }}
                            >
                                {userDetails.band ? (
                                    userDetails.band.name
                                ) : (
                                    <CustomButton
                                        text="Start a band!"
                                        variant="warning"
                                    />
                                )}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "20px" }}>
                        {!userDetails.verified ? (
                            <CustomButton
                                onClick={handleSubscription}
                                text="Subscribe!"
                            />
                        ) : (
                            <CustomButton
                                onClick={handleUnSub}
                                text="Unsubscribe"
                                variant="danger"
                            />
                        )}
                        <CustomButton
                            onClick={handleProfileUpdate}
                            text="Update profile"
                        />
                    </div>
                    {/* <div>
                        <div>
                            <label htmlFor="audio-input">
                                Select your demo
                            </label>
                            <input
                                type="file"
                                id="audio-input"
                                name="audio-input"
                                onChange={(e: any) => setAudios(e.target.files)}
                                multiple
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
                                onChange={(e: any) => setImages(e.target.files)}
                                multiple
                            />
                        </div>
                        <button onClick={handleProfileUpdate}>Update</button>
                    </div> */}
                </div>
            ) : (
                <div className="profile--content loading">
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
        </div>
    );
}

//either include a menu or have all the users do their navigating
//from their profile
//if you do have a nav menu then it should slide out from the right btw
