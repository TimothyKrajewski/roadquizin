// src/screens/SelectQuizScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FancyButton from '../components/FancyButton';
import LoadingIndicator from '../components/LoadingIndicator';
import { getQuizTitle } from '../utils/quizTitles';
import { MaterialIcons } from '@expo/vector-icons';

type SelectQuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectQuiz'>;

const QUIZZES_PER_PAGE = 10; // Number of quizzes to show per page
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Complete list of all quiz files in assets/Offline_Quizes folder
const ALL_QUIZ_NAMES = [
  'AfricanHistory', 'AmericanHistory', 'AmericanRevolution', 'Amphibians', 'AncientChina',
  'AncientEgypt', 'AncientGreece', 'AncientHistory', 'Animals', 'Architecture', 'Art',
  'AsianHistory', 'Astronomy', 'Biology', 'Birds', 'Books', 'Capitals', 'Chemistry',
  'Cities', 'CivilWar', 'ClassicLiterature', 'Clouds', 'Colors', 'ColorsAdvanced',
  'Composers', 'Computers', 'Conservation', 'Continents', 'Countries', 'Currency',
  'Dinosaurs', 'DisneyAnimation', 'DisneyAttractions', 'DisneyCharacters', 'DisneyCompany',
  'DisneyHistory', 'DisneyMovies', 'DisneyMusic', 'DisneyParks', 'DisneyPrincesses',
  'DisneyVillains', 'Earthquakes', 'Ecosystems', 'Emotions', 'Energy', 'EuropeanHistory',
  'Explorers', 'Fish', 'Flags', 'Flowers', 'Food', 'Forces', 'Fruits', 'Games',
  'GardeningBasics', 'GardeningFlowers', 'GardeningHerbs', 'GardeningTips',
  'GardeningVegetables', 'Geography', 'GolfBasics', 'GolfCourses', 'GolfEquipment',
  'GolfEtiquette', 'GolfHistory', 'GolfMajors', 'GolfPlayers', 'GolfRules',
  'GolfScoring', 'GolfTips', 'GreekMythology', 'Habitats', 'Holidays', 'HumanBody',
  'Insects', 'Internet', 'Inventions', 'Islands', 'Languages', 'LatinAmericanHistory',
  'Light', 'Machines', 'Mammals', 'Materials', 'Mathematics', 'Measurement',
  'MedievalEurope', 'MedievalHistory', 'MiddleAges', 'Months', 'Mountains', 'Movies',
  'Music', 'Mythology', 'MythsAndLegends', 'NFLDraft', 'NFLHistory', 'NFLPlayers',
  'NFLPlayoffs', 'NFLPositions', 'NFLRecords', 'NFLRules', 'NFLStats', 'NFLSuperBowl',
  'NFLTeams', 'NurseryRhymes', 'Oceans', 'Olympics', 'Physics', 'PiratesCaribbean',
  'PiratesFamous', 'PiratesFiction', 'PiratesGeneral', 'PiratesLife', 'PiratesModern',
  'PiratesMyths', 'PiratesShips', 'PiratesTreasure', 'PiratesWeapons', 'Planets',
  'Plants', 'Poetry', 'Presidents', 'PresidentsAchievements', 'PresidentsAssassinations',
  'PresidentsEarly', 'PresidentsElections', 'PresidentsFirsts', 'PresidentsGeneral',
  'PresidentsLegacy', 'PresidentsModern', 'PresidentsPersonal', 'PresidentsQuotes',
  'PresidentsWars', 'Renaissance', 'RenaissanceHistory', 'Reptiles', 'Rivers',
  'RomanBuildings', 'RomanCulture', 'RomanDailyLife', 'RomanEmperors', 'RomanEmpire',
  'RomanFall', 'RomanLegacy', 'RomanMilitary', 'RomanRepublic', 'RomanWars', 'Seas',
  'Seasons', 'SeasonsAdvanced', 'Senses', 'Shakespeare', 'Shapes', 'Sound', 'Space',
  'Sports', 'Stars', 'StateCapitals', 'StateFacts', 'StateFlags', 'StateGeography',
  'StateHistory', 'StateNicknames', 'StateRecords', 'StateSymbols', 'StateTrivia',
  'States', 'StatesGeneral', 'Technology', 'Time', 'TimeZones', 'Transportation',
  'Trees', 'Vegetables', 'Volcanoes', 'WaterCycle', 'Weather', 'WeatherAdvanced',
  'Weekdays', 'WeirdFoodBans', 'WeirdFoodBeliefs', 'WeirdFoodCurrency', 'WeirdFoodFacts',
  'WeirdFoodHistory', 'WeirdFoodInventions', 'WeirdFoodLuxury', 'WeirdFoodMedicine',
  'WeirdFoodMyths', 'WeirdFoodOrigins', 'WorldGeography', 'WorldWarI',
  'WorldWarIAftermath', 'WorldWarIBattles', 'WorldWarICauses', 'WorldWarII',
  'WorldWarIIAftermath', 'WorldWarIIBattles', 'WorldWarIITimeline', 'WorldWarsComparison',
  'WorldWarsTechnology', 'MarineBiology', 'Genetics', 'Evolution', 'ClimateChange', 'Geology',
  'Meteorology', 'Botany', 'Zoology', 'Microbiology', 'Neuroscience',
  'QuantumPhysics', 'ChemistryAdvanced', 'Anatomy', 'Physiology', 'Ecology',
  'Paleontology', 'Astrophysics', 'Oceanography', 'Biochemistry', 'Pharmacology',
  'Basketball', 'Baseball', 'Soccer', 'Tennis', 'Hockey',
  'OlympicGames', 'Boxing', 'Swimming', 'TrackAndField', 'Cycling',
  'Skiing', 'Surfing', 'Cricket', 'Rugby', 'Volleyball',
  'MarvelMovies', 'StarWars', 'HarryPotter', 'LordOfTheRings', 'GameOfThrones',
  'TheOffice', 'Friends', 'BreakingBad', 'StrangerThings', 'MusicGenres',
  'RockMusic', 'HipHop', 'Jazz', 'ClassicalMusic', 'CountryMusic',
  'AncientRome', 'Vikings', 'MedievalKnights', 'RenaissanceArt', 'IndustrialRevolution',
  'ColdWar', 'VietnamWar', 'KoreanWar', 'FrenchRevolution', 'RussianRevolution',
  'AncientMesopotamia', 'MayanCivilization', 'IncaEmpire', 'AztecEmpire', 'ByzantineEmpire',
  'EuropeanCountries', 'AsianCountries', 'AfricanCountries', 'SouthAmericanCountries',
  'NorthAmericanCountries', 'Islands', 'Deserts', 'Rainforests', 'Mountains', 'Rivers',
  'ShakespearePlays', 'PoetryFamous', 'Novels', 'ScienceFiction', 'Fantasy',
  'Mystery', 'Horror', 'Romance', 'Biographies', 'MythologyNorse',
  'ArtificialIntelligence', 'Cryptocurrency', 'Programming', 'VideoGames', 'SocialMedia',
  'InternetHistory', 'MobileApps', 'Cybersecurity', 'Robotics', 'VirtualReality',
  'CookingBasics', 'WorldCuisines', 'Baking', 'Wine', 'Coffee',
  'USStatesAndCapitals', 'WorldCountriesAndCapitals'
];

