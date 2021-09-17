const axios = require("axios");

const SCRABBLE_BOARD_URL = `https://gist.githubusercontent.com/jgingerexscientia/191dd3d6a575c130af6d006971467f3f/raw/f7836f1fa4c7c45de10b49bdb527adf52ec7d7e2/scrabble_board.json`;
const YOUR_BOARD_URL = `https://gist.githubusercontent.com/jgingerexscientia/2ed4ec09eb5ec49b897eec9c8fb5e4ba/raw/74e763cabd20e8a4d7c6b494c88196cecb6c31d4/your_board.json`;
const BEFORE_AFTER_WORD_ADDED_URL = `https://gist.githubusercontent.com/jgingerexscientia/fbada88cfd407fe2a0d4ee87371ffd32/raw/e81d339e6119d794e316e959e945421b747d97c5/board_after_word_added.json`;
const LETTER_SCORE_URL = `https://gist.githubusercontent.com/jgingerexscientia/b443403a3cf6c23938764ebf35feb4da/raw/c0f3d6aedd311b07439cc65adfeac631d7651b10/letter_values.json`;
const WORDS_URL = `https://www.wordgamedictionary.com/sowpods/download/sowpods.txt`;

/**
 *
 * finds the score of the board after tiles have been assembled.
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
    const row = your_board[i];
    for (let j = 0; j < row.length; j++) {
      const char = row[j];
      const newChar = board_after_word_added[i][j];
      if (char !== newChar && your_tiles.split("").includes(newChar)) {
        let multiplier = 1;
        switch (scrabble_board[i][j]) {
          case "DL":
            multiplier = 2;
          case "TL":
            multiplier = 3;
          case "DW":
            multiplier = 1;
            score_multiplier.push(2);
          case "TW":
            multiplier = 1;
            score_multiplier.push(3);
        }
        word += newChar;
        score += multiplier * letter_scores[newChar];
      }
    }
  }
  const reversedWord = word.split("").reverse().join("");
  if (words.includes(word) || words.includes(reversedWord)) {
    return score;
  }
  return -1;
};

/**
 *
 * collects word and board data from provided URL's and runs board scoring function.
 *
 * @returns
 */
const runScrabble = async () => {
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
        console.clear();
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
