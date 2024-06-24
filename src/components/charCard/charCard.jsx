import './charCard.css'
import coin from '/coin.png'
import { useEffect, useRef, useState } from 'react'
import backend from '../../urls'


export default function CharCard( props ){

    console.log(coin)

    const hp = useRef(null)
    const exp = useRef(null)
    const card = useRef(null)

    const [char_name,setChar_name] = useState('')
    const [gold,setGold] = useState(0)
    const [chp,setChp] = useState(0)
    const [mhp,setMhp] = useState(10)
    const [cexp,setCexp] = useState(0)
    const [mexp,setMexp] = useState(10)
    const [lvl,setLvl] = useState(10)

    

    useEffect(()=>{
        for(let c of props.charlist){
            if(c.char_name == props.CharName){
                //  console.log(c)
                setChar_name(c.char_name)
                setGold(c.GOLD)
                setChp(c.CURRENT_HP)
                setMhp(c.MAX_HP)
                setCexp(c.EXP)
                setMexp(c.xp_value)
                setLvl(c.LVL)
            }
        }

    },[props.charlist])

    useEffect(()=>{
        hp.current.style.width = Math.round(200 /100 * (chp/(mhp/100))) + 'px'
        exp.current.style.width = Math.round(200 /100 * (cexp/(mexp/100))) + 'px'
    },[chp,exp])

    function openCharsheet(charname){
        props.setCharname(charname)
        props.setShowChars(false)
        props.setisCharsheet(true)
    }

    function handlePClick(){
        openCharsheet(char_name)
    }

    function handleDivClick(e){
        if(!props.isAdminPanelOpen){
            props.setisAdminPanelOpen(true)
        }
        props.setSelectedCards(prev=>({
            ...prev,
            [char_name]:!props.selectedCards[char_name]
        }))
    }

    return(
        <>
            <div className="character_card" ref={card} onClick={props.gm?handleDivClick:null} style={props.selectedCards[char_name]?{background:'#2f2f2f95'}:{background:'#80808070'}}>
                <div className="char_name">
                    <p onClick={handlePClick}>{char_name}</p>
                </div>
                <div className="stats">
                    <p>lvl:{lvl}</p>
                    <div className="gggooolllddd" style={
                        {
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            gap:'5px'
                        }
                        }>
                        <img src={coin} width={20} height={20}/>
                        <span className="gold">{gold}</span>
                    </div>
                </div>
                <div className="bars">
                    <div className="progress-back"><div className="progress-bar hp" ref={hp}><span className="progress-value" id='hp'>{chp}/{mhp}</span></div></div>
                    <div className="progress-back"><div className="progress-bar exp" ref={exp}><span className="progress-value" id='exp'>{cexp}/{mexp}</span></div></div>
                </div>
            </div>
        </>
    )
}


