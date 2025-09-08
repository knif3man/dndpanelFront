import { useRef } from 'react'
import './AdminPanel.css'
import backend from '../../urls'
import { useEffect,useState } from 'react'



export default function AdminPanel( props ){

    const form = useRef(null)
    const addStatusEffects = useRef(null)
    const removeStatusEffects = useRef(null)
    const [statusEffectsList,setStatusEffectsList] = useState(null)


    async function getAvailableStatusEffects(){
        const options = {
            method: 'GET',
        }
      
        try{
            const resp = await fetch(backend+'/api/getAvailableStatus',options)
            const ServerStatusEffectsList = await resp.json()
            let tempObj = []
            for(let item of ServerStatusEffectsList){
                tempObj.push(item.statusName)
            }
            setStatusEffectsList(tempObj)
        } catch(e){
            return 'cannot get status effects list'
        }
    }

    useEffect(()=>{
        getAvailableStatusEffects()
    },[])

    useEffect(()=>{
        if(statusEffectsList){
            addStatusEffects.current.options.length=0
            let nullOptions = document.createElement('option')
            nullOptions.value = 'none'
            nullOptions.textContent = 'Не накладывать'
            nullOptions.selected = true
            addStatusEffects.current.append(nullOptions)
            if(typeof(statusEffectsList) != 'string'){
                for(let item of statusEffectsList){
                    let option = document.createElement('option')
                    option.value = item
                    option.textContent = item
                    addStatusEffects.current.append(option)
                }
            } else {
                let option = document.createElement('option')
                    option.value = statusEffectsList
                    option.textContent = statusEffectsList
                    addStatusEffects.current.append(option)
            }
        }
    },[statusEffectsList])

    useEffect((e)=>{
        removeStatusEffects.current.options.length = 0
        let nullOptions = document.createElement('option')
        nullOptions.value = 'none'
        nullOptions.textContent = 'Не снимать'
        nullOptions.selected = true
        removeStatusEffects.current.append(nullOptions)
        for(let char of Object.keys(props.selectedCards)){
            if(props.charsStatusEffects[char] && props.selectedCards[char]){
                if(typeof(props.charsStatusEffects[char]) != 'string'){
                    for(let item of props.charsStatusEffects[char]){
                        let option = document.createElement('option')
                        option.value = item
                        option.textContent = char + ": " + item
                        removeStatusEffects.current.append(option)
                    }
                } else {
                    let option = document.createElement('option')
                        option.value = props.charsStatusEffects[char]
                        option.textContent = char + ": " + props.charsStatusEffects[char]
                        removeStatusEffects.current.append(option)
                }
            }
        }
    },[props.selectedCards])

    function handleAdminPanel(e){
        // props.setisAdminPanelOpen(!props.isAdminPanelOpen)
        // console.log(props.selectedCards)
    }

    function handleAdminPanelClose(){
        props.setisAdminPanelOpen(!props.isAdminPanelOpen)
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
        props.setChars(charList)
      }

    async function handleFormSubmit(e){
        e.preventDefault()
        let dataToSend = {}
        const formData = new FormData(form.current)

        for(let char in props.selectedCards){
            if(props.selectedCards[char]){
                let obj = Object.fromEntries(formData)
                if(props.charsStatusEffects.length >0){
                    if(props.charsStatusEffects[char].indexOf(obj.removeStatusEffects) != -1)
                        dataToSend[char] = obj
                    else{
                        dataToSend[char] = obj
                        dataToSend[char]['removeStatusEffects'] = 'none'
                    }
                } else {
                    dataToSend[char] = obj
                }
            }

            // Обработка ситуации с повышением уровня персонажа
            for(let person of Object.values(props.chars)){
                if(person.char_name == char && props.selectedCards[char]){
                    const expChangeValue = parseInt(Object.fromEntries(formData).EXP)
                    if(person.EXP + expChangeValue >= person.xp_value){
                        const addLvlReq = await fetch(backend + '/api/addLvl',{
                            method:'POST',
                            headers:{
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            body: JSON.stringify({
                                char_name: char,
                                lvl:person.LVL
                            })
                        })

                        const addLvlResponse = await addLvlReq.text()
                    }
                    
                }
            }
        }

        const res = await fetch(backend+'/api/changeCharacters',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(dataToSend)
        })
        const dataFromSever = await res.json()

        for(let char of dataFromSever.changedCharacter){
            props.setSelectedCards(prev =>({
                ...prev,
                [char]:false
            }))
        }
        getChar(props.user)
        addStatusEffects.current.options[0].selected = true

    }

    async function handleHideCharacters(e){

        let objToSend = {}
        let newSelectedCards = props.selectedCards
        for(let char of Object.keys(props.selectedCards)){
            if(props.selectedCards[char]){
                console.log(char)
                objToSend[char]=props.user
                delete newSelectedCards[char]
            }
        }
        props.setSelectedCards(newSelectedCards)

        const response = await fetch(backend + '/api/hideCharacters',{
            method:'POST',
            headers:{
                'Content-type':'application/json;charset=utf-8'
            },
            body: JSON.stringify(objToSend)
        })

        const serverAnswer = await response.status
        if(serverAnswer == 200){
            console.log('sended and recieve')
        }
        handleAdminPanelClose()
    }


    return(
        <section className={props.isAdminPanelOpen?"AdminPanel open":"AdminPanel"} onClick={handleAdminPanel}>
            <section className="hideCharacters">
                <span className='sysBtn left' onClick={handleHideCharacters}><img src="../../../public/hide.png" width={30} height={30}></img></span>
            </section>
            <section className="ufertyros" onClick={handleAdminPanelClose}>
                <img width={20} src={props.isAdminPanelOpen?"arrowDown.png":"arrowUp.png"}/>
            </section>

            <form className='form' ref={form}>
                <section className="AdminPanelSection AdminPanelHp">
                    <section>
                    </section>
                    <input type="number" name='CURRENT_HP' placeholder='Текущее HP'/>
                    {/* <input type="number" name='MAX_HP' placeholder='Максимальное HP'/> */}
                </section>

                <section className="AdminPanelSection AdminPanelExp">
                    <input type="number" name='EXP' placeholder='Опыт'/>
                </section>

                <section className="AdminPanelSection AdminPanelGold">
                    <input type="number" name='GOLD' placeholder='Золото'/>
                </section>

                <section className="AdminPanelSection AdminPanelStatusEffect">
                    <div className="selectWrapper">
                        <label>Снять:</label>
                        <select className='statusEffect' id='removeStatusEffects' name="removeStatusEffects" ref={removeStatusEffects}></select>
                    </div>
                    <div className="selectWrapper">
                        <label>Добавить:</label>
                        <select className='statusEffect' id='addStatusEffects' name="addStatusEffects" ref={addStatusEffects}>
                            <option value="1">test1</option>
                            <option value="2">test2</option>
                            <option value="3">test3</option>
                        </select>
                    </div>
                </section>

                <button type="submit" className='sysBtn' onClick={handleFormSubmit}>Сохранить</button>
            </form>
        </section>
    )
}