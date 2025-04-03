## notes about endpoints

team by id
- wins/losses -> some kind of bar that's green and red or something that's larger on the one side

game by id - has a lot of good information (box score) - should probably use a table for this
    "player_id": 19124084, <-- doesn't get used
    "player_name": "Bogdan Bogdanovic",
    "team": "LA Clippers",
    "points": 20, // <-- these 5 could have little colored icons next to them in that table or something to make it a little more engaging
    "rebounds": 4,
    "assists": 7,
    "steals": 1,
    "blocks": 0,
    "field_goals_made": 8,
    "field_goals_attempt": 8,
    "field_goal_percentage": 1,
    "field_goals3_made": 4,
    "field_goals3_attempt": 4,
    "field_goal3_percentage": 1,
    "freethrows_made": 0,
    "freethrows_attempt": 0,
    "freethrow_percentage": 0

get player details - has a lot of information and abbr that he'll send later

conference - west, east

-------
useful to know:
```typescript
const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
```

<!-- dev accounts -->
claebcode
claebdev@example.com

claebcode2
claebdev2@example.com