import UserType from "./UserType";

type MessageType = {
    _id?: number;
    reciever?: UserType | number | null;
    sender?: UserType | number | null;
    content: string;
    createdAt: number;
    viewedBy: (UserType | null)[];
};

export default MessageType;
