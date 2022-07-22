import './App.css';
import {useEffect, useState} from 'react';
import beautify from 'json-beautify';
import { validate } from '@websaam/lit-accs-validator';
const dJSON = require('dirty-json');
// const r = dJSON.parse("{ test: 'this is a test'}")
// console.log(JSON.stringify(r));

const getVarType = (val) => Object.prototype.toString.call(val).slice(8, -1).toLowerCase();

function App() {
  const [defaultAcc, setDefaultAcc ] = useState('[{"contractAddress":"0x3110c39b428221012934A7F617913b095BC1078C","standardContractType":"ERC1155","chain":"ethereum","method":"balanceOf","parameters":[":userAddress","9541"],"returnValueTest":{"comparator":">","value":"0"}}]')
  const [defaultV, setDefault] = useState(beautify(JSON.parse(defaultAcc), null, 2, 80))
  const [message, setMessage] = useState(null);

  useEffect(() => {
    
      if( ! message ){
        let res;
        try{
          res = validate(JSON.parse(defaultAcc));
          // setMessage(beautify(dParsed, null, 2, 80));
          setMessage(window.litValidatorStatus);
        }catch(e){
          console.log(e);
          setMessage(window.litValidatorStatus);
        }
      }
   
  }, [])

  const handleMessageChange = event => {

    setMessage({});

    // 👇️ update textarea value
    // setMessage(event.target.value);
    const dParsed = dJSON.parse(event.target.value);

    let res;

    try{
      res = validate(dParsed);
      // setMessage(beautify(dParsed, null, 2, 80));
      setMessage(window.litValidatorStatus);
    }catch(e){
      setMessage({
        status: 'FAILED',
        msg: window.litValidatorStatus.msg ?? 'Something went wrong',
      });
    }
  };

  return (
    <div className="App">
      <h1>Lit Protocol Access Control Conditions Debugger</h1>
      <div className='intro'>
        Documentation: <a target="_blank" href="https://developer.litprotocol.com/docs/AccessControlConditions/intro">https://developer.litprotocol.com/docs/AccessControlConditions/intro</a>
      </div>
      <div className="playground">
        <div className='col'>
          <label htmlFor="input-text">Input</label>
          <textarea defaultValue={defaultV} onChange={handleMessageChange} className="textarea" autoComplete='off'autoCapitalize='off' spellCheck='false'>
            
          </textarea>
        </div>
        <div className="separator"></div>
        <div className="col">
          <label htmlFor="output-text">{ 
            message?.status == 'PASSED' ? <div className="valid">Valid Schema{message?.msg?.length > 1 ? 's' : ''} found</div> : message?.status == 'FAILED' ? <div className="error">Error</div> : 'Waiting...'
          }</label>
          { 
            getVarType(message?.msg) === 'array' && message?.status === 'PASSED' ? 
            <ul>
              {
                message?.msg.map((m) => {
                  return (
                    <li><a target="_blank" href={`https://github.com/LIT-Protocol/lit-accs-validator-sdk/blob/main/src/schemas/${m}.json`}>{ m }</a></li>
                  )
                })
              }
            </ul>
            :
            <>
            { 
              <div class="err-msg">
                { message?.msg }
              </div>
            }
            </>
          }
          {/* <textarea value={message} className="textarea" id="output-text" readOnly="" defaultValue=''></textarea> */}
        </div>
        
      </div>
    </div>
  );
}

export default App;
