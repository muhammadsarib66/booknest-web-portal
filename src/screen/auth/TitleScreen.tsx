import { heroImg, whiteLogo } from '../../assets/icons'

const TitleScreen = () => {
  return (
    <div className="flex-1 w-full relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImg} 
          alt="BookNest Hero" 
          className="h-full w-full object-cover transform scale-105 transition-transform duration-700 hover:scale-100" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-indigo-900/80"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between text-white p-8">
        {/* Header */}
        <div className="flex items-center gap-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
            <img src={whiteLogo} alt="BookNest Logo" className="h-12 w-12" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-wide">
              BookNest
            </h1>
            <p className="text-blue-200 text-sm font-medium">Your Literary Community</p>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center text-center space-y-6 animate-slide-up">
          <h2 className="text-5xl font-bold leading-tight">
            Welcome to Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
              Reading Universe
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-lg mx-auto leading-relaxed">
            Discover, share, and connect with fellow book lovers in our vibrant community
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <span className="text-sm font-medium">📚 Share Books</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <span className="text-sm font-medium">💬 Connect</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <span className="text-sm font-medium">🌟 Discover</span>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="text-center animate-fade-in-delayed">
          <blockquote className="text-lg italic text-blue-200 font-light">
            "A reader lives a thousand lives before he dies..."
          </blockquote>
          <cite className="text-sm text-blue-300 mt-2 block">— George R.R. Martin</cite>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-white/30 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute bottom-32 left-16 w-1 h-1 bg-blue-300/50 rounded-full animate-pulse delay-2000"></div>
      <div className="absolute top-1/3 right-10 w-1.5 h-1.5 bg-purple-300/40 rounded-full animate-ping delay-3000"></div>
    </div>
  )
}

export default TitleScreen