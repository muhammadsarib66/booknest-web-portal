import { heroImg } from '../assets/icons'
import { ReactTyped } from 'react-typed'

const HeroSection = () => {
  return (
    <div className="hidden md:block relative text-white text-center">
      <div>
        <img src={heroImg} alt="hero" className="w-full h-full object-cover" />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-3xl md:text-5xl font-bold">
          <ReactTyped
            strings={["Discover", "Exchange", "Share"]}
            typeSpeed={100}
            backSpeed={50}
            loop
          />{" "}
          Books Effortlessly
        </h1>
        <p className="mt-4 text-lg">
          Join a community of book lovers exchanging stories
        </p>
        <div className="mt-6 space-x-4">
          <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded transition-all hover:bg-blue-50">
            Get Started
          </button>
          <button className="border border-white py-2 px-4 rounded transition-all hover:bg-white hover:text-blue-600">
            Browse Books
          </button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection