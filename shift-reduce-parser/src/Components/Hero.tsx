import { motion } from "motion/react";
import ReactPlayer from "react-player";

const Hero = () => {
  return (
    <>
      <ReactPlayer playing={true} height="100%" src="demo.mp4" width="100%" />
      <div className="hero-overlay">
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.8, // a bit snappier
            ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for sleekness
          }}
        >
          <p className="text-6xl">Online Shift Reduce Parser Tool</p>
          <a href="https://github.com/m-malik622" className="text-xl">Check out my Github</a>
          <p className="text-4xl">How Does It Work?</p>
          <ReactPlayer playing={false} height="60%" src="https://youtu.be/g9Pb5L8aLeI?si=SW8m8EnOY_hJQMMf" width="40%" controls={true}/>
        </motion.div>
      </div>
    </>
  );
};

export default Hero;
