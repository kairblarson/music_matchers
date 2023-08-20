import MessageType from "./MessageType";
import UserType from "./UserType";

type ChatroomType = {
    accepted: boolean;
    createdAt: string;
    declined: boolean;
    messages: MessageType[];
    users: UserType[];
    _id: string;
};

export default ChatroomType;
