export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h4 className="text-white text-lg font-bold mb-4">FoodieExpress</h4>
          <p>© 2026 FoodieExpress Technologies Pvt. Ltd.</p>
        </div>
        <div>
          <h4 className="text-white text-lg font-bold mb-4">Company</h4>
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Team</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-lg font-bold mb-4">Contact</h4>
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="hover:text-white transition-colors">Help & Support</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Partner with us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Ride with us</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
