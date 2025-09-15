import {  useEffect, useRef,useState } from "react"
import CharCard from "./../charCard/charCard"
import './CharacterCards.css'
import backend from '../../urls'




const CharacterCards = (props) =>{
    
    const hidedSpan = useRef(null)
    const hideSelect = useRef(null)
    const [isHidedCharactersShow,setIsHidedCharactersShow] = useState(false)

    useEffect(()=>{
        if(hidedSpan.current){
            hidedSpan.current.textContent = '+' + props.hidedCharacters.length.toString()
        }

        
        if(hideSelect.current){
            hideSelect.current.innerHTML = ''
            for(let char of props.hidedCharacters){
                let option = document.createElement('option')
                option.textContent = char.charName
                hideSelect.current.append(option) 
            }
        }
            
    },[props.hidedCharacters])

    function showHidedCharacters(){
        setIsHidedCharactersShow(!isHidedCharactersShow)
    }

    async function setCharacterVisibility(){
        hidedSpan.current.click()
        let data = {}
        data[hideSelect.current.value] = props.user
        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
          }
        
        if(hideSelect.current.children.length == 1){
            showHidedCharacters()
        }
        const res = await fetch(backend + '/setCharVisibility', options)
    }



    return(
        <>
            <section className='characterCards'>
                {(Object.values(props.charlist)).map(char => 
                    <CharCard key={char.char_name} selectedCards={props.selectedCards} setSelectedCards={props.setSelectedCards}  CharName={char.char_name} charlist={props.charlist} setisAdminPanelOpen={props.setisAdminPanelOpen} isAdminPanelOpen={props.isAdminPanelOpen} setShowChars={props.setShowChars} setisCharsheet={props.setisCharsheet} setCharname={props.setCharname} gm={props.gm} statusEffect={props.charsStatusEffects[char.char_name]} charsStatusEffects={props.charsStatusEffects}/>
                )}

                <div className="hiderDiv">
                    {props.hidedCharacters.length>0?<span className="hidedCharacters" ref={hidedSpan} onClick={showHidedCharacters}>+1</span>:null}
                    {!isHidedCharactersShow?<select ref={hideSelect} className="hideSelect"></select>:<select ref={hideSelect} className="showSelect"></select>}
                    {isHidedCharactersShow?<input type="button" value={"Отобразить"} className="sysBtn" onClick={setCharacterVisibility}></input>:null}
                </div>
            </section>
        </>
    )
}

export default CharacterCards