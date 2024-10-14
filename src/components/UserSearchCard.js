import { Link } from "react-router-dom";
import Avatar from "./Avatar";

function UserSearchCard({ user, onClose }) {
  return (
    <Link
      to={`/${user?._id}`}
      onClick={onClose}
      className="flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border hover:border-primary rounded cursor-pointer"
    >
      <div>
        <Avatar
          width={50}
          height={50}
          userId={user?._id}
          name={user?.name}
          imageUrl={user?.profile_pic}
        />
      </div>
      <div>
        <div className="font-semibold text-ellipsis line-clamp-1">
          {user?.name}
        </div>
        <p className="">{user?.email}</p>
      </div>
    </Link>
  );
}

export default UserSearchCard;
