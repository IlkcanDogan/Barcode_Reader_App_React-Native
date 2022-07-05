import React, { useEffect } from 'react';
import { View, BackHandler } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Theme from '../core/theme';
import Button from '../components/Button';

function HomeScreen({ navigation }) {
    //#region BackButton Disable
    const isFocused = useIsFocused();
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => isFocused)
        return () => backHandler.remove()
    })
    //#endregion
    const { colors } = Theme;
    return (
        <View style={{ backgroundColor: '#fff', flex: 1, paddingHorizontal: 15, }}>
            <View style={{ marginTop: 30 }}>
                <Button mode="contained" onPress={() => navigation.navigate('CameraScreen')} style={{ backgroundColor: colors.secondary }} >
                    Barkod Oku
                </Button>
            </View>
            <View style={{ marginTop: 30 }}>
                <Button mode="contained" onPress={() => navigation.navigate('ProductScreen')} style={{ backgroundColor: colors.secondary }} >
                    Klavye
                </Button>
            </View>
        </View>
    )
}

export default HomeScreen