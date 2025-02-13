import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const BookDetailsScreen = ({ route, navigation }) => {
  const { bookKey } = route.params;
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#1a365d',
      },
      headerTintColor: '#fff',
    });
    fetchBookDetails();
  }, [navigation]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://openlibrary.org${bookKey}.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch book details');
      }
      const data = await response.json();

      // Fetch author details for each author
      const authorPromises = (data.authors || []).map(async (author) => {
        try {
          const authorKey = author.author.key;
          const authorResponse = await fetch(`https://openlibrary.org${authorKey}.json`);
          const authorData = await authorResponse.json();
          return {
            ...authorData,
            key: authorKey 
          };
        } catch (error) {
          console.error('Error fetching author:', error);
          return {
            name: 'Unknown Author',
            key: null
          };
        }
      });

      const authorDetails = await Promise.all(authorPromises);

      setBookDetails({
        ...data,
        authorDetails,
      });
    } catch (err) {
      setError('Unable to load book information. Please try again later.');
      console.error('Book details fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookDetails();
  };

  const handleAuthorPress = (authorKey) => {
    if (authorKey) {
      navigation.navigate('AuthorDetailsScreen', { 
        authorKey: authorKey.replace('/authors/', '') 
      });
    }
  };

  const InfoSection = ({ title, children }) => (
    children ? (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionContent}>
          {children}
        </View>
      </View>
    ) : null
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a365d" />
        <Text style={styles.loadingText}>Loading book details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchBookDetails}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        {bookDetails?.covers?.[0] ? (
          <Image
            source={{
              uri: `https://covers.openlibrary.org/b/id/${bookDetails.covers[0]}-L.jpg`,
            }}
            style={styles.coverImage}
          />
        ) : (
          <View style={styles.placeholderCover}>
            <Text style={styles.placeholderText}>
              {bookDetails?.title?.[0] || 'B'}
            </Text>
          </View>
        )}
        <View style={styles.headerOverlay} />
        <Text style={styles.title}>{bookDetails?.title}</Text>
      </View>

      <View style={styles.contentContainer}>
        <InfoSection title="Authors">
          {bookDetails.authorDetails.map((author, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleAuthorPress(author.key)} 
              style={styles.authorButton}
              disabled={!author.key}
            >
              <Text style={[
                styles.authorName, 
                !author.key && styles.authorNameDisabled
              ]}>
                {author.name}
              </Text>
            </TouchableOpacity>
          ))}
        </InfoSection>

        {bookDetails.first_publish_date && (
          <InfoSection title="First Published">
            <Text style={styles.text}>{bookDetails.first_publish_date}</Text>
          </InfoSection>
        )}

        {bookDetails.description && (
          <InfoSection title="Description">
            <Text style={styles.text}>
              {typeof bookDetails.description === 'object'
                ? bookDetails.description.value
                : bookDetails.description}
            </Text>
          </InfoSection>
        )}

        {bookDetails.subjects && bookDetails.subjects.length > 0 && (
          <InfoSection title="Subjects">
            <View style={styles.tagContainer}>
              {bookDetails.subjects.map((subject, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{subject}</Text>
                </View>
              ))}
            </View>
          </InfoSection>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: -10,
  },
  title: {
    fontSize: 26,
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  authorName: {
    color: '#007BFF', 
    fontSize: 16,
    marginBottom: 6,
  },
  authorNameDisabled: {
    color: '#999', 
  },
  infoText: {
    fontSize: 16,
    color: '#555',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    color: '#333',
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#1a365d',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BookDetailsScreen;
