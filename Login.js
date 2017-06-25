import React, { Component } from 'react';
import {
    AsyncStorage,
    Button,
    Text,
    TextInput,
    View
} from 'react-native';

export default class Login extends Component {
    componentWillMount(){
        // Get session key from store and update state
        AsyncStorage.getItem('PhoneNumber', (error, result) => {
        if(error){
            // error in getting session key
            console.error(error);
        } else if(result && result.length == 10) {
            // we have some data.
            let phoneNumber = result;
            AsyncStorage.getItem('SessionKey', (error, result) => {
                if(error){
                    // error in getting session key
                    console.error(error);
                } else if(result && result.length == 46) {
                    // we have some data.
                    this.props.changeState({view:"conversations",phoneNumber:phoneNumber,sessionKey:result});
                    //this._setFullName();
                    //this._listConversations();
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


    _formatPhoneNumber(s){
        var s2 = (""+s).replace(/\D/g, '');
        var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
        return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
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
                    console.error(error);
                } else {
                AsyncStorage.setItem('SessionKey', sessionKey, (error) => {
                    if(error){
                        console.error(error);
                    } else {
                        this.props.changeState({view:"conversations",sessionKey:sessionKey});
                    }
                });
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
                    value = {this._formatPhoneNumber(this.phoneNumber)}
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

