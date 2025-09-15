import { useRef,useEffect } from 'react'
import backend from '../../urls'
import "./EncounterInit.css"



const EncounterInit = (props) => {   
    
    const toSelect = useRef(null)
    const selected = useRef(null)

    useEffect(()=>{
        addCharsToSelec(Object.values(props.chars))
    },[])

    function addCharsToSelec(chars){
        if(toSelect.current.getAttribute('isfilled') == 'false'){
            for(let char of chars){
                let charDiv = document.createElement('div')
                charDiv.className = 'charToSelect'
                charDiv.textContent = char.char_name
                
                let initiative = document.createElement('input')
                initiative.type = 'number'
                initiative.className = 'initiative'
                initiative.placeholder = 'инициатива'
                charDiv.append(initiative)
                charDiv.addEventListener('click',addToFight)
                toSelect.current.append(charDiv)
            }
            toSelect.current.setAttribute('isfilled','true')
        }
    }

    function addToFight(e){
        if(e.target.className != 'initiative'){
            if(e.target.parentNode.parentNode.id == 'prepare'){
                selected.current.prepend(e.target)
            } else {
                console.log(123)
                toSelect.current.append(e.target)
            }
        }
    }

    function moveAll(e){
        let from,to
        if(e.target.textContent == '>>'){
            from = toSelect
            to = selected
        } else {
            from = selected
            to = toSelect
        }
        let list = []
        for(let char of from.current.children){
            if( char.id != 'addnpc' && (char.id).indexOf('npc') == -1){
                list.push(char)
            }
        }

        for(let char of list){
            to.current.prepend(char)
        }
    }

    function addNPC(e){
        let npcDiv = document.createElement('div')
        npcDiv.className = 'charToSelect'
        npcDiv.id = 'npc' + selected.current.children.length.toString()

        let npcName = document.createElement('input')
        npcName.type = 'text' 
        npcName.placeholder = 'Имя NPC'
        npcName.className = 'initiative'
        npcName.style.width = '100px'
        npcDiv.append(npcName)

        let npcInitiative = document.createElement('input')
        npcInitiative.type = 'number' 
        npcInitiative.placeholder = 'инициатива'
        npcInitiative.className = 'initiative'
        npcInitiative.style.width = '100px'
        npcDiv.append(npcInitiative)

        let okbtn = document.createElement('button')
        okbtn.className = 'okbtn'
        okbtn.textContent = 'Ok'
        okbtn.addEventListener('click',endAddNPC)
        npcDiv.append(okbtn)

        selected.current.insertBefore(npcDiv,e.target)
    }

    function endAddNPC(e){
        let npcDiv = e.target.parentNode
        
        let newDiv = document.createElement('div')
        newDiv.className = 'charToSelect'
        newDiv.textContent = npcDiv.children[0].value
                
        let initiative = npcDiv.children[1]
        newDiv.append(initiative)

        npcDiv.remove()
        selected.current.insertBefore(newDiv,selected.current.children[selected.current.children.length-1])
    }

    async function createEncounterCharsList(){
        let obj = {}
        if(selected.current.children.length == 1){
            alert('Не выбрано ни одного персонажа для encounterа')
            return
        }
        for(let char of selected.current.children){
            if((char.id) != 'addnpc'){
                if(char.children[0].value == ''){
                    alert('Вы не ввели инициативу')
                    return
                }
                if(char.children.length == 3){
                    alert('Вы не применили NPC, нажмите на кнопку "Ok"')
                    return
                }   
                obj[char.textContent] = char.children[0].value
            } else {
                console.log(char)   
            }
        }

        console.log(obj)        

        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({data:obj})
          }
      
        const resp = await fetch(backend+'/encounterInit',options)
        try{
            const answer = await resp.json()
        } catch(e){
            
        }
        props.setEncounterInit(false)
    }

    function undo(){
        props.encounterInit[1].style.display='block'
        props.setEncounterInit([false,props.encounterInit[1]])  
        props.setHideStartEncounter(false)
    }


    return (
        <div className="blackscreen">
            <div className="wrapper">
                <div className="choose">
                    <div className="toSelect" id='prepare'>
                        <h3>Доступно:</h3>
                        <div className="forChars" ref={toSelect}  isfilled='false'>

                        </div>
                    </div>
                    <div className="controlsAdding">
                        <button className="endBtn" onClick={moveAll}>{'>>'}</button>
                        <button className="endBtn" onClick={moveAll}>{'<<'}</button>
                    </div>
                    <div className="toSelect" id='selected'>
                        <h3>Выбрано:</h3>
                        <div className="forChars" ref={selected}  isfilled='false'>

                            <div className="charToSelect addNPC " onClick={addNPC} id='addnpc'>Добавить NPC</div>
                        </div>
                    </div>
                </div>
                <div className="controlsBtn">
                    <button className="endBtn" onClick={createEncounterCharsList}>Сохранить</button>
                    <button className="endBtn" onClick={undo}>Отменить</button>
                </div>
            </div>

        </div>
    )
}

export default EncounterInit