export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-xl text-gray-400">
              © {new Date().getFullYear()} Y&M Consulting Inc. All rights reserved.
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-2xl text-gray-300">
              Smart Credit Decisions <span className="text-red-500">Made Simple</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
