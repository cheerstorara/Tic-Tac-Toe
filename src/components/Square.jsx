export default function Square({ value, onClick, isWinning }) {
  return (
    <button
      className="w-24 h-24 text-4xl font-vintage border-2 border-dashed border-gray-600 hover:bg-[#eee8d5] transition-all duration-200"
      onClick={onClick}
    >
      {value}
    </button>
  );
}
