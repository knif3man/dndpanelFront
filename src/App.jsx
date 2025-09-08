import Login from "./components/login/Login"
import Logo from "./components/logo/Logo"
import HubHeader from "./components/hubHeader/HubHeader"
import CharacterCards from "./components/CharacterCards/CharacterCards"
import AdminPanel from "./components/AdminPanel/AdminPanel"
import Charsheet from "./components/Charsheet/Charsheet"
import EncounterInit from "./components/EncounterInit/EncounterInit"
import CreateCharacter from "./components/CreateCharacter/CreateCharacter"
import { useEffect, useState, useRef } from 'react'
import backend from './urls'
import socketIO from 'socket.io-client';
import { 
  hashRandom, 
  hashString, 
  hashObject, 
  hashArray 
} from 'react-hash-string'



const App = () => {
  const [ isUser, setisUser ] = useState(false)
  const [ user, setUser ] = useState(null)
  const [ gm, setGM ] = useState(false)
  const [charname, setCharname ] = useState(null)

  const [showChars, setShowChars] = useState(true)
  const [chars,setChars ] = useState(null)
  const [charsStatusEffects,setCharStatusEffects] = useState({})
  const [isAdminPanelOpen,setisAdminPanelOpen] = useState(false)
  
  const [encounterInit,setEncounterInit] = useState([null,null])
  const [isEncounter,setIsEncounter] = useState(false)
  const [encounterChars,setEncounterChar] = useState([])
  const [isEncounetrCounterNeedUpdate,setisEncounetrCounterNeedUpdate] = useState(false)
  const [encounterCounterPosition,setEncounterCounterPosition] = useState(0)
  const [hideStartEncounter,setHideStartEncounter] = useState(false)

  const [isCreateCharacter,setIsCreateCharacter] = useState(false)

  const [isCharsheet,setisCharsheet] = useState(false)

  const [selectedCards,setSelectedCards] = useState(null)

  const [hidedCharacters,setHidedCharacters] = useState(null)



  // обработка сообщения от сервера о необходимости обновить данные
  const socket = socketIO.connect('https://dndpanel.ru');
  useEffect(()=>{
    // let string = window.navigator.userAgent.toLowerCase().replace(/ /g,'').replace(/;/g,',') + ';' + Intl.DateTimeFormat().resolvedOptions().locale + ';' + Intl.DateTimeFormat().resolvedOptions().timeZone
    // tryLogin(string)

    socket.on('connect',async ()=>{
      console.log('connected to socket.io')
      checkEncounter()
      getHidedChars()
    })
    socket.on('needUpdateCharactersData',()=>{
      getChar(user).then((answer)=>{
          setChars(answer)
        }
      )
      getCharStatusEffects(user).then((answer=>{
        let charStatusObj = {}
        for(let status of answer){
          try{
            if(charStatusObj[status.charName].length >= 1){
              charStatusObj[status.charName].push(status.statusEffect)
            }
          } catch(e) {
            charStatusObj[status.charName] = [status.statusEffect]
          }
        }
        setCharStatusEffects(charStatusObj)
        getHidedChars()
      }))
    })
    socket.on('encounterStart',async ()=>{
      let encounterUsers = await getEncounterData()
      setIsEncounter(true)
      setEncounterChar(encounterUsers)
      console.log(encounterUsers)      
      let newPosition = await getEncounterCounterPosition()
      setEncounterCounterPosition(newPosition[0]['counterPosition'])  
    })
    socket.on('updateEncounterCounterPosition',async ()=>{
      let newPosition = await getEncounterCounterPosition()
      setEncounterCounterPosition(newPosition[0]['counterPosition'])  
    })
    socket.on('stopEncounter',()=>{
      setHideStartEncounter(false)
      setIsEncounter(false)
    })

    return(()=>{
      socket.off('connect')
      socket.off('needUpdateCharactersData')
      socket.off('encounterStart')
      socket.off('updateEncounterCounterPosition')
      socket.off('stopEncounter')
    })
  },[])

  async function checkEncounter(){
    const options = {
      method: 'GET',
    }

    const resp = await fetch(backend+'/api/checkEncounter',options)
    const answer = await resp.json()
    if(answer.data != 'no'){
      setHideStartEncounter(true)
      setIsEncounter(true)      
      let encounterUsers = await getEncounterData()
      setEncounterChar(encounterUsers)
      let newPosition = (await getEncounterCounterPosition())[0]['counterPosition']
      console.log(newPosition)
      if(newPosition != "can't get newposition"){
        setEncounterCounterPosition(newPosition)
      } else {
        setEncounterCounterPosition(0)
      }
    }
  }

  async function getEncounterCounterPosition(){
    const options = {
      method: 'GET',
    }

    const resp = await fetch(backend+'/api/getEncounterCounterPosition',options)
    try{
      const newPosition = await resp.json()
      return newPosition
    } catch(e){
      return "can't get newposition"
    }
  }

  async function getCharStatusEffects(user){
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({user:user})
    }

    const resp = await fetch(backend+'/api/getCharStatusEffects',options)
    try{
      const charsStatus = await resp.json()
      return charsStatus
    } catch(e){
      return "can't get char status effects"
    }
  }

  async function tryLogin(hash){
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON;charset=utf-8'
      },
      body: JSON.stringify({data:hashString(hash)})
    }

    const resp = await fetch(backend+'/api/tryLogin',options)
    try{
      const charsStatus = await resp
      return {
        error:false,
        errorText:'',
        data:charsStatus
      }

    } catch(e){
      return {
        error:true,
        errorText:"can't get char status effects",
        data:''
      }
    }
  }



  async function getChar(user){
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({user:user})
    }

    const resp = await fetch(backend+'/api/getChar',options)
    const charList = await resp.json()
    return charList
  }

  async function getEncounterData(){
    const options = {
      method: 'GET'
    }

    const res = await fetch(backend + '/api/getEncounterData', options)
    const encounterUser = await res.json()
    return encounterUser
  }

  async function getHidedChars(){
    const options = {
      method: 'GET'
    }

    const res = await fetch(backend + '/api/getHidedCharacters', options)
    const hidedChars = await res.json()
    setHidedCharacters(hidedChars)
  }

  useEffect(()=>{
    {isCharsheet?document.body.style.overflowY="scroll":document.body.style.overflowY="auto"}
    if(isCharsheet){
      setHideStartEncounter(true)
    } else {
      if(isEncounter){
        setHideStartEncounter(true)
      } else {
        setHideStartEncounter(false)
      }
    }
  },[isCharsheet])
 
  useEffect(()=>{
    if(isEncounter){
      setHideStartEncounter(true)
    }   
  },[isEncounter])

  useEffect(()=>{
    let isNeedtoClose = true
    for(let card in selectedCards){
      if(selectedCards[card]){
        isNeedtoClose = false
      }
    }

    if(isNeedtoClose){
      setisAdminPanelOpen(false)
    }
  },[selectedCards])

  return (
    <div className='container'>
      <Logo/>
      {
        isUser ? (
          <>
            <HubHeader user={user} setChars={setChars} logout={setisUser} setShowChars={setShowChars} isCharsheet={isCharsheet} setisCharsheet={setisCharsheet} setCharname={setCharname} gm={gm} setEncounterInit={setEncounterInit} isEncounter={isEncounter} setIsEncounter={setIsEncounter} encounterChars={encounterChars} isEncounetrCounterNeedUpdate={isEncounetrCounterNeedUpdate} encounterCounterPosition={encounterCounterPosition} setEncounterCounterPosition={setEncounterCounterPosition} hideStartEncounter={hideStartEncounter} setHideStartEncounter={setHideStartEncounter} isCreateCharacter={isCreateCharacter} setIsCreateCharacter={setIsCreateCharacter}/>
            {showChars?(
              <>
                {gm?<AdminPanel user={user} chars={chars} isAdminPanelOpen={isAdminPanelOpen} setisAdminPanelOpen={setisAdminPanelOpen} selectedCards={selectedCards} setSelectedCards={setSelectedCards} setChars={setChars} charsStatusEffects={charsStatusEffects}/>:null}
                {chars? <CharacterCards user={user} hidedCharacters={hidedCharacters} charlist={chars} selectedCards={selectedCards} setSelectedCards={setSelectedCards} setisAdminPanelOpen={setisAdminPanelOpen} setShowChars={setShowChars} setisCharsheet={setisCharsheet} setCharname={setCharname} charname={charname} isAdminPanelOpen={isAdminPanelOpen} gm={gm} charsStatusEffects={charsStatusEffects}/> : null}
                
              </>
            ):null
            }
            {(isCharsheet && !showChars)?<><Logo/><Charsheet charname={charname} setChars={setChars} username={user}/></>:null}
            {encounterInit[0]?<EncounterInit chars={chars} setEncounterInit={setEncounterInit} encounterInit={encounterInit} setHideStartEncounter={setHideStartEncounter}/>:null}
            {isCreateCharacter?<><CreateCharacter setIsCreateCharacter={setIsCreateCharacter} user={user}/></>:null}
          </>
        ) : (
          <Login setisUser={setisUser} setUser={setUser} getChar={getChar} setChars={setChars} setGM={setGM} chars={chars} setSelectedCards={setSelectedCards} getCharStatusEffects={getCharStatusEffects} setCharStatusEffects={setCharStatusEffects}/>
        )
      }
    </div>

  )
}

export default App
