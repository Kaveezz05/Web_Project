import React, { useState, memo } from "react";
import { FaUser, FaLock, FaCog } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const InputWithIcon = memo(({ icon: Icon, ...props }) => (
  <div className="relative">
    <input
      {...props}
      className="w-full pr-10 p-3 rounded-lg bg-black/80 text-[#E5E9F0] placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#2978B5] transition"
    />
    <Icon className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3AED0] pointer-events-none" />
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
      {/* Login button or settings cog */}
      {!isAuthenticated ? (
        <button
          onClick={() => setShowLogin(true)}
          className="px-5 py-2 bg-[#2978B5] hover:bg-[#4A9EDE] transition rounded-full font-semibold text-[#E5E9F0]"
        >
          Login
        </button>
      ) : (
        <div className="relative inline-block">
          <FaCog
            className="text-[#E5E9F0] w-6 h-6 cursor-pointer hover:text-[#2978B5]"
            onClick={() => setShowSettingsDropdown((prev) => !prev)}
            title="Settings"
          />
          {showSettingsDropdown && (
            <div className="absolute right-0 mt-2 w-28 bg-black/80 backdrop-blur-md rounded-lg shadow-lg z-50 p-2 text-[#E5E9F0] border border-[#303D5A]">
              <button
                onClick={openLogoutPrompt}
                className="block w-full text-left px-4 py-2 hover:bg-[#2978B5] rounded transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Login/Register Modal */}
      {showLogin && (
        <div
          className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/90 backdrop-blur-sm overflow-auto min-h-screen
          "
        >
          <div className="relative w-full max-w-md bg-black/80 border border-[#303D5A] rounded-2xl shadow-xl p-8 text-[#E5E9F0] m-4">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-3xl font-bold text-[#A3AED0] hover:text-[#2978B5] transition"
              aria-label="Close Login Modal"
              type="button"
            >
              &times;
            </button>

            <h1 className="text-5xl font-extrabold mb-8 select-none tracking-wide">
              <span className="text-[#2978B5]">V</span>istaLite
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
                    autoFocus
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
                    className="w-full py-3 bg-[#2978B5] hover:bg-[#4A9EDE] transition rounded-full font-semibold"
                  >
                    Sign In
                  </button>
                  <p className="text-center text-sm mt-4 text-[#A3AED0]">
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAction("register")}
                      className="text-[#2978B5] underline hover:text-[#4A9EDE]"
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
                    autoFocus
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
                    className="w-full py-3 bg-[#2978B5] hover:bg-[#4A9EDE] transition rounded-full font-semibold"
                  >
                    Sign Up
                  </button>
                  <p className="text-center text-sm mt-4 text-[#A3AED0]">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAction("login")}
                      className="text-[#2978B5] underline hover:text-[#4A9EDE]"
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

      {/* Logout Confirmation Modal */}
      {showLogoutPrompt && (
        <div
          className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/90 backdrop-blur-sm overflow-auto min-h-screen
          "
        >
          <div className="relative w-full max-w-md bg-black/80 border border-[#303D5A] rounded-2xl shadow-xl p-8 text-[#E5E9F0] m-4">
            <h2 className="text-2xl mb-6 font-semibold">Confirm Logout</h2>
            <p className="mb-4">Please enter your password to logout:</p>
            <input
              type="password"
              value={logoutPasswordInput}
              onChange={(e) => setLogoutPasswordInput(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/80 text-[#E5E9F0] border border-[#4A9EDE] focus:outline-none focus:ring-2 focus:ring-[#2978B5] mb-4"
            />
            {logoutError && (
              <p className="text-red-500 mb-4">{logoutError}</p>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutPrompt(false)}
                className="px-4 py-2 rounded bg-[#303D5A] hover:bg-[#4A9EDE] transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded bg-[#2978B5] hover:bg-[#4A9EDE] transition"
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
