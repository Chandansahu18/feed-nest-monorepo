import SignIn from "@/components/auth-page-sections/signin-section/signIn";
import SignUp from "@/components/auth-page-sections/signup-section/signUp";
import { useLocation } from "react-router-dom"
import NotFoundPage from "../not-found/NotFoundPage";

const AuthPage = () => {
    const {state} = useLocation();      
    if (state.type === 'signup') {
        return (
          <SignUp />
        )
    }else if (state.type === 'signin') {
        return(
            <SignIn />
        )
    }else{
        return(
            <NotFoundPage />
        )
    }
    
}

export default AuthPage