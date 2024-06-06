import React from "react";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";

import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "~/app/api/uploadthing/core";

const UploadthingSSRPlugin = () => {
  return <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />;
};

export default UploadthingSSRPlugin;
