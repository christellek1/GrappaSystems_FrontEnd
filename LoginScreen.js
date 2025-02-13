import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const users = [
    { email: 'grappasystems3@gmail.com', password: 'GSRecruit2025', permissions: ['books', 'authors'] },
    { email: 'grappasystems4@gmail.com', password: 'GSRecruit2025', permissions: ['authors'] },
    { email: 'grappasystems5@gmail.com', password: 'GSRecruit2025', permissions: ['books'] }
  ];

  const handleLogin = () => {
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
      Alert.alert("Login Successful", "Welcome! Loading your dashboard...");
      navigation.replace('MainApp', { userEmail: user.email, userPermissions: user.permissions });
    } else {
      Alert.alert("Login Failed", "Invalid credentials, please try again.");
    }
  };

  return (
    <ImageBackground 
      source={require('./bg.jpg')} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.header}>Welcome Back!</Text>
        <Text style={styles.subHeader}>Login to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
        
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={24} 
              color="#666" 
              style={styles.eyeIcon} 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '90%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    color: '#007AFF',
    fontSize: 14,
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 3,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
