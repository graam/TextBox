import React, { Component } from 'react';
import {
    AsyncStorage,
    Button,
    FlatList,
    StyleSheet,
    Text,
    TouchableHighlight,
    ToolbarAndroid,
    View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Scripts from "./Scripts.js";
import MenuAndroid from "./MenuAndroid.js";

export default class Conversations extends Component {
    componentWillMount(){
        //WARNING: If it completes before mounting then it can not update state.
        //this._listConversations();
    }
    componentDidMount(){
        this._listConversations();
        // Set minimum 6 seconds
        this.timer = setInterval(() => this._listConversations(), 10000);
    }
    componentDidUpdate(){
        //this.cnvList.scrollToEnd();
    }
    componentWillUnmount(){
        clearInterval(this.timer);
    }
    
    _goToLogin(){
        // Reset session key.
        AsyncStorage.setItem('SessionKey', "", (error) => {
            if(error){
                console.error(error);
            } else {
                this.props.changeState({view:"login"});
            }
        });
    }

    _goToNewMessage(){
        this.props.changeState({view:'compose'})
    }

    _listConversations(){
        fetch('https://api.zipwhip.com/conversation/list',{
            method:'POST',
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            body:'session='+this.props.sessionKey+'&start=0&limit=50'
        })
        .then((resp) => resp.json())
        .then((json) => json.response)
        //.then((data) => _sortArrOfObjs(data,"lastMessageDate"))
        .then((sortedData) => {
            this.props.changeState({cnvSrc:sortedData});
        })
        .catch((error) => {
            //TODO: Show cached list
            console.log("Conversations64:"+error);
        })
    }


    _renderSeparator = () => {
        return (
            <View
                style={{
                height: 1,
                backgroundColor: "#9C9691",
                }}
            />
        )
    };

    _renderItem = (obj) => {
        let rd = obj.item;
        return (
            <TouchableHighlight onPress={() => {
                //clearInterval(this.timer);
                this.props.changeState({view:"messages",fingerprint:rd.fingerprint,toFirstName:rd.lastContactFirstName||"Unknown",toLastName:rd.lastContactLastName,toPhoneNumber:rd.lastContactMobileNumber});
            }}>
                <View style={rd.unreadCount?styles.item_unread:styles.item}>
                    <View style={styles.row}>
                        <Text>{rd.lastContactFirstName?rd.lastContactFirstName:"Unknown"} </Text>
                        <Text>{rd.lastContactLastName} </Text>
                        <Text style={styles.date}>{Scripts.formatDate(rd.lastUpdated)}</Text>
                    </View>
                    <View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.phone}>{Scripts.formatPhoneNumber(rd.lastContactMobileNumber)}</Text>
                            <Text style={styles.unread}>{rd.unreadCount?rd.unreadCount:''}</Text>
                        </View>
                        <Text style={styles.text}>{rd.lastMessageBody}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    };


    render(){
        return(
            <View style={{flex:1}}>
                <View style={styles.header}>
                    <View></View>
                    <View>
                        <Text>{this.props.fullName}</Text>
                        <Text style={styles.subtitle}>{Scripts.formatPhoneNumber(this.props.phoneNumber)}</Text>
                    </View>
                    <MenuAndroid actions={['New Text','Logout']} onPress={this.onPopupEvent} />
                </View>
                <FlatList
                    ref={(ref) => this.cnvList = ref}
                    data={this.props.cnvSrc}
                    extraData={this.state}
                    keyExtractor={(item,index) => index}
                    ItemSeparatorComponent={this._renderSeparator}
                    renderItem={this._renderItem}
                />
            </View>
        )
    }

    onPopupEvent = (eventName, index) => {
        if (eventName !== 'itemSelected') return;
        if (index === 0) this._goToNewMessage();
        else this._goToLogin();
    }
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
    item: {
        padding:5,
        backgroundColor: '#EEEEEE',
    },
    item_unread: {
        padding:5,
        backgroundColor:'#E8FFCC',
    },
    row: {
        flexDirection: 'row',
    },
    unread: {
        textAlign: 'right',
        fontWeight: 'bold',
    },
    phone: {
        flex:1,
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: 14,
    },
    date: {
        flex: 1,
        fontSize: 10,
        color: '#A6A6A6',
        textAlign: 'right',
    },
    text: {
        fontSize:10,
        height:15,
    }
});

