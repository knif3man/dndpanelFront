import { useRef } from 'react'
import "./hubHeader.css"
import backend from '../../urls'

const HubHeader = (props) => {

    const saveBtn = useRef(null)

    function logout(){
        props.logout(false)
    }

    function handleToMain(){
        props.setCharname(null)
        props.setisCharsheet(false)
        props.setShowChars(true)
    }

    

    return (
        <section className="hubHeader">
            <span className="username">
                <label>Имя пользователя: </label>
                <span>{props.user}</span>
            </span>
            {props.isCharsheet?<button className="toMain" onClick={handleToMain}>На главную</button>:null}
            <button className="logout" onClick={logout}>Выйти</button>
        </section>
    )
}

export default HubHeader