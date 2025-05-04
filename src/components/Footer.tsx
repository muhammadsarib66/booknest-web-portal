import { fbIcon, instaIcon, linkIcon, mainBigLogo, xIcon, ytIcon } from "../assets/icons";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Logo Section */}
        <div>
          <img src={mainBigLogo} alt="BookNest Logo" className="mb-4" />
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-3 text-xs font-medium">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Customer Feedback</a></li>
            <li><a href="#">Support</a></li>
          </ul>
        </div>

        {/* Stay Updated */}
        <div>
          <h4 className="font-semibold mb-3">Stay Updated</h4>
          <ul className="space-y-3 text-xs font-medium">
            <li><a href="#">Newsletter</a></li>
            <li><a href="#">Events</a></li>
            <li><a href="#">Partnerships</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Feedback</a></li>
          </ul>
        </div>

        {/* Subscribe Section */}
        <div>
          <h4 className="font-semibold mb-3">Subscribe</h4>
          <p className="text-gray-800 font-medium mb-3 text-xs ">Join our newsletter to stay updated on features and releases.</p>
          <div className="flex items-center gap-1 h-10 ">
            <input
              type="email"
              placeholder="Enter your email"
              className=" bg-transparent text-sm h-full w-full  border-black border px-3 py-1 text-black flex-1 outline-none"
            />
            <button 
            className='text-xs text-bgPrimary font-bold px-4 py-2 h-full w-fit text-center border border-bgPrimary '
          >
            subscribe
          </button>
            </div>
          <p className="text-xs text-gray-500 mt-2">By subscribing, you agree to our <a href="#" className="underline">Privacy Policy</a>.</p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t text-xs border-gray-300 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center  text-gray-600">
        <p>© 2024 BookNest. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Cookies Settings</a>
        </div>
        <div className="flex space-x-4 mt-2 sm:mt-0 text-gray-600">
            {[ fbIcon,instaIcon,ytIcon,xIcon,linkIcon,].map((Icon, index) => (
                <img src={Icon} alt="social icon" key={index} className="w-5 h-5" />
            ))}
        </div>
      </div>
    </footer>
  );
}
