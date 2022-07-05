import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { RNCamera } from "react-native-camera";
import BarcodeMask from 'react-native-barcode-mask';

function CameraScreen({ navigation }) {
    const { width, height } = Dimensions.get('window');
    const handleRead = (e) => {
        if (e.data) {
            navigation.navigate('ProductScreen', { barcode: e.data })
        }
    }

    return (
        <React.Fragment>
            <View style={styles.container}>
                <RNCamera
                    barCodeTypes={[RNCamera.Constants.BarCodeType.ean13]}
                    //flashMode={RNCamera.Constants.FlashMode.on}
                    style={styles.preview}
                    onBarCodeRead={handleRead}
                    ref={cam => (this.camera = cam)}
                    captureAudio={false}
                >
                    <BarcodeMask showAnimatedLine={true} animatedLineColor='red' width={width / 1.3} height={width / 1.5} />
                </RNCamera>
            </View>
        </React.Fragment>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row"
    },
    preview: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    }
});

export default CameraScreen;