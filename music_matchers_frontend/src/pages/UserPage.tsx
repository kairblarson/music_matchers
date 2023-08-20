import { useState, useEffect } from "react";
import { FaChevronCircleLeft } from "react-icons/fa";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ErrorType from "../types/ErrorType";
import UserType from "../types/UserType";

export default function UserPage(props: any) {
    const [userDetails, setUserDetails] = useState<UserType | null>(null);
    const [error, setError] = useState<ErrorType | null>(null);
    const navigate = useNavigate();
    const [backButtonHover, setBackButtonHover] = useState(false);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    useEffect(() => {
        fetch(`http://localhost:8081/api/v1/users/${id}`, {
            method: "get",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            mode: "cors",
        })
            .then((res) => {
                if (res.status === 401) {
                    window.location.href = "http://localhost:3000/login";
                }
                return res.json();
            })
            .then((data) => {
                if (data.message) {
                    setError(data);
                } else {
                    setUserDetails(data);
                }
            })
            .catch((error) => {
                console.log("ERROR:", error);
            });
    }, [id]);

    const backButtonStyle = {
        transition: "all linear .1s",
        cursor: backButtonHover ? "pointer" : "default",
    };

    return (
        <div className="userpage">
            <Header />
            {!error ? (
                <div className="userpage--content">
                    <small
                        className="back-chev"
                        onClick={() => navigate(-1)}
                        style={backButtonStyle}
                        onMouseEnter={() => setBackButtonHover((prev) => !prev)}
                        onMouseLeave={() => setBackButtonHover((prev) => !prev)}
                    >
                        back to chat
                    </small>
                    {userDetails ? (
                        <Card cardDetails={userDetails} matched={true} />
                    ) : null}
                </div>
            ) : (
                <div className="userpage--content error">{error.message}</div>
            )}
            <Footer />
        </div>
    );
}
