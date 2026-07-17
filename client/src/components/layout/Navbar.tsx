function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-600">
          InterviewAce AI
        </h1>

        <div className="flex items-center gap-8">
          <a href="#" className="font-medium text-gray-600 transition hover:text-blue-600">
            Features
          </a>

          <a href="#" className="font-medium text-gray-600 transition hover:text-blue-600">
            How it Works
          </a>

          <a href="#" className="font-medium text-gray-600 transition hover:text-blue-600">
            About
          </a>

          <button
            className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
          >
            Start Interview
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;