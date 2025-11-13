import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Product = {
  id: number;
  brand: string;
  name: string;
  price: string;
  image_link: string;
  product_type: string;
};

const API_BASE = "https://makeup-api.herokuapp.com/api/v1";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");

  async function load() {
    try {
      const res = await fetch(`${API_BASE}/products.json`);
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = query
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      )
    : products;

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#932097ff" />
        <Text style={styles.muted}>Carregando produtos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>💄 Catálogo de Maquiagem</Text>

      <TextInput
        placeholder="Buscar produto..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        onRefresh={() => {
          setRefreshing(true);
          load();
        }}
        refreshing={refreshing}
        ListEmptyComponent={<Text style={styles.muted}>Nenhum resultado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.image_link }}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.brand}</Text>
              <Text style={styles.cardType}>{item.product_type}</Text>
              <Text style={styles.cardPrice}>💰 ${item.price || "0.00"}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#946196ff",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 20,
    color: "#773f7aff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  muted: {
    color: "#666",
    marginTop: 8,
  },
  input: {
    margin: 16,
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    borderColor: "#EEC",
    borderWidth: StyleSheet.hairlineWidth,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    borderColor: "#873e91ff",
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#222",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#8f2a8fff",
  },
  cardType: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  cardPrice: {
    fontWeight: "600",
    marginTop: 4,
    color: "#4CAF50",
  },
});
