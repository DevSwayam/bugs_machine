import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

const AlertModal = ({ isOpen, setIsOpen, wonPrize }) => {
  // const handleUnderstood = () => {
  //   setIsBetPlaced(true);
  //   setIsOpen(false);
  // };
  //   const [isOpen, setIsOpen] = useState(true);
  return (
    <SpringModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      wonPrize={wonPrize}
      // handleUnderstood={handleUnderstood}
    />
  );
};

const SpringModal = ({ isOpen, setIsOpen, wonPrize }) => {
  const router = useRouter();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer">
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-500 to-gray-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden">
            <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              {/* <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-gray-800 grid place-items-center mx-auto">
                <FiAlertCircle />
              </div> */}
              <h3 className="text-2xl font-bold text-center mb-2">
                You&apos;ve won {wonPrize === "0" ? "0" : wonPrize.slice(0, -18)} Bugs
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="bg-white/20 hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded">
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertModal;
