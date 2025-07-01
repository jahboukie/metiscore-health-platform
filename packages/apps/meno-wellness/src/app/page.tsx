import { AuthButton } from "./components/auth-button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          MenoWellness
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          This is the future home of the MenoWellness application.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <AuthButton />
        </div>
      </div>
    </main>
  );
}
