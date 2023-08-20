const User = require("../models/User");
const Chatroom = require("../models/Chatroom");
const Message = require("../models/Message");
const { handleSwipeCount } = require("./UserService");

const handleMessage = async (message) => {
    const { sender, reciever, content } = message;
    if (!sender || !reciever) return null;

    const senderDB = await User.findById(sender);
    const recieverDB = await User.findById(reciever);
    const currentChatroom = await getCurrentChatroom(
        senderDB,
        recieverDB,
        null
    );

    const newMessage = await Message.create({
        sender: senderDB,
        reciever: recieverDB,
        content: content,
        viewedBy: [sender],
    });

    if (!currentChatroom || currentChatroom.length === 0) {
        const result = await handleSwipeCount(senderDB);
        if (result == "swipe limit reached") {
            return "swipe limit reached";
        } else {
            const newChatroom = await Chatroom.create({
                users: [senderDB, recieverDB],
                messages: [newMessage],
            });

            recieverDB.chatrooms.push(newChatroom);
            senderDB.chatrooms.push(newChatroom);

            await recieverDB.save();
            await senderDB.save();
            await newChatroom.save();
            return "OK";
        }
    } else {
        currentChatroom.messages.push(newMessage);
        if (currentChatroom.messages.length > 1)
            currentChatroom.accepted = true;
        await currentChatroom.save();
        return "OK";
    }
};

const getAllChatrooms = async (currentUser, accepted) => {
    const chatrooms = await Chatroom.find({
        accepted: JSON.parse(accepted),
        declined: false,
        users: currentUser,
    })
        .populate("users")
        .populate({ path: "messages", populate: { path: "viewedBy" } });

    const filteredChatrooms = chatrooms.map((room) => {
        if (JSON.parse(accepted)) {
            return room;
        } else if (
            JSON.stringify(room.messages[0].reciever._id) ===
            JSON.stringify(currentUser._id)
        ) {
            console.log(room.messages[0].reciever._id);
            return room;
        }
    });

    return filteredChatrooms;
};

const declineChatRequest = async (chatroomId) => {
    const chatroom = await Chatroom.findById(chatroomId).catch((err) =>
        console.log(err)
    );

    if (chatroom) {
        chatroom.declined = true;
        await chatroom.save();
    }
    return chatroom;
};

const getCurrentChatroom = async (currentUser, reciever, chatroomId, page) => {
    let chatroom = null;

    if (chatroomId) {
        chatroom = await Chatroom.findById(chatroomId)
            .populate("messages")
            .populate("users");
    } else {
        chatroom = await Chatroom.findOne({
            users: { $all: [currentUser, reciever] },
        })
            .populate("messages")
            .catch((err) => console.log(err));
    }

    if (chatroom) {
        chatroom.messages.forEach(async (message) => {
            if (!message?.viewedBy?.includes(currentUser._id.toString())) {
                if (message.viewedBy) {
                    message.viewedBy.push(currentUser);
                } else {
                    message.viewedBy = [currentUser];
                }
            }
            await message.save();
        });

        if (
            JSON.stringify(chatroom.users[0]._id) !==
                JSON.stringify(currentUser._id) &&
            JSON.stringify(chatroom.users[1]._id) !==
                JSON.stringify(currentUser._id)
        ) {
            return { error: "unauthorized" };
        }
    }

    if (!page) return chatroom;

    const messages = chatroom.messages
        .reverse()
        .slice(page * 20, page * 20 + 20);

    return {
        createdAt: chatroom.createdAt,
        messages,
        users: [...chatroom.users],
    };
};

module.exports = {
    handleMessage,
    getAllChatrooms,
    getCurrentChatroom,
    declineChatRequest,
};
