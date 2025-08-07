import React, { useState, memo } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const { user, login, logout } = useAuth();
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
      const formData = new URLSearchParams();
      formData.append("username", loginUsername.trim());
      formData.append("password", loginPassword.trim());

      const res = await fetch("http://localhost/vistalite/login.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      login({ username: data.username });
      setShowLogin(false);
      setLoading(false);
      setShowWelcomePopup(true);
      setTimeout(() => setShowWelcomePopup(false), 3000);

      const username = data.username.toLowerCase();
      if (username === "admin") navigate("/admin");
      else if (username === "cashier") navigate("/cashier");
      else navigate("/");
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
      const formData = new URLSearchParams();
      formData.append("email", regEmail.trim());
      formData.append("username", regUsername.trim());
      formData.append("password", regPassword.trim());

      const res = await fetch("http://localhost/vistalite/register.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      alert("🎉 Registration successful!");
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
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  return (
    <>
      {!user ? (
        <button
          onClick={() => setShowLogin(true)}
          className="px-5 py-2 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] transition rounded-full font-semibold text-black"
        >
          Login
        </button>
      ) : (
        <div className="relative inline-flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-black/80 border border-[#303D5A] rounded-full px-3 py-1 text-[#E5E9F0] text-sm font-semibold">
            <FaUser className="w-5 h-5 text-[#2978B5]" />
            <span>{user.username}</span>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="px-5 py-2 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] transition rounded-full font-semibold text-black"
          >
            Logout
          </button>
        </div>
      )}

      {/* ✅ Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm min-h-screen">
          <div className="relative w-full max-w-md bg-black/80 border border-[#303D5A] rounded-2xl shadow-xl p-8 text-[#E5E9F0] m-4">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-3xl font-bold text-[#A3AED0] hover:text-[#2978B5]"
            >
              &times;
            </button>

            <h1 className="text-5xl font-extrabold mb-8 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA]">
              Vistalite
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
                    className="w-full py-3 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] rounded-full font-semibold text-black"
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
                    className="w-full py-3 bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] rounded-full font-semibold text-black"
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

      {/* ✅ Logout Modal (now styled like login modal) */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm min-h-screen">
          <div className="relative w-full max-w-md bg-black/80 border border-[#303D5A] rounded-2xl shadow-xl p-8 text-[#E5E9F0] m-4">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute top-4 right-4 text-3xl font-bold text-[#A3AED0] hover:text-[#2978B5]"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">Confirm Logout</h2>
            <p className="text-sm text-[#A3AED0] text-center mb-6">Are you sure you want to logout?</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-full bg-[#303D5A] hover:bg-[#4A9EDE] text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black font-semibold shadow-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showWelcomePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black px-6 py-2 rounded-full shadow-lg text-sm font-medium animate-drop-fade">
            👋 Welcome, {loginUsername}!
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
