import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, ScrollView, StatusBar, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import SplashScreen from './SplashScreen';

const FOLDERS = ['personal notes', 'feelings', 'morning pages', 'great ideas'];
const FILTERS = ['filters', 'important', 'to-do', 'favorites'];

const lightTheme = {
  background: '#F5F5F5',
  text: '#333333',
  accent: '#eb6e6e',
  card: '#FFFFFF',
  border: '#E0E0E0',
};

const darkTheme = {
  background: '#1c1c1e',
  text: '#FFFFFF',
  accent: '#eb6e6e',
  card: '#2c2c2e',
  border: '#3c3c3e',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('folders');
  const [currentFolder, setCurrentFolder] = useState('');
  const [folders, setFolders] = useState({});
  const [activeFilters, setActiveFilters] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const noteScaleAnim = useRef(new Animated.Value(1)).current;
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    loadFolders();
  }, [updateTrigger]);

  const loadFolders = async () => {
    try {
      const storedFolders = await AsyncStorage.getItem('folders');
      if (storedFolders !== null) {
        setFolders(JSON.parse(storedFolders));
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const toggleFilter = (filter) => {
    setActiveFilters(prevFilters =>
      prevFilters.includes(filter)
        ? prevFilters.filter(f => f !== filter)
        : [...prevFilters, filter]
    );
  };

  const addNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: '',
      content: '',
      date: new Date().toLocaleDateString(),
      tags: [],
      checklist: [],
      isImportant: false,
      isTodo: false,
      isFavorite: false
    };
    setCurrentNote(newNote);
    setCurrentScreen('noteDetail');
    
    // Remove this part that adds the new note to the current folder
    // const updatedFolders = { ...folders };
    // if (!updatedFolders[currentFolder]) {
    //   updatedFolders[currentFolder] = [];
    // }
    // updatedFolders[currentFolder].push(newNote);
    // setFolders(updatedFolders);
    // AsyncStorage.setItem('folders', JSON.stringify(updatedFolders));
  };

  const saveNote = () => {
    if (currentNote) {
      setFolders(prevFolders => {
        const updatedFolders = { ...prevFolders };
        if (!updatedFolders[currentFolder]) {
          updatedFolders[currentFolder] = [];
        }
        const existingNoteIndex = updatedFolders[currentFolder].findIndex(note => note.id === currentNote.id);
        if (existingNoteIndex !== -1) {
          // Update existing note
          updatedFolders[currentFolder][existingNoteIndex] = currentNote;
        } else {
          // Add new note
          updatedFolders[currentFolder].push(currentNote);
        }
        AsyncStorage.setItem('folders', JSON.stringify(updatedFolders));
        return updatedFolders;
      });
      setCurrentScreen('notes'); // Go back to notes list after saving
    }
  };

  const addNewFolder = () => {
    if (newFolderName.trim() !== '') {
      setFolders(prevFolders => ({
        ...prevFolders,
        [newFolderName]: []
      }));
      setNewFolderName('');
      AsyncStorage.setItem('folders', JSON.stringify({...folders, [newFolderName]: []}));
    }
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const theme = isDarkMode ? darkTheme : lightTheme;

  // Move the styles inside the component
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1c1c1e' : '#F5F5F5',
    },
    container: {
      flex: 1,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 30,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
    },
    folderItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 20,
      borderBottomWidth: 1,
    },
    folderName: {
      fontSize: 18,
    },
    folderCount: {
      fontSize: 18,
      fontWeight: '700',
    },
    newFolderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
    },
    newFolderInput: {
      flex: 1,
      height: 50,
      borderRadius: 25,
      paddingHorizontal: 20,
      marginRight: 10,
    },
    addFolderButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filtersContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 20,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 10,
      marginBottom: 10,
    },
    filterText: {
      fontSize: 14,
      fontWeight: '600',
    },
    noteItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderRadius: 10,
      marginBottom: 15,
    },
    noteTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    notePreview: {
      fontSize: 14,
      marginBottom: 8,
    },
    noteDate: {
      fontSize: 12,
    },
    addButton: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noteHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backButton: {
      padding: 5,
    },
    noteDetailDate: {
      fontSize: 14,
    },
    noteActions: {
      flexDirection: 'row',
    },
    actionButton: {
      padding: 5,
      marginLeft: 10,
    },
    noteDetailContent: {
      flex: 1,
      padding: 15,
    },
    noteDetailTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    noteDetailBody: {
      fontSize: 16,
      marginBottom: 20,
    },
    checklistContainer: {
      marginBottom: 20,
    },
    checklistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: theme.accent,
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: theme.accent,
    },
    checklistText: {
      flex: 1,
      fontSize: 16,
    },
    addChecklistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    addChecklistText: {
      marginLeft: 10,
      fontSize: 16,
    },
    noOutline: {
      outlineWidth: 0,
      outlineStyle: 'none',
    },
    noteContent: {
      flex: 1,
    },
    deleteButton: {
      marginLeft: 10,
    },
  });

  const deleteNote = useCallback((noteId) => {
    console.log('Deleting note with id:', noteId);
    setFolders(prevFolders => {
      const updatedFolders = { ...prevFolders };
      if (updatedFolders[currentFolder]) {
        console.log('Before deletion:', updatedFolders[currentFolder].length);
        updatedFolders[currentFolder] = updatedFolders[currentFolder].filter(note => note.id !== noteId);
        console.log('After deletion:', updatedFolders[currentFolder].length);
        AsyncStorage.setItem('folders', JSON.stringify(updatedFolders));
      }
      return updatedFolders;
    });
  }, [currentFolder]);

  const animateScreenTransition = (toValue) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: toValue === 0 ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (toValue === 0) {
        setCurrentScreen(nextScreen);
        animateScreenTransition(1);
      }
    });
  };

  const setCurrentScreenWithAnimation = (screen) => {
    nextScreen = screen;
    animateScreenTransition(0);
  };

  const renderFolderScreen = () => (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.background,
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -50]
          }) }]
        }
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>folders</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={Object.keys(folders)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.folderItem, { borderBottomColor: theme.border }]}
            onPress={() => {
              setCurrentFolder(item);
              setCurrentScreen('notes');
            }}
          >
            <Text style={[styles.folderName, { color: theme.text }]}>{item}</Text>
            <Text style={[styles.folderCount, { color: theme.accent }]}>{folders[item]?.length || 0}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
      />
      <View style={styles.newFolderContainer}>
        <TextInput
          style={[styles.newFolderInput, { backgroundColor: theme.card, color: theme.text }]}
          value={newFolderName}
          onChangeText={setNewFolderName}
          placeholder="New folder"
          placeholderTextColor={theme.text + '80'}
        />
        <TouchableOpacity style={[styles.addFolderButton, { backgroundColor: theme.accent }]} onPress={addNewFolder}>
          <Ionicons name="add" size={24} color={theme.background} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderNotesScreen = () => {
    const filteredNotes = folders[currentFolder]?.filter(note => {
      if (activeFilters.length === 0) return true;
      return (
        (activeFilters.includes('important') && note.isImportant) ||
        (activeFilters.includes('to-do') && note.isTodo) ||
        (activeFilters.includes('favorites') && note.isFavorite)
      );
    }) || [];

    return (
      <Animated.View 
        style={[
          styles.container, 
          { 
            backgroundColor: theme.background,
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -50]
            }) }]
          }
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentScreen('folders')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>{currentFolder}</Text>
        </View>
        <View style={styles.filtersContainer}>
          {FILTERS.map(filter => (
            <TouchableOpacity 
              key={filter} 
              style={[
                styles.filterButton, 
                { backgroundColor: theme.card },
                activeFilters.includes(filter) && { backgroundColor: theme.accent }
              ]}
              onPress={() => toggleFilter(filter)}
            >
              <Text style={[
                styles.filterText, 
                { color: activeFilters.includes(filter) ? theme.background : theme.text }
              ]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          extraData={folders}
          renderItem={renderNoteItem}
          contentContainerStyle={styles.notesList}
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.accent }]} onPress={addNewNote}>
          <Ionicons name="add" size={24} color={theme.background} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderNoteItem = ({ item }) => {
    const animatePress = () => {
      Animated.sequence([
        Animated.timing(noteScaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(noteScaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return (
      <Animated.View 
        style={[
          styles.noteItem, 
          { 
            backgroundColor: theme.card,
            transform: [{ scale: noteScaleAnim }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.noteContent}
          onPress={() => {
            animatePress();
            setCurrentNote(item);
            setCurrentScreenWithAnimation('noteDetail');
          }}
        >
          <Text style={[styles.noteTitle, { color: theme.text }]}>{item.title}</Text>
          <Text style={[styles.notePreview, { color: theme.text + '80' }]}>{item.content.substring(0, 50)}...</Text>
          <Text style={[styles.noteDate, { color: theme.text + '60' }]}>{item.date}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {
            animatePress();
            deleteNote(item.id);
          }} 
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderNoteDetailScreen = () => (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.background,
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -50]
          }) }]
        }
      ]}
    >
      <View style={styles.noteHeader}>
        <TouchableOpacity onPress={() => setCurrentScreen('notes')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.noteDetailDate, { color: theme.text }]}>{currentNote.date}</Text>
        <View style={styles.noteActions}>
          {/* Add this TouchableOpacity for the save icon */}
          <TouchableOpacity onPress={saveNote} style={styles.actionButton}>
            <Ionicons name="save-outline" size={24} color={theme.text} />
          </TouchableOpacity>
          {/* Existing action buttons */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setCurrentNote({...currentNote, isImportant: !currentNote.isImportant})}
          >
            <Ionicons name="flag-outline" size={24} color={currentNote.isImportant ? theme.accent : theme.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setCurrentNote({...currentNote, isTodo: !currentNote.isTodo})}
          >
            <Ionicons name="checkbox-outline" size={24} color={currentNote.isTodo ? theme.accent : theme.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setCurrentNote({...currentNote, isFavorite: !currentNote.isFavorite})}
          >
            <Ionicons name="heart-outline" size={24} color={currentNote.isFavorite ? theme.accent : theme.text} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.noteDetailContent}>
        <TextInput
          style={[styles.noteDetailTitle, styles.noOutline, { color: theme.text }]}
          value={currentNote.title}
          onChangeText={(text) => setCurrentNote({ ...currentNote, title: text })}
          placeholder="Note title"
          placeholderTextColor={theme.text + '80'}
        />
        <TextInput
          style={[styles.noteDetailBody, styles.noOutline, { color: theme.text }]}
          value={currentNote.content}
          onChangeText={(text) => setCurrentNote({ ...currentNote, content: text })}
          placeholder="Start writing..."
          placeholderTextColor={theme.text + '80'}
          multiline
        />
        <View style={styles.checklistContainer}>
          {currentNote.checklist.map((item, index) => (
            <View key={index} style={styles.checklistItem}>
              <TouchableOpacity
                style={[styles.checkbox, item.checked && styles.checkboxChecked]}
                onPress={() => {
                  const updatedChecklist = [...currentNote.checklist];
                  updatedChecklist[index].checked = !updatedChecklist[index].checked;
                  setCurrentNote({ ...currentNote, checklist: updatedChecklist });
                }}
              >
                {item.checked && <Ionicons name="checkmark" size={18} color={theme.background} />}
              </TouchableOpacity>
              <TextInput
                style={[styles.checklistText, { color: theme.text }]}
                value={item.text}
                onChangeText={(text) => {
                  const updatedChecklist = [...currentNote.checklist];
                  updatedChecklist[index].text = text;
                  setCurrentNote({ ...currentNote, checklist: updatedChecklist });
                }}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addChecklistItem}
        onPress={() => {
          const updatedChecklist = [...currentNote.checklist, { text: '', checked: false }];
          setCurrentNote({ ...currentNote, checklist: updatedChecklist });
        }}
      >
        <Ionicons name="add-circle-outline" size={24} color={theme.text} />
        <Text style={[styles.addChecklistText, { color: theme.text }]}>Add checklist item</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const handleContinue = () => {
    setShowSplash(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      {showSplash ? (
        <SplashScreen onContinue={handleContinue} />
      ) : (
        <>
          {currentScreen === 'folders' && renderFolderScreen()}
          {currentScreen === 'notes' && renderNotesScreen()}
          {currentScreen === 'noteDetail' && renderNoteDetailScreen()}
        </>
      )}
    </SafeAreaView>
  );
}