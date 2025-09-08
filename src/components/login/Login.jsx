import Logo from "../logo/Logo"
import React, { useEffect, useState, useRef } from "react";
import "./login.css";
import backend from '../../urls'

const Login = (props) => {


    const loginButton = useRef(null)

    function HandleloginBtn(e){
        if(e.key == 'Enter'){
            loginButton.current.click()
        }
    }

    useEffect(()=>{

        // установка кнопки ентер
        document.addEventListener('keypress',HandleloginBtn)
        // снятие кнопки при размонтировании LOGIN
        return()=>{
            document.removeEventListener('keypress',HandleloginBtn)
        }
      },[])

    const [loginData, setLoginData] = useState(
        {
            user:"",
            password:""
        }
    );

    const [isError,setisError] = useState(false)
    const [iserrorText,setiserrorText] = useState('')

    const handleFormChange =  (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]:e.target.value,
        });
    };

    const handleLogInButton = async (e) =>{

        const res = await fetch(backend+'/api/login',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(loginData)
        })

        const logInStatus = await res.json()

        if(logInStatus.status){
            props.setUser(loginData.user)
            props.setisUser(true)
            const newDataFromServer = await props.getChar(loginData.user)
            let newDataFromServerStatus = await props.getCharStatusEffects(loginData.user)

            let charStatusObj = {}
            for(let status of newDataFromServerStatus){
                if(charStatusObj[status.charName]){
                    charStatusObj[status.charName].push(status.statusEffect)
                } else {
                    charStatusObj[status.charName] = [status.statusEffect]
                }
            }
            // console.log(charStatusObj)

            props.setChars(Object.values(newDataFromServer))
            props.setCharStatusEffects(charStatusObj)

            const objForSetSelectedCards = {}
            for(let char of Object.values(newDataFromServer)){
                objForSetSelectedCards[char.char_name] = false
            }  
            props.setSelectedCards(objForSetSelectedCards)
        } else {
            setisError(true)
            setiserrorText(logInStatus.error)
        }
        props.setGM(logInStatus.gm)

        

    }

    return (
        <>
            <Logo/>
            <div className="loginDiv" >
                <h2>dndpanel.ru</h2>
                <img src="d20.png" alt="" />
                <form>
                    <input type="text" onChange={handleFormChange} placeholder = "Имя пользователя... " value={loginData.user} name="user" autoFocus={true}/>
                    <input type="password" onChange={handleFormChange} placeholder = "Пароль... " value={loginData.password} name="password"/>
                    <button type="button" onClick={handleLogInButton} ref={loginButton}> Войти </button>
                </form>
                <p style={{color:'red'}}>{isError? iserrorText:''}</p>
            </div>
        </>
    )
}


export default Login

