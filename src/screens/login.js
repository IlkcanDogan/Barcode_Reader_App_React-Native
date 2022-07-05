import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EncryptedStorage from 'react-native-encrypted-storage';
import { API_URL } from '../core/constants';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';

//components
import SignLayout from '../components/SignLayout';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

function LoginScreen({ navigation }) {
    const styles = StyleSheet.create({
        forgotPassword: {
            width: '100%',
            alignItems: 'flex-end',
            marginBottom: 24,
        },
        row: {
            flexDirection: 'row',
            marginTop: 4,
        }
    });

    const { colors } = useTheme();
    const [wait, setWait] = useState(false);
    const [isLoggedWait, setIsLoggedWait] = useState(true);

    const [username, setUsername] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [settings, setSettings] = useState({ protocol: '', ip: '', port: '' });

    //#region Is Login
    useEffect(() => {
        EncryptedStorage.getItem('user_session').then((data) => {
            let sessionJson = JSON.parse(data);

            if (sessionJson.isLogin) {
                navigation.navigate('HomeScreen');
            }

            setIsLoggedWait(false)
        }).catch((error) => {
            setIsLoggedWait(false)
        })

        EncryptedStorage.getItem('settings').then((data) => {
            let settingsJson = JSON.parse(data);

            if (settingsJson) {
                setSettings({ ...settingsJson });
            }
        })

    }, [])
    //#endregion

    const handleLogin = () => {
        if (username.value) {
            if (password.value) {
                setWait(true);
                
                axios.post(`${settings.protocol + settings.ip}:${settings.port}` + '/index.php', {
                    username: username.value.trim(),
                    password: password.value
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }).then((resp) => {
                    setWait(false)

                    if (resp.data.status === 'success') {
                        EncryptedStorage.setItem('user_session', JSON.stringify({ isLogin: true })).then(() => {

                        })
                        navigation.navigate('HomeScreen');
                    }
                    else {
                        Alert.alert('Uyarı', 'Kullanıcı adı veya şifreniz yanlış. Lütfen tekrar deneyin!', [
                            { text: "Tamam", onPress: () => { }, }
                        ]);
                    }
                }).catch(() => {
                    setWait(false)
                    Alert.alert('Uyarı', 'Sunucuya ulaşılamıyor, lütfen internet bağlantınızı kontrol edin!', [
                        { text: "Tamam", onPress: () => { }, }
                    ]);
                })
            }
            else {
                setPassword({ ...password, error: 'Lüfen boş bırakmayın!' });
            }
        }
        else {
            setUsername({ ...username, error: 'Lütfen boş bırakmayın!' });
        }
    }

    return (
        <React.Fragment>
            {isLoggedWait ? (
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <ActivityIndicator size="large" color={colors.secondary} />
                </View>
            ) : (
                <React.Fragment>
                    <View style={{ backgroundColor: '#fff', padding: 20, }}>
                        <TouchableOpacity onPress={() => navigation.navigate('SettingScreen')}>
                            <AntDesign name='setting' size={25} color='#000' style={{ alignSelf: 'flex-end' }} />
                        </TouchableOpacity>
                    </View>
                    <KeyboardAwareScrollView style={{ backgroundColor: colors.background, paddingTop: 50 }}>
                        <SignLayout>
                            <Text style={{ fontWeight: 'bold', color: colors.primary, fontSize: 35, marginBottom: 50 }}>Barkod Okuyucu</Text>
                            <TextInput
                                label='Kullanıcı Adı'
                                disabled={wait}
                                returnKeyType='next'
                                onChangeText={text => setUsername({ value: text, error: '' })}
                                error={!!username.error}
                                errorText={username.error}
                                autoCapitalize='none'
                            />
                            <TextInput
                                label='Şifre'
                                disabled={wait}
                                returnKeyType='done'
                                onChangeText={text => setPassword({ value: text, error: '', show: password.show })}
                                error={!!password.error}
                                errorText={password.error}
                                rightButtonClick={() => setPassword({ ...password, show: !password.show })}
                                secureTextEntry={true}
                            />
                            <Button mode="contained" onPress={wait ? null : handleLogin} style={{ backgroundColor: colors.primary }} loading={wait} >
                                {wait ? 'Lütfen bekleyin...' : 'Giriş Yap'}
                            </Button>
                        </SignLayout>
                    </KeyboardAwareScrollView>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

export default LoginScreen