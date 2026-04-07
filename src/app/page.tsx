import WallCalendar from "@/components/WallCalendar";

export default function Home() {
  return (
    <main className="min-h-screen py-16 px-4 relative flex justify-center">
      {/* Absolute noise overlay covering the background */}
      <div className="paper-noise"></div>
      
      {/* Calendar Component */}
      <div className="w-full relative z-10 flex justify-center">
        <WallCalendar />
      </div>
    </main>
  );
}