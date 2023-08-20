import BandType from "./BandType";
import UserType from "./UserType";

type InviteType = {
    _id: string;
    band: BandType;
    to: UserType;
    from: UserType;
    accepted: Boolean;
    declined: Boolean;
};

export default InviteType;
