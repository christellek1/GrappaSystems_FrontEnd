import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, StyleSheet } from 'react-native';

const AuthorDetailsScreen = ({ route }) => {
  const { authorKey } = route.params; // Get the authorKey from params
  const [authorDetails, setAuthorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAuthorDetails();
  }, [authorKey]); // Dependency array should contain authorKey to refetch if it changes

  const fetchAuthorDetails = async () => {
    try {
      const response = await fetch(`https://openlibrary.org/authors/${authorKey}.json`);
      const data = await response.json();
      setAuthorDetails(data);
    } catch (err) {
      setError('Failed to load author details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {authorDetails.photos && authorDetails.photos[0] && (
        <Image
          source={{
            uri: `https://covers.openlibrary.org/a/id/${authorDetails.photos[0]}-L.jpg`,
          }}
          style={styles.photo}
        />
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.name}>{authorDetails.name}</Text>
        {authorDetails.fuller_name && (
          <Text style={styles.fullName}>Full name: {authorDetails.fuller_name}</Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Life</Text>
          {authorDetails.birth_date && (
            <Text style={styles.dateInfo}>Born: {authorDetails.birth_date}</Text>
          )}
          {authorDetails.death_date && (
            <Text style={styles.dateInfo}>Died: {authorDetails.death_date}</Text>
          )}
        </View>

        {authorDetails.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Biography</Text>
            <Text style={styles.bio}>
              {typeof authorDetails.bio === 'object'
                ? authorDetails.bio.value
                : authorDetails.bio}
            </Text>
          </View>
        )}

        {authorDetails.wikipedia && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wikipedia</Text>
            <Text style={styles.link}>{authorDetails.wikipedia}</Text>
          </View>
        )}

        {authorDetails.links && authorDetails.links.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>External Links</Text>
            {authorDetails.links.map((link, index) => (
              <Text key={index} style={styles.link}>
                {link.title || link.url}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
    marginTop: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0000ff', 
  },
  fullName: {
    fontSize: 16,
    color: '#0066cc', 
    marginBottom: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  dateInfo: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  link: {
    color: '#0066cc',
    fontSize: 16,
    marginVertical: 4,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default AuthorDetailsScreen;
