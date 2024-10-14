import { useCallback, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
import { IoClose } from "react-icons/io5";

function SearchUser({ onClose }) {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  //   const handleSearchUser = async (e) => {};

  const handleSearchUser = useCallback(async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`;
    try {
      setLoading(true);
      const response = await axios.post(URL, { search: search });
      console.log("RESPONSE searcUser : ", response);

      if (response?.data?.success) {
        setSearchUser(response.data.data);
      }
    } catch (err) {
      console.log("err from search user in SearchUser.js : ", err);
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    handleSearchUser();
  }, [handleSearchUser]);
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10">
        {/* input search user */}
        <div className="bg-white rounded h-14 overflow-hidden flex flex-1">
          <input
            type="text"
            className="w-full outline-none py-1 h-full px-4"
            placeholder="Search User by name, email..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="h-14 w-14 flex justify-center items-center">
            <IoSearchOutline size={25} />
          </div>
        </div>

        {/* display search user */}
        <div className="bg-white mt-2 w-full p-4 rounded">
          {/* no user found */}
          {searchUser.length === 0 && !loading && (
            <p className="text-center text-slate-500">no user found</p>
          )}
          {loading && (
            <div className="flex justify-center items-center">
              <Loading />
            </div>
          )}
          {searchUser.length > 0 &&
            !loading &&
            searchUser.map((user, index) => (
              <UserSearchCard user={user} onClose={onClose} key={user?._id} />
            ))}
        </div>
      </div>
      <div
        className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white"
        onClick={onClose}
      >
        <button>
          <IoClose size={25} />
        </button>
      </div>
    </div>
  );
}

export default SearchUser;
