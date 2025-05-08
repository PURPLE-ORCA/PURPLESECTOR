import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

function LoadingIndicator({ message = "Loading..." }) {
  return (
    <div className="p-6 flex items-center justify-center text-center min-h-[10rem]">
      {" "}
      {/* Added min-height */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="mr-3"
      >
        <Loader2 className="h-6 w-6 text-[#950505] dark:text-[#ff6b6b]" />
      </motion.div>
      <p className="text-black dark:text-white">{message}</p>
    </div>
  );
}
export default LoadingIndicator;
