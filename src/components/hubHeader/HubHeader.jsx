import { useRef,useEffect,useState } from 'react'
import "./hubHeader.css"
import backend from '../../urls'

const HubHeader = (props) => {

    const saveBtn = useRef(null)
    const encounterDiv = useRef(null)
    const encounterCounter = useRef(null)

    useEffect(()=>{
        console.log(props.encounterChars)
        showEncounter(props.encounterChars)
    },[props.encounterChars])

    useEffect(()=>{
        if(encounterDiv.current){
            // console.log(encounterDiv.current)
            // console.log(encounterDiv.current.children.length - 1)
            // console.log(props.encounterCounterPosition)
            if(props.encounterCounterPosition > encounterDiv.current.children.length - 1){
                props.setEncounterCounterPosition(0)
            } else {
                let center = encounterDiv.current.children[props.encounterCounterPosition].offsetLeft + encounterDiv.current.children[props.encounterCounterPosition].offsetWidth / 2 - 15;
                encounterCounter.current.style.left = (center).toString() + 'px'
            }
        }
    },[props.encounterCounterPosition])

    function logout(){
        props.logout(false)
    }

    function handleToMain(){
        props.setCharname(null)
        props.setisCharsheet(false)
        props.setShowChars(true)
    }

    function handleEncounterBtn(e){
        props.setHideStartEncounter(true)
        props.setEncounterInit([true,e.target])
    }

    function showEncounter(list){
        list.sort((a,b)=>{
            if(a['initiative'] < b['initiative']){
                return -1
            } else {
                return 1
            }
        })
        if(encounterDiv.current){
            if(encounterDiv.current.children.length == 1){
                for(let char of list){
                    let p = document.createElement('p')
                    p.textContent = char['char_name'] + ':' + char['initiative']
                    encounterDiv.current.prepend(p)
                }
                if(encounterCounter.current){
                    encounterCounter.current.style.left = '50px'
                }
            } 
        }
    }

    async function handleTurn(){
        let newPosition = props.encounterCounterPosition +  1
        if(newPosition == encounterDiv.current.children.length-1){
            newPosition = 0 
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({newPosition:newPosition})
        }
      
        const resp = await fetch(backend+'/setEncounterPosition',options)
        props.setEncounterCounterPosition(newPosition)

    }

    async function stopEncounter(){
        props.setIsEncounter(false)
        props.setHideStartEncounter(false)
        const options = {
            method: 'GET'
        }
      
        const res = await fetch(backend + '/stopEncounter', options)
        return
    }
    

    return (
        <section className="hubHeader">
            <span className="username">
                <div className="userDataWrapper">
                    <label>Имя пользователя: </label>
                    <span>{props.user}</span>
                </div>
                <div className="addCharBtn">
                    <button className="adduser" onClick={() => {props.setIsCreateCharacter(true)}}>Добавить персонажа</button>
                </div>
            </span>
            {props.isEncounter?<><div ref={encounterDiv} className='encounterDiv'><span className='counter' ref={encounterCounter}>&#8679;</span></div>{props.gm?<><button className='endBtn' onClick={handleTurn}>Ход</button><button className='endBtn' onClick={stopEncounter}>Завершить</button></>:null}</>:null}
            {props.gm && !props.hideStartEncounter?<button className="systemBtn" onClick={handleEncounterBtn}>Начать encounter</button>:null}
            {props.isCharsheet?<button className="toMain" onClick={handleToMain}>На главную</button>:null}
            <button className="logout" onClick={logout}>Выйти</button>
        </section>
    )
}

export default HubHeader