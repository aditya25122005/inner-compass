import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Dashboard from "./components/pages/dashboard";
import Settings from "./components/pages/Settings";
import YourActivities from "./components/pages/YourActivities";
import ChatAi from "./components/pages/ChatAi";
import HelpDesk from "./components/pages/HelpDesk";
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav className="navbar">
          <h2>Abe Tu mujhe mental app mat bol tu khudko ment al bol</h2>

          {/* Avatar on Right */}
          <div
            className="avatar-container"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <img
              src="https://media.licdn.com/dms/image/v2/D5603AQGN1CX_mqgqSA/profile-displayphoto-crop_800_800/B56Zi3yW.DG0AI-/0/1755430091583?e=1759968000&v=beta&t=7fUvkSE9K0_u2bxIQ--FXzeeO9TK6zpGp0l7Jf2rleg" // Dummy avatar, replace with user pic
              alt="User Avatar"
              className="avatar"
            />
          </div>
        </nav>

        {/* Side Menu */}
        <div className={`side-menu ${menuOpen ? "open" : ""}`}>
          <button className="close-btn" onClick={() => setMenuOpen(false)}>
            ✖
          </button>
          <ul>
            <li>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/your-activities" onClick={() => setMenuOpen(false)}>
                Your Activities
              </Link>
            </li>
            <li>
              <Link to="/chatai" onClick={() => setMenuOpen(false)}>
                ChatAi
              </Link>
            </li>
            <li>
              <Link to="/settings" onClick={() => setMenuOpen(false)}>
                Settings
              </Link>
            </li>
            <li>
              <Link to="/help-desk" onClick={() => setMenuOpen(false)}>
                Help Desk
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/your-activities" element={<YourActivities />} />
            <Route path="/chatai" element={<ChatAi />} />
            <Route path="/help-desk" element={<HelpDesk />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
