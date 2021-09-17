const axios = require("axios");

// URLs from .pdf
const SCRABBLE_BOARD_URL = `https://gist.githubusercontent.com/jgingerexscientia/191dd3d6a575c130af6d006971467f3f/raw/f7836f1fa4c7c45de10b49bdb527adf52ec7d7e2/scrabble_board.json`;
const YOUR_BOARD_URL = `https://gist.githubusercontent.com/jgingerexscientia/2ed4ec09eb5ec49b897eec9c8fb5e4ba/raw/74e763cabd20e8a4d7c6b494c88196cecb6c31d4/your_board.json`;
const BEFORE_AFTER_WORD_ADDED_URL = `https://gist.githubusercontent.com/jgingerexscientia/fbada88cfd407fe2a0d4ee87371ffd32/raw/e81d339e6119d794e316e959e945421b747d97c5/board_after_word_added.json`;
const LETTER_SCORE_URL = `https://gist.githubusercontent.com/jgingerexscientia/b443403a3cf6c23938764ebf35feb4da/raw/c0f3d6aedd311b07439cc65adfeac631d7651b10/letter_values.json`;
const WORDS_URL = `https://www.wordgamedictionary.com/sowpods/download/sowpods.txt`;

/**
 *
 * Collects word and board data from provided URL's and runs board scoring function.
 *
 */
const runScrabble = async () => {
  /**
   *
   * Finds the score of the board after tiles have been assembled.
   * Assumes only one word was added to the board either horizontally or vertically
   * (not scanning rows and columns individually).
   *
   * @param {*} your_tiles
   * @param {*} your_board
   * @param {*} board_after_word_added
   */
  const findBoardScore = (
    your_tiles,
    your_board,
    board_after_word_added,
    letter_scores,
    scrabble_board,
    words
  ) => {
    let score = 0;
    let score_multiplier = [];
    let word = ``;
    for (let i = 0; i < your_board.length; i++) {
      // process each row
      const row = your_board[i];
      for (let j = 0; j < row.length; j++) {
        // scan each column for new characters
        const char = row[j];
        const newChar = board_after_word_added[i][j];
        if (char !== newChar && your_tiles.split("").includes(newChar)) {
          let multiplier = 1;
          switch (scrabble_board[i][j]) {
            case "DL":
              multiplier = 2;
              break;
            case "TL":
              multiplier = 3;
              break;
            case "DW":
              multiplier = 1;
              score_multiplier.push(2);
              break;
            case "TW":
              multiplier = 1;
              score_multiplier.push(3);
              break;
          }
          word += newChar;
          score += multiplier * letter_scores[newChar];
        }
      }
    }
    score *= score_multiplier.reduce((o, a) => o * a, 1);
    const reversedWord = word.split("").reverse().join("");
    if (words.includes(word) || words.includes(reversedWord)) {
      return score;
    }
    return -1;
  };

  let requests = [];
  const your_tiles = "startup";
  const urls = [
    SCRABBLE_BOARD_URL,
    YOUR_BOARD_URL,
    BEFORE_AFTER_WORD_ADDED_URL,
    LETTER_SCORE_URL,
    WORDS_URL,
  ];

  for (let url of urls) {
    requests.push(axios.get(url));
  }

  await axios.all(requests).then(
    axios.spread(
      (
        scrabble_board,
        your_board,
        board_after_word_added,
        letter_scores,
        scrabble_words
      ) => {
        const score = findBoardScore(
          your_tiles,
          your_board.data,
          board_after_word_added.data,
          letter_scores.data,
          scrabble_board.data,
          scrabble_words.data.split(".txt")[2].split("\r\n")
        );
        console.log(
          "The score for this board with tiles ",
          your_tiles,
          " is: ",
          score
        );
      }
    )
  );
};

runScrabble();
