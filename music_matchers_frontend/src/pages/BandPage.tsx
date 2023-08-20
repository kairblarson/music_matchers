import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BandType from "../types/BandType";
import useFetch from "../hooks/useFetch";
import InviteType from "../types/InviteType";
import InviteCard from "../components/InviteCard";

export default function BandPage() {
    const [invites, setInvites] = useState<BandType[] | null>(null);
    const { data: bandInvites } = useFetch(
        "http://localhost:8081/api/v1/users/band-requests",
        "GET"
    );

    useEffect(() => {
        setInvites((prev) => bandInvites);
    }, []);

    async function handleAccept(requestID: string) {
        fetch("http://localhost:8081/api/v1/users/accept-band-request", {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify({
                requestID,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Request failed");
                return res.json();
            })
            .then((data) => {
                //after someone accepts a band req, display a popup
                //congratulating them
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleDecline() {}

    return (
        <div className="chatroom">
            <Header />
            <div className="chatroom--content">
                <h1 className="bandpage--title">Requests</h1>
                <div>
                    {bandInvites &&
                        bandInvites.map((value: InviteType, index: number) => {
                            return (
                                <InviteCard
                                    key={index}
                                    invite={value}
                                    handleAccept={handleAccept}
                                    handleDecline={handleDecline}
                                />
                            );
                        })}
                </div>
            </div>
            <Footer />
        </div>
    );
}

//change the class names of all the parent div tags and the content div name
//to a generic name

//--a general coding tip i need to consider is when im using react i really
//should be making components that can be reused for example: RenderList,
//Header, Card, Item, Button, etc. and then use those to render diff things
//instead of making a new thing from scratch everytime
