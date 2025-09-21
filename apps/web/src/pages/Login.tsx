import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LOGIN_MUTATION = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      accessToken
      refreshToken
    }
  }
`;

interface LoginResponse {
  login: {
    accessToken: string;
    refreshToken: string;
  };
}

interface LoginVars {
  data: {
    email: string;
    password: string;
  };
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [login, { loading, error }] = useMutation<LoginResponse, LoginVars>(
    LOGIN_MUTATION
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({
        variables: {
          data: {
            email: form.email,
            password: form.password,
          },
        },
      });

      if (res.data?.login.accessToken) {
        localStorage.setItem("accessToken", res.data.login.accessToken);
        localStorage.setItem("refreshToken", res.data.login.refreshToken);
        window.location.href = "/app";
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-pinkPurple to-bluePastel overflow-hidden">
      {/* Clouds Container */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[
          { src: "/cloud1.svg", size: "w-20", top: "top-12", duration: 40, delay: 0 },
          { src: "/cloud2.svg", size: "w-24", top: "top-1/4", duration: 50, delay: 10 },
          { src: "/cloud3.svg", size: "w-28", top: "top-1/2", duration: 60, delay: 20 },
          { src: "/cloud4.svg", size: "w-16", top: "top-3/4", duration: 45, delay: 5 },
          { src: "/cloud2.svg", size: "w-20", top: "top-[20%]", duration: 55, delay: 15 },
          { src: "/cloud3.svg", size: "w-24", top: "top-[65%]", duration: 70, delay: 25 },
          { src: "/cloud1.svg", size: "w-28", top: "top-[80%]", duration: 65, delay: 30 },
          { src: "/cloud4.svg", size: "w-20", top: "top-[35%]", duration: 52, delay: 12 },
        ].map((cloud, i) => (
          <motion.img
            key={i}
            src={cloud.src}
            alt={`cloud-${i}`}
            className={`absolute ${cloud.top} ${cloud.size} opacity-50`}
            initial={{ x: "-200px" }}
            animate={{ x: ["-200px", "100vw"] }}
            transition={{
              duration: cloud.duration,
              delay: cloud.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Login card */}
      <div className="relative z-10 flex w-[900px] h-[520px] rounded-2xl shadow-xl overflow-hidden bg-offWhite">
        {/* Left: Form */}
        <div className="flex-1 p-12 flex flex-col justify-center">
          <h2 className="text-3xl text-teal-800 mb-8 text-center font-poppins">
            Log in
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              name="email"
              type="email"
              placeholder="Email@gmail.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border-b border-gray-400 focus:outline-none focus:border-pinkMedium p-2 bg-transparent placeholder-gray-400"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border-b border-gray-400 focus:outline-none focus:border-pinkMedium p-2 bg-transparent placeholder-gray-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 rounded-full bg-pinkMedium hover:bg-pinkPurple text-white font-bold tracking-wide transition-colors"
            >
              {loading ? "Logging in..." : "LOG IN"}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-sm text-red-500">
              {error.message.replace("GraphQL error: ", "")}
            </p>
          )}
            <p className="mt-6 text-sm text-gray-600 text-center font-poppins">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-pinkMedium font-semibold">
                Sign up
            </Link>
            </p>
        </div>

        {/* Right: Artwork */}
        <div className="relative flex-1 bg-gradient-to-tr from-pinkLight to-pinkPurple">
          <img
            src="/signup-artwork.svg"
            alt="Login artwork"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
