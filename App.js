import React, { useRef, useMemo, useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import ListItem from "./components/ListItem";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { getMarketData } from "./services/cryptoService";
import { borderRightColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const ListHeader = () => (
  <>
    <View style={styles.titleWrapper}>
      <Text style={styles.largeTitle}>Markets</Text>
    </View>
    <View style={styles.divider} />
  </>
);

export default function App() {
  const [data, setData] = useState([]);
  const [selectedCoinData, setSelectedCoinData] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [sort, setSort] = useState("market_cap_desc");
  const [numberOfItems, setNumberOfItems] = useState("5");
  const [curr, setCurr] = useState("usd");
  const [currencies, setCurrencies] = useState([
    { label: "US Dollars", value: "usd" },
    { label: "INR", value: "inr" },
    { label: "JPY", value: "jpy" },
    { label: "EUR", value: "eur" },
  ]);
  const [sortItems, setSortItems] = useState([
    { label: "Ascending Market Cap", value: "market_cap_asc" },
    { label: "Descending Market Cap", value: "market_cap_desc" },
    { label: "Ascending Volume", value: "volume_asc" },
    { label: "Descending Volume", value: "volume_desc" },
  ]);

  useEffect(() => {
    const fetchMarketData = async (sort, curr, numberOfItems) => {
      const marketData = await getMarketData(sort, curr, numberOfItems);
      setData(marketData);
      console.log(marketData);
    };

    fetchMarketData(sort, curr, numberOfItems);
  }, [curr, sort, numberOfItems]);

  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ["50%"], []);

  handleItems = (number) => {
    setNumberOfItems(number);
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container}>
        <ListHeader />
        <View style={styles.view}>
          <Text style={styles.left}>Currency</Text>
          <DropDownPicker
            open={open2}
            value={curr}
            items={currencies}
            setOpen={setOpen2}
            setValue={setCurr}
            setItems={setCurrencies}
            style={styles.picker}
            zIndex={3000}
            zIndexInverse={1000}
          />
        </View>
        <View style={styles.view}>
          <Text style={styles.left}>Sort By</Text>
          <DropDownPicker
            open={open}
            value={sort}
            items={sortItems}
            setOpen={setOpen}
            setValue={setSort}
            setItems={setSortItems}
            style={styles.picker}
            zIndex={2000}
            zIndexInverse={2000}
          />
        </View>
        <View style={styles.view}>
          <Text style={styles.left}>Number of Items</Text>
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Number of Items"
            placeholderStyle={{ marginLeft: 5 }}
            autoCapitalize="none"
            onChangeText={this.handleItems}
            style={styles.input}
          />
        </View>

        <FlatList
          keyExtractor={(item) => item.id}
          data={data}
          renderItem={({ item }) => (
            <ListItem
              name={item.name}
              symbol={item.symbol}
              currentPrice={item.current_price}
              priceChangePercentage7d={
                item.price_change_percentage_7d_in_currency
              }
              logoUrl={item.image}
              curr={curr}
            />
          )}
        />
      </SafeAreaView>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        style={styles.bottomSheet}
      ></BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 20,
    backgroundColor: "#fff",
  },
  titleWrapper: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  largeTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 5,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#A9ABB1",
    marginHorizontal: 16,
    marginTop: 16,
  },
  bottomSheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  sort: {
    marginLeft: 210,
    marginRight: 20,
  },
  right: {
    textAlign: "right",
    marginRight: 10,
  },
  left: {
    textAlign: "left",
    marginLeft: 10,
  },
  picker: {
    width: 400,
    marginLeft: 5,
    display: this.open ? "none" : "flex",
  },
  view: {
    marginBottom: 5,
  },
});
