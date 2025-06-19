import { Button } from "./ui/button"

const Header = () => {
  return (
    <div className="h-16 px-4">
      {/* main header content */}
     <div className="h-full flex justify-between items-center">
     {/* left content */}
     <div className="h-10 w-32 flex justify-start items-center">
      <button className="size-10 block min-[1024px]:hidden">
      <img src="https://res.cloudinary.com/dgquchqc2/image/upload/v1750361713/menu_dahvfo.png" alt="menu" className="size-6"/>
      </button>
      <img src="https://res.cloudinary.com/dgquchqc2/image/upload/v1750359425/favicon_spilef.svg" alt="icon" className="size-5 object-contain min-[375px]:hidden" />
      <img src="https://res.cloudinary.com/dgquchqc2/image/upload/v1750359181/logo_fbv0e7.svg" alt="logo" className="size-full object-cover hidden min-[375px]:block" />
     </div>
     {/* right content */}
     <div className="h-10 w-20">
      <Button variant={"outline"} className="size-full">Sign in</Button>
     </div>
     </div>
    </div>
  )
}

export default Header