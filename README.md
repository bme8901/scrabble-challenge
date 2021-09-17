# Exscientia Coding Challenge

Scrabble solutions for board problem as well as design/architecure for (both) solver & website.

## Installation

Use the package manager [npm](https://npm.com) to install axios.

```bash
npm install axios
```

## Usage

```bash
node index.js
```

## Design/Architecture for Website

(Note: for the sake of simplicity I've avoided discussion around authenticating users and role based access to resources like game scores.)

To enable multiplayer options for the scrabble game, I'd need to create a client side view for the browser game and a backend to persist results and enable bidirectional communication
via WebSocket, likely with socket.io. Out of experience and familiarity I'd choose either express.js or nest.js

To record the results of games and associate with players, we'd need two entities in a database: User and Game. Game would contain two foreign keys for User (user_id1, user_id2, whereby the score for each could be associated with the two accounts.)

Users could continue to modify the browser-side board until the board is full or the game deemed complete. Between each turn the board could be scored using the function from the first exercise. In this case, points could be aggregated by User and then increment their score until the end of the game. The results would be stored as entries in a
results or score column on the Game entity. Example table descriptions are included below:

+------+---------------+--+--+--+           
| User |               |  |  |  |
+------+---------------+--+--+--+
| PK   | id            |  |  |  |
+------+---------------+--+--+--+
|      | email         |  |  |  |
+------+---------------+--+--+--+
|      | password_hash |  |  |  |
+------+---------------+--+--+--+
|      | ...           |  |  |  |
+------+---------------+--+--+--+

+------+----------+--+--+--+
| Game |          |  |  |  |
+------+----------+--+--+--+
| PK   | id       |  |  |  |
+------+----------+--+--+--+
| FK   | user_id1 |  |  |  |
+------+----------+--+--+--+
| FK   | user_id2 |  |  |  |
+------+----------+--+--+--+
|      | results  |  |  |  |
+------+----------+--+--+--+
|      | ...      |  |  |  |
+------+----------+--+--+--+

For persisting user actions, results, and other queries via the API, we could use several different arrangements on the server-
side, including: (Note that I've used AWS products, but could be deployed on Azure, DO, etc.)

        1.) AWS Gateway and Lambda's for each endpoint
        2.) ECS + Docker Image
        3.) EC2 + Docker Image

        + DynamoDB or RDS for a database solution

## Design/Architecture for General Solver

I'd first create a Leter tree structure from the full word list like so:

                             A
                             |
                             B*
                          /     \
                         B       I
                       / | \     |
                     E   O   R*  D
                     |   |       |
                     Y*  T*      E*

where the presence of an asterisk implies the end of a valid word at that Letter Node.

Referencing the popular algorithm discussed in [The World's Fastest Scrabble Program (Appel & Jacobson)](http://www.cs.cmu.edu/afs/cs/academic/class/15451-s06/www/lectures/scrabble.pdf), the solver would operate in the following steps:

    1.) Accept a board of letters
    2.) Observe the spaces adjacent to each letter
        a.) Create prefixes by attaching letters around spaces with letters
        b.) Identify whether a prefix is valid by determining if the tree has a node and/or child nodes using the core letter
        c.) If the prefix is valid, begin suffix creation
            i.) Test each of the child nodes from the end of the prefix to determine if they are valid words.
            ii.) If word is valid, add to list of completed words
    3.) Repeat (2.) for all adjacent spaces, distance from letters, and configurations.
    d.) Discover the score of each word using the board scoring function created in the first exercise and use the word with the highest score.
