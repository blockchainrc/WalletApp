import React from 'react'
import {StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Alert, TouchableHighlight} from 'react-native';
import Singleton from '../../utils/Singleton';
let single = new Singleton();
import SQLiteUtils from '../../utils/SQLiteUtils';
let sqlite = new SQLiteUtils();
export default class Scanner extends React.Component {
  constructor(props) {
    super(props);
  }
  _onClick = () => {
    sqlite.open();
    console.log(single.getDB());
  }
  _onSearch = () => {
    sqlite.close();
    console.log(single.getDB());
  }
  _onGetDB = () => {
    console.log(single.getDB());
  }
  render() {
    return (
      <View>
        <Text style={styles.text}>db:{this.props.db}</Text>
        <TouchableHighlight onPress={this._onClick}>
          <Text  style={styles.text}>sss</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._onSearch}>
          <Text  style={styles.text}>dddd</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._onGetDB}>
          <Text  style={styles.text}>open</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._onClose}>
          <Text  style={styles.text}>close</Text>
        </TouchableHighlight>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
