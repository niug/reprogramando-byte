import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Theory from "./pages/Theory";
import Challenge from "./pages/Challenge";
import Teacher from "./pages/Teacher";

export default function App() {
  const { user, userData, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-white text-center">
        <div className="text-6xl mb-4 animate-bounce">🤖</div>
        <p>Carregant CodeQuest...</p>
      </div>
    </div>
  );

  if (!user) return <Login />;

  if (userData?.rol === "professor") {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Teacher userData={userData} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard userData={userData} user={user} />} />
        <Route path="/theory/:blockId" element={<Theory />} />
        <Route path="/challenge/:blockId/:challengeIndex" element={<Challenge user={user} userData={userData} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}