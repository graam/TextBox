import React, { Component } from 'react';

import {
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

var Scripts = require("./Scripts.js");

export default class Conversations extends Component {
    constructor(props){
        super(props);
        this.state = {
            msgSrc: []
        }
    }


    componentWillMount(){
        //this._listMessages();
    }
    componentDidMount(){
        this._listMessages();
        this.timer = setInterval(() => this._listMessages(), 2000);
    }
    componentDidUpdate(){
        this.msgList.scrollToEnd();
    }
    componentWillUnmount(){
        clearInterval(this.timer);
    }



    _listMessages(){
        fetch('https://api.zipwhip.com/conversation/get',{
            method:'POST',
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            body:'session='+this.props.sessionKey+'&fingerprint='+this.props.fingerprint+'&start=0&limit=50'
        })
        .then((resp) => resp.json())
        .then((json) => json.response)
        .then((response) => response.messages)
        .then((data) => _sortArrOfObjs(data,"dateCreated"))
        .then((sortedData) => {
            // this.setState({msgSrc:sortedData},(prevState,props)=>this.msgList.scrollToEnd());
            this.setState({msgSrc:sortedData},(prevState,props)=>setTimeout(() => this.msgList.scrollToEnd(), 100));
        })
        .catch((error) => {
            console.error(error.message);
        });
    }


    _sendMessage(){
        fetch('https://api.zipwhip.com/message/send',{
            method:'POST',
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            body:'session='+this.props.sessionKey+'&contacts=ptn:/'+this.toPhoneNumber+'&body='+this.msgToSend
        })
        .then((resp) => resp.json())
        .then((json) => json.success)
        .then((success) => {
            if(success){
                this._listMessages();
            }
        })
        .catch((error) => {
            console.error(error.message);
        });
    }



    render(){
        return (
            <View style={{flex:1}}>
                <FlatList
                    ref={(ref) => this.msgList = ref}
                    keyExtractor={(item,index) => index}
                    extraData={this.state}
                    data={this.state.msgSrc}
                    renderItem={(obj) => {
                        let rd = obj.item;
                        if(this.props.phoneNumber == rd.sourceAddress.substr(-10)){
                            return (
                                <View style={styles.row}>
                                    <Text style={{flex:1/10}} >&nbsp;</Text>
                                    <View style={styles.msg_out}>
                                        <View>
                                        <Text style={styles.msg_phone_to}>To: {rd.destAddress} </Text>
                                        <Text>{rd.body} </Text>
                                        <Text style={styles.date}>{Scripts.formatDate(rd.dateCreated)} </Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        } else {
                            // Update to phone number.
                            this.toPhoneNumber = rd.sourceAddress.substr(-10);
                            return (
                                <View style={styles.row}>
                                    <View style={styles.msg_in}>
                                        <View>
                                        <Text style={styles.msg_phone}>From: {rd.sourceAddress} </Text>
                                        <Text>{rd.body} </Text>
                                        <Text style={styles.date}>{Scripts.formatDate(rd.dateCreated)} </Text>
                                        </View>
                                    </View>
                                    <Text style={{flex:1/10}} >&nbsp;</Text>
                                </View>
                            )
                        }
                    }}
                />
                <View style={styles.footer}>
                    <TextInput style={{flex:1}}
                        ref='msgBox'
                        placeholder="Type a message"
                        onChangeText={(text)=>{
                            this.msgToSend=text;
                        }}
                    />
                    <Button transparent
                        style={{backgroundColor:"#33b5e5"}}
                        title='Send'
                        onPress={() => {
                            this._sendMessage();
                            this.msgToSend='';
                            this.refs['msgBox'].setNativeProps({text:''});
                        }}
                    />
                </View>
            </View>
        )
    }
}


const _sortArrOfObjs = (arrObj,criteria) => {
    return arrObj.sort((a,b) => {
        if (a[criteria] < b[criteria]) {
            return -1;
        }
        if (a[criteria] > b[criteria]) {
            return 1;
        }
        return 0;
    });
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: '#EEEEEE',
  },
  date: {
    flex: 1,
    textAlign: 'right',
    fontSize: 10,
    color: '#A6A6A6',
  },
  msg_in: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#A7DFDF',
    padding: 5,
    borderRadius: 8,
  },
  msg_out: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#DDDDDD',
    padding: 5,
    borderRadius: 8,
  },
  msg_phone: {
    fontSize: 9,
  },
  msg_phone_to: {
    fontSize: 9,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    padding: 2,
    backgroundColor: '#EEEEEE',
  }
});

//exports._sortArrOfObjs = _sortArrOfObjs;
