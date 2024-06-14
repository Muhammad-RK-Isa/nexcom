import React from "react";
import { Appearances } from "./_components/appearances";

const SettingsPage = () => {
  return (
    <div>
      <React.Suspense>
        <Appearances />
      </React.Suspense>
    </div>
  );
};

export default SettingsPage;
