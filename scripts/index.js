class Hero {
    constructor(hp, damage, x, y) {
        this.hp = hp;
        this.damage = damage;
        this.x = x;
        this.y = y;
    }

    attackEnemy(enemyes, directions, map) {
        for (const direction of directions) {
            const newX = this.x + direction.x;
            const newY = this.y + direction.y;
            for (const enemy of enemyes) {
                if (
                    newX >= 0 && newX < map.length &&
                    newY >= 0 && newY < map[0].length &&
                    map[newX][newY] === enemy
                ) {
                    enemy.health -= this.damage
                    if (enemy.health <= 0){
                        map[newX][newY] = 'room';
                        enemyes = enemyes.filter(item => item !== enemy);
                        return enemyes
                    }
                    if(enemyes.length == 0)
                    location.reload();
                }
            }   
        }
        return enemyes
    }

    moveHero(key, map) {
        let newHeroX = this.x;
        let newHeroY = this.y;
    
        if (key === 'W') {
            newHeroX = Math.max(0, this.x - 1);
        } else if (key === 'S') {
            newHeroX = Math.min(map.length - 1, this.x + 1);
        } else if (key === 'A') {
            newHeroY = Math.max(0, this.y - 1);
        } else if (key === 'D') {
            newHeroY = Math.min(map[0].length - 1, this.y + 1);
        }

        if (
            map[newHeroX][newHeroY] === 'room' 
            || map[newHeroX][newHeroY] === 'potion' 
            || map[newHeroX][newHeroY] === 'sword'
            ) {
                if (map[newHeroX][newHeroY] === 'potion'){
                    this.hpHero += 1;
            } else if(map[newHeroX][newHeroY] === 'sword'){
                this.damage += 1
            }
            map[this.x][this.y] = 'room';
            this.x = newHeroX;
            this.y = newHeroY;
            map[this.x][this.y] = this;
        }
        drawMap();
    }
}

h1 = new Hero(5, 1, 0, 0)
let map = [];
let enemyes = [];
let step = true; 

const directions = [
    { x: -1, y: 0 }, 
    { x: 1, y: 0 },  
    { x: 0, y: -1 }, 
    { x: 0, y: 1 },   
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },         
];

function checkAllRoomsConnected(map) {
    const visited = new Array(map.length).fill().map(() => new Array(map[0].length).fill(false));
    const rooms = [];

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] === 'room') {
                rooms.push({ x: i, y: j });
            }
        }
    }

    const start = rooms[0];
    rooms.shift();
    const queue = [start];
    visited[start.x][start.y] = true;

    while (queue.length > 0) {
        const current = queue.shift();

        const neighbors = [
            { x: current.x + 1, y: current.y },
            { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 },
            { x: current.x, y: current.y - 1 }
        ];

        for (const neighbor of neighbors) {
            if (
                neighbor.x >= 0 &&
                neighbor.x < map.length &&
                neighbor.y >= 0 &&
                neighbor.y < map[0].length &&
                map[neighbor.x][neighbor.y] === 'room' &&
                !visited[neighbor.x][neighbor.y]
            ) {
                visited[neighbor.x][neighbor.y] = true;
                queue.push(neighbor);
                rooms.splice(rooms.findIndex(room => room.x === neighbor.x && room.y === neighbor.y), 1);
            }
        }
    }

    for (const room of rooms) {
        map[room.x][room.y] = 'wall';
    }

    return rooms.length === 0;
}

function placeObjectInRooms(map) {
    const swordCount = 2;
    const healthCount = 10;
    const enymeCount = 10;
    const heroCount = 1;

    let swordsPlaced = 0;
    let healthPlaced = 0;
    let enymePlaced = 0;
    let heroPlaced = 0;

    while (
            swordsPlaced < swordCount 
            || healthPlaced < healthCount 
            || enymePlaced < enymeCount 
            || heroPlaced < heroCount
        ) {
        const randomX = Math.floor(Math.random() * map.length);
        const randomY = Math.floor(Math.random() * map[0].length);

        if (map[randomX][randomY] === 'room') {
            if (swordsPlaced < swordCount) {
                map[randomX][randomY] = 'sword';
                swordsPlaced++;
            } else if (healthPlaced < healthCount) {
                map[randomX][randomY] = 'potion';
                healthPlaced++;
            }else if (enymePlaced < enymeCount) {
                enemyes[enymePlaced] = { x: randomX, y: randomY, health: 5 }
                map[randomX][randomY] = enemyes[enymePlaced];
                enymePlaced++;
            }else if (heroPlaced < heroCount) {
                h1.x = randomX
                h1.y = randomY
                map[randomX][randomY] = h1;
                heroPlaced++;
            }
        }
    }
}

