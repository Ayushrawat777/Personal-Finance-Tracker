import { useEffect } from "react";import * as React from "react";
import "./styles.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { UserOutlined } from "@ant-design/icons";
const Header = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  const logoutFnc = () => {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Logged Out Successfully!");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  };
  return (
    <div className="navbar">
      <p className="logo">Financely</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {user.photoURL ? (
            <img
              src={user.photoURL}
              style={{ borderRadius: "50%", height: "2rem", width: "2rem" }}
            />
          ) : (
            <UserOutlined
              style={{ borderRadius: "50%", height: "2rem", width: "2rem" }}
            />
          )}
          <p className="logo link" onClick={logoutFnc}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
};

export default Header;
