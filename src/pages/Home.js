import axios from "axios";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser
} from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import logo from "../assets/logo.png";
import io from "socket.io-client";

function Home() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // we will fetch the logged in user details
  const fetchUserDetails = useCallback(async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true
      });

      // if we can not get token, this is what will be return from the /user-details endpoint
      if (response?.data?.data?.logout) {
        dispatch(logout);
        navigate("/email");
      }

      dispatch(setUser(response?.data?.data));

      console.log("current user details", response);
    } catch (err) {
      console.log("HOME ERRORO FTECH USER: ", err);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // *** Socket Connection ******
  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token")
      }
    });

    socketConnection.on("onlineUser", (data) => {
      console.log("connected online user: ", data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);

  console.log("LOGGED IN USER IN HOME.js : ", user);

  const basePath = location.pathname === "/";
  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      {/* message components */}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      {/* for Mobile version this will be hidden. this will only show for index ("/") or "<App/> component" */}
      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <div>
          <img src={logo} width={250} alt="logo" />
        </div>
        <p className="text-lg mt-2 text-slate-500">
          Select user to send message
        </p>
      </div>
    </div>
  );
}

export default Home;
