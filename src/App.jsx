import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Theory from "./pages/Theory";
import Challenge from "./pages/Challenge";
import Teacher from "./pages/Teacher";
import TeacherGroup from "./pages/TeacherGroup";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const { user, userData, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user) return <Login />;

  if (userData?.rol === "professor") {
    return (
    <BrowserRouter>
      <Routes>
        <Route path="/teacher" element={<Teacher userData={userData} user={user} />} />
        <Route path="/teacher/group/:groupId" element={<TeacherGroup />} />
        <Route path="*" element={<Navigate to="/teacher" />} />
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