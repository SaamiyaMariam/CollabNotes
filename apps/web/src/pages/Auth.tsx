import { useState } from "react";
import { motion } from "framer-motion";
import Login from "./Login";
import Signup from "./Signup";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-pinkPurple to-bluePastel overflow-hidden perspective">
      {/* Clouds Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[
          { src: "/cloud1.svg", size: "w-20", top: "top-12", duration: 40, delay: 0 },
          { src: "/cloud2.svg", size: "w-24", top: "top-1/4", duration: 50, delay: 10 },
          { src: "/cloud3.svg", size: "w-28", top: "top-1/2", duration: 60, delay: 20 },
          { src: "/cloud4.svg", size: "w-16", top: "top-3/4", duration: 45, delay: 5 },
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

      {/* Flipping Card */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-pinkPurple to-bluePastel overflow-hidden"
         style={{ perspective: "1500px" }}>
      <motion.div
        className="relative w-[900px] h-[520px]"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isLogin ? 0 : 180 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Front: Login */}
        <div
          className="absolute w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Login onSwitch={() => setIsLogin(false)} />
        </div>

        {/* Back: Signup */}
        <div
          className="absolute w-full h-full"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Signup onSwitch={() => setIsLogin(true)} />
        </div>
      </motion.div>
    </div>
    </div>
  );
}
