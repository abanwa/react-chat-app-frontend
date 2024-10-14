import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
// import { PiUserCircle } from "react-icons/pi";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/userSlice";

function CheckPasswordPage() {
  const [data, setData] = useState({
    password: ""
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleOnChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("DATA ", data);
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;
    console.log("URL PASSWORD :", URL);

    try {
      const response = await axios({
        method: "POST",
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password
        },
        withCredentials: true
      });
      console.log("response : ", response);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        // we will dispatch this to our redux
        // the token is the payload
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setData({
          password: ""
        });

        navigate("/");
      }
    } catch (err) {
      console.log("ERROR PASSWORD_PAGE :", err);
      toast.error(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, [location?.state?.name, navigate]);

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col">
          {/* <PiUserCircle size={80} /> */}
          <Avatar
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className="font-semibold text-lg mt-1">
            {location?.state?.name}
          </h2>
        </div>
        <h3>Welcome to Chat app!</h3>

        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password :</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your Password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
            Login
          </button>
        </form>

        <p className="my-3 text-center">
          New User ?{" "}
          <Link
            to={"/forgot-password"}
            className="hover:text-primary font-semibold"
          >
            Forgot password ?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CheckPasswordPage;
