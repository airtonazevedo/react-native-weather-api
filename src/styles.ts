import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    textAlign: 'justify',
    fontSize: 18,
  },
  button: {
    marginTop: 30,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#444',
  },
});

export default styles;
