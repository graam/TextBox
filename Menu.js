import React, { Component } from 'react';
import { Modal, Text, StyleSheet, TouchableHighlight, View } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';


class Menu extends Component {

    state = { modalVisible: false}

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {alert("Modal has been closed.")}}>
                    <View style={styles.modal}>
                        <Text>Hello World!</Text>
                        <TouchableHighlight
                            onPress={() => {this.setModalVisible(!this.state.modalVisible) }}>
                            <Text>Hide Modal</Text>
                        </TouchableHighlight>
                    </View>
                </Modal>
                <TouchableHighlight onPress={() => { this.setModalVisible(true) }}>
                    <Text>Menu <Icon name="menu" size={30} /></Text>
                </TouchableHighlight>
            </View>
        );
    }
}

module.exports = Menu;

const styles = StyleSheet.create ({
   container: {
      alignItems: 'flex-start',
      backgroundColor: '#F5FCFF',
      padding: 10
   },
	
   modal: {
      backgroundColor: '#F5FCFF',
      width:100,
      height:'auto',
      marginTop: 30,
      padding: 10,
      paddingTop:2,
   },
	
   text: {
      color: '#3f2949',
      marginTop: 20
   }
})