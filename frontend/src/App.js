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
import axios from "axios";
import "./app.css";
import { format } from "timeago.js";
import Login from "./components/Login";
import Register from "./components/Register";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const myStorage = window.localStorage;

function App() {
  const [mapStyle, setMapStyle] = useState("light");
  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [rating, setRating] = useState(1);

  const [currentUsername, setCurrentUsername] = useState(
    myStorage.getItem("user")
  );
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const mapStyles = {
    default: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors",
    },
    dark: {
      url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors, CyclOSM",
    },
    light: {
      url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors, Humanitarian",
    },
    voyager: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors, OpenTopoMap",
    },
  };

  // Load real pins from the backend on first load
  useEffect(() => {
    const fetchPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.error("Error fetching pins:", err);
      }
    };
    fetchPins();
  }, []);

  const handleAddClick = (e) => {
    if (!currentUsername) {
      alert("Please login first to add a pin!");
      return;
    }
    setNewPlace({
      lat: e.latlng.lat,
      long: e.latlng.lng,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
      setTitle("");
      setDesc("");
      setRating(1);
    } catch (err) {
      console.error("Error saving pin:", err);
      alert("Failed to save pin. Please try again.");
    }
  };

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
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

        {pins.map((pin) => (
          <Marker key={pin._id} position={[pin.lat, pin.long]}>
            <Popup closeButton={true} autoClose={true} closeOnClick={false}>
              <div
                style={{
                  minWidth: "220px",
                  padding: "10px",
                  fontFamily: "Arial, sans-serif",
                  color: "#222",
                }}
              >
                <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
                  {pin.title}
                </h3>
                <p style={{ margin: "4px 0", fontSize: "14px" }}>
                  {pin.desc}
                </p>
                <p
                  style={{
                    margin: "6px 0",
                    fontSize: "14px",
                    color: "#ff9800",
                  }}
                >
                  {"⭐".repeat(pin.rating)}
                </p>
                <hr style={{ margin: "8px 0" }} />
                <p
                  style={{ margin: "3px 0", fontSize: "12px", color: "#999" }}
                >
                  created by <strong>{pin.username}</strong>{" "}
                  {format(pin.createdAt)}
                </p>
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
        {currentUsername ? (
          <button className="button logout" onClick={handleLogout}>
            Log out ({currentUsername})
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

      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          setCurrentUsername={setCurrentUsername}
          myStorage={myStorage}
        />
      )}
    </div>
  );
}

export default App;
