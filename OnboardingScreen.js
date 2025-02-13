import React, { useRef, useState, useEffect } from 'react';
import { 
  View, Text, Image, StyleSheet, Animated, Dimensions, TouchableOpacity, ScrollView 
} from 'react-native';

const { width } = Dimensions.get('window');

const images = [
  require('./book1.jpg'),
  require('./book2.jpg'),
  require('./book3.jpg'),
];

const texts = [
  'Discover a world of books.',
  'Find your next great read.',
  'Enjoy seamless book browsing.',
];

const OnboardingScreen = ({ navigation }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextPage = (currentPage + 1) % images.length;
      setCurrentPage(nextPage);
      scrollViewRef.current?.scrollTo({ x: nextPage * width, animated: true });
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentPage]);

  const handleScroll = (event) => {
    const newPage = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(newPage);
  };

  const handleNext = () => {
    if (currentPage === images.length - 1) {
      navigation.navigate('Login');
    } else {
      const nextIndex = currentPage + 1;
      setCurrentPage(nextIndex);
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.slide}>
            <Image source={image} style={styles.image} />
            <Text style={styles.text}>{texts[index]}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, { backgroundColor: currentPage === index ? '#007AFF' : '#ccc' }]}
          />
        ))}
      </View>

      {/* Skip and Next buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.buttonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentPage === images.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    marginHorizontal: 32,
  },
  buttonText: {
    color: '#007AFF', // Blue color for buttons
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OnboardingScreen;
