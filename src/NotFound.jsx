function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 px-6">
            <h1 className="text-7xl font-extrabold text-blue-600 dark:text-blue-400 drop-shadow mb-4">
                404
            </h1>

            <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                The page you’re looking for doesn’t exist.
            </p>

            <a
                href="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
                Go Back Home
            </a>
        </div>
    );
}

export default NotFound;
