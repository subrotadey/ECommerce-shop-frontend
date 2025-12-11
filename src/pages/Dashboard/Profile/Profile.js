import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../contexts/AuthProvider";
import avatar from "../../../assets/images/profile.svg"

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetch(`https://e-learning-server-hazel.vercel.app/users/role/${user.email}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
        .then(res => res.json())
        .then(data => setRole(data.role))
    }
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6  shadow-xl rounded-2xl border">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Profile Picture */}
        <div className="avatar mx-auto">
          <div className="w-32 h-32 rounded-full border-4 border-accent shadow-md object-cover">
            <img
              src={
                user?.photoURL || avatar
              } alt="profile" />
          </div>

        </div>

        {/* Profile Details */}
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-semibold text-primary">👤 {user?.displayName || "Unnamed User"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base-content">
            <p>
              <span className="font-semibold">📧 Email:</span><br />
              {user?.email}
            </p>
            <p>
              <span className="font-semibold">🆔 UID:</span><br />
              {user?.uid}
            </p>
            <p>
              <span className="font-semibold">🔑 Role:</span><br />
              {role || "N/A"}
            </p>
            <p>
              <span className="font-semibold">📅 Joined:</span><br />
              {user?.metadata?.creationTime || "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
