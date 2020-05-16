import * as React from "react";
import { Text, View, Image,  StyleSheet, AsyncStorage } from "react-native";
import axios from "axios";
import { SearchBar, Button } from "react-native-elements";
import { FlatGrid } from 'react-native-super-grid';
import { showMessage, hideMessage } from "react-native-flash-message";




export default function HomeScreen() {
  const [books, setBooks] = React.useState("");
  const [search, setSearch] = React.useState("harry potter");
  
  // Please get a new API key from Google API console for Google Books otherwise the App won't work
  let api_key = "";

  React.useEffect(() => {
    axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=${search}&key=${api_key}`
      )
      .then((response) => {
        let items = response.data.items
        let final= items.map(book => {
          let title = book.volumeInfo.title ? book.volumeInfo.title : null
          let sub = book.volumeInfo.subtitle ? book.volumeInfo.subtitle : null
          let heading = sub ? `${title}: ${sub}` : `${title}`
          let img = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "./assets/img.png"
          let price = book.saleInfo.saleability === "FOR_SALE" ? `${book.saleInfo.listPrice.amount} ${book.saleInfo.listPrice.currencyCode}` : "Not for Sale"
          return (
             {
              heading: heading,
              img: img,
              price: price
             }
          )
        })
        setBooks(final);
        console.log(books)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [search]);

  const handleFavourite = async (index) => {
    try {
      let key = books[index].heading
      await AsyncStorage.setItem(key, JSON.stringify(books[index]))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
    <SearchBar
    placeholder="Type Here..."
    platform="android"
    onChangeText={(text) => setSearch(text)}
    value={search}
  />
    {books ? <FlatGrid
        itemDimension={150}
        items={books}
        style={styles.gridView}
        // staticDimension={300}
        // fixed
        // spacing={20}
        renderItem={({ item, index }) => (
            <View style={[styles.itemContainer, { backgroundColor: "rgb(245, 244, 244)" }]}>
            <Text style={styles.itemName}>{item.heading}</Text>
            <Image source={{uri: item.img}} style={{width: 160, height: 210}} />
           {/* <img src={item.img} /> */}
            <Text style={styles.itemCode}>{item.price}</Text>
            <Button title="Favourite it!" type="outline" onPress={() => {
              showMessage({
                message: "Added to Favourites",
                type: "info",
              })
              handleFavourite(index)}}/>
          </View>
        )}
      />: null}
    </>
  );
}

const styles = StyleSheet.create({
  gridView: {
    marginTop: 15,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
   },
  itemName: {
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
    marginBottom: 10
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: 'black',
    marginTop: 10
  },
});
