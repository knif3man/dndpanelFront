import { useEffect,useState,useRef } from 'react'
import './charsheet.css'
import backend from '../../urls'


export default function Charsheet( props ){

    const charsheet = useRef(null)
    const notify = useRef(null)
    const saveBTN = useRef(null)

    const [CharsheetData,setCharsheetData] = useState(null)
    const [needUpdate,setNeedUpdate] = useState(false)

    async function getChar(user){
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({user:user})
      }
  
      const resp = await fetch(backend+'/api/getChar',options)
      const dataFromServerWithChars = await resp.json()
      console.log(dataFromServerWithChars)
      props.setChars(dataFromServerWithChars)
    }

    useEffect(()=>{
      async function getCharsheet(charname){
        
        const resp = await fetch(backend+'/api/getCharsheet',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({charname:charname})
      })
        const data = await resp.json()
        setCharsheetData(data)
      }

      getCharsheet(props.charname)

    },[])

    useEffect(()=>{
      if(CharsheetData){
        Object.keys(CharsheetData[0]).forEach(element =>{
          //= CharsheetData[0][element]
          try{
            if(document.getElementsByName(element)[0].nodeName == 'INPUT' && document.getElementsByName(element)[0].type == 'checkbox'){
              if(CharsheetData[0][element] == 1){
                document.getElementsByName(element)[0].checked = true
              } else {
                document.getElementsByName(element)[0].checked = false
              }
            }else {
              document.getElementsByName(element)[0].value = CharsheetData[0][element].replace(/@@@X/gi,'\n').replace(/@@@Y/g,'"')
            }
          } catch {
            document.getElementsByName(element)[0]
          }
        })

      }
    },[CharsheetData])

    function save(){
      setNeedUpdate(true)
    }

    useEffect(()=>{
      if(needUpdate){
        let dataToSave = {}
        const allInputs = charsheet.current.getElementsByTagName('input')
        const allTextArea = charsheet.current.getElementsByTagName('TextArea')
        const exhaustion = document.querySelectorAll('.exhaustion_item__checkbox')

        for(let x=0;x<allInputs.length;x++){
          if(allInputs[x].type == 'checkbox'){
              if(allInputs[x].checked){
                  dataToSave[allInputs[x].name]=1
              } else {
                  dataToSave[allInputs[x].name]=0
              }
          } else {
              if(allInputs[x].id != 'doNotUseForGrabData'){
                dataToSave[allInputs[x].name]=allInputs[x].value
              }
          }
        }
        for(let x=0;x<allTextArea.length;x++){
          dataToSave[allTextArea[x].name]=allTextArea[x].value.replace(/"/g,'@@@Y')
        }

        for(let c of exhaustion){
          console.log(c,c.checked)
          if(c.checked){
            dataToSave[c.name]=1
          } else {
            dataToSave[c.name]=0
          }
        }



        console.log('data: ',dataToSave)

        async function sendCharToServer(dataToSave){
          const options =
          {
            method:'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(dataToSave)
          }
          const res = await fetch(backend+'/api/saveCharData',options)
          const data = await res.json()
          notify.current.innerText = data.status.toString()
          notify.current.className = 'infoMessagesActive'
          getChar(props.username)

          saveBTN.current.disabled = true
          setTimeout(()=>{
            notify.current.className = 'infoMessages'
            saveBTN.current.disabled = false
          },2000)
          
        }
        sendCharToServer(dataToSave)
        setNeedUpdate(false)



        
      }
    },[needUpdate])


    function exhaustionClick(e){
      let exhaustionWrapper = e.target.parentNode.parentNode
      let currentExhaustion = parseInt(e.target.name)
      for(let exhaustion_item of exhaustionWrapper.children){
        if(exhaustion_item.children.length > 1){
          for(let item of exhaustion_item.children){
            if(item.type == 'checkbox'){
              if(parseInt(item.name) < currentExhaustion){
                item.checked = true
                console.log(item,item.checked)
              }
            }
          }
        }
      }

    }

    return(
        <>
            <div className="charsheet_wrapper">
              <div className="exhaustionWrapper">
                  <h3>Степени истощения</h3>
                  <div className="exhaustion">
                    <div className="exhaustion_item">
                      <label className="exhaustion_item__label" htmlFor='exhautstion_item_0' title='Помеха при проверках характеристик'>1-я степень</label>
                      <input type="checkbox" name="0" id="exhautstion_item_0" className='exhaustion_item__checkbox' onClick={exhaustionClick}/>
                    </div>
                    <div className="exhaustion_item">
                      <label className="exhaustion_item__label" htmlFor='exhautstion_item_1' title='Скорость уменьшается вдвое'>2-я степень</label>
                      <input type="checkbox" name="1" id="exhautstion_item_1" className='exhaustion_item__checkbox' onClick={exhaustionClick}/>
                    </div>
                    <div className="exhaustion_item">
                      <label className="exhaustion_item__label" htmlFor='exhautstion_item_2' title='Помеха при бросках атаки и спасбросках'>3-я степень</label>
                      <input type="checkbox" name="2" id="exhautstion_item_2" className='exhaustion_item__checkbox' onClick={exhaustionClick}/>
                    </div>
                    <div className="exhaustion_item">
                      <label className="exhaustion_item__label" htmlFor='exhautstion_item_3' title='Максимум хитов уменьшается вдвое'>4-я степень</label>
                      <input type="checkbox" name="3" id="exhautstion_item_3" className='exhaustion_item__checkbox' onClick={exhaustionClick}/>
                    </div>
                    <div className="exhaustion_item">
                      <label className="exhaustion_item__label" htmlFor='exhautstion_item_4' title='Скорость снижается до 0'>5-я степень</label>
                      <input type="checkbox" name="4" id="exhautstion_item_4" className='exhaustion_item__checkbox' onClick={exhaustionClick}/>
                    </div>
                    <div className="exhaustion_item">
                      <label className="exhaustion_item__label" htmlFor='exhautstion_item_5' title='Смерть'>6-я степень</label>
                      <input type="checkbox" name="5" id="exhautstion_item_5" className='exhaustion_item__checkbox' onClick={exhaustionClick}/>
                    </div>
                  </div>
                </div>
              <form className="charsheet" ref={charsheet}>
                <header>
                  <section className="charname">
                    <label htmlFor="charname">Character Name</label><input name="charname" placeholder="Thoradin Fireforge" />
                  </section>
                  <section className="misc">
                    <ul>
                      <li>
                        <label htmlFor="classlevel">Class & Level</label><input name="classlevel" placeholder="Paladin 2" />
                      </li>
                      <li>
                        <label htmlFor="background">Background</label><input name="background" placeholder="Acolyte" />
                      </li>
                      <li>
                        <label htmlFor="playername">Player Name</label><input name="playername" placeholder="Player McPlayerface"/>
                      </li>
                      <li>
                        <label htmlFor="race">Race</label><input name="race" placeholder="Half-elf" />
                      </li>
                      <li>
                        <label htmlFor="alignment">Alignment</label><input name="alignment" placeholder="Lawful Good" />
                      </li>
                      <li>
                        <label htmlFor="experiencepoints">Experience Points</label><input name="experiencepoints" placeholder="3240" />
                      </li>
                    </ul>
                  </section>
                </header>
                <main>
                  <section>
                    <section className="attributes">
                      <div className="scores">
                        <ul>
                          <li>
                            <div className="score">
                              <label htmlFor="Strengthscore">Strength</label><input name="Strengthscore" placeholder="10" />
                            </div>
                            <div className="modifier">
                              <input name="Strengthmod" placeholder="+0" />
                            </div>
                          </li>
                          <li>
                            <div className="score">
                              <label htmlFor="Dexterityscore">Dexterity</label><input name="Dexterityscore" placeholder="10" />
                            </div>
                            <div className="modifier">
                              <input name="Dexteritymod" placeholder="+0" />
                            </div>
                          </li>
                          <li>
                            <div className="score">
                              <label htmlFor="Constitutionscore">Constitution</label><input name="Constitutionscore" placeholder="10" />
                            </div>
                            <div className="modifier">
                              <input name="Constitutionmod" placeholder="+0" />
                            </div>
                          </li>
                          <li>
                            <div className="score">
                              <label htmlFor="Wisdomscore">Wisdom</label><input name="Wisdomscore" placeholder="10" />
                            </div>
                            <div className="modifier">
                              <input name="Wisdommod" placeholder="+0" />
                            </div>
                          </li>
                          <li>
                            <div className="score">
                              <label htmlFor="Intelligencescore">Intelligence</label><input name="Intelligencescore" placeholder="10" />
                            </div>
                            <div className="modifier">
                              <input name="Intelligencemod" placeholder="+0" />
                            </div>
                          </li>
                          <li>
                            <div className="score">
                              <label htmlFor="Charismascore">Charisma</label><input name="Charismascore" placeholder="10" />
                            </div>
                            <div className="modifier">
                              <input name="Charismamod" placeholder="+0" />
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="attr-applications">
                        <div className="inspiration box">
                          <div className="label-container">
                            <label htmlFor="inspiration">Inspiration</label>
                          </div>
                          <input name="inspiration" type="checkbox" />
                        </div>
                        <div className="proficiencybonus box">
                          <div className="label-container">
                            <label htmlFor="proficiencybonus">Proficiency Bonus</label>
                          </div>
                          <input name="proficiencybonus" placeholder="+2" />
                        </div>
                        <div className="saves list-section box">
                          <ul>
                            <li>
                              <label htmlFor="Strength-save">Strength</label><input name="Strength-save" placeholder="+0" type="text" /><input name="Strength-save-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Dexterity-save">Dexterity</label><input name="Dexterity-save" placeholder="+0" type="text" /><input name="Dexterity-save-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Constitution-save">Constitution</label><input name="Constitution-save" placeholder="+0" type="text" /><input name="Constitution-save-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Wisdom-save">Wisdom</label><input name="Wisdom-save" placeholder="+0" type="text" /><input name="Wisdom-save-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Intelligence-save">Intelligence</label><input name="Intelligence-save" placeholder="+0" type="text" /><input name="Intelligence-save-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Charisma-save">Charisma</label><input name="Charisma-save" placeholder="+0" type="text" /><input name="Charisma-save-prof" type="checkbox" />
                            </li>
                          </ul>
                          <div className="label">
                            Saving Throws
                          </div>
                        </div>
                        <div className="skills list-section box">
                          <ul>
                            <li>
                              <label htmlFor="Acrobatics">Acrobatics <span className="skill">(Dex)</span></label><input name="Acrobatics" placeholder="+0" type="text" /><input name="Acrobatics-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Animal Handling">Animal Handling <span className="skill">(Wis)</span></label><input name="Animal Handling" placeholder="+0" type="text" /><input name="Animal Handling-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Arcana">Arcana <span className="skill">(Int)</span></label><input name="Arcana" placeholder="+0" type="text" /><input name="Arcana-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Athletics">Athletics <span className="skill">(Str)</span></label><input name="Athletics" placeholder="+0" type="text" /><input name="Athletics-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Deception">Deception <span className="skill">(Cha)</span></label><input name="Deception" placeholder="+0" type="text" /><input name="Deception-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="History">History <span className="skill">(Int)</span></label><input name="History" placeholder="+0" type="text" /><input name="History-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Insight">Insight <span className="skill">(Wis)</span></label><input name="Insight" placeholder="+0" type="text" /><input name="Insight-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Intimidation">Intimidation <span className="skill">(Cha)</span></label><input name="Intimidation" placeholder="+0" type="text" /><input name="Intimidation-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Investigation">Investigation <span className="skill">(Int)</span></label><input name="Investigation" placeholder="+0" type="text" /><input name="Investigation-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Medicine">Medicine <span className="skill">(Wis)</span></label><input name="Medicine" placeholder="+0" type="text" /><input name="Medicine-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Nature">Nature <span className="skill">(Int)</span></label><input name="Nature" placeholder="+0" type="text" /><input name="Nature-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Perception">Perception <span className="skill">(Wis)</span></label><input name="Perception" placeholder="+0" type="text" /><input name="Perception-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Performance">Performance <span className="skill">(Cha)</span></label><input name="Performance" placeholder="+0" type="text" /><input name="Performance-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Persuasion">Persuasion <span className="skill">(Cha)</span></label><input name="Persuasion" placeholder="+0" type="text" /><input name="Persuasion-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Religion">Religion <span className="skill">(Int)</span></label><input name="Religion" placeholder="+0" type="text" /><input name="Religion-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Sleight of Hand">Sleight of Hand <span className="skill">(Dex)</span></label><input name="Sleight of Hand" placeholder="+0" type="text" /><input name="Sleight of Hand-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Stealth">Stealth <span className="skill">(Dex)</span></label><input name="Stealth" placeholder="+0" type="text" /><input name="Stealth-prof" type="checkbox" />
                            </li>
                            <li>
                              <label htmlFor="Survival">Survival <span className="skill">(Wis)</span></label><input name="Survival" placeholder="+0" type="text" /><input name="Survival-prof" type="checkbox" />
                            </li>
                          </ul>
                          <div className="label">
                            Skills
                          </div>
                        </div>
                      </div>
                    </section>
                    <div className="passive-perception box">
                      <div className="label-container">
                        <label htmlFor="passiveperception">Passive Wisdom (Perception)</label>
                      </div>
                      <input name="passiveperception" placeholder="10" />
                    </div>
                    <div className="otherprofs box textblock">
                      <label htmlFor="otherprofs">Other Proficiencies and Languages</label><textarea name="otherprofs"></textarea>
                    </div>
                  </section>
                  <section>
                    <section className="combat">
                      <div className="armorclass">
                        <div>
                          <label htmlFor="ac">Armor Class</label><input name="ac" placeholder="10" type="text" />
                        </div>
                      </div>
                      <div className="initiative">
                        <div>
                          <label htmlFor="initiative">Initiative</label><input name="initiative" placeholder="+0" type="text" />
                        </div>
                      </div>
                      <div className="speed">
                        <div>
                          <label htmlFor="speed">Speed</label><input name="speed" placeholder="30" type="text" />
                        </div>
                      </div>
                      <div className="hp">
                        <div className="regular">
                          <div className="max">
                            <label htmlFor="maxhp">Hit Point Maximum</label><input name="maxhp" placeholder="10" type="text" />
                          </div>
                          <div className="current">
                            <label htmlFor="currenthp">Current Hit Points</label><input name="currenthp" type="text" />
                          </div>
                        </div>
                        <div className="temporary">
                          <label htmlFor="temphp">Temporary Hit Points</label><input name="temphp" type="text" />
                        </div>
                      </div>
                      <div className="hitdice">
                        <div>
                          <div className="total">
                            <label htmlFor="totalhd">Total</label><input name="totalhd" placeholder="2d10" type="text" />
                          </div>
                          <div className="remaining">
                            <label htmlFor="remaininghd">Hit Dice</label><input name="remaininghd" type="text" />
                          </div>
                        </div>
                      </div>
                      <div className="deathsaves">
                        <div>
                          <div className="label">
                            <label>Death Saves</label>
                          </div>
                          <div className="marks">
                            <div className="deathsuccesses">
                              <label>Successes</label>
                              <div className="bubbles">
                                <input name="deathsuccess1" type="checkbox" />
                                <input name="deathsuccess2" type="checkbox" />
                                <input name="deathsuccess3" type="checkbox" />
                              </div>
                            </div>
                            <div className="deathfails">
                              <label>Failures</label>
                              <div className="bubbles">
                                <input name="deathfail1" type="checkbox" />
                                <input name="deathfail2" type="checkbox" />
                                <input name="deathfail3" type="checkbox" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section className="attacksandspellcasting">
                      <div>
                        <label>Attacks & Spellcasting</label>
                        <table>
                          <thead>
                            <tr>
                              <th>
                                Name
                              </th>
                              <th>
                                Atk Bonus
                              </th>
                              <th>
                                Damage/Type
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <input name="atkname1" type="text" />
                              </td>
                              <td>
                                <input name="atkbonus1" type="text" />
                              </td>
                              <td>
                                <input name="atkdamage1" type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input name="atkname2" type="text" />
                              </td>
                              <td>
                                <input name="atkbonus2" type="text" />
                              </td>
                              <td>
                                <input name="atkdamage2" type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input name="atkname3" type="text" />
                              </td>
                              <td>
                                <input name="atkbonus3" type="text" />
                              </td>
                              <td>
                                <input name="atkdamage3" type="text" />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <textarea name="ATTACKS&SPELLCASTING"></textarea>
                      </div>
                    </section>
                    <section className="equipment">
                      <div>
                        <label>Equipment</label>
                        <textarea placeholder="Equipment list here" name="Equipment"></textarea>
                      </div>
                    </section>
                  </section>
                  <section>
                    <section className="flavor">
                      <div className="personality">
                        <label htmlFor="personality">Personality</label><textarea name="personality"></textarea>
                      </div>
                      <div className="ideals">
                        <label htmlFor="ideals">Ideals</label><textarea name="ideals"></textarea>
                      </div>
                      <div className="bonds">
                        <label htmlFor="bonds">Bonds</label><textarea name="bonds"></textarea>
                      </div>
                      <div className="flaws">
                        <label htmlFor="flaws">Flaws</label><textarea name="flaws"></textarea>
                      </div>
                    </section>
                    <section className="features">
                      <div>
                        <label htmlFor="features">Features & Traits</label><textarea name="features"></textarea>
                      </div>
                    </section>
                  </section>
                </main>
              </form>
              
              <section className="saveBtnWrapper">
                <button className="saveBytn" onClick={save} id='doNotUseForGrabData' ref={saveBTN}>Сохранить</button>
              </section>         
            </div>
            
            <div className="infoMessages" ref={notify}>

            </div>
        </>
    )
}
