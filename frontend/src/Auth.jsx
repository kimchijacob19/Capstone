import { useState } from "react";

function Auth({ onAuthSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:3000/api/auth/${isLogin ? "login" : "register"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isLogin
              ? { username, password }
              : {
                  username,
                  password,
                  name,
                  email,
                }
          ),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      // saved token and user profile
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        onAuthSuccess(data.token);
      } else {
        alert("Ready to onboard, please log in!");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div>
              <label>Name: </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Email: </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div>
          <label>Username: </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={() => setIsLogin(!isLogin)}
        style={{ marginTop: "1rem" }}
      >
        Switch to {isLogin ? "Register" : "Login"}
      </button>
    </div>
  );
}

export default Auth;
