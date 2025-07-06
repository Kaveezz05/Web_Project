import React, { useState, memo } from "react";
import { FaUser, FaLock, FaCog } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const InputWithIcon = memo(({ icon: Icon, ...props }) => (
  <div className="relative">
    <input
      {...props}
      className="w-full pr-10 p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
    />
    <Icon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
));

const Login = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [action, setAction] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [logoutPasswordInput, setLogoutPasswordInput] = useState("");
  const [logoutError, setLogoutError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (loginUsername && loginPassword) {
      setIsAuthenticated(true);
      setShowLogin(false);
      setShowSettingsDropdown(false);
      navigate("/");
    } else {
      alert("Please enter username and password");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Registration is currently not implemented.");
    setAction("login");
  };

  const openLogoutPrompt = () => {
    setLogoutPasswordInput("");
    setLogoutError("");
    setShowLogoutPrompt(true);
    setShowSettingsDropdown(false);
  };

  const confirmLogout = () => {
    if (logoutPasswordInput === loginPassword) {
      setIsAuthenticated(false);
      setShowLogoutPrompt(false);
      setLoginUsername("");
      setLoginPassword("");
      setLogoutPasswordInput("");
      setLogoutError("");
      navigate("/");
    } else {
      setLogoutError("Incorrect password. Please try again.");
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <button
          onClick={() => setShowLogin(true)}
          className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Login
        </button>
      ) : (
        <div className="relative inline-block">
          <FaCog
            className="text-white w-6 h-6 cursor-pointer hover:text-primary"
            onClick={() => setShowSettingsDropdown((prev) => !prev)}
            title="Settings"
          />
          {showSettingsDropdown && (
            <div className="absolute right-0 mt-2 w-28 bg-gray-800 rounded shadow-lg z-50 p-2 text-white">
              <button
                onClick={openLogoutPrompt}
                className="block w-full text-left px-4 py-2 text-white hover:bg-red-600 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Login/Register Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-gray-900 rounded-xl shadow-lg p-6 text-white">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-3xl font-bold text-gray-400 hover:text-red-500"
              aria-label="Close Login Modal"
            >
              &times;
            </button>

            <h1 className="text-4xl font-extrabold mb-8 select-none">
              <span className="text-red-600">V</span>istaLite
            </h1>

            <form
              onSubmit={action === "login" ? handleLogin : handleRegister}
              className="space-y-6"
            >
              {action === "login" ? (
                <>
                  <InputWithIcon
                    icon={FaUser}
                    type="text"
                    placeholder="Username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                  />
                  <InputWithIcon
                    icon={FaLock}
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary hover:bg-primary-dull transition rounded font-semibold"
                  >
                    Sign In
                  </button>
                  <p className="text-center text-sm mt-4">
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAction("register")}
                      className="text-primary underline"
                    >
                      Sign Up
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <InputWithIcon
                    icon={MdEmail}
                    type="email"
                    placeholder="Email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                  <InputWithIcon
                    icon={FaUser}
                    type="text"
                    placeholder="Username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                  />
                  <InputWithIcon
                    icon={FaLock}
                    type="password"
                    placeholder="Password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary hover:bg-primary-dull transition rounded font-semibold"
                  >
                    Sign Up
                  </button>
                  <p className="text-center text-sm mt-4">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAction("login")}
                      className="text-primary underline"
                    >
                      Sign In
                    </button>
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Logout Password Prompt Modal */}
      {showLogoutPrompt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
          <div className="bg-gray-900 rounded-xl p-6 w-80 shadow-lg text-white flex flex-col gap-5">
            <h3 className="text-lg font-semibold text-center">Confirm Logout</h3>
            <input
              type="password"
              placeholder="Enter your password"
              value={logoutPasswordInput}
              onChange={(e) => setLogoutPasswordInput(e.target.value)}
              className="p-3 rounded bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            {logoutError && (
              <p className="text-red-400 text-center text-sm">{logoutError}</p>
            )}
            <div className="flex justify-end gap-4 mt-3">
              <button
                onClick={() => {
                  setShowLogoutPrompt(false);
                  setLogoutError("");
                  setLogoutPasswordInput("");
                }}
                className="px-5 py-2 rounded bg-gray-700 hover:bg-gray-600 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 transition font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
 