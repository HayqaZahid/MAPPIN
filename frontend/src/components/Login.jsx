import { Room, Cancel, Lock, Person } from '@mui/icons-material';
import axios from "axios";
import { useRef, useState } from "react";
import "./login.css";

export default function Login({ setShowLogin, setCurrentUsername, myStorage }) {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post("/users/login", user);
      setCurrentUsername(res.data.username);
      myStorage.setItem("user", res.data.username);
      setShowLogin(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room className="logoIcon" />
        <span className="logoText">LamaPin</span>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <Person className="inputIcon" />
          <input autoFocus placeholder="Username" ref={usernameRef} />
        </div>
        <div className="inputGroup">
          <Lock className="inputIcon" />
          <input type="password" min="6" placeholder="Password" ref={passwordRef} />
        </div>
        <button className="loginBtn" type="submit">Login</button>
        {error && <span className="failure">⚠ Something went wrong!</span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}
