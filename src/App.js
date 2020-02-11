import React from 'react';
import './App.css';
import {BUTTONS} from "./constants"

const OP_ARR = ["+","-","*","/"]
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      display:"0",
      lastPressed:null,
      currEquation:"0",
      currOp:null

    }
    this.handleClick=this.handleClick.bind(this);
  }

  doCalc(lastPressed){
    let result =Math.round(1000000000000 * eval(this.state.currEquation)) / 1000000000000;
    result = (result=="Infinity" )?"Error":result;   //Handle divide by 0
    if(OP_ARR.indexOf(lastPressed)>=0)
      this.setState({display:result.toString(),lastPressed:lastPressed,currEquation:result.toString()+lastPressed});
    else
      this.setState({display:result.toString(),lastPressed:lastPressed,currEquation:result.toString()});
  }

  updateDisplay(input){
    if(input.type==="OP"){  //handling operations
      if(input.id==="clear") //reset logic
        this.setState({display:"0",lastPressed:null,currEquation:"0"})
      else if(input.id==="decimal"){ 
        if(OP_ARR.indexOf(this.state.lastPressed)>=0)
          this.setState((state)=>({display:"0"+input.value,lastPressed:input.value,currEquation:state.currEquation+"0"+input.value}))
        else if(this.state.lastPressed==="=")
          this.setState((state)=>({display:"0"+input.value,lastPressed:input.value,currEquation:"0"+input.value}))
        else if(this.state.display.indexOf(".")===-1)
          this.setState((state)=>({display:state.display+input.value,lastPressed:input.value,currEquation:state.currEquation+input.value}))
      }
      else if(input.id==="equals")
        this.doCalc(input.value)
      else{  //handle +,-,/ and *
        if(this.state.lastPressed===".") //handle when not pressing anything after pressing decimal
          this.setState((state)=>({currEquation:state.currEquation+"0"}))

        if(OP_ARR.indexOf(this.state.lastPressed)>=0) {//handle when pressing operations repeatedly.take the last one as valid
          if(this.state.lastPressed==="+" && input.value==="-")  //but ignore negative sign
            this.setState((state)=>({lastPressed:input.value,currEquation:state.currEquation+input.value}))

          if(this.state.currEquation.slice(this.state.currEquation.length-2,this.state.currEquation.length)==="+-") 
            this.setState((state)=>({lastPressed:input.value,currEquation:state.currEquation.slice(0,-2)+input.value}))
          else
            this.setState((state)=>({lastPressed:input.value,currEquation:state.currEquation.slice(0,-1)+input.value}))
        }
        else if(this.state.currEquation.indexOf('+')>0 || this.state.currEquation.indexOf('-')>0 || this.state.currEquation.indexOf('*')>0 ||this.state.currEquation.indexOf('/')>0){
          this.doCalc(input.value);
        }
        else{
          this.setState((state)=>({lastPressed:input.value,currEquation:state.currEquation+input.value}))
        }
      }
    }
    else{  //handling numbers
      if(this.state.display ==="0" && input.value!=='0')
        this.setState({display:input.value,lastPressed:input.value,currEquation:input.value})
      if(this.state.display !== "0" ){
        if(OP_ARR.indexOf(this.state.lastPressed)>=0){
          this.setState((state)=>({display:input.value,lastPressed:input.value,currEquation:state.currEquation+input.value}))
        }
        else if(this.state.lastPressed==="=")  //reset the cal when pressing a number after =
          this.setState((state)=>({display:input.value,lastPressed:input.value,currEquation:input.value}))
        else
          this.setState((state)=>({display:state.display+input.value,lastPressed:input.value,currEquation:state.currEquation+input.value}))
      }
    }
  }

  handleClick(e){
    this.updateDisplay(e);
  }
  render(){
    return (<div>
              <span>{this.state.lastPressed}</span><br/>
              <span>{this.state.currEquation}</span><br/>
              <span id="display">{this.state.display}</span><br/>
              {BUTTONS.map((val)=><Button id={val.id} key={val.id} value={val.value} type={val.type} display={val.display} handleClick={this.handleClick}/>)}
            </div>);

  }
}

const Button = (props)=>{
return (<button id={props.id} onClick={()=>props.handleClick(props)}>{props.display}</button>);
}

export default App;
