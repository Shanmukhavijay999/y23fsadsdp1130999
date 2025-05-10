import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = () => {
    const [isSignup, setIsSignup] = useState(true);
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [token, setToken] = useState(localStorage.getItem("jwt") || null);
    const [username, setUsername] = useState(localStorage.getItem("username") || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate(); // Initialize navigation

    useEffect(() => {
        setUsername(localStorage.getItem("username")); // Sync username state with local storage
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isSignup ? "/auth/register" : "/auth/login";
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`http://localhost:9090${endpoint}`, formData);
            if (!isSignup) {
                localStorage.setItem("jwt", response.data.token);  // Store JWT token
                localStorage.setItem("username", formData.username);  // Store username
                setToken(response.data.token);
                setUsername(formData.username);
                navigate("/cars"); // Redirect to project page after login
            }

            alert(`${isSignup ? "User registered successfully!" : "Login successful!"}`);
        } catch (error) {
            setError(error.response?.data?.message || "Server error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("username");
        setToken(null);
        setUsername(null);
        navigate("/auth"); // Redirect to login page after logout
        alert("Logged out successfully!");
    };

    return (
        <div style={styles.container}>
            <div className="card" style={styles.card}>
                {token ? (
                    <>
                        <h2 style={styles.title}>Welcome, {username}!</h2>
                        <button onClick={handleLogout} style={styles.button}>Logout</button>
                    </>
                ) : (
                    <>
                        <h2 style={styles.title}>{isSignup ? "Sign Up" : "Login"}</h2>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <input type="text" name="username" placeholder="Username" onChange={handleChange} required style={styles.input} />
                            <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={styles.input} />
                            {error && <p style={styles.error}>{error}</p>}
                            <button type="submit" style={styles.button} disabled={loading}>
                                {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
                            </button>
                        </form>
                        <button onClick={() => setIsSignup(!isSignup)} style={styles.toggleButton}>
                            {isSignup ? "Already have an account? Login" : "New here? Sign Up"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

// Styling
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right, #007BFF, #6610f2)",
    },
    card: {
        backgroundColor: "#fff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
        textAlign: "center",
        width: "350px",
    },
    title: {
        marginBottom: "20px",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    input: {
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "16px",
    },
    button: {
        padding: "12px",
        backgroundColor: "#007BFF",
        color: "#fff",
        fontSize: "16px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
    },
    toggleButton: {
        marginTop: "15px",
        background: "none",
        border: "none",
        color: "#007BFF",
        cursor: "pointer",
        fontSize: "14px",
        textDecoration: "underline",
    },
    error: {
        color: "red",
        fontSize: "14px",
        textAlign: "center",
    }
};

export default Auth;