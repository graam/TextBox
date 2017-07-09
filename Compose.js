import React, { Component } from 'react';

import {
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchBar from 'react-native-searchbar';

var Scripts = require("./Scripts.js");

export default class Compose extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.cnvSrc,
            results: [],
            toNumbers: []
        };
        this._handleResults = this._handleResults.bind(this);
    }

    _handleResults(results) {
        this.setState({ results });
    }

    _addNumber(str){
        if(this.state.toNumbers.indexOf(str) < 0){
            this.state.toNumbers.push(str);
            this.setState({});
        }
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
                //this._listMessages();
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
                        <Text style={styles.subtitle}>{this.props.toPhoneNumber}</Text>
                    </View>
                    <View></View>
                </View>
                <View>
                    <View>
                        {
                            this.state.toNumbers.map((result, i) => {
                                return (
                                    <Text key={i}>{result}</Text>
                                );
                            })
                        }
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <View style={{flex:1}}>
                            <SearchBar
                                ref={(ref) => this.searchBar = ref}
                                data={this.state.items}
                                handleResults={this._handleResults}
                                placeholder='Type phone number'
                                hideBack
                                hideX
                                showOnLoad
                            />
                        </View>
                        <View>
                            <Icon name="add" style={{fontSize:24}}
                                onPress={() => {
                                    let searchTerm = this.searchBar.getValue();
                                    this._addNumber(searchTerm);
                                }}/>
                        </View>
                    </View>
                    <View style={{ marginTop: 40 }}>
                        {
                            this.state.results.map((result, i) => {
                                return (
                                    <TouchableHighlight key={i} onPress={() => {
                                        this._addNumber(result.lastContactMobileNumber);
                                    }}> 
                                        <Text>{result.lastContactMobileNumber}, {result.lastContactFirstName} {result.lastContactLastName}</Text>
                                    </TouchableHighlight>
                                );
                            })
                        }
                    </View>
                </View>
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
                            this.state.toNumbers.forEach((num) => {
                                this.toPhoneNumber = num;
                                this._sendMessage();
                            });
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
