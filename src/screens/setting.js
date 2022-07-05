import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Theme from '../core/theme';

//components
import SignLayout from '../components/SignLayout';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

function SettingScreen({ navigation }) {
    const { colors } = Theme;

    const [settings, setSettings] = useState({ protocol: '', ip: '', port: '' });

    useEffect(() => {
        EncryptedStorage.getItem('settings').then((data) => {
            let settingsJson = JSON.parse(data);

            if (settingsJson) {
                setSettings({ ...settingsJson });
            }
        })
    }, []);

    const handleSave = () => {
        EncryptedStorage.setItem('settings', JSON.stringify({ ...settings })).then(() => {
            Alert.alert('Başarılı', 'Değişikliklerin geçerli olabilmesi için lütfen uygulamayı yeniden başlatın!', [
                { text: "Tamam", onPress: () => { }, }
            ]);
        })
    }

    return (
        <React.Fragment>
            <KeyboardAwareScrollView style={{ backgroundColor: colors.background, marginTop: -20 }}>
                <SignLayout>
                    <TextInput
                        label='Protokol'
                        value={settings.protocol}
                        onChangeText={text => setSettings({ ...settings, protocol: text })}
                    />
                    <TextInput
                        label='IP Adresi / Domain'
                        value={settings.ip}
                        onChangeText={text => setSettings({ ...settings, ip: text })}
                    />
                    <TextInput
                        label='Port'
                        value={settings.port}
                        onChangeText={text => setSettings({ ...settings, port: text })}
                        keyboardType='numeric'
                    />
                    <Button mode="contained" onPress={handleSave} style={{ backgroundColor: colors.secondary }} >
                        Kaydet
                    </Button>
                </SignLayout>
            </KeyboardAwareScrollView>
        </React.Fragment>
    )
}

export default SettingScreen;