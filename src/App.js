import Board from "./components/Board";
import { Analytics } from "@vercel/analytics/react"; // sudah benar

function App() {
  return (
    <div className="min-h-screen bg-[#f5f5dc] flex items-center justify-center px-4 py-8">
      <div className="flex flex-col items-center text-center max-w-md w-full">
        <h1 className="text-5xl mb-6 font-vintage text-[#4b3621]">Tic Tac Toe</h1>

        <div className="w-full flex justify-center">
          <Board />
        </div>
      </div>

      {/* Tambahkan Analytics di luar komponen utama juga tidak apa-apa */}
      <Analytics />
    </div>
  );
}

export default App;
