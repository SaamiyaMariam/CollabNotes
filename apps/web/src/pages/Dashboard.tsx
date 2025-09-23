import { gql, useQuery } from "@apollo/client";
import { Navigate } from "react-router-dom";

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      displayName
    }
  }
`;

export default function Dashboard() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  const { data, loading, error } = useQuery(ME_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching user</p>;

  const username = data?.me?.displayName ?? "User";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-offWhite">
      <h1 className="text-4xl font-bold text-teal-800">
        Hi {username}! 👋
      </h1>
      <p className="mt-4 text-xl text-gray-700">
        Welcome to CollabNotes 🎉
      </p>
    </div>
  );
}
