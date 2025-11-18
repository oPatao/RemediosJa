import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface FilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (category: string | null, maxPrice: number) => void;
}

const categories = ['Medicamentos', 'Saúde', 'Bebê', 'Beleza', 'Higiene', 'Equipamentos'];
const prices = [20, 50, 100, 200];

export default function FilterBottomSheet({ visible, onClose, onApply }: FilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);

  const handleApply = () => {
    onApply(selectedCategory, selectedPrice);
    onClose();
  };

  const handleClear = () => {
      setSelectedCategory(null);
      setSelectedPrice(0);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>Filtrar Busca</Text>
                <TouchableOpacity onPress={onClose}>
                  <Feather name="x" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <ScrollView>
                {/* Categorias */}
                <Text style={styles.sectionTitle}>Categoria</Text>
                <View style={styles.chipsContainer}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.chip, selectedCategory === cat && styles.chipSelected]}
                      onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    >
                      <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextSelected]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Faixa de Preço */}
                <Text style={styles.sectionTitle}>Preço Máximo</Text>
                <View style={styles.chipsContainer}>
                  {prices.map((price) => (
                    <TouchableOpacity
                      key={price}
                      style={[styles.chip, selectedPrice === price && styles.chipSelected]}
                      onPress={() => setSelectedPrice(selectedPrice === price ? 0 : price)}
                    >
                      <Text style={[styles.chipText, selectedPrice === price && styles.chipTextSelected]}>
                        Até R$ {price},00
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>Limpar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                  <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  chipSelected: {
    backgroundColor: '#e6f7eb', // Verde claro do iFood
    borderColor: '#28a745',
  },
  chipText: {
    color: '#333',
  },
  chipTextSelected: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  clearButton: {
      padding: 15,
  },
  clearButtonText: {
      color: 'gray'
  },
  applyButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});