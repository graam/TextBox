import React, { Component } from 'react';
import {
    Button,
    FlatList,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';

var Scripts = require("./Scripts.js");

export default class Conversations extends Component {
    constructor(props){
        super(props);
        this.state = {
            cnvSrc: []
        }
    }

    componentWillMount(){
        //WARNING: If it completes before mounting then it can not update state.
        //this._listConversations();
    }
    componentDidMount(){
        this._listConversations();
        // Set minimum 6 seconds
        this.timer = setInterval(() => this._listConversations(), 6000);
    }
    componentDidUpdate(){
        //
    }
    componentWillUnmount(){
        clearInterval(this.timer);
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
            this.setState({cnvSrc:sortedData});
        })
        .catch((error) => {
            console.error(error);
        })
    }

    _renderHeader = () => {
        return <Button title="End" onPress={() => this.cnvList.scrollToEnd()} />;
    };

    _renderSeparator = () => {
        return (
            <View
                style={{
                height: 1,
                backgroundColor: "#CED0CE",
                }}
            />
        )
    };

    _renderItem = (obj) => {
        let rd = obj.item;
        return (
            <TouchableHighlight onPress={() => {
                clearInterval(this.timer);
                this.props.changeState({view:"messages",fingerprint:rd.fingerprint});
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
            <View>
                <View>
                    <Text>Header</Text>
                </View>
                <FlatList
                    ref={(ref) => this.cnvList = ref}
                    data={this.state.cnvSrc}
                    extraData={this.state}
                    keyExtractor={(item,index) => index}
                    ListHeaderComponent={this._renderHeader}
                    ItemSeparatorComponent={this._renderSeparator}
                    renderItem={this._renderItem}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
