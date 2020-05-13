import * as React from 'react';
import { Text, View, Image, RefreshControl, AsyncStorage, StyleSheet } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { Button } from "react-native-elements";
import { showMessage, hideMessage } from "react-native-flash-message";



export default function FavouriteScreen() {
  const [favourites, setFavourites] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  

  const fetchFavourites = async() => {
    let realData = []
    let finalData = []
    let asynckeys = await AsyncStorage.getAllKeys()
    let data = await AsyncStorage.multiGet(asynckeys)
    data.forEach(item => realData.push(item[1]))
    realData.forEach(item => finalData.push(JSON.parse(item)))
    await setFavourites(finalData);

  }

  React.useEffect(() => {
      fetchFavourites()
    }, [])

    const onRefresh = React.useCallback(async () => {
      setRefreshing(true);
      fetchFavourites()
      setTimeout(() => {  console.log("Waiting!"); }, 2000);
    }, [refreshing]);
  

    const handleRemove = async (index) => {
      try {
        let key = favourites[index].heading
        await AsyncStorage.removeItem(key)
        fetchFavourites()
      } catch (error) {
        console.error(error)
      }
    }

    return (
      <>
      <Button title="Refresh" type="outline" onPress={() => onRefresh()}/>
      {favourites ? <FlatGrid
        itemDimension={150}
        items={favourites}
        style={styles.gridView}
        // staticDimension={300}
        // fixed
        // spacing={20}
        renderItem={({ item, index }) => (
        <View contentContainerStyle={[styles.itemContainer, { backgroundColor: "rgb(245, 244, 244)" }]}>
            <Text style={styles.itemName}>{item.heading}</Text>
            <Image source={{uri: item.img}} style={{width: 160, height: 210}} />
            <Text style={styles.itemCode}>{item.price}</Text>
            <Button title="Remove" type="outline" onPress={() => {
              showMessage({
                message: "Removed from Favourites",
                type: "info",
              })
              handleRemove(index)}}/>
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