// Static quiz mapping for all quiz files - required for React Native bundling
const QUIZ_MAP: { [key: string]: () => any } = {
  'AfricanHistory': () => require('../../assets/Offline_Quizes/AfricanHistory.json'),
  'AmericanHistory': () => require('../../assets/Offline_Quizes/AmericanHistory.json'),
  'AmericanRevolution': () => require('../../assets/Offline_Quizes/AmericanRevolution.json'),
  'Amphibians': () => require('../../assets/Offline_Quizes/Amphibians.json'),
  'AncientChina': () => require('../../assets/Offline_Quizes/AncientChina.json'),
  'AncientEgypt': () => require('../../assets/Offline_Quizes/AncientEgypt.json'),
  'AncientGreece': () => require('../../assets/Offline_Quizes/AncientGreece.json'),
  'AncientHistory': () => require('../../assets/Offline_Quizes/AncientHistory.json'),
  'Animals': () => require('../../assets/Offline_Quizes/Animals.json'),
  'Architecture': () => require('../../assets/Offline_Quizes/Architecture.json'),
  'Art': () => require('../../assets/Offline_Quizes/Art.json'),
  'AsianHistory': () => require('../../assets/Offline_Quizes/AsianHistory.json'),
  'Astronomy': () => require('../../assets/Offline_Quizes/Astronomy.json'),
  'Biology': () => require('../../assets/Offline_Quizes/Biology.json'),
  'Birds': () => require('../../assets/Offline_Quizes/Birds.json'),
  'Books': () => require('../../assets/Offline_Quizes/Books.json'),
  'Capitals': () => require('../../assets/Offline_Quizes/Capitals.json'),
  'Chemistry': () => require('../../assets/Offline_Quizes/Chemistry.json'),
  'Cities': () => require('../../assets/Offline_Quizes/Cities.json'),
  'CivilWar': () => require('../../assets/Offline_Quizes/CivilWar.json'),
  'ClassicLiterature': () => require('../../assets/Offline_Quizes/ClassicLiterature.json'),
  'Clouds': () => require('../../assets/Offline_Quizes/Clouds.json'),
  'Colors': () => require('../../assets/Offline_Quizes/Colors.json'),
  'ColorsAdvanced': () => require('../../assets/Offline_Quizes/ColorsAdvanced.json'),
  'Composers': () => require('../../assets/Offline_Quizes/Composers.json'),
  'Computers': () => require('../../assets/Offline_Quizes/Computers.json'),
  'Conservation': () => require('../../assets/Offline_Quizes/Conservation.json'),
  'Continents': () => require('../../assets/Offline_Quizes/Continents.json'),
  'Countries': () => require('../../assets/Offline_Quizes/Countries.json'),
  'Currency': () => require('../../assets/Offline_Quizes/Currency.json'),
  'Dinosaurs': () => require('../../assets/Offline_Quizes/Dinosaurs.json'),
  'DisneyAnimation': () => require('../../assets/Offline_Quizes/DisneyAnimation.json'),
  'DisneyAttractions': () => require('../../assets/Offline_Quizes/DisneyAttractions.json'),
  'DisneyCharacters': () => require('../../assets/Offline_Quizes/DisneyCharacters.json'),
  'DisneyCompany': () => require('../../assets/Offline_Quizes/DisneyCompany.json'),
  'DisneyHistory': () => require('../../assets/Offline_Quizes/DisneyHistory.json'),
  'DisneyMovies': () => require('../../assets/Offline_Quizes/DisneyMovies.json'),
  'DisneyMusic': () => require('../../assets/Offline_Quizes/DisneyMusic.json'),
  'DisneyParks': () => require('../../assets/Offline_Quizes/DisneyParks.json'),
  'DisneyPrincesses': () => require('../../assets/Offline_Quizes/DisneyPrincesses.json'),
  'DisneyVillains': () => require('../../assets/Offline_Quizes/DisneyVillains.json'),
  'Earthquakes': () => require('../../assets/Offline_Quizes/Earthquakes.json'),
  'Ecosystems': () => require('../../assets/Offline_Quizes/Ecosystems.json'),
  'Emotions': () => require('../../assets/Offline_Quizes/Emotions.json'),
  'Energy': () => require('../../assets/Offline_Quizes/Energy.json'),
  'EuropeanHistory': () => require('../../assets/Offline_Quizes/EuropeanHistory.json'),
  'Explorers': () => require('../../assets/Offline_Quizes/Explorers.json'),
  'Fish': () => require('../../assets/Offline_Quizes/Fish.json'),
  'Flags': () => require('../../assets/Offline_Quizes/Flags.json'),
  'Flowers': () => require('../../assets/Offline_Quizes/Flowers.json'),
  'Food': () => require('../../assets/Offline_Quizes/Food.json'),
  'Forces': () => require('../../assets/Offline_Quizes/Forces.json'),
  'Fruits': () => require('../../assets/Offline_Quizes/Fruits.json'),
  'Games': () => require('../../assets/Offline_Quizes/Games.json'),
  'GardeningBasics': () => require('../../assets/Offline_Quizes/GardeningBasics.json'),
  'GardeningFlowers': () => require('../../assets/Offline_Quizes/GardeningFlowers.json'),
  'GardeningHerbs': () => require('../../assets/Offline_Quizes/GardeningHerbs.json'),
  'GardeningTips': () => require('../../assets/Offline_Quizes/GardeningTips.json'),
  'GardeningVegetables': () => require('../../assets/Offline_Quizes/GardeningVegetables.json'),
  'Geography': () => require('../../assets/Offline_Quizes/Geography.json'),
  'GolfBasics': () => require('../../assets/Offline_Quizes/GolfBasics.json'),
  'GolfCourses': () => require('../../assets/Offline_Quizes/GolfCourses.json'),
  'GolfEquipment': () => require('../../assets/Offline_Quizes/GolfEquipment.json'),
  'GolfEtiquette': () => require('../../assets/Offline_Quizes/GolfEtiquette.json'),
  'GolfHistory': () => require('../../assets/Offline_Quizes/GolfHistory.json'),
  'GolfMajors': () => require('../../assets/Offline_Quizes/GolfMajors.json'),
  'GolfPlayers': () => require('../../assets/Offline_Quizes/GolfPlayers.json'),
  'GolfRules': () => require('../../assets/Offline_Quizes/GolfRules.json'),
  'GolfScoring': () => require('../../assets/Offline_Quizes/GolfScoring.json'),
  'GolfTips': () => require('../../assets/Offline_Quizes/GolfTips.json'),
  'GreekMythology': () => require('../../assets/Offline_Quizes/GreekMythology.json'),
  'Habitats': () => require('../../assets/Offline_Quizes/Habitats.json'),
  'Holidays': () => require('../../assets/Offline_Quizes/Holidays.json'),
  'HumanBody': () => require('../../assets/Offline_Quizes/HumanBody.json'),
  'Insects': () => require('../../assets/Offline_Quizes/Insects.json'),
  'Internet': () => require('../../assets/Offline_Quizes/Internet.json'),
  'Inventions': () => require('../../assets/Offline_Quizes/Inventions.json'),
  'Islands': () => require('../../assets/Offline_Quizes/Islands.json'),
  'Languages': () => require('../../assets/Offline_Quizes/Languages.json'),
  'LatinAmericanHistory': () => require('../../assets/Offline_Quizes/LatinAmericanHistory.json'),
  'Light': () => require('../../assets/Offline_Quizes/Light.json'),
  'Machines': () => require('../../assets/Offline_Quizes/Machines.json'),
  'Mammals': () => require('../../assets/Offline_Quizes/Mammals.json'),
  'Materials': () => require('../../assets/Offline_Quizes/Materials.json'),
  'Mathematics': () => require('../../assets/Offline_Quizes/Mathematics.json'),
  'Measurement': () => require('../../assets/Offline_Quizes/Measurement.json'),
  'MedievalEurope': () => require('../../assets/Offline_Quizes/MedievalEurope.json'),
  'MedievalHistory': () => require('../../assets/Offline_Quizes/MedievalHistory.json'),
  'MiddleAges': () => require('../../assets/Offline_Quizes/MiddleAges.json'),
  'Months': () => require('../../assets/Offline_Quizes/Months.json'),
  'Mountains': () => require('../../assets/Offline_Quizes/Mountains.json'),
  'Movies': () => require('../../assets/Offline_Quizes/Movies.json'),
  'Music': () => require('../../assets/Offline_Quizes/Music.json'),
  'Mythology': () => require('../../assets/Offline_Quizes/Mythology.json'),
  'MythsAndLegends': () => require('../../assets/Offline_Quizes/MythsAndLegends.json'),
  'NFLDraft': () => require('../../assets/Offline_Quizes/NFLDraft.json'),
  'NFLHistory': () => require('../../assets/Offline_Quizes/NFLHistory.json'),
  'NFLPlayers': () => require('../../assets/Offline_Quizes/NFLPlayers.json'),
  'NFLPlayoffs': () => require('../../assets/Offline_Quizes/NFLPlayoffs.json'),
  'NFLPositions': () => require('../../assets/Offline_Quizes/NFLPositions.json'),
  'NFLRecords': () => require('../../assets/Offline_Quizes/NFLRecords.json'),
  'NFLRules': () => require('../../assets/Offline_Quizes/NFLRules.json'),
  'NFLStats': () => require('../../assets/Offline_Quizes/NFLStats.json'),
  'NFLSuperBowl': () => require('../../assets/Offline_Quizes/NFLSuperBowl.json'),
  'NFLTeams': () => require('../../assets/Offline_Quizes/NFLTeams.json'),
  'NurseryRhymes': () => require('../../assets/Offline_Quizes/NurseryRhymes.json'),
  'Oceans': () => require('../../assets/Offline_Quizes/Oceans.json'),
  'Olympics': () => require('../../assets/Offline_Quizes/Olympics.json'),
  'Physics': () => require('../../assets/Offline_Quizes/Physics.json'),
  'PiratesCaribbean': () => require('../../assets/Offline_Quizes/PiratesCaribbean.json'),
  'PiratesFamous': () => require('../../assets/Offline_Quizes/PiratesFamous.json'),
  'PiratesFiction': () => require('../../assets/Offline_Quizes/PiratesFiction.json'),
  'PiratesGeneral': () => require('../../assets/Offline_Quizes/PiratesGeneral.json'),
  'PiratesLife': () => require('../../assets/Offline_Quizes/PiratesLife.json'),
  'PiratesModern': () => require('../../assets/Offline_Quizes/PiratesModern.json'),
  'PiratesMyths': () => require('../../assets/Offline_Quizes/PiratesMyths.json'),
  'PiratesShips': () => require('../../assets/Offline_Quizes/PiratesShips.json'),
  'PiratesTreasure': () => require('../../assets/Offline_Quizes/PiratesTreasure.json'),
  'PiratesWeapons': () => require('../../assets/Offline_Quizes/PiratesWeapons.json'),
  'Planets': () => require('../../assets/Offline_Quizes/Planets.json'),
  'Plants': () => require('../../assets/Offline_Quizes/Plants.json'),
  'Poetry': () => require('../../assets/Offline_Quizes/Poetry.json'),
  'Presidents': () => require('../../assets/Offline_Quizes/Presidents.json'),
  'PresidentsAchievements': () => require('../../assets/Offline_Quizes/PresidentsAchievements.json'),
  'PresidentsAssassinations': () => require('../../assets/Offline_Quizes/PresidentsAssassinations.json'),
  'PresidentsEarly': () => require('../../assets/Offline_Quizes/PresidentsEarly.json'),
  'PresidentsElections': () => require('../../assets/Offline_Quizes/PresidentsElections.json'),
  'PresidentsFirsts': () => require('../../assets/Offline_Quizes/PresidentsFirsts.json'),
  'PresidentsGeneral': () => require('../../assets/Offline_Quizes/PresidentsGeneral.json'),
  'PresidentsLegacy': () => require('../../assets/Offline_Quizes/PresidentsLegacy.json'),
  'PresidentsModern': () => require('../../assets/Offline_Quizes/PresidentsModern.json'),
  'PresidentsPersonal': () => require('../../assets/Offline_Quizes/PresidentsPersonal.json'),
  'PresidentsQuotes': () => require('../../assets/Offline_Quizes/PresidentsQuotes.json'),
  'PresidentsWars': () => require('../../assets/Offline_Quizes/PresidentsWars.json'),
  'Renaissance': () => require('../../assets/Offline_Quizes/Renaissance.json'),
  'RenaissanceHistory': () => require('../../assets/Offline_Quizes/RenaissanceHistory.json'),
  'Reptiles': () => require('../../assets/Offline_Quizes/Reptiles.json'),
  'Rivers': () => require('../../assets/Offline_Quizes/Rivers.json'),
  'RomanBuildings': () => require('../../assets/Offline_Quizes/RomanBuildings.json'),
  'RomanCulture': () => require('../../assets/Offline_Quizes/RomanCulture.json'),
  'RomanDailyLife': () => require('../../assets/Offline_Quizes/RomanDailyLife.json'),
  'RomanEmperors': () => require('../../assets/Offline_Quizes/RomanEmperors.json'),
  'RomanEmpire': () => require('../../assets/Offline_Quizes/RomanEmpire.json'),
  'RomanFall': () => require('../../assets/Offline_Quizes/RomanFall.json'),
  'RomanLegacy': () => require('../../assets/Offline_Quizes/RomanLegacy.json'),
  'RomanMilitary': () => require('../../assets/Offline_Quizes/RomanMilitary.json'),
  'RomanRepublic': () => require('../../assets/Offline_Quizes/RomanRepublic.json'),
  'RomanWars': () => require('../../assets/Offline_Quizes/RomanWars.json'),
  'Seas': () => require('../../assets/Offline_Quizes/Seas.json'),
  'Seasons': () => require('../../assets/Offline_Quizes/Seasons.json'),
  'SeasonsAdvanced': () => require('../../assets/Offline_Quizes/SeasonsAdvanced.json'),
  'Senses': () => require('../../assets/Offline_Quizes/Senses.json'),
  'Shakespeare': () => require('../../assets/Offline_Quizes/Shakespeare.json'),
  'Shapes': () => require('../../assets/Offline_Quizes/Shapes.json'),
  'Sound': () => require('../../assets/Offline_Quizes/Sound.json'),
  'Space': () => require('../../assets/Offline_Quizes/Space.json'),
  'Sports': () => require('../../assets/Offline_Quizes/Sports.json'),
  'Stars': () => require('../../assets/Offline_Quizes/Stars.json'),
  'StateCapitals': () => require('../../assets/Offline_Quizes/StateCapitals.json'),
  'StateFacts': () => require('../../assets/Offline_Quizes/StateFacts.json'),
  'StateFlags': () => require('../../assets/Offline_Quizes/StateFlags.json'),
  'StateGeography': () => require('../../assets/Offline_Quizes/StateGeography.json'),
  'StateHistory': () => require('../../assets/Offline_Quizes/StateHistory.json'),
  'StateNicknames': () => require('../../assets/Offline_Quizes/StateNicknames.json'),
  'StateRecords': () => require('../../assets/Offline_Quizes/StateRecords.json'),
  'StateSymbols': () => require('../../assets/Offline_Quizes/StateSymbols.json'),
  'StateTrivia': () => require('../../assets/Offline_Quizes/StateTrivia.json'),
  'States': () => require('../../assets/Offline_Quizes/States.json'),
  'StatesGeneral': () => require('../../assets/Offline_Quizes/StatesGeneral.json'),
  'Technology': () => require('../../assets/Offline_Quizes/Technology.json'),
  'Time': () => require('../../assets/Offline_Quizes/Time.json'),
  'TimeZones': () => require('../../assets/Offline_Quizes/TimeZones.json'),
  'Transportation': () => require('../../assets/Offline_Quizes/Transportation.json'),
  'Trees': () => require('../../assets/Offline_Quizes/Trees.json'),
  'Vegetables': () => require('../../assets/Offline_Quizes/Vegetables.json'),
  'Volcanoes': () => require('../../assets/Offline_Quizes/Volcanoes.json'),
  'WaterCycle': () => require('../../assets/Offline_Quizes/WaterCycle.json'),
  'Weather': () => require('../../assets/Offline_Quizes/Weather.json'),
  'WeatherAdvanced': () => require('../../assets/Offline_Quizes/WeatherAdvanced.json'),
  'Weekdays': () => require('../../assets/Offline_Quizes/Weekdays.json'),
  'WeirdFoodBans': () => require('../../assets/Offline_Quizes/WeirdFoodBans.json'),
  'WeirdFoodBeliefs': () => require('../../assets/Offline_Quizes/WeirdFoodBeliefs.json'),
  'WeirdFoodCurrency': () => require('../../assets/Offline_Quizes/WeirdFoodCurrency.json'),
  'WeirdFoodFacts': () => require('../../assets/Offline_Quizes/WeirdFoodFacts.json'),
  'WeirdFoodHistory': () => require('../../assets/Offline_Quizes/WeirdFoodHistory.json'),
  'WeirdFoodInventions': () => require('../../assets/Offline_Quizes/WeirdFoodInventions.json'),
  'WeirdFoodLuxury': () => require('../../assets/Offline_Quizes/WeirdFoodLuxury.json'),
  'WeirdFoodMedicine': () => require('../../assets/Offline_Quizes/WeirdFoodMedicine.json'),
  'WeirdFoodMyths': () => require('../../assets/Offline_Quizes/WeirdFoodMyths.json'),
  'WeirdFoodOrigins': () => require('../../assets/Offline_Quizes/WeirdFoodOrigins.json'),
  'WorldGeography': () => require('../../assets/Offline_Quizes/WorldGeography.json'),
  'WorldWarI': () => require('../../assets/Offline_Quizes/WorldWarI.json'),
  'WorldWarIAftermath': () => require('../../assets/Offline_Quizes/WorldWarIAftermath.json'),
  'WorldWarIBattles': () => require('../../assets/Offline_Quizes/WorldWarIBattles.json'),
  'WorldWarICauses': () => require('../../assets/Offline_Quizes/WorldWarICauses.json'),
  'WorldWarII': () => require('../../assets/Offline_Quizes/WorldWarII.json'),
  'WorldWarIIAftermath': () => require('../../assets/Offline_Quizes/WorldWarIIAftermath.json'),
  'WorldWarIIBattles': () => require('../../assets/Offline_Quizes/WorldWarIIBattles.json'),
  'WorldWarIITimeline': () => require('../../assets/Offline_Quizes/WorldWarIITimeline.json'),
  'WorldWarsComparison': () => require('../../assets/Offline_Quizes/WorldWarsComparison.json'),
  'WorldWarsTechnology': () => require('../../assets/Offline_Quizes/WorldWarsTechnology.json'),
  'MarineBiology': () => require('../../assets/Offline_Quizes/MarineBiology.json'),
  'Genetics': () => require('../../assets/Offline_Quizes/Genetics.json'),
  'Evolution': () => require('../../assets/Offline_Quizes/Evolution.json'),
  'ClimateChange': () => require('../../assets/Offline_Quizes/ClimateChange.json'),
  'Geology': () => require('../../assets/Offline_Quizes/Geology.json'),
  'Meteorology': () => require('../../assets/Offline_Quizes/Meteorology.json'),
  'Botany': () => require('../../assets/Offline_Quizes/Botany.json'),
  'Zoology': () => require('../../assets/Offline_Quizes/Zoology.json'),
  'Microbiology': () => require('../../assets/Offline_Quizes/Microbiology.json'),
  'Neuroscience': () => require('../../assets/Offline_Quizes/Neuroscience.json'),
  'QuantumPhysics': () => require('../../assets/Offline_Quizes/QuantumPhysics.json'),
  'ChemistryAdvanced': () => require('../../assets/Offline_Quizes/ChemistryAdvanced.json'),
  'Anatomy': () => require('../../assets/Offline_Quizes/Anatomy.json'),
  'Physiology': () => require('../../assets/Offline_Quizes/Physiology.json'),
  'Ecology': () => require('../../assets/Offline_Quizes/Ecology.json'),
  'Paleontology': () => require('../../assets/Offline_Quizes/Paleontology.json'),
  'Astrophysics': () => require('../../assets/Offline_Quizes/Astrophysics.json'),
  'Oceanography': () => require('../../assets/Offline_Quizes/Oceanography.json'),
  'Biochemistry': () => require('../../assets/Offline_Quizes/Biochemistry.json'),
  'Pharmacology': () => require('../../assets/Offline_Quizes/Pharmacology.json'),
  'Basketball': () => require('../../assets/Offline_Quizes/Basketball.json'),
  'Baseball': () => require('../../assets/Offline_Quizes/Baseball.json'),
  'Soccer': () => require('../../assets/Offline_Quizes/Soccer.json'),
  'Tennis': () => require('../../assets/Offline_Quizes/Tennis.json'),
  'Hockey': () => require('../../assets/Offline_Quizes/Hockey.json'),
  'OlympicGames': () => require('../../assets/Offline_Quizes/OlympicGames.json'),
  'Boxing': () => require('../../assets/Offline_Quizes/Boxing.json'),
  'Swimming': () => require('../../assets/Offline_Quizes/Swimming.json'),
  'TrackAndField': () => require('../../assets/Offline_Quizes/TrackAndField.json'),
  'Cycling': () => require('../../assets/Offline_Quizes/Cycling.json'),
  'Skiing': () => require('../../assets/Offline_Quizes/Skiing.json'),
  'Surfing': () => require('../../assets/Offline_Quizes/Surfing.json'),
  'Cricket': () => require('../../assets/Offline_Quizes/Cricket.json'),
  'Rugby': () => require('../../assets/Offline_Quizes/Rugby.json'),
  'Volleyball': () => require('../../assets/Offline_Quizes/Volleyball.json'),
  'MarvelMovies': () => require('../../assets/Offline_Quizes/MarvelMovies.json'),
  'StarWars': () => require('../../assets/Offline_Quizes/StarWars.json'),
  'HarryPotter': () => require('../../assets/Offline_Quizes/HarryPotter.json'),
  'LordOfTheRings': () => require('../../assets/Offline_Quizes/LordOfTheRings.json'),
  'GameOfThrones': () => require('../../assets/Offline_Quizes/GameOfThrones.json'),
  'TheOffice': () => require('../../assets/Offline_Quizes/TheOffice.json'),
  'Friends': () => require('../../assets/Offline_Quizes/Friends.json'),
  'BreakingBad': () => require('../../assets/Offline_Quizes/BreakingBad.json'),
  'StrangerThings': () => require('../../assets/Offline_Quizes/StrangerThings.json'),
  'MusicGenres': () => require('../../assets/Offline_Quizes/MusicGenres.json'),
  'RockMusic': () => require('../../assets/Offline_Quizes/RockMusic.json'),
  'HipHop': () => require('../../assets/Offline_Quizes/HipHop.json'),
  'Jazz': () => require('../../assets/Offline_Quizes/Jazz.json'),
  'ClassicalMusic': () => require('../../assets/Offline_Quizes/ClassicalMusic.json'),
  'CountryMusic': () => require('../../assets/Offline_Quizes/CountryMusic.json'),
  'AncientRome': () => require('../../assets/Offline_Quizes/AncientRome.json'),
  'Vikings': () => require('../../assets/Offline_Quizes/Vikings.json'),
  'MedievalKnights': () => require('../../assets/Offline_Quizes/MedievalKnights.json'),
  'RenaissanceArt': () => require('../../assets/Offline_Quizes/RenaissanceArt.json'),
  'IndustrialRevolution': () => require('../../assets/Offline_Quizes/IndustrialRevolution.json'),
  'ColdWar': () => require('../../assets/Offline_Quizes/ColdWar.json'),
  'VietnamWar': () => require('../../assets/Offline_Quizes/VietnamWar.json'),
  'KoreanWar': () => require('../../assets/Offline_Quizes/KoreanWar.json'),
  'FrenchRevolution': () => require('../../assets/Offline_Quizes/FrenchRevolution.json'),
  'RussianRevolution': () => require('../../assets/Offline_Quizes/RussianRevolution.json'),
  'AncientMesopotamia': () => require('../../assets/Offline_Quizes/AncientMesopotamia.json'),
  'MayanCivilization': () => require('../../assets/Offline_Quizes/MayanCivilization.json'),
  'IncaEmpire': () => require('../../assets/Offline_Quizes/IncaEmpire.json'),
  'AztecEmpire': () => require('../../assets/Offline_Quizes/AztecEmpire.json'),
  'ByzantineEmpire': () => require('../../assets/Offline_Quizes/ByzantineEmpire.json'),
  'EuropeanCountries': () => require('../../assets/Offline_Quizes/EuropeanCountries.json'),
  'AsianCountries': () => require('../../assets/Offline_Quizes/AsianCountries.json'),
  'AfricanCountries': () => require('../../assets/Offline_Quizes/AfricanCountries.json'),
  'SouthAmericanCountries': () => require('../../assets/Offline_Quizes/SouthAmericanCountries.json'),
  'NorthAmericanCountries': () => require('../../assets/Offline_Quizes/NorthAmericanCountries.json'),
  'Islands': () => require('../../assets/Offline_Quizes/Islands.json'),
  'Deserts': () => require('../../assets/Offline_Quizes/Deserts.json'),
  'Rainforests': () => require('../../assets/Offline_Quizes/Rainforests.json'),
  'Mountains': () => require('../../assets/Offline_Quizes/Mountains.json'),
  'Rivers': () => require('../../assets/Offline_Quizes/Rivers.json'),
  'ShakespearePlays': () => require('../../assets/Offline_Quizes/ShakespearePlays.json'),
  'PoetryFamous': () => require('../../assets/Offline_Quizes/PoetryFamous.json'),
  'Novels': () => require('../../assets/Offline_Quizes/Novels.json'),
  'ScienceFiction': () => require('../../assets/Offline_Quizes/ScienceFiction.json'),
  'Fantasy': () => require('../../assets/Offline_Quizes/Fantasy.json'),
  'Mystery': () => require('../../assets/Offline_Quizes/Mystery.json'),
  'Horror': () => require('../../assets/Offline_Quizes/Horror.json'),
  'Romance': () => require('../../assets/Offline_Quizes/Romance.json'),
  'Biographies': () => require('../../assets/Offline_Quizes/Biographies.json'),
  'MythologyNorse': () => require('../../assets/Offline_Quizes/MythologyNorse.json'),
  'ArtificialIntelligence': () => require('../../assets/Offline_Quizes/ArtificialIntelligence.json'),
  'Cryptocurrency': () => require('../../assets/Offline_Quizes/Cryptocurrency.json'),
  'Programming': () => require('../../assets/Offline_Quizes/Programming.json'),
  'VideoGames': () => require('../../assets/Offline_Quizes/VideoGames.json'),
  'SocialMedia': () => require('../../assets/Offline_Quizes/SocialMedia.json'),
  'InternetHistory': () => require('../../assets/Offline_Quizes/InternetHistory.json'),
  'MobileApps': () => require('../../assets/Offline_Quizes/MobileApps.json'),
  'Cybersecurity': () => require('../../assets/Offline_Quizes/Cybersecurity.json'),
  'Robotics': () => require('../../assets/Offline_Quizes/Robotics.json'),
  'VirtualReality': () => require('../../assets/Offline_Quizes/VirtualReality.json'),
  'CookingBasics': () => require('../../assets/Offline_Quizes/CookingBasics.json'),
  'WorldCuisines': () => require('../../assets/Offline_Quizes/WorldCuisines.json'),
  'Baking': () => require('../../assets/Offline_Quizes/Baking.json'),
  'Wine': () => require('../../assets/Offline_Quizes/Wine.json'),
  'Coffee': () => require('../../assets/Offline_Quizes/Coffee.json'),
  'USStatesAndCapitals': () => require('../../assets/Offline_Quizes/USStatesAndCapitals.json'),
  'WorldCountriesAndCapitals': () => require('../../assets/Offline_Quizes/WorldCountriesAndCapitals.json'),
};

