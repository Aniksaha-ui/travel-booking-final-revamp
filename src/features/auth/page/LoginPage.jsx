import LoginForm from "../component/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#100d0e] px-8 py-10 text-white">
      <section className="grid w-full max-w-[1120px] grid-cols-[1fr_440px] overflow-hidden rounded-xl border border-[#2d282b] bg-[#171314]">
        <div className="relative flex min-h-[620px] flex-col justify-between border-r border-[#2d282b] bg-[#120f10] p-10">
          <div>
            <img
              src="https://flynextbd.com/wp-content/uploads/2023/09/Fly-Next-PNG-abhaya-Lib-Font.png"
              alt="Fly Next"
              className="h-11 w-auto"
            />
          </div>

          <div className="max-w-[520px]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-400">
              Travel operations
            </p>
            <h2 className="mt-5 text-5xl font-bold leading-tight text-white">
              Manage routes, bookings, and admin tools from one workspace.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#b4c5df]">
              Secure access for daily travel administration.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            {["Bookings", "Routes", "Reports"].map((item) => (
              <div key={item} className="rounded-md border border-[#2d282b] bg-[#1d181a] px-4 py-3 font-semibold text-white">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center bg-[#171314] p-8">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
