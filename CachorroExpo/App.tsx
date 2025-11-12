import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacity,
  Platform
} from 'react-native';

// Definição de tipo para os dados da Dog API
interface DogApiData {
  message: string; // URL da imagem
  status: string;
}

const App = () => {
  // NOVO ESTADO: Para guardar o nome da raça
  const [dogBreed, setDogBreed] = useState<string | null>(null); 
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar a imagem do cachorro e extrair a raça
  const fetchDogImage = async () => {
    const apiUrl = 'https://dog.ceo/api/breeds/image/random';
    
    setLoading(true);

    try {
      const response = await fetch(apiUrl);
      const data: DogApiData = await response.json();
      
      if (data.status === 'success') {
        const dogLink = data.message;
        setImageUrl(dogLink);

        // --- LÓGICA DE EXTRAÇÃO DA RAÇA ---
        // A raça está no meio do URL, ex: ".../breeds/hound-afghan/..."
        const parts = dogLink.split('/');
        
        // Pega a penúltima parte da URL
        let breedSlug = parts[parts.length - 2]; 

        // 1. Remove o hífen e separa em palavras ('hound-afghan' -> 'hound afghan')
        let breedName = breedSlug.replace('-', ' ');
        
        // 2. Capitaliza a primeira letra de cada palavra (para exibição)
        breedName = breedName
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        setDogBreed(breedName); // Salva o nome da raça
        // --- FIM DA LÓGICA ---
        
      } else {
        console.error("Erro na resposta da API:", data);
        setImageUrl(null);
        setDogBreed(null);
      }
      
    } catch (error) {
      console.error("Erro ao buscar a imagem do cachorro:", error);
      setImageUrl(null);
      setDogBreed(null);
    } finally {
      setLoading(false);
    }
  };

  // Carrega a primeira imagem ao iniciar o app
  useEffect(() => {
    fetchDogImage();
  }, []); 

  // Exibe tela de carregamento (Spinner)
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4B0082" />
        <Text style={styles.text}>Buscando o melhor amigo...</Text>
      </View>
    );
  }

  // Conteúdo principal (imagem, raça e botão)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cachorro API 🐕: Imagem Aleatória</Text>
      
      {imageUrl ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Raça Atual:</Text>
          <Text style={styles.breedText}>{dogBreed || 'Desconhecida'}</Text>
          
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image} 
            accessibilityLabel={`Imagem do cachorro da raça ${dogBreed}`}
          />
        </View>
      ) : (
        <Text style={styles.errorText}>
          Ops! Não foi possível carregar a imagem.
        </Text>
      )}

      {/* Botão de recarregar */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={fetchDogImage}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Ver Outro Cachorro</Text>
      </TouchableOpacity>
    </View>
  );
};


// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#E6E6FA', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 0, 
  },
  loadingContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#4B0082',
    textAlign: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#6A5ACD',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    width: '100%',
    maxWidth: 350,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6A5ACD',
    marginTop: 5,
  },
  breedText: { // NOVO ESTILO
    fontSize: 24,
    fontWeight: '700',
    color: '#4B0082',
    marginBottom: 15,
  },
  image: {
    width: 280,
    height: 280,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#6A5ACD',
  },
  button: {
    backgroundColor: '#6A5ACD',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default App;