import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./app.css";
import { format } from "timeago.js";
 
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function App() {
  const [mapStyle, setMapStyle] = useState("light");
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [rating, setRating] = useState(1);
  const [username, setUsername] = useState("Hayqa");

  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
 
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
 
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const mapStyles = {
    default: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors",
    },
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; OpenStreetMap &copy; CartoDB",
    },
    light: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; OpenStreetMap &copy; CartoDB",
    },
    voyager: {
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      attribution: "&copy; OpenStreetMap &copy; CartoDB",
    },
  };

  const locations = [
    {
      name: "Islamabad",
      position: [33.6844, 73.0479],
      description: "Capital city of Pakistan",
      population: "1.18 million",
      established: "1960",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      name: "Karachi",
      position: [24.8607, 67.0011],
      description: "Largest city and economic hub",
      population: "14.9 million",
      established: "1729",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Lahore",
      position: [31.5204, 74.3587],
      description: "Cultural capital of Pakistan",
      population: "11.1 million",
      established: "1000 AD",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Rawalpindi",
      position: [33.5651, 73.0169],
      description: "Twin city of Islamabad",
      population: "2.1 million",
      established: "1493",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      name: "Wah Cantt",
      position: [33.2311, 53.0124],
      description: "city with highest literacy rate",
      population: "0.1 million",
      established: "1200",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    },
  ];

  const handleAddClick = (e) => {
    setNewPlace({
      lat: e.latlng.lat,
      long: e.latlng.lng,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPin = {
      username: username,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    console.log("Pin added:", newPin);

    setNewPlace(null);
    setTitle("");
    setDesc("");
    setRating(1);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    console.log("Logged out!");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      username: registerUsername,
      password: registerPassword,
    };
 
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find((u) => u.username === newUser.username);
    if (exists) {
      alert("Username already exists!");
      return;
    }
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    setShowRegister(false);
    alert("User registered successfully!");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const user = {
      username: loginUsername,
      password: loginPassword,
    };

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(
      (u) => u.username === user.username && u.password === user.password
    );

    if (found) {
      setCurrentUser(found.username);
      localStorage.setItem("currentUser", found.username);
      setShowLogin(false);
      alert("Logged in successfully!");
    } else {
      alert("Invalid credentials!");
    }
  };

  const MapEvents = () => {
    useMapEvents({
      dblclick: handleAddClick,
    });
    return null;
  };

  return (
    <div
      className="App"
      style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}
    >
      <h1 style={{ margin: "10px 0" }}> Map App</h1>
 
      <div style={{ margin: "10px 0" }}>
        <button onClick={() => setMapStyle("default")}>Default</button>
        <button onClick={() => setMapStyle("dark")}>Dark</button>
        <button onClick={() => setMapStyle("light")}>Light</button>
        <button onClick={() => setMapStyle("voyager")}>Voyager</button>
      </div>

      <MapContainer
        center={[30.3753, 69.3451]}
        zoom={6}
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <MapEvents />
        <TileLayer
          url={mapStyles[mapStyle].url}
          attribution={mapStyles[mapStyle].attribution}
        />
 
        {locations.map((location, index) => (
          <Marker key={index} position={location.position}>
            <Popup closeButton={true} autoClose={true} closeOnClick={false}>
              <div
                style={{
                  minWidth: "220px",
                  padding: "10px",
                  fontFamily: "Arial, sans-serif",
                  color: "#222",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  {location.name}
                </h3>
                <p style={{ margin: "4px 0", fontSize: "14px" }}>
                  {location.description}
                </p>
                <p style={{ margin: "4px 0", fontSize: "13px" }}>
                  <strong>Population:</strong> {location.population}
                </p>
                <p style={{ margin: "4px 0", fontSize: "13px" }}>
                  <strong>Established:</strong> {location.established}
                </p>
                <p
                  style={{
                    margin: "6px 0",
                    fontSize: "14px",
                    color: "#ff9800",
                  }}
                >
                  ⭐⭐⭐⭐⭐
                </p>
                <hr style={{ margin: "8px 0" }} />
                <p
                  style={{ margin: "3px 0", fontSize: "12px", color: "#666" }}
                >
                  📍 Coordinates: {location.position[0].toFixed(4)},{" "}
                  {location.position[1].toFixed(4)}
                </p>
                <p
                  style={{ margin: "3px 0", fontSize: "12px", color: "#999" }}
                >
                  created by <strong>Hayqa</strong> {format(location.createdAt)}
                </p>
                <button
                  style={{
                    marginTop: "6px",
                    padding: "6px 12px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                  onClick={() => alert(`More info about ${location.name}!`)}
                >
                  Learn More
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {newPlace && (
          <Marker position={[newPlace.lat, newPlace.long]}>
            <Popup
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
            >
              <div className="form-container">
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                    value={desc}
                  />
                  <label>Rating</label>
                  <select
                    onChange={(e) => setRating(e.target.value)}
                    value={rating}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
 
      <div className="buttons-container">
        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Log out ({currentUser})
          </button>
        ) : (
          <div className="auth-buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
      </div>
 
      {showRegister && (
        <div className="register-popup">
          <form className="register-form" onSubmit={handleRegisterSubmit}>
            <label>Username</label>
            <input
              type="text"
              placeholder="username"
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <button type="submit">Register</button>
           
            <button
              type="button"
              onClick={() => setShowRegister(false)}
              className="close-popup"
            >
              X
            </button>
          </form>
        </div>
      )}

      {showLogin && (
        <div className="login-popup">
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <label>Username</label>
            <input
              type="text"
              placeholder="username"
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button type="submit">Login</button> 
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="close-popup"
            >
              X
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
