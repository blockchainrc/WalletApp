import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Alert, ToastAndroid, DeviceEventEmitter } from 'react-native';
import SubmitButton from '../../components/SubmitButton'
import SQLUtils from '../../utils/SQLUtils'
let sqlite = new SQLUtils()
import web3API from '../../utils/web3API'
import {connect} from "react-redux";
import {NavigationActions } from 'react-navigation';
let web3 = new web3API()
import web3Utils from '../../utils/web3Utils';
@connect((store) => {
  return {}
})
export default class ImportPrivateKey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privatekey: '',
      account: '',
      password: '',
      confirmPassword: '',
    }
  }
  componentDidMount = () => {
    sqlite.close()
  }

  popToHome = (emitterValue) => {
    DeviceEventEmitter.emit('WALLET', emitterValue);
    this.props.dispatch(NavigationActions.back());
  }

  setAccount(text) {
    this.setState({account: text});
  }
  setPassword(text) {
    this.setState({password: text});
  }
  setConfirmPassword(text) {
    this.setState({confirmPassword: text});
  }
  onPressImport = () => {
    if(!web3.validateIfEmpty(this.state.privatekey)){
      ToastAndroid.show('私钥不能为空', ToastAndroid.SHORT);
      return;
    }
    else if(!web3.validateIfEmpty(this.state.account)){
      ToastAndroid.show('账户不能为空', ToastAndroid.SHORT);
      return;
    }
    else if(!web3.validateIfEmpty(this.state.password)){
      ToastAndroid.show('密码不能为空', ToastAndroid.SHORT);
      return;
    }
    if (this.state.password != this.state.confirmPassword) {
      ToastAndroid.show('两次密码不一致', ToastAndroid.SHORT);
      return;
    }
    let account_name = this.state.account;
    let password = this.state.confirmPassword;
    let  privatekey = this.state.privatekey;

    web3Utils.importPrivateKey(account_name,privatekey,password).then((data) => {
      sqlite.insertWallets(data).then((msg) => {
        if (msg == "1") {
          Alert.alert('导入成功 ！');
          this.popToHome('success');
          //this.props.dispatch(link('Home'));
        } else {
          Alert.alert("插入账号数据发生意外错误！");
          this.popToHome('success');
          //this.props.dispatch(link('Home'));
        }
      }).catch((err) => {
        Alert.alert("插入账号数据发生意外错误！", err);
      })
    }).catch((err) => {
      Alert.alert("发生意外错误！");
      this.popToHome('fail');
      //this.props.dispatch(link('Home'));
    })
    /*
    web3.importWallet(account_name, password, keystore).then((msg) => {
      if (msg != null) {
        console.log(msg)
        sqlite.getAllActionHistory().then((histories) => {
          console.log(histories)
          let msgString = JSON.stringify(msg)
          let data = {
            id: histories[histories.length - 1].id,
            resulttype: msg.data.code,
            resultmsg: msgString
          }
          sqlite.updateActionHistory(data).then(() => {
            console.log('更新成功')
          }).catch(() => {
            console.log('更新失败')
          })
        }).catch((err) => {
          console.log(err)
        })
        if (msg.data.code == 1) {
          if (account_name != null || account_name != '') {
            let data = msg.data
            data.data.name = account_name;
            sqlite.insertWallets(data.data).then((msg) => {
              if (msg == "1") {
                Alert.alert('导入成功 ！');
                this.popToHome('success');
                //this.props.dispatch(link('Home'));
              } else {
                Alert.alert("插入账号数据发生意外错误！");
                this.popToHome('success');
                //this.props.dispatch(link('Home'));
              }
            }).catch((err) => {
              Alert.alert("插入账号数据发生意外错误！", err);
            })
          }
        } else {
          Alert.alert("私钥串或者密码错误，请重新输入！");
        }
      } else {
        Alert.alert("发生意外错误！");
        this.popToHome('fail');
        //this.props.dispatch(link('Home'));
      }
    }).catch((err) => {
      Alert.alert("发生意外错误！");
      this.popToHome('fail');
      //this.props.dispatch(link('Home'));
    })*/
  }
  renderItem(text, password, isPassword, changeInput) {
    return (
      <View>
        <View style={styles.grayLine}/>
        <View style={styles.keyContainer}>
          <Text style={styles.text}>{text}</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            onChangeText={(text) => changeInput(text)}
            value={password}
            secureTextEntry={isPassword}
          />
        </View>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.keyContainer}>
            <Text style={styles.keyText}>*</Text>
            <TextInput
              style={styles.keystore}
              multiline
              underlineColorAndroid="transparent"
              onChangeText={(text) => this.setState({privatekey: text})}
              value={this.state.privatekey}
              placeholder={'明文私钥'}
            />
          </View>
          {this.renderItem('账户', this.state.account, false, this.setAccount.bind(this))}
          {this.renderItem('输入密码', this.state.password, true, this.setPassword.bind(this))}
          {this.renderItem('确认密码', this.state.confirmPassword, true, this.setConfirmPassword.bind(this))}
        </View>
        <SubmitButton enable buttonText={'开始导入'} onPressButton={this.onPressImport.bind(this)}/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE',
  },
  inputContainer: {
    paddingLeft: 10,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  keyContainer: {
    flexDirection: 'row'
  },
  keyText: {
    color: 'red',
    paddingTop: 10,
  },
  keystore: {
    flex: 1,
    height: 110,
    textAlignVertical: 'top',
  },
  grayLine: {
    height: 0.5,
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: 'gray',
  },
  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    height: 50,
    width: 80,
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#71716d',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    textAlignVertical: 'center',
  },
});