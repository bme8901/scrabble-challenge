# Exscientia Coding Challenge

Scrabble solutions for board problem as well as design/architecure for solver & website.

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

To enable multiplayer options for the scrabble game, I'd need to implement bidirectional communication
via WebSockets, likely with socket.io.

To record the results of games and associate with players, we'd need two entities: User and Game, which would be  
desribed by the UML below. (Note: for the sake of I'll avoid discussion around authenticating users and role based
access to resources.)

Users could continue to modify the browser-side board until the board is full or deemed complete. In this case,
points could be aggregated by User and then increment their score. The results would be stored as entries in the
user_results column.

For persisting user actions, results, and other queries, we could use several different arrangements on the server-
side, including: (Note that I've used AWS products, but could be deployed on Azure, DO, etc.)

        1.) AWS Gateway and Lambda's for each endpoint
        2.) ECS + Docker Image
        3.) EC2 + Docker Image

        + DynamoDB or RDS for a database solution

## Design/Architecure for General Solver

Reference:
