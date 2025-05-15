import { Player } from "./player.js";  
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "./enemy.js";
import { UI } from "./UI.js";

window.addEventListener('load', function() {
const  canvas = document.getElementById('canvas1');
const  ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 500;

class Game{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.groundMargin = 50;
        this.speed = 0;
        this.maxSpeed = 3;
        this.background = new Background(this);
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.UI = new UI(this);
        this.enemies = [];
        this.particle = [];
        this.collision = [];
        this.enemyTimer = 0;
        this.enemyInterval = 1000;
        this.time = 0
        this.maxTime = 30000;
        this.debug = true;
        this.score = 0;
        this.fontColor = 'black';
        this.gameOver = false;
        this.player.currentState = this.player.states[0];
        this.player.currentState.enter();
    }

    update(deltaTime) {
        this.time += deltaTime;
        if(this.time > this.maxTime) {
            this.gameOver = true;   
        }
        this.background.update();
        this.player.update(this.input.key, deltaTime);

        //handle enemies
        {
            if(this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            }
            else {
                this.enemyTimer += deltaTime;
            }

            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if(enemy.markedForDeletion) {
                    this.enemies.splice(this.enemies.indexOf(enemy), 1);
                }
            });
        }

        //handle particles
        {
            this.particle.forEach((particle) => {
                particle.update();
                if(particle.markedForDeletion) {
                    this.particle.splice(this.particle.indexOf(particle), 1);
                }
            })
            if(this.particle.length > 20) {
                this.particle.splice(0, 50);
            }
        }

        //handle collison
        {
            this.collision.forEach((collision) => {
                collision.update(deltaTime);
                if(collision.markedForDeletion) {
                    this.collision.splice(this.collision.indexOf(collision), 1);
                }
            });
        }
    }
    draw(context) {
        this.background.draw(context);
        this.player.draw(context);
        this.enemies.forEach(enemy => {
            enemy.draw(context);
        });

        this.particle.forEach(particle => {
            particle.draw(context);
        });

        this.collision.forEach(collision => {
            collision.draw(context);
        });
        this.UI.draw(context);
    }
    addEnemy() {
        if(this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
        else if(this.speed > 0 ) this.enemies.push(new ClimbingEnemy(this));
        this.enemies.push(new FlyingEnemy(this));
    }
}

const game = new Game(canvas.width, canvas.height);
let lastTime = 0;

function animate(timeStamp){
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    if(!game.gameOver) requestAnimationFrame(animate);
}

animate(0);
});