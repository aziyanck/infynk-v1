import { useEffect, useState } from "react";
import { getUserProfileByRouteId } from "../services/userService";
import UserView from "../UserView";

const PublicUserPage = () => {
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const routeId = "if001"; // hardcoded for now

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await getUserProfileByRouteId(routeId);
      if (error || !data) setNotFound(true);
      else setUser(data);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (notFound) return <div className="text-center py-10 text-red-500">User not found</div>;
  console.log('User:', user);

  return <UserView user={user} />;
};

export default PublicUserPage;
