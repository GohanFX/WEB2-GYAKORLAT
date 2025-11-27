import { Link } from "react-router"

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Formula 1 Hub</h3>
              <p className="text-sm">
                Your comprehensive platform for all things Formula 1.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/database" className="hover:text-white transition-colors">Database</Link></li>
                <li><Link to="/chart" className="hover:text-white transition-colors">Charts</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Admin</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 Formula 1 Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}

export default Footer