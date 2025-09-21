import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const SIGNUP_MUTATION = gql`
  mutation Signup($data: SignupInput!) {
    signup(data: $data) {
      accessToken
      refreshToken
    }
  }
`;

interface SignupResponse {
  signup: {
    accessToken: string;
    refreshToken: string;
  };
}

interface SignupVars {
  data: {
    displayName: string;
    email: string;
    password: string;
  };
}

export default function Signup({ onSwitch }: { onSwitch: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [signup, { loading, error }] = useMutation<SignupResponse, SignupVars>(
    SIGNUP_MUTATION
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signup({
        variables: {
          data: {
            displayName: form.name,
            email: form.email,
            password: form.password,
          },
        },
      });

      if (res.data?.signup.accessToken) {
        localStorage.setItem("accessToken", res.data.signup.accessToken);
        localStorage.setItem("refreshToken", res.data.signup.refreshToken);
        window.location.href = "/app";
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="flex w-[900px] h-[520px] rounded-2xl shadow-xl overflow-hidden bg-offWhite">
      {/* Left: Form */}
      <div className="flex-1 p-12 flex flex-col justify-center">
        <h2 className="text-3xl text-teal-800 mb-8 text-center font-poppins">
          Sign up!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border-b border-gray-400 focus:outline-none focus:border-pinkMedium p-2 bg-transparent placeholder-gray-400"
          />
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
            {loading ? "Signing up..." : "SIGN UP"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-500">
            {error.message.replace("GraphQL error: ", "")}
          </p>
        )}

        <p className="mt-6 text-sm text-gray-600 text-center font-poppins">
          Already have an account?{" "}
          <button  type="button" onClick={onSwitch} className="text-pinkMedium font-semibold">
            Log in
          </button>
        </p>
      </div>

      {/* Right: Artwork */}
      <div className="relative flex-1 bg-gradient-to-tr from-pinkLight to-pinkPurple">
        <img
          src="/signup-artwork.svg"
          alt="Signup artwork"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
