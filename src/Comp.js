import {NavLink, useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {MyContext} from "./App";
import {useContext} from "react";
function Header(){
    const {userdata} = useContext(MyContext);
    let islogin = userdata.message === undefined ? true:false;
    return <header>
    <div className="logo"><NavLink to="/">NonTechBg</NavLink></div>
    <nav>
        <NavLink to="/">home</NavLink>
        <NavLink to="/aboutme">aboutme</NavLink>
        <NavLink to="/contact">contact</NavLink>
        {!islogin ? <><NavLink to="/login">login</NavLink><NavLink to="/register">register</NavLink></>:<NavLink to="/logout">logout</NavLink>}
    </nav>
</header>
}
function Hero(){
    const {userdata} = useContext(MyContext);
    let name = userdata.full_name === undefined ? "user":userdata.full_name;
    return <section>
    <div>
        <h3>welcome {name}</h3>
        <h1>We Are The MERN Developer</h1>
    </div>
</section>
}
function Contact(){
    const {userdata} = useContext(MyContext);
    let name = userdata.full_name === undefined ? "user":userdata.full_name;
    return <section>
    <div>
        <h3>welcome {name}</h3>
        <h1>Contact Us Page</h1>
    </div>
</section>
}
function Register(){
    let {updateUserApi} = useContext(MyContext);
    const [cookies,setCookie] = useCookies([]);
    let navigate = useNavigate();
    function submited(e){
        e.preventDefault();
        let {full_name,email,mobile,password,cpassword} = e.target;
        if(full_name.value.trim() === ""){
            alert("full name is invalid");
        }else if(email.value.trim() === ""){
            alert("email is invalid");
        }else if(mobile.value.trim() === ""){
            alert("mobile is invalid");
        }else if(password.value.trim() === ""){
            alert("password is invalid");
        }else if(password.value !== cpassword.value){
            alert("confirm password is invalid");
        }else{
            let obj = {full_name:full_name.value,email:email.value,mobile:mobile.value,password:password.value};
            fetch("http://localhost:8000/registeruser/",{
                method:"POST",
                body: JSON.stringify(obj),
                headers:{
                "Content-Type":"application/json"
                }
            }).then((res) => res.json()).then((data) => {
                if(data.message){
                    alert(data.message);
                }else{
                    updateUserApi(data);
                    setCookie("jwt",data.token);
                    navigate("/");
                }
            }).catch((err) => {
                console.log(err);
                alert(err);
            });
        }
    }
    return <section>
    <form onSubmit={submited} autoComplete="off" method="POST">
        <h1>user registration form</h1>
        <div className="form-group">
            <input type="text" className="form-control" name="full_name" placeholder="your name" />
        </div>
        <div className="form-group">
            <input type="email" className="form-control" name="email" placeholder="email" />
        </div>
        <div className="form-group">
            <input type="number" className="form-control" name="mobile" placeholder="mobile" />
        </div>
        <div className="form-group">
            <input type="password" className="form-control" name="password" placeholder="password" />
        </div>
        <div className="form-group">
            <input type="password" className="form-control" name="cpassword" placeholder="confirm password" />
        </div>
        <div className="form-group">
            <input type="submit" value="register" />
        </div>
    </form>
</section>
}
function Login(){
    let {updateUserApi} = useContext(MyContext);
    const [cookies,setCookie] = useCookies([]);
    let navigate = useNavigate();
    function submited(e){
        e.preventDefault();
        let {email,password} = e.target;
        if(email.value.trim() === ""){
            alert("email is invalid");
        }else if(password.value.trim() === ""){
            alert("password is invalid");
        }else{
            fetch("http://localhost:8000/loginuser/",{
                method:"POST",
                body: JSON.stringify({email:email.value,password:password.value}),
                headers:{
                "Content-Type":"application/json"
                }
            }).then((res) => res.json()).then((data) => {
                if(data.message){
                    alert(data.message);
                }else{
                    updateUserApi(data);
                    setCookie("jwt",data.token);
                    navigate("/");
                }
            }).catch((err) => {
                console.log(err);
                alert(err);
            });
        }
    }
    return <section>
    <form onSubmit={submited} autoComplete="off" method="POST">
        <h1>user login form</h1>
        <div className="form-group">
            <input type="email" className="form-control" name="email" placeholder="email" />
        </div>
        <div className="form-group">
            <input type="password" className="form-control" name="password" placeholder="password" />
        </div>
        <div className="form-group">
            <input type="submit" value="login" />
        </div>
    </form>
</section>
}
function AboutMe(){
    let {userdata} = useContext(MyContext);
    let {full_name,email,mobile,date} = userdata;
    if(!full_name || !email || !mobile || !date){
        return <section>
            <h1>please login to see your data</h1>
        </section>
    }
    return <section>
    <div className="box">
        <table>
            <caption>your data</caption>
            <tbody>
            <tr>
                <th>name</th>
                <td>{full_name}</td>
            </tr>
            <tr>
                <th>email</th>
                <td>{email}</td>
            </tr>
            <tr>
                <th>mobile</th>
                <td>{mobile}</td>
            </tr>
            <tr>
                <th>join date</th>
                <td>{date}</td>
            </tr>
            </tbody>
        </table>
    </div>
</section>
}
function Logout(){
    let {updateUserApi} = useContext(MyContext);
    let navigate = useNavigate();
    const [cookies,setCookie,removeCookie] = useCookies([]);
    updateUserApi({message:"user is logout now"});
    removeCookie("jwt");
    navigate("/");
}
function Footer(){
    return <footer>
    <h4>all copyright received &copy; 2022-23</h4>
</footer>
}
function Error404(){
    return <section>
        <h1>oops error 404 page not found</h1>
    </section>
}
export {Header,Hero,Contact,Register,Login,AboutMe,Footer,Error404,Logout}