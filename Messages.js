import React, { Component } from 'react';

import {
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

var Scripts = require("./Scripts.js");

export default class Messages extends Component {
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
            this.props.changeState({msgSrc:sortedData},(prevState,props)=>setTimeout(() => this.msgList.scrollToEnd(), 100));
        })
        .catch((error) => {
            console.error(error.message);
        });
    }


    _sendMessage(){
        fetch('https://api.zipwhip.com/message/send',{
            method:'POST',
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            body:'session='+this.props.sessionKey+'&contacts=ptn:/'+this.props.toPhoneNumber+'&body='+this.msgToSend
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
                <View style={styles.header}>
                    <View>
                        <Icon name="arrow-back" color="white" style={{fontSize:24}} onPress={() => {
                            this.props.changeState({view:"conversations"});
                        }}/>
                    </View>
                    <View>
                        <Text>{this.props.toFirstName} {this.props.toLastName}</Text>
                        <Text style={styles.subtitle}>{Scripts.formatPhoneNumber(this.props.toPhoneNumber)}</Text>
                    </View>
                    <View></View>
                </View>
                <FlatList
                    ref={(ref) => this.msgList = ref}
                    keyExtractor={(item,index) => index}
                    data={this.props.msgSrc}
                    renderItem={(obj) => {
                        let rd = obj.item;
                        this.firstName = rd.firstName;
                        this.lastName = rd.lastName;
                        if(this.props.phoneNumber == rd.sourceAddress.substr(-10)){
                            return (
                                <View style={styles.row}>
                                    <View style={styles.msg_out}>
                                        <View>
                                            <Text style={styles.msg_phone}>To: {rd.destAddress} </Text>
                                            <Text>{rd.body} </Text>
                                            <Text style={styles.date_out}>{Scripts.formatDate(rd.dateCreated)} </Text>
                                        </View>
                                    </View>
                                    <Text style={{flex:1/10}} >&nbsp;</Text>
                                </View>
                            )
                        } else {
                            return (
                                <View style={styles.row}>
                                    <Text style={{flex:1/10}} >&nbsp;</Text>
                                    <View style={styles.msg_in}>
                                        <View>
                                            <Text style={styles.msg_phone_to}>From: {rd.sourceAddress} </Text>
                                            <Text style={{textAlign:'right'}}>{rd.body} </Text>
                                            <Text style={styles.date_in}>{Scripts.formatDate(rd.dateCreated)} </Text>
                                        </View>
                                    </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
        backgroundColor: '#3F9BBF',
    },
    subtitle:{
        fontSize: 16,
        color: 'white',
    },
  row: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: '#EEEEEE',
  },
  date_out: {
    fontSize: 10,
    color: '#A6A6A6',
    textAlign: 'left',
  },
  date_in: {
    fontSize: 10,
    color: '#A6A6A6',
    textAlign: 'right',
  },
  msg_out: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#A7DFDF',
    padding: 5,
    borderRadius: 8,
  },
  msg_in: {
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
