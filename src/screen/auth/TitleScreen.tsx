import { authImg, whiteLogo } from '../../assets/icons'

const TitleScreen = () => {
  return (
    <div className="flex-1 w-full relative" >
    <img src={authImg} alt="authImg" className="h-full w-full object-cover" />
    <div className="absolute top-0 left-0 w-full h-full    text-white">
     
     <div className="flex items-center gap-4 p-8">
      <img src={whiteLogo} alt="whiteLogo" className="h-16 w-16 " />
      <h1 className="text-4xl font-bold">
          BookNest 
      </h1>
     </div>
    </div>
    </div>
  )
}

export default TitleScreen