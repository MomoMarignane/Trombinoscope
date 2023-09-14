import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ref, getDatabase, child, get } from 'firebase/database';

const DatabaseScreen = () => {
  const [data, setData] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    // Récupérez les données de la base de données Firebase
    const messagesRef = ref(db, 'messages'); // Référence à la table 'messages'

    // Utilisez la fonction `get` pour obtenir les données
    get(messagesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Transformez les données en un tableau d'objets clé-valeur
        const dataArray = Object.entries(data).map(([id, messageData]) => ({
          id,
          messageData,
        }));
        setData(dataArray);
      } else {
        console.log('Aucune donnée trouvée');
      }
    }).catch((error) => {
      console.error('Erreur lors de la récupération des données :', error);
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
      {data.map((item, index) => (
        <TouchableOpacity key={index} style={styles.itemContainer}>
          <Text style={styles.itemId}>ID: {item.id}</Text>
          <Text style={styles.itemText}>Données: {JSON.stringify(item.messageData)}</Text>
        </TouchableOpacity>
      ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  itemId: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
  },
});

export default DatabaseScreen;