"use client";
import React, { useEffect, useState } from "react";
import { MultiStepLoader as Loader } from "./ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { Button } from "./ui/button";

export function MultiStepLoader({
  loading,
  currentState,
  setLoading,
  loadingStates,
}) {
  // const [loading, setLoading] = useState(false);
  // const [currentState, setCurrentState] = useState(0);

  return (
    <div>
      {/* Core Loader Modal */}
      <Loader
        loadingStates={loadingStates}
        loading={loading}
        currentState={currentState}
      />
      {/* <Button onClick={() => setLoading(true)}>Click to load</Button> */}

      {loading && (
        <button
          className="fixed top-4 right-4 text-black dark:text-white z-[120]"
          onClick={() => setLoading(false)}>
          <IconSquareRoundedX className="h-10 w-10" />
        </button>
      )}
    </div>
  );
}
