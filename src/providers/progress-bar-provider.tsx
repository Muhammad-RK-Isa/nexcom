"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const ProgressBarProvider = () => {
  return (
    <ProgressBar
      height="2px"
      color="#3b82f6"
      options={{
        showSpinner: false,
      }}
      shallowRouting
    />
  );
};

export default ProgressBarProvider;
