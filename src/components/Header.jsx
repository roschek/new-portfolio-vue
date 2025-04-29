import { FaMoon, FaSun } from 'react-icons/fa';

function Header({ darkMode, setDarkMode }) {
  return (
    <header className="flex justify-between p-4 bg-white dark:bg-gray-800 shadow-md fixed w-full top-0 z-10">
      <h1 className="text-xl font-bold">Portfolio</h1>
      <button onClick={() => setDarkMode(!darkMode)} className="text-2xl">
        {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
      </button>
    </header>
  );
}

export default Header;