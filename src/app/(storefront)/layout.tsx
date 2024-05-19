import React from "react";
import Footer from "~/components/footer";

const StorefrontRoutesLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {children}
      <Footer className="absolute bottom-0" />
    </div>
  );
};

export default StorefrontRoutesLayout;
