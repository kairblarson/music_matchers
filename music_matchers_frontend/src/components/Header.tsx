import React from "react";
import { useEffect, useState } from "react";
import { BsPersonFill, BsRocketTakeoff } from "react-icons/bs";

export default function Header() {
    function verifyUser() {
        // fetch("http://localhost:8081/api/v1/auth/verify-user", {
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     credentials: "include",
        //     mode: "cors",
        // })
        //     .then((res) => res.json())
        //     .then((res) => console.log(res));
    }

    return (
        <div className="header">
            <h1 className="header--title">
                <BsRocketTakeoff />
                Music Matchers
            </h1>
        </div>
    );
}
