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

const BookListingScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = async (query, pageNum, sort) => {
    if (query.length < 3) {
      setBooks([]);
      return;
    }

    try {
      setLoading(true);
      const offset = (pageNum - 1) * 20;
      const sortParam = sort === 'title' ? 'title' : 'first_publish_year';
      
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&offset=${offset}&limit=20&sort=${sortParam}`
      );
      const data = await response.json();
      
      const newBooks = data.docs.map(book => ({
        key: book.key,
        title: book.title,
        author: book.author_name ? book.author_name[0] : 'Unknown Author',
        coverId: book.cover_i,
        publishYear: book.first_publish_year,
        authors: book.author_key || []
      }));

      if (pageNum === 1) {
        setBooks(newBooks);
      } else {
        setBooks(prev => [...prev, ...newBooks]);
      }

      setHasMore(newBooks.length === 20);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce((query, pageNum, sort) => {
    fetchBooks(query, pageNum, sort);
  }, 500);

  useEffect(() => {
    if (searchQuery.length >= 3) {
      setPage(1);
      debouncedFetch(searchQuery, 1, sortBy);
    }
  }, [searchQuery, sortBy]);

  const handleLoadMore = () => {
    if (!loading && hasMore && searchQuery.length >= 3) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBooks(searchQuery, nextPage, sortBy);
    }
  };

  const renderBook = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('BookDetails', { bookKey: item.key })}
    >
      <Image
        source={
          item.coverId
            ? { uri: `https://covers.openlibrary.org/b/id/${item.coverId}-M.jpg` }
            : require('./books.jpg')
        }
        style={styles.coverImage}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
        {item.publishYear && (
          <Text style={styles.year}>Published: {item.publishYear}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search books..."
        placeholderTextColor="black"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <View style={styles.sortContainer}>
        <Text style={styles.sortText}>Sort by:</Text>
        <Picker
          selectedValue={sortBy}
          style={styles.picker}
          onValueChange={(value) => setSortBy(value)}
        >
          <Picker.Item label="Title" value="title" />
          <Picker.Item label="Publish Year" value="year" />
        </Picker>
      </View>

      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item, index) => `${item.key}-${index}`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loading && <ActivityIndicator size="large" color="#0066cc" />
        }
      />
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
  bookItem: {
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
  coverImage: {
    width: 90,
    height: 120,
    borderRadius: 10,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  author: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  year: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
  },
});


export default BookListingScreen;
