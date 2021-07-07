import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Text,
} from 'react-native';
import {
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import styles from './styles';
import env from './env';

const App: React.FC = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const requestPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      const permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (permission === RESULTS.BLOCKED) {
        Alert.alert(
          'Você negou a permissão',
          'Agora para acessarmos sua localização precisamos que autorize nas configurações do seu app',
          [
            {
              onPress: () => openSettings(),
              style: 'default',
              text: 'Abrir agora',
            },
            {
              onPress: () => {},
              style: 'cancel',
              text: 'Cancelar',
            },
          ],
        );
      }
      return permission;
    }
    const permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, {
      title: 'Olá',
      message: 'Podemos acessar sua localização para ver a previsão do tempo?',
      buttonPositive: 'Sim',
      buttonNegative: 'Não',
    });
    return permission;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const permission = await requestPermission();
    if (permission === RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        async location => {
          console.log(location);
          try {
            const res = await (
              await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${env.API_KEY}&lang=pt_br&units=metric`,
              )
            ).json();
            setMessage(
              `O clima em ${res.name} é: ${res.weather[0].description} com ${res.main.temp} graus, mínima de ${res.main.temp_min} e máxima de ${res.main.temp_max}`,
            );
          } catch (err) {
            setMessage('Não foi possível conectar com o servidor');
          }
          setLoading(false);
        },
        () => {
          setMessage('Não foi possível encontrar sua localização');
          setLoading(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 100},
      );
    } else {
      setMessage('Permissão negada');
    }
  }, [requestPermission]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <TouchableOpacity onPress={load} style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={'#222'} />
        ) : (
          <Text>Atualizar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default App;
