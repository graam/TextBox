import React, { Component } from 'react';

import {
  AppRegistry,
  AsyncStorage,
  Text
} from 'react-native';

import Login from './src/Login.js';
import Conversations from './src/Conversations.js';
import Messages from './src/Messages.js';
import Compose from './src/Compose.js';


export default class TextBox extends Component {
  constructor(props){
    super(props);
    this.state = {
      view: "login",
      cnvSrc: [],
      msgSrc: [],
      phoneNumber:"",
      sessionKey: "",
      fullName:"",
      fingerprint:"",
      toFirstName:"",
      toLastName:"",
      toPhoneNumber:""
    }
  }

  _changeState(obj){
    this.setState(obj);
  }

  render() {
    if(this.state.view == "login"){

      return (
        <Login
          changeState={this._changeState.bind(this)}
        />
      );

    } else if(this.state.view == "conversations") {

      return(
        <Conversations
          sessionKey={this.state.sessionKey}
          changeState={this._changeState.bind(this)}
          cnvSrc={this.state.cnvSrc}
          fullName={this.state.fullName}
          phoneNumber={this.state.phoneNumber}
        />
      );

    } else if(this.state.view == "messages") {

      return (
        <Messages
          phoneNumber={this.state.phoneNumber}
          fingerprint={this.state.fingerprint}
          sessionKey={this.state.sessionKey}
          changeState={this._changeState.bind(this)}
          msgSrc={this.state.msgSrc}
          toFirstName={this.state.toFirstName}
          toLastName={this.state.toLastName}
          toPhoneNumber={this.state.toPhoneNumber}
        />
      )

    } else if(this.state.view == "compose") {

      return (
        <Compose
          phoneNumber={this.state.phoneNumber}
          fingerprint={this.state.fingerprint}
          sessionKey={this.state.sessionKey}
          changeState={this._changeState.bind(this)}
          cnvSrc={this.state.cnvSrc}
          toFirstName={this.state.toFirstName}
          toLastName={this.state.toLastName}
          toPhoneNumber={this.state.toPhoneNumber}
        />
      )

    } else  {

      return <Text>Default view</Text>;

    }
  }
}

AppRegistry.registerComponent('TextBox', () => TextBox);
