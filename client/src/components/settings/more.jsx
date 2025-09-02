
const MoreSettings = () => (
  <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
    <h2 className="text-2xl font-semibold mb-4 text-white">More Settings</h2>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Notifications</span>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-10 h-6 bg-gray-700 rounded-full shadow-inner peer-checked:bg-indigo-500 transition-colors"></div>
            <div className="dot absolute w-4 h-4 bg-white rounded-full shadow-md transition-all top-1 left-1 peer-checked:transform peer-checked:translate-x-4"></div>
          </div>
        </label>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Dark Mode</span>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-10 h-6 bg-gray-700 rounded-full shadow-inner peer-checked:bg-indigo-500 transition-colors"></div>
            <div className="dot absolute w-4 h-4 bg-white rounded-full shadow-md transition-all top-1 left-1 peer-checked:transform peer-checked:translate-x-4"></div>
          </div>
        </label>
      </div>
    </div>
  </div>
);

export default MoreSettings;