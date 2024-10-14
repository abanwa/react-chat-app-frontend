import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import uploadFile from "../helpers/uploadFile";
import Loading from "./Loading";
import backgroundImage from "../assets/wallapaper.jpeg";
import { IoMdSend } from "react-icons/io";
import moment from "moment";

function MessagePage() {
  const { userId } = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false
  });

  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef();

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }
  }, [currentMessage]);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", userId);

      // when the logged in message has visisted the message page, the message will automatically be updated to seen
      // the logged in user id wil be emitted
      socketConnection.emit("seen", userId);

      socketConnection.on("message-user", (data) => {
        // console.log("user that we open their message details : ", data);
        setDataUser(data);
      });

      // this will be the conversation and messages between the users coming from the server. socket.io/index.js
      socketConnection.on("message", (data) => {
        console.log("message data", data);
        setAllMessage(data);
      });
    }
  }, [userId, socketConnection, user]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((open) => !open);
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    console.log("UploadPhoto from message page.js", uploadPhoto);

    setMessage((prev) => ({ ...prev, imageUrl: uploadPhoto?.url }));
  };
  const handleUploadVideo = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    console.log("UploadVideo from message page.js", uploadPhoto);

    setMessage((prev) => ({ ...prev, videoUrl: uploadPhoto?.url }));
  };

  const handleClearUploadImage = () => {
    setMessage((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleClearUploadVideo = () => {
    setMessage((prev) => ({ ...prev, videoUrl: "" }));
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setMessage((prev) => ({ ...prev, text: value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    // this message will be sne to the backend
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new-message", {
          sender: user?._id,
          receiver: userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id
        });

        // empty the message after we have sent it
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: ""
        });
      }
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover"
    >
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              userId={dataUser?._id}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className="-my-2 text-sm">
              {dataUser?.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer hover:text-primary">
            <HiDotsVertical />
          </button>
        </div>
      </header>

      {/* ***  show all message  **** */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-40">
        {/* All messages show here */}
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {allMessage.map((msg, index) => (
            <div
              className={` p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                user?._id === msg?.msgByUserId
                  ? "ml-auto bg-teal-100"
                  : "bg-white"
              }`}
            >
              <div className="w-full">
                {msg?.imageUrl && (
                  <img
                    src={msg?.imageUrl}
                    className="w-full h-full object-scale-down"
                    alt="pic"
                  />
                )}

                {msg?.videoUrl && (
                  <video
                    src={msg?.videoUrl}
                    className="w-full h-full object-scale-down"
                    controls
                    muted
                    autoPlay
                  />
                )}
              </div>
              <p className="px">{msg?.text}</p>
              <p className="text-xs ml-auto w-fit">
                {moment(msg.createdAt).format("hh:mm")}
              </p>
            </div>
          ))}
        </div>

        {/* upload image display */}
        {message?.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadImage}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message?.imageUrl}
                alt="message pic"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}
        {/* upload video display */}
        {message?.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadVideo}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message?.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              ></video>
            </div>
          </div>
        )}
        {loading && (
          <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

      {/* ***  send message  *** */}
      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative">
          <button
            onClick={handleUploadImageVideoOpen}
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white"
          >
            <FaPlus size={20} />
          </button>
          {/* video and image */}
          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        {/* ** input box ** */}
        <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type your message..."
            className="py-1 px-4 outline-none w-full h-full"
            value={message?.text}
            onChange={handleOnChange}
          />
          <button className="text-primary hover:text-secondary">
            <IoMdSend size={25} />
          </button>
        </form>
      </section>
    </div>
  );
}

export default MessagePage;
