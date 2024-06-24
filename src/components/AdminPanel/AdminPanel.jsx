import { useRef } from 'react'
import './AdminPanel.css'
import backend from '../../urls'



export default function AdminPanel( props ){

    const form = useRef(null)

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
                dataToSend[char] = Object.fromEntries(formData)
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
    }


    return(
        <section className={props.isAdminPanelOpen?"AdminPanel open":"AdminPanel"} onClick={handleAdminPanel}>
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

                <button type="submit" className='sysBtn' onClick={handleFormSubmit}>Сохранить</button>
            </form>
        </section>
    )
}