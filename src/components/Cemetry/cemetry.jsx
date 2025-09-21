
import { useEffect } from 'react'
import './cemetry.css'
import grass from '/grass.png' 
import tree_right from '/tree_right.png'
import tree_left from '/tree_left.png'
import gate_right from '/gate_right.png'
import gate_left from '/gate_left.png'
import backend from '../../urls'



const Cemetry = (props) =>{

    async function getDeceasedCharacters(){
        const options = {
        method: 'GET',
        }

        const resp = await fetch(backend+'/getDeceasedCharacters',options)
        const answer = await resp.json()
        drawDeceasedCharacters(answer)
    }

    function drawDeceasedCharacters(list){
        let contentDiv = document.querySelector('.cemetryContent')
        contentDiv.innerHTML = ''
        for (let char of list){
            let charData = char
            let graveDiv = document.createElement('div')
            graveDiv.className = 'grave'

            let charNameSpan = document.createElement('span')
            charNameSpan.className = 'charName'
            charNameSpan.innerText = 'Имя: ' + charData['char_name'].replace('RIP','')
            console.log(charNameSpan)

            let lvlSpan = document.createElement('span')
            lvlSpan.className = 'lvl'
            lvlSpan.innerText = 'Уровень: ' + charData['LVL']

            let goldSpan = document.createElement('span')
            goldSpan.className = 'gold'
            goldSpan.innerText = 'Золото при смерти: ' + charData['GOLD']

            let goldIcon = document.createElement('img')
            goldIcon.src = "/coin.png"
            goldIcon.width = 26
            goldIcon.height = 26

            graveDiv.append(charNameSpan)
            graveDiv.append(lvlSpan)
            goldSpan.append(goldIcon)
            graveDiv.append(goldSpan)
            contentDiv.append(graveDiv)
        }
    }

    function handleScroll(e){
            let treeLeft = document.querySelector('#tree-left');
            let treeRight = document.querySelector('#tree-right');
            let gateLeft = document.querySelector('#gate-left');
            let gateRight = document.querySelector('#gate-right');
            let text = document.querySelector('.text')
            
            let value = window.scrollY;
            
            text.style.top = 255-(value*0.4) + 'px'
            treeLeft.style.left = -value*0.6 + 'px'
            treeRight.style.left = value*0.6 + 'px'
        
            gateLeft.style.left = -value*0.2 + 'px'
            gateRight.style.left = value*0.2 + 'px'
    }

    function closeCemetry(){
        props.setIsCemetry(false)
    }

    useEffect(()=>{
        getDeceasedCharacters()
        window.addEventListener('wheel',handleScroll)
        return (window.removeEventListener('scroll', handleScroll))    
    },[])


    return (
        <>
            <div className="cemetryWrapper">
                <span className="text">Скроль вниз</span>
                <div className="fog"><div></div></div>
                <img src={tree_left} id="tree-left"/>
                <img src={tree_right} id="tree-right"/>
                <img src={grass} id="grass"/>
                <img src={gate_left} className="gateL" id="gate-left"/>
                <img src={gate_right} className="gateR" id="gate-right"/>
            </div>
            <div className="cemetryContent">
            </div>
            <button className='cemetryBackBtn' onClick={closeCemetry}>Назад</button>

        </>
    )
}

export default Cemetry