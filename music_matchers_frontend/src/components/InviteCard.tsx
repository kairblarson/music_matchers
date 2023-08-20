import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import BandType from "../types/BandType";
import InviteType from "../types/InviteType";

type InviteCardProps = {
    invite: InviteType;
    handleAccept: (requestID: string) => void;
    handleDecline: (requestID: string) => void;
};

export default function InviteCard(props: InviteCardProps) {
    return (
        <div className="invitecard">
            <div className="invitecard--main">
                <div className="invitecard--left">
                    <p>
                        {props.invite.from.name} sent you a request to join "
                        {props.invite.band.name}"
                    </p>
                </div>
            </div>
            <div className="invitecard--buttons">
                <FaThumbsUp
                    className="invitecard--button"
                    onClick={() => props.handleAccept(props.invite._id)}
                />
                <FaThumbsDown
                    className="invitecard--button"
                    onClick={() => props.handleDecline(props.invite._id)}
                />
            </div>
        </div>
    );
}