const SelectQuizScreen: React.FC = () => {
  const navigation = useNavigation<SelectQuizScreenNavigationProp>();
  const [quizzes, setQuizzes] = useState<{ name: string; title: string; url: string; completed: boolean }[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<{ name: string; title: string; url: string; completed: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedQuizzes, setDisplayedQuizzes] = useState<{ name: string; title: string; url: string; completed: boolean }[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // Always load from local assets folder
        const quizList = ALL_QUIZ_NAMES.map((name) => ({ 
          name, 
          title: getQuizTitle(name),
          url: '', 
          completed: false 
        }));
        
        // Check which quizzes have been completed
        const highScorePromises = quizList.map(async (quiz) => {
          const highScore = await AsyncStorage.getItem(`highScore_${quiz.name}`);
          return {
            ...quiz,
            completed: highScore !== null,
          };
        });
        
        const updatedQuizzes = await Promise.all(highScorePromises);
        // Sort by title alphabetically
        updatedQuizzes.sort((a, b) => a.title.localeCompare(b.title));
        setQuizzes(updatedQuizzes);
        setFilteredQuizzes(updatedQuizzes);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch quizzes.', error);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Filter quizzes based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredQuizzes(quizzes);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(query) || 
        quiz.name.toLowerCase().includes(query)
      );
      setFilteredQuizzes(filtered);
    }
    // Reset to first page when search changes
    setCurrentPage(0);
  }, [searchQuery, quizzes]);

  // Update displayed quizzes when page or filtered quizzes change
  useEffect(() => {
    const startIndex = currentPage * QUIZZES_PER_PAGE;
    const endIndex = startIndex + QUIZZES_PER_PAGE;
    setDisplayedQuizzes(filteredQuizzes.slice(startIndex, endIndex));
  }, [currentPage, filteredQuizzes]);

  const loadQuizFromAssets = (quizName: string): any => {
    const loader = QUIZ_MAP[quizName];
    if (loader) {
      try {
        return loader();
      } catch (error) {
        console.error(`Failed to load quiz ${quizName}:`, error);
        return null;
      }
    }
    return null;
  };

  const handleQuizPress = async (quizName: string) => {
    const quizData = loadQuizFromAssets(quizName);
    if (!quizData) {
      console.error(`Quiz ${quizName} not found`);
      return;
    }
    navigation.navigate('Quiz', { quizData, quizName });
  };

  const totalPages = Math.ceil(filteredQuizzes.length / QUIZZES_PER_PAGE);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={24} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search quizzes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <MaterialIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.paginationInfo}>
        <Text style={styles.paginationText}>
          {searchQuery ? `Found ${filteredQuizzes.length} quiz${filteredQuizzes.length !== 1 ? 'zes' : ''}` : `Page ${currentPage + 1} of ${totalPages} (${quizzes.length} quizzes)`}
        </Text>
      </View>
      <FlatList
        data={displayedQuizzes}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <FancyButton
            text={item.title}
            onPress={() => handleQuizPress(item.name)}
            completed={item.completed}
          />
        )}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.paginationControls}>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 0 && styles.pageButtonDisabled]}
          onPress={handlePreviousPage}
          disabled={currentPage === 0}
        >
          <Text style={[styles.pageButtonText, currentPage === 0 && styles.pageButtonTextDisabled]}>
            Previous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pageButton, currentPage >= totalPages - 1 && styles.pageButtonDisabled]}
          onPress={handleNextPage}
          disabled={currentPage >= totalPages - 1}
        >
          <Text style={[styles.pageButtonText, currentPage >= totalPages - 1 && styles.pageButtonTextDisabled]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
    marginLeft: 5,
  },
  paginationInfo: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  paginationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listContent: {
    flexGrow: 1,
  },
  paginationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 10,
  },
  pageButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  pageButtonDisabled: {
    backgroundColor: '#ccc',
  },
  pageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pageButtonTextDisabled: {
    color: '#888',
  },
});

export default SelectQuizScreen;
