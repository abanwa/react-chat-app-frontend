import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

function Avatar({ userId, name, imageUrl, width, height }) {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);
  let avatarName = "";
  if (name) {
    avatarName = name
      ?.split(" ")
      .map((word) => word.at(0))
      .join("")
      .slice(0, 2); // select only the first two letters
    // console.log("SPLITEDNAME: ", name);

    // const splitName = name?.split(" ");
    // if (splitName.length > 1) {
    //   avatarName = splitName[0][0] + splitName[1][0];
    // } else {
    //   avatarName = splitName[0][0];
    // }
  }

  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-gray-200",
    "bg-cyan-200",
    "bg-sky-200",
    "bg-blue-200"
  ];

  const randomNumber = Math.floor(Math.random() * bgColor.length);
  const isOnline = onlineUser.includes(userId);
  return (
    <div
      className={`text-slate-800 rounded-full border text-xl font-bold relative`}
      style={{ width: width + "px", height: height + "px" }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          className="overflow-hidden rounded-full"
          alt={name}
        />
      ) : name ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${bgColor[randomNumber]}`}
        >
          {avatarName}
        </div>
      ) : (
        <PiUserCircle size={width} />
      )}

      {isOnline && (
        <div className="bg-green-600 p-1 absolute bottom-2 -right-1 z-10 rounded-full"></div>
      )}
    </div>
  );
}

export default Avatar;
