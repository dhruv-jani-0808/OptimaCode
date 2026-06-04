import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Problems from "./pages/Problems";
import Workspace from "./pages/Workspace";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-[#0f172a] text-slate-100">
                    <Navbar />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
                        <Route
                            path="/problems"
                            element={
                                <ProtectedRoute>
                                    <Problems />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/workspace/:problemId"
                            element={
                                <ProtectedRoute>
                                    <Workspace />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Catch-All */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;