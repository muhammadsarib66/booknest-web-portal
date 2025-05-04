import { Button } from '@material-tailwind/react'

const MyButton = ({ type ,onClick, style, btnText,loading , disabled}:any) => {
  return (
    <div>
      <Button
      type={type}
      onPointerEnterCapture={''}
      onPointerLeaveCapture={''}
      placeholder={''} 
      disabled={disabled}
      loading={loading}
      onClick={onClick} className={`  ${style}   w-full flex justify-center items-center `}  ripple={true}>
        
        {btnText}
      </Button>
    </div>
  )
}

export default MyButton