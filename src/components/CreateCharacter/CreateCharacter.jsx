import { useState, useEffect, useRef } from 'react'
import backend from '../../urls'
import "./CreateCharacter.css"


const CreateCharacter = (props) => {  
    
    const[isDataValid,setIsDataValid] = useState(false)
    const[newCharData,setNewCharData] = useState({})
    const addLabelError = useRef(null)

    useEffect(()=>{
        let savedData = JSON.parse(localStorage.getItem('savedData'))
        if(savedData){
            let usedKeys = 0
            Object.values(savedData).forEach(key =>{
                if(key != ""){
                    usedKeys +=1
                }
            })
            if(usedKeys != 0){
                let form = document.querySelector('.addForm')
                Object.keys(savedData).forEach(key =>{
                    if(savedData[key]){
                        form.elements[key].value = savedData[key]
                    } else {
                        form.elements[key].classList.add('error_input')
                    }
                })
            }
        }
    },[])

    useEffect(()=>{
        if(newCharData != []){
            sendNewCharData(newCharData)
        }
    },[newCharData])

    function hideBlacksreen(e,props){
    let form = document.querySelector('.addForm')
    let wrapper = document.querySelector('.wrapper')
    if (e.target.parentNode != form && e.target.parentNode != wrapper && e.target.parentNode.className != 'row' && e.target.parentNode.className != 'blackscreen') {
        localStorage.setItem('savedData',JSON.stringify(getDataFromForm()))
        props.setIsCreateCharacter(false)
    }
    }

    function getDataFromForm() {
        let form = document.querySelector('.addForm')
        let formData = new FormData(form)
        let newCharData = {}
        formData.forEach((value, key) => {
            newCharData[key] = value
        })
        return newCharData
    }

    function validateData(){
        let form = document.querySelector('.addForm')
        let newCharData = getDataFromForm()
        if (!newCharData.name || !newCharData.maxHp || !newCharData.gold || !newCharData.lvl) {
            setIsDataValid(false)
            Object.keys(newCharData).forEach(key => {
                if (!newCharData[key]) {
                    console.log(key)
                    form.elements[key].classList.add('error_input')
                }
            })
        } else {
            console.log(newCharData)
            setIsDataValid(true)
            Object.keys(newCharData).forEach(key => {
                form.elements[key].classList.remove('error_input')
            })
            localStorage.setItem('savedData',JSON.stringify({}))
            setNewCharData(newCharData)
        }
    }

    async function sendNewCharData(dataToSendNewChar){
        console.log('try send')
        let CharData = dataToSendNewChar
        console.log(CharData)
        if(Object.keys(CharData).length > 0){
            CharData['player'] = props.user
            console.log(CharData)
            const options = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(CharData)
            }
          
            const resp = await fetch(backend+'/api/createCharacter',options)
                .then(response =>{
                    return response.text()
                }) 
                .then(answer => {
                    let form = document.querySelector('.addForm')
                    if(answer == 'ok'){            
                        Object.keys(CharData).forEach(key => {
                            if(key != 'player'){
                                form.elements[key].value = ''
                                form.elements[key].classList.remove('error_input')
                            }
                        })
                        props.setIsCreateCharacter(false)
                    } else if( answer == 'Error, that name is used'){
                        setIsDataValid(false)
                        form.elements['name'].classList.add('error_input')
                        setTimeout(()=>{
                            console.log(addLabelError.current.textContent)
                            addLabelError.current.textContent = `Имя ${CharData.name} уже занято!!!`
                        },100)
                    } else {
                        console.log(answer)
                    }
                })
        }
    }
    function removeRed(e){
        try{
            e.target.classList.remove('error_input')
        } catch(e){

        }
    }




    return (
        <div className="blackscreen" onClick={(e) => hideBlacksreen(e, props)}>
            <div className="wrapper" >
                <h2>Создать персонажа</h2>
                {isDataValid?null:<label className='error' id='addLabelError' ref={addLabelError}>Данные заполнены с ошибкой или пустые</label>}
                <form className='addForm'>
                    <div className="row">
                        <label htmlFor="name">Имя:</label>
                        <input type="text" id="name" name="name" className='rowInput' required  onChange={removeRed}/>
                    </div>

                    <div className="row">
                        <label htmlFor="maxHp">HP:</label>
                        <input type="number" id="maxHp" name="maxHp" className='rowInput'required  onChange={removeRed}/>
                    </div>

                    <div className="row">
                        <label htmlFor="gold">Золото:</label>
                        <input type="number" id="gold" name="gold" className='rowInput'required  onChange={removeRed}/>
                    </div>

                    <div className="row">
                        <label htmlFor="lvl">Уровень:</label>
                        <input type="number" id="lvl" name="lvl" className='rowInput' required onChange={removeRed} />
                    </div>  

                    <input type='button' value='Создать' onClick={validateData} className='endBtn'></input>
                </form>
            </div>

        </div>
    )
}

export default CreateCharacter