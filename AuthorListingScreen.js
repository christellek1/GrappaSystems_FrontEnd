import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import debounce from 'lodash/debounce';

const AuthorListingScreen = ({ navigation }) => {
  const [authors, setAuthors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [hasMore, setHasMore] = useState(true);

  const fetchAuthors = async (query, pageNum, sort) => {
    try {
      setLoading(true);
      const offset = (pageNum - 1) * 20;
      const url = `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(query)}&offset=${offset}&limit=20`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data && data.docs) {
        const newAuthors = data.docs.map(author => ({
          key: author.key,
          name: author.name || 'Unknown Author',
          birthDate: author.birth_date || null,
          photoUrl: author.key
            ? `https://covers.openlibrary.org/b/id/${author.key.replace('/authors/', '')}-M.jpg`
            : null,
          workCount: author.work_count || 0,
        }));

        const sortedAuthors =
          sort === 'name'
            ? newAuthors.sort((a, b) => a.name.localeCompare(b.name))
            : newAuthors.sort((a, b) => {
                if (!a.birthDate || !b.birthDate) return 0;
                return new Date(a.birthDate) - new Date(b.birthDate);
              });

        if (pageNum === 1) {
          setAuthors(sortedAuthors);
        } else {
          setAuthors(prev => [...prev, ...sortedAuthors]);
        }

        setHasMore(newAuthors.length === 20);
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce((query, pageNum, sort) => {
    fetchAuthors(query, pageNum, sort);
  }, 500);

  useEffect(() => {
    debouncedFetch(searchQuery, page, sortBy);
  }, [searchQuery, sortBy]);

  const handleLoadMore = () => {
    if (!loading && hasMore && searchQuery.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAuthors(searchQuery, nextPage, sortBy);
    }
  };

  const renderAuthor = ({ item }) => {
    console.log('Author Photo URL:', item.photoUrl); 

    return (
      <TouchableOpacity
        style={styles.authorItem}
        onPress={() =>
          navigation.navigate('AuthorDetails', { authorKey: item.key, authorName: item.name })
        }
      >
        <Image
          source={item.photoUrl ? { uri: item.photoUrl } : require('./portrait.jpg')} 
          style={styles.authorImage}
          defaultSource={require('./portrait.jpg')} 
        />
        <View style={styles.authorInfo}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          {item.birthDate && (
            <Text style={styles.birthDate}>Born: {item.birthDate}</Text>
          )}
          <Text style={styles.workCount}>{item.workCount} works</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search authors"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
      />

      <View style={styles.sortContainer}>
        <Text style={styles.sortText}>Sort by:</Text>
        <Picker
          selectedValue={sortBy}
          style={styles.picker}
          onValueChange={(value) => setSortBy(value)}
        >
          <Picker.Item label="Name" value="name" />
          <Picker.Item label="Birth Date" value="birth_date" />
        </Picker>
      </View>

      {loading && authors.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={authors}
          renderItem={renderAuthor}
          keyExtractor={(item) => item.key}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => loading && <ActivityIndicator size="large" color="#0000ff" />}
          ListEmptyComponent={() => <Text style={styles.noResults}>No authors found</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  searchInput: {
    height: 50,
    borderColor: '#0066cc',
    borderWidth: 1.5,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  sortText: {
    fontSize: 18,
    color: '#0066cc',
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 60,
    borderRadius: 25,
    backgroundColor: '#fff',
    color: '#0066cc',
  },
  authorItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  authorImage: {
    width: 90,
    height: 120,
    borderRadius: 10,
  },
  authorInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  birthDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  workCount: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
  },
  loader: {
    marginTop: 20,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default AuthorListingScreen;
