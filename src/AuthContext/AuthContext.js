import { auth } from "firebase/firebase.config";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";

const react = require("react");




const AuthContext = react.createContext()



export const useAuth = () =>{
    return useContext(AuthContext)
}

export const AuthProvider = ({children}) => {

    const [currentUser,setCurrentUser] = useState()
    const [isLoading,setIsLoading] = useState(true)

    const login = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password)
    }

    const  logout = () => {
        return auth.signOut()
      }

    useEffect(() => {
        
        const unsubscribe =  auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setIsLoading(false)
        })

        return unsubscribe
    }, [])



    const value = {
        currentUser,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    )
}