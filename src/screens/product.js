import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { API_URL } from "../core/constants";
import EncryptedStorage from 'react-native-encrypted-storage';
import Theme from "../core/theme";
import axios from 'axios';

//components
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { ScrollView } from "react-native-gesture-handler";

function ProductScreen({ route, navigation }) {
    const { colors } = Theme;
    let barcode = route.params?.barcode || '';

    const [search, setSearch] = useState({ value: barcode, error: '', _wait: !!barcode });
    const [product, setProduct] = useState(null);
    const [settings, setSettings] = useState({ protocol: '', ip: '', port: '' });

    const GetProductData = (api) => {
        axios.get(api + '/?barcode=' + search.value).then((resp) => {
            if (resp.data.status === 'success') {
                setProduct(resp.data);
                setSearch({ ...search, _wait: false });
            }
            else {
                setSearch({ ...search, error: 'Barkod geçersiz!' });
            }
        }).catch(() => {
            setSearch({ ...search, _wait: false });
            Alert.alert('Uyarı', 'Sunucuya ulaşılamıyor, lütfen internet bağlantınızı kontrol edin!', [
                { text: "Tamam", onPress: () => { }, }
            ]);
        })
    }

    useEffect(() => {
        EncryptedStorage.getItem('settings').then((data) => {
            let settingsJson = JSON.parse(data);

            if (settingsJson) {
                setSettings({ ...settingsJson });

                if (barcode) {
                    GetProductData(`${settingsJson.protocol + settingsJson.ip}:${settingsJson.port}`)
                }
            }
        })


    }, [])

    const handleSearch = () => {
        setSearch({ ...search, _wait: true });
        GetProductData(`${settings.protocol + settings.ip}:${settings.port}`);
    }

    const styles = StyleSheet.create({
        category: {
            marginTop: 25,
        },
        categoryTitle: {
            fontSize: 26,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 15
        },
        text: {
            fontSize: 16,
            textAlign: 'center'
        }
    })

    const FormatData = (data) => {
        let arr = [];

        for (var key in data) {
            arr = [...arr, {
                title: key,
                value: data[key]
            }]
        }

        return arr;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 15, paddingTop: 15 }}>
            <ScrollView>
                <TextInput
                    label='Barkod'
                    disabled={search._wait}
                    value={search.value}
                    returnKeyType='next'
                    keyboardType='numeric'
                    onChangeText={text => setSearch({ value: text, error: '' })}
                    error={!!search.error}
                    errorText={search.error}
                    autoCapitalize='none'
                />
                <Button mode="contained" onPress={search._wait ? null : handleSearch} style={{ backgroundColor: colors.secondary }} >
                    {search._wait ? 'Lütfen bekleyin...' : 'Ara'}
                </Button>


                {search._wait ? (
                    <View style={{ marginTop: 50, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                        <ActivityIndicator size="large" color={colors.secondary} />
                    </View>
                ) : (
                    product ? (
                        <React.Fragment>
                            <View style={styles.category}>
                                <Text style={styles.categoryTitle}>Ürün Hakkında</Text>
                                {FormatData(product.product).map((item, index) => {
                                    return (
                                        <Text key={index} style={styles.text}>
                                            {`${item.title}: ${item.value}`}
                                        </Text>
                                    )
                                })}
                            </View>

                            <View style={styles.category}>
                                <Text style={styles.categoryTitle}>Fiyat Bilgisi</Text>
                                {FormatData(product.price).map((item, index) => {
                                    return (
                                        <Text key={index} style={styles.text}>
                                            {`${item.title}: ${item.value}`}
                                        </Text>
                                    )
                                })}
                            </View>

                            <View style={styles.category}>
                                <Text style={styles.categoryTitle}>Stok Bilgisi</Text>
                                {FormatData(product.stock).map((item, index) => {
                                    return (
                                        <Text key={index} style={[styles.text, { fontWeight: parseInt(item.value) ? "bold" : 'normal' }]}>
                                            {`${item.title}: ${item.value}`}
                                        </Text>
                                    )
                                })}
                            </View>
                        </React.Fragment>
                    ) : null
                )}
            </ScrollView>
        </View>
    )
}

export default ProductScreen