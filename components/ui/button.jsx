export function Button({ children, onClick, className }) {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white ${className}`}
      >
        {children}
      </button>
    );
  }
  