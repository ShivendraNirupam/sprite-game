import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from "./playerState.js";
import { CollisionAnimation } from "./collisionAnimation.js";
export class Player{
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.vy = 0;
        this.gravity = 1;
        this.image = document.getElementById('player');
        this.speed = 0;
        this.maxSpeed = 2;
        this.energy = 100;
        this.maxEnergy = 100;
        this.energyGen = 5;
        this.states = [new Sitting(this.game), 
                       new Running(this.game),
                       new Jumping(this.game),
                       new Falling(this.game),
                       new Rolling(this.game),
                       new Diving(this.game),
                       new Hit(this.game)];
    }

    update(input, deltaTime) {
        this.checkCollision();
        this.currentState.handleInput(input);

        //Energy Generation
        {
            // Energy recharge logic
            if (this.energy < this.maxEnergy) {
                this.energy += this.energyRegen;
                if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
            }

        }
        //Vertical movement
        {
            this.y += this.vy;
            if(!this.onGround()){
                this.vy += this.gravity;
            }
            else {
                this.vy = 0;
            }

            
        }
        //Horizontal movement
        {
            this.x += this.speed;
            if(input.includes('ArrowRight') || input.includes('d') || input.includes('D')){
                this.speed = this.maxSpeed;
            }
            else if(input.includes('ArrowLeft') || input.includes('a') || input.includes('A')){
                this.speed = -2*this.maxSpeed;
            }
            else{
                this.speed = 0;
         }
            if(this.x < 0) this.x = 0;
            if(this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        }

        //Sprite animation
        {   
           if(this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
           }
           else {
            this.frameTimer += deltaTime;
           }
        }
    }
    draw(context) {
        
        context.drawImage(
            this.image,
            this.frameX * this.width, 
            this.frameY * this.height, 
            this.width, 
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
);

    }

    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = speed * this.game.maxSpeed;
        this.currentState.enter();
    }
    checkCollision() {
        this.game.enemies.forEach(enemy => {
            if(
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ) {
                enemy.markedForDeletion = true;
                this.game.collision.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if(this.currentState === this.states[4] || this.currentState === this.states[5]) {
                    this.game.score++;
                }
                
                else {
                    this.setState(6, 0);
                }
            }
        
        })
    }
}