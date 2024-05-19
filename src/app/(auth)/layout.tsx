const AuthLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative grid bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.5]">
      <div className="z-10 grid min-h-screen place-items-center p-4">
        {children}
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
    </div>
  );
};

export default AuthLayout;
