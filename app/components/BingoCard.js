import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Text,
  ActivityIndicator
} from 'react-native';

const CARD_ROWS = 5;
const CARD_COLUMNS = 5;

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/';

import CategoryRow from './CategoryRow';
import BingoButton from './BingoButton';
import BingoCardStyle from '../styles/BingoCardStyle';

class BingoCard extends Component {
  static navigationOptions = {
    title: 'Bingo Card'
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.onValidateBingoPress = this.onValidateBingoPress.bind(this);
  }

  componentWillMount() {
    debugger;
    this.props.getAllData();
  }

  render() {
    if (this.props.allDataLoading) {
      return(
        <View style={ BingoCardStyle.activityIndicatorContainer }>
        <StatusBar
           barStyle="light-content"
         />
          <ActivityIndicator animating={true} />
        </View>
      );
    } else {
      let allData = this.props.allData;
      let categoryRows = [];
      for (let i = 0; i < allData.length; i++) {
        categoryRows.push(
          <CategoryRow
            data={ allData[i] }
            key={ i }
          />
        );
      }
      return (
        <View style={ BingoCardStyle.cardContainer }>
          <StatusBar
             barStyle="light-content"
           />
          <View style={ BingoCardStyle.rowsContainer }>
            { categoryRows }
          </View>
          <View style= { BingoCardStyle.validateBingoContainer }>
            <BingoButton
              onPress = { this.onValidateBingoPress }
              isEnabled={ this.isBingo() }
            />
          </View>
        </View>
      );
    }
  }

  isSelected(item) {
    return item.isSelected;
  }

  onValidateBingoPress() {
    let data = this.props.allData;
    let selectedOptions = [];
    for (let i = 0; i < data.length; i++) {
      let selectedOption = data[i].options.filter(this.isSelected);
      selectedOption.forEach((option) => {
        selectedOptions.push(option);
      });
    }
    this.props.validateBingo(selectedOptions);
  }

  isBingo() {
    let data = this.props.allData;
    let i, j, trueCount;
    let isRowBingo = isColumnBingo = isDiagonalBingo = isOtherDiagonalBingo = false;

    // check for column bingo
    for (i = 0; i < CARD_COLUMNS; i++) {
      trueCount = 0;
      for (j = 0; j < CARD_ROWS; j++) {
        if (data[i].options[j].isSelected) {
          trueCount++;
        }
      }

      if (trueCount === CARD_ROWS) {
        isColumnBingo = true;
        break;
      }
    }

    // check for row bingo
    for (i = 0; i < CARD_ROWS; i++) {
      trueCount = 0;
      for (j = 0; j < CARD_COLUMNS; j++) {
        if (data[j].options[i].isSelected) {
          trueCount++;
        }
      }
      if (trueCount === CARD_COLUMNS) {
        isRowBingo = true;
        break;
      }
    }

    // check for diagonal bingo
    i = 0;
    trueCount = 0;
    while (i < CARD_ROWS) {
      if (data[i].options[i].isSelected) {
        trueCount++;
      }
      i++;
    }
    if (trueCount === CARD_ROWS) {
      isDiagonalBingo = true;
    }

    // check for other diagonal bingo
    i = 0;
    j = CARD_ROWS - 1;
    trueCount = 0;
    while (i < CARD_COLUMNS && j >= 0) {
      if (data[i].options[j].isSelected) {
        trueCount++;
      }
      i++;
      j--;
    }
    if (trueCount === CARD_ROWS) {
      isOtherDiagonalBingo = true;
    }

    return isRowBingo || isColumnBingo || isDiagonalBingo || isOtherDiagonalBingo;
  }
}

// The function takes data from the app current state,
// and insert/links it into the props of our component.
// This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state, props) {
  return {
    activeRoundData: state.activeRoundReducer.activeRoundData,
    activeRoundDataLoading: state.activeRoundReducer.activeRoundDataLoading,
    allDataLoading: state.dataReducer.allDataLoading,
    allData: state.dataReducer.allData,
    isValidBingo: state.bingoValidationReducer.isValidBingo
  }
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file (action/home.js)
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BingoCard);
