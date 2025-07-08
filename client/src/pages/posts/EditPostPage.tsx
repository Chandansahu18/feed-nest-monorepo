import { useLocation } from "react-router-dom"

const EditPostPage = () => {
    const {state} = useLocation();
    console.log(state);
    
  return (
    <div>EditPostPage</div>
  )
}

export default EditPostPage