function generateMap() {
    for (let i = 0; i < 24; i++) {
        map[i] = [];
        for (let j = 0; j < 40; j++) {
            map[i][j] = 'wall'; 
        }
    }

    const minRoomSize = 3;
    const maxRoomSize = 8;
    const minRooms = 5;
    const maxRooms = 10;
    
    const rooms = Math.floor(Math.random() * (maxRooms - minRooms + 1)) + minRooms;
    
    let generatedRooms = 0;
    
    while (generatedRooms < rooms) {
        const roomWidth = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
        const roomHeight = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
    
        const i = Math.floor(Math.random() * (24 - roomHeight)); 
        const j = Math.floor(Math.random() * (40 - roomWidth)); 
    
        let isSpaceOccupied = false;
    
        for (let x = i - 1; x < i + roomHeight + 1; x++) {
            for (let y = j - 1; y < j + roomWidth + 1; y++) {
                if (map[x] && map[x][y] && map[x][y] !== 'wall') {
                    isSpaceOccupied = true;
                    break;
                }
            }
        }
    
        if (!isSpaceOccupied) {
            for (let x = i; x < i + roomHeight; x++) {
                for (let y = j; y < j + roomWidth; y++) {
                    map[x][y] = 'room';
                }
            }
            generatedRooms++;
        }
    }

    const verticalPassages = Math.floor(Math.random() * 3) + 3; 
    for (let count = 0; count < verticalPassages; count++) {
        const randomNumber = Math.floor(Math.random() * 5) + 1; 
        const passageLocation = Math.floor(Math.random() * (40 / randomNumber)) * randomNumber; 

        for (let i = 0; i < 24; i++) {
            map[i][passageLocation] = 'room';
        }
    }

    const horizontalPassages = Math.floor(Math.random() * 3) + 3; 
    for (let count = 0; count < horizontalPassages; count++) {
        const randomNumber = Math.floor(Math.random() * 5) + 1; 
        const passageLocation = Math.floor(Math.random() * (25 - randomNumber)); 
        for (let j = 0; j < 40; j++) {
            map[passageLocation][j] = 'room';
        }
    }
    checkAllRoomsConnected(map)
    placeObjectInRooms(map)
}

function addHpBar(enemy, rowIndex, colIndex, field, hp){
    const tile = $('<div class="tile"></div>');
    if(enemy){
        tile.addClass('healthE')
    }else{
        tile.addClass('healthH')
    }

    tile.css({
        top: (rowIndex * 50 - 2) + 'px', 
        left: colIndex * 50 + 'px', 
        width: 10 * hp + 'px'
    });

    field.append(tile);
}

function drawMap() {
    const field = $('.field');
    field.empty();

    map.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const tile = $('<div class="tile"></div>');
            for (const enemy of enemyes) {
                
                if (cell === 'wall') {
                    tile.addClass('wall');
                } else if (cell === 'room') {
                    tile.addClass('room');
                }else if (cell === 'sword') {
                    tile.addClass('sword');
                }else if (cell === 'potion') {
                    tile.addClass('potion');
                }else if (cell === enemy) {
                    addHpBar(true, rowIndex, colIndex, field, enemy.health)
                    tile.addClass('enemy');
                }else if (cell === h1) {
                    tile.addClass('hero');
                    addHpBar(false ,rowIndex, colIndex, field, h1.hp)
                }
            }

            tile.css({
                top: rowIndex * 50 + 'px', 
                left: colIndex * 50 + 'px' 
            });

            field.append(tile);
        });
    });
}

function getRandomAndExclude(indexes, myArray) {
    const index = Math.floor(Math.random() * indexes.length); 
    const selectedIndex = indexes[index]; 
    indexes.splice(index, 1); 
    return myArray[selectedIndex]; 
}

function enemyMove(enemy){
    let indexes = Array.from(Array(directions.length).keys());

    for (const direction of directions) {
        let dir = getRandomAndExclude(indexes, directions);
        const newX = enemy.x + dir.x;
        const newY = enemy.y + dir.y;
        if (
            newX >= 0 && newX < map.length &&
            newY >= 0 && newY < map[0].length &&
            map[newX][newY] === 'room'
        ) {
            map[enemy.x][enemy.y] = 'room';
            enemy.x = newX;
            enemy.y = newY;
            map[newX][newY] = enemy;
            break;
        }

    }
}

function enemyActions(){
    for (const enemy of enemyes) {
        let action = false;
        for (const direction of directions) {
            const newX = enemy.x + direction.x;
            const newY = enemy.y + direction.y;
            if (
                newX >= 0 && newX < map.length &&
                newY >= 0 && newY < map[0].length &&
                map[newX][newY] === h1
            ) {
                h1.hp -= 1;
                action = true;
                if(h1.hp == 0)
                location.reload();
            }
        }
        if (action == false){
            enemyMove(enemy)
        }
    }
    drawMap();
    step = true

}

$(document).ready(function() {
    generateMap();
    drawMap();
    document.addEventListener('keyup', function(event) {
        const key = event.key.toUpperCase();
        if ((key === 'W' || key === 'A' || key === 'S' || key === 'D') && step == true) {
            h1.moveHero(key,map);
            drawMap();
            step = false;
        }else if(event.code === 'Space' && step == true){
            enemyes = h1.attackEnemy(enemyes, directions, map);
            drawMap();
            step = false;
        }
        if(step == false){
            enemyActions();
        }
    });
});