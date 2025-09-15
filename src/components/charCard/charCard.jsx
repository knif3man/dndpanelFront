import './charCard.css'
import coin from '/coin.png'
import { useEffect, useRef, useState } from 'react'
import backend from '../../urls'
import { ReactSVG } from 'react-svg'


export default function CharCard( props ){
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
        for(let c of Object.values(props.charlist)){
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
    },[chp,cexp])

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

    function drawAllStatuses(statusList){
        let returned = []
        if(typeof(statusList) == 'string'){
            returned.push(<img key={0} src={"../../../public/statusEffects/"+ statusList +".svg"} width={32} height={32} title={statusList} onClick={()=>{window.open("https://ttg.club/screens/" + statusList.toLowerCase(), "_blank")}}/>)
        } else {
            statusList.map(status =>{
                returned.push(<img key={props.statusEffect.indexOf(status)} src={"../../../public/statusEffects/"+ status +".svg"} width={32} height={32} title={status} onClick={()=>{window.open("https://ttg.club/screens/" + status.toLowerCase(), "_blank")}}/>)
            })
        }
        return returned
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
                <div className="statusEffects">
                        {
                            props.statusEffect?<span className="statusIMG">{drawAllStatuses(props.statusEffect)}</span>:null
                        }
                </div>
            </div>
        </>
    )
}


