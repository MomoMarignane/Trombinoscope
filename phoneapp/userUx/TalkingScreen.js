import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ref, getDatabase, child, get } from 'firebase/database';
import { useRoute } from '@react-navigation/native';

const DatabaseScreen = () => {
  const [data, setData] = useState([]);
  const db = getDatabase();
  const route = useRoute();
const userName = route.params.userName;

  useEffect(() => {
    // Récupérez les données de la base de données Firebase
    const messagesRef = ref(db, 'messages'); // Référence à la table 'messages'

    // Utilisez la fonction `get` pour obtenir les données
    get(messagesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // const text = messageData.text; // Récupérez le contenu du message
        // const timestamp = messageData.timestamp;
        // Transformez les données en un tableau d'objets clé-valeur
        const dataArray = Object.entries(data).map(([id, messageData]) => ({
          id,
          // text,
          // timestamp,
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
      <Text style={{top: 70, fontSize: 40, textAlign: 'center'}}>
        { userName }
      </Text>
      <ScrollView>
      {data.map((item, index) => (
        <TouchableOpacity key={index} style={styles.itemContainer}>
          {/* <Text style={styles.itemText}>Données: {JSON.stringify(item.messageData)}</Text> */}
          <Text style={styles.itemId}>{item.id}</Text>
          <Text key={item.id} style={{left: 10 , bottom: 5}}>{Object.values(item.messageData).map(entry => entry.text).join(', ')}</Text>
          <Text key={item.id} style={{textAlign: 'right'}}>
            {new Date(Object.values(item.messageData)[0].timestamp).toLocaleString()}
          </Text>
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
    backgroundColor: 'rgba(94, 0, 0, 0.6)',
  },
  itemContainer: {
    backgroundColor: '#F0F0F0',
    top: 150,
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
    bottom: 6,
    right: 4,
  },
  itemText: {
    fontSize: 14,
  },
});

export default DatabaseScreen;