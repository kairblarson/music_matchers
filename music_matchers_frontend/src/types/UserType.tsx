import { ReactNode } from "react";
import BandType from "./BandType";

type UserType = {
    _id?: number;
    type: string;
    name: string;
    email: string;
    location: {
        city: string;
        state: string;
    };
    genre: string[];
    lookingFor: string[];
    members: UserType[];
    link?: string;
    images: string[];
    chatrooms?: string[];
    createdAt: number;
    viewedUsers: string[];
    demos: string[];
    additionalInfo: string;
    verified?: boolean;
    band?: BandType;
    distanceBetweenUsers?: number;
};

export default UserType;
