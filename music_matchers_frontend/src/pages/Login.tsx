import React from "react";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import ChatModal from "../components/ChatModal";
import CustomButton from "../components/CustomButton";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Login() {
    const [userInput, setUserInput] = useState({
        email: "",
        password: "",
    });
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get("error");

        if (errorParam === "true") {
            setIsError(true);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;

        setUserInput((prev) => {
            return name === "email"
                ? { ...prev, email: value }
                : { ...prev, password: value };
        });
    };

    const handleSubmit = () => {
        fetch(`http://localhost:8081/api/v1/auth/login`, {
            method: "post",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify({
                email: userInput.email,
                password: userInput.password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                window.location.href = "http://localhost:3000/home";
            })
            .catch((error) => {
                console.log("ERROR:", error);
            });
    };

    if (isError) {
        return (
            <div>
                <Header />
                <div className="login--content error">
                    <div style={{ textAlign: "center" }}>
                        <p>Something went wrong:/</p>
                        <p>Try again later.</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="login">
            <Header />
            <div className="login--content">
                <div className="login--main">
                    <h1>Login</h1>
                    <div className="login--inputs">
                        <input
                            className="input"
                            placeholder="Email"
                            name="email"
                            value={userInput.email}
                            onChange={handleChange}
                            type="email"
                            style={{
                                width: "100%",
                            }}
                        ></input>
                        <input
                            className="input"
                            placeholder="Password"
                            name="password"
                            value={userInput.password}
                            onChange={handleChange}
                            type="password"
                            style={{
                                width: "100%",
                            }}
                        ></input>
                    </div>
                    <div className="login--buttons">
                        <CustomButton text="Clear" variant="danger" />
                        <CustomButton text="Login" onClick={handleSubmit} />
                    </div>
                    <div style={{ width: "80%" }}>
                        <CustomButton
                            text="Sign up"
                            variant="warning"
                            onClick={() =>
                                (window.location.href =
                                    "http://localhost:3000/signup")
                            }
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
