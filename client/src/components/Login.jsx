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
  const [loading, setLoading] = useState(false);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!loginUsername.trim() || !loginPassword.trim()) {
      alert("Please enter username and password");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost/vistalite/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error || !data.success) {
        alert(data.error || "Login failed");
        setLoading(false);
        return;
      }

      alert("Login successful");
      setIsAuthenticated(true);
      setShowLogin(false);
      setLoginUsername("");
      setLoginPassword("");
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Network error. Make sure XAMPP is running and login.php is accessible.");
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!regEmail.trim() || !regUsername.trim() || !regPassword.trim()) {
      alert("Please fill all registration fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost/vistalite/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail.trim(),
          username: regUsername.trim(),
          password: regPassword.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error || !data.success) {
        alert(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      alert("Registration successful");
      setAction("login");
      setRegEmail("");
      setRegUsername("");
      setRegPassword("");
      setLoading(false);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Network error. Make sure XAMPP is running and register.php is accessible.");
      setLoading(false);
    }
  };

  const confirmLogout = () => {
    setIsAuthenticated(false);
    setShowLogoutPrompt(false);
    navigate("/");
  };

  return (
    <>
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
                onClick={() => {
                  setShowSettingsDropdown(false);
                  setShowLogoutPrompt(true);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-[#2978B5] rounded transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm min-h-screen">
          <div className="relative w-full max-w-md bg-black/80 border border-[#303D5A] rounded-2xl shadow-xl p-8 text-[#E5E9F0] m-4">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-3xl font-bold text-[#A3AED0] hover:text-[#2978B5] transition"
              aria-label="Close Login Modal"
              type="button"
            >
              &times;
            </button>

            <h1 className="text-5xl font-extrabold mb-8 tracking-wide">
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
                    disabled={loading}
                  />
                  <InputWithIcon
                    icon={FaLock}
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#2978B5] hover:bg-[#4A9EDE] transition rounded-full font-semibold disabled:opacity-50"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                  <p className="text-center text-sm mt-4 text-[#A3AED0]">
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAction("register")}
                      className="text-[#2978B5] underline hover:text-[#4A9EDE]"
                      disabled={loading}
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
                    disabled={loading}
                  />
                  <InputWithIcon
                    icon={FaUser}
                    type="text"
                    placeholder="Username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <InputWithIcon
                    icon={FaLock}
                    type="password"
                    placeholder="Password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#2978B5] hover:bg-[#4A9EDE] transition rounded-full font-semibold disabled:opacity-50"
                  >
                    {loading ? "Signing Up..." : "Sign Up"}
                  </button>
                  <p className="text-center text-sm mt-4 text-[#A3AED0]">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAction("login")}
                      className="text-[#2978B5] underline hover:text-[#4A9EDE]"
                      disabled={loading}
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

      {showLogoutPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm min-h-screen">
          <div className="w-full max-w-md bg-black/80 border border-[#303D5A] rounded-2xl shadow-xl p-8 text-[#E5E9F0] m-4">
            <h2 className="text-2xl mb-6 font-semibold">Confirm Logout</h2>
            <p className="mb-4">Are you sure you want to logout?</p>
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