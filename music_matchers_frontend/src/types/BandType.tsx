import UserType from "./UserType";

type BandType = {
    _id: string;
    name: string;
    members: UserType[];
    verified?: boolean;
    enabled?: boolean;
    createdAt: string;
};

export default BandType;
