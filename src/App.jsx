import Login from "./components/login/Login"
import Logo from "./components/logo/Logo"
import HubHeader from "./components/hubHeader/HubHeader"
import CharacterCards from "./components/CharacterCards/CharacterCards"
import AdminPanel from "./components/AdminPanel/AdminPanel"
import Charsheet from "./components/Charsheet/Charsheet"
import { useEffect, useState } from 'react'
import backend from './urls'




const App = () => {
  const [ isUser, setisUser ] = useState(false)
  const [ user, setUser ] = useState(null)
  const [ gm, setGM ] = useState(false)

  const [charname, setCharname ] = useState(null)

  const [showChars, setShowChars] = useState(true)
  const [ chars,setChars ] = useState(null)
  const [isAdminPanelOpen,setisAdminPanelOpen] = useState(false)

  const [isCharsheet,setisCharsheet] = useState(false)

  const [selectedCards,setSelectedCards] = useState(null)

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

  useEffect(()=>{
    {isCharsheet?document.body.style.overflowY="scroll":document.body.style.overflowY="hidden"}
  },[isCharsheet])
 
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
            <HubHeader user={user} setChars={setChars} logout={setisUser} setShowChars={setShowChars} isCharsheet={isCharsheet} setisCharsheet={setisCharsheet} setCharname={setCharname}/>
            {showChars?(
              <>
                {gm?<AdminPanel user={user} isAdminPanelOpen={isAdminPanelOpen} setisAdminPanelOpen={setisAdminPanelOpen} selectedCards={selectedCards} setSelectedCards={setSelectedCards} setChars={setChars}/>:null}
                {chars? <CharacterCards charlist={chars} selectedCards={selectedCards} setSelectedCards={setSelectedCards} setisAdminPanelOpen={setisAdminPanelOpen} setShowChars={setShowChars} setisCharsheet={setisCharsheet} setCharname={setCharname} charname={charname} isAdminPanelOpen={isAdminPanelOpen} gm={gm}/> : null}
                
              </>
            ):null
            }
            {(isCharsheet && !showChars)?<><Logo/><Charsheet charname={charname} setChars={setChars} username={user}/></>:null}
          </>
        ) : (
          <Login setisUser={setisUser} setUser={setUser} getChar={getChar} setChars={setChars} setGM={setGM} chars={chars} setSelectedCards={setSelectedCards}/>
        )
      }
    </div>

  )
}

export default App