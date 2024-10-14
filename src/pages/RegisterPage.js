import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";

function RegisterPage() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  });

  const [uploadPhoto, setUploadPhoto] = useState(null);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    const uploadPhoto = await uploadFile(file);
    console.log("UploadPhoto ", uploadPhoto);
    setUploadPhoto(file);

    setData((prev) => ({ ...prev, profile_pic: uploadPhoto?.url }));
  };

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("DATA ", data);
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);
      console.log("response : ", response);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: ""
        });

        navigate("/email");
      }
    } catch (err) {
      console.log("ERROR :", err);
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md   rounded overflow-hidden p-4 mx-auto">
        <h3>Welcome to Chat app!</h3>

        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password :</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">
              Photo :
              <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer group/close">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {uploadPhoto?.name
                    ? uploadPhoto?.name
                    : "Upload profile photo"}
                </p>
                <button
                  className="text-lg ml-2 hover:text-red-600 group-hover/close:opacity-100 opacity-0"
                  onClick={handleClearUploadPhoto}
                >
                  {uploadPhoto?.name && <IoClose />}
                </button>
              </div>
            </label>

            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              onChange={handleUploadPhoto}
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
            Register
          </button>
        </form>

        <p className="my-3 text-center">
          Already have account ?{" "}
          <Link to={"/email"} className="hover:text-primary font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
