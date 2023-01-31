import { createContext, useEffect, useReducer } from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Header,Hero,Contact,Register,Login,AboutMe,Footer, Error404,Logout} from "./Comp";
import {useCookies} from "react-cookie";
export const MyContext = createContext();
function App(){
  const [cookies] = useCookies(['jwt']);
  const reducer = (state,action) => {
    switch(action.type){
      case "GET_USER":
        return {...state,userdata:action.data};
      default:
        return state;
    }
  }
  let [state,dispatch] = useReducer(reducer,{userdata:{message:"i am initial value"},});
  useEffect(() => {
    if(cookies.jwt !== undefined){
      fetch("http://localhost:8000/auth/",{
        method:"POST",
        body: JSON.stringify({jwt:cookies.jwt}),
        headers:{
          "Content-Type":"application/json"
        }
      }).then((res) => res.json()).then((data) => {
        if(data.message){
          alert(data.message);
        }else{
          dispatch({type:"GET_USER",data});
        }
      }).catch((err) => {
        console.log(err);
        alert("api data fetching error");
      });
    }
  },[]);
  const updateUserApi = (data) => {
    dispatch({type:"GET_USER",data})
  }
  return <MyContext.Provider value={{...state,updateUserApi}}>
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/aboutme" element={<AboutMe />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </MyContext.Provider>
}
export default App;