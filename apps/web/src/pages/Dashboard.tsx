import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-offWhite">
      <h1 className="text-4xl font-bold text-teal-800">Welcome 🎉</h1>
    </div>
  );
}
