import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";
import { getUserProfileByRouteId } from "../services/userService";
import UserView from "../components/UserView";
import UserNotFound from "./UserNotFound";

const PublicUserPage = () => {
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const { slug: routeId } = useParams(); // 👈 get routeId from URL

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await getUserProfileByRouteId(routeId);
      if (error || !data) setNotFound(true);
      else setUser(data);
      setLoading(false);
    };
    fetchUser();
  }, [routeId]);

  if (loading) return <div className="text-center py-10">
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <ThreeDot variant="pulsate" color="#3194cc" size="large" text="" textColor="" />
    </div>
  </div>;
  if (notFound) return <UserNotFound />;

  return <UserView user={user} />;
};

export default PublicUserPage;
