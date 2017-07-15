import React, { Component } from 'react';
import {
    AsyncStorage,
    Button,
    Text,
    TextInput,
    View
} from 'react-native';

var Scripts = require("./Scripts.js");

export default class Login extends Component {
    componentDidMount(){
        // Get session key from store and update state
        AsyncStorage.getItem('PhoneNumber', (error, phoneNumber) => {
            if(error){
                // error in getting session key
                console.error(error);
            } else if(phoneNumber && phoneNumber.length == 10) {
                // we have some data.
                //let phoneNumber = result;
                AsyncStorage.getItem('SessionKey', (error, sessionKey) => {
                    if(error){
                        // error in getting session key
                        console.log(error);
                    } else if(sessionKey && sessionKey.length == 46) {
                        // we have some data.
                        //let sessionKey = result;
                        AsyncStorage.getItem('FullName', (error, fullName) => {
                            if(error){
                                // error in getting full name
                                console.log(error);
                            } else {
                                this.props.changeState({view:"conversations",phoneNumber:phoneNumber,sessionKey:sessionKey,fullName:fullName});
                            }
                        });
                    } else {
                        // Session key invalid.
                        // Do nothing, let it stay on login view.
                    }
                });
            } else {
                // Phone number invalid.
                // Do nothing, let it stay on login view.
            }
        });
    }


    //////////////////////////////////////////////////////////////////////
    /*  SESSION KEY                                                     */
    //////////////////////////////////////////////////////////////////////
    _setSessionKey() {
        fetch('https://api.zipwhip.com/user/login',{
            method:'POST',
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            body:'username='+this.phoneNumber+'&password='+this.password
        })
        .then((response) => response.json())
        .then((json) => {
            if(json.success) return json.response;
            else Alert.alert("Invalid Username or Password.");
        })
        .then((sessionKey) => {
            AsyncStorage.setItem('PhoneNumber', this.phoneNumber, (error) => {
                if(error){
                    console.log(error);
                } else {
                    AsyncStorage.setItem('SessionKey', sessionKey, (error) => {
                        if(error){
                            console.log(error);
                        } else {
                            this._setFullName(this.phoneNumber,sessionKey);
                        }
                    });
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    //////////////////////////////////////////////////////////////////////
    /*  FULL NAME                                                       */
    //////////////////////////////////////////////////////////////////////
    _setFullName(phoneNumber,sessionKey) {
        fetch('https://api.zipwhip.com/user/get',{
            method:'POST',
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            body:'session='+sessionKey
        })
        .then((resp) => resp.json())
        .then((json) => {
            if(json.success) return json.response;
            else throw json.errorDesc;
        })
        .then((response) => response.user)
        .then((user) => user.fullName)
        .then((fullName) => {
            AsyncStorage.setItem('FullName', fullName, (error) => {
                if(error){
                    console.log(error);
                } else {
                    this.props.changeState({view:"conversations",phoneNumber:phoneNumber,sessionKey:sessionKey,fullName:fullName});
                }
            });
        })
        .catch((error) => {
            console.error(error);
        });
    }
    
    
    render() {
        return (
            <View>
                <TextInput
                    ref='1'
                    keyboardType='phone-pad'
                    returnKeyType='next'
                    placeholder='Phone number'
                    value = {Scripts.formatPhoneNumber(this.phoneNumber)}
                    onChangeText={(text) => this.phoneNumber = text}
                    onSubmitEditing={() => this.refs['2'].focus()}
                />
                <TextInput
                    ref='2'
                    onChangeText={(text) => this.password=text}
                    returnKeyType='send'
                    placeholder='Password'
                    secureTextEntry={true}
                    onSubmitEditing={() => this._setSessionKey()}
                />
                <Button
                    title="Login"
                    onPress={() => this._setSessionKey()}
                />
            </View>
        );
    }
}

