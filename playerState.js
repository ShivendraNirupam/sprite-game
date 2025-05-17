import { Dust, Fire, Splash } from './particle.js';

export const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6,
};

class State {
    constructor(state, game) {
        this.state = state;
        this.game = game;
    }
}

export class Sitting extends State {
    constructor(game) {
        super('SITTING', game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 4;
        this.game.player.frameY = 5;
    }
    handleInput(input) {
        if (input.includes('ArrowLeft') || input.includes('ArrowRight') || input.includes('a') || input.includes('d') || input.includes('A') || input.includes('D')) {
            this.game.player.setState(states.RUNNING, 1);
        } 
    }
}

export class Running extends State {
    constructor(game) {
        super('RUNNING', game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.frameY = 3;
        this.game.player.maxFrame = 8;
    }
    handleInput(input) {
        this.game.particle.unshift(new Dust(this.game, this.game.player.x + 30, this.game.player.y + 80));
        if (input.includes('ArrowDown') || input.includes('s') || input.includes('S')) {
            this.game.player.setState(states.SITTING, 0);
        } else if (input.includes('ArrowUp') || input.includes('w') || input.includes('W')) {
            this.game.player.setState(states.JUMPING, 1);
        } else if (input.includes('Enter')  && this.game.player.energy >= 20) {
            this.game.player.setState(states.ROLLING, 2);
        }
    }
}

export class Jumping extends State {
    constructor(game) {
        super('JUMPING', game);
    }
    enter() {
        if (this.game.player.onGround()) {
            this.game.player.vy -= 25;
        }
        this.game.player.frameX = 0;
        this.game.player.frameY = 1;
        this.game.player.maxFrame = 6;
    }
    handleInput(input) {
        if (this.game.player.vy > this.game.player.gravity) {
            this.game.player.setState(states.FALLING, 1);
        } else if (input.includes('Enter') && !this.game.player.onGround()  && this.game.player.energy >= 20) {
            this.game.player.setState(states.ROLLING, 2);
        } else if (input.includes('ArrowDown') || input.includes('s') || input.includes('S')) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Falling extends State {
    constructor(game) {
        super('FALLING', game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.frameY = 2;
        this.game.player.maxFrame = 6;
    }
    handleInput(input) {
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes('ArrowDown') || input.includes('s') || input.includes('S')) {
            this.game.player.setState(states.DIVING, 1);
        } else if (input.includes('Enter') && this.game.player.onGround()) {
            this.game.player.setState(states.ROLLING, 2);
        }
    }
}

export class Rolling extends State {
    constructor(game) {
        super('ROLLING', game);
    }

    enter() {

        this.game.player.frameX = 0;
        this.game.player.frameY = 6;
        this.game.player.maxFrame = 6;
    }

    handleInput(input) {
        this.game.particle.unshift(new Fire(this.game, this.game.player.x + 30, this.game.player.y + 80));

        if (this.game.player.energy <= 0) {
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else {
            this.game.player.setState(states.FALLING, 1);
        }
        return;
    }

        if (!input.includes('Enter') && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (!input.includes('Enter') && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1);
        } else if (input.includes('Enter') && (input.includes('ArrowUp') || input.includes('w') || input.includes('W')) && this.game.player.onGround()) {
            this.game.player.vy = -25;
        } else if ((input.includes('ArrowDown') || input.includes('s') || input.includes('S')) && !this.game.player.onGround()) {
            this.game.player.setState(states.DIVING, 1);
        }
    }
}

export class Diving extends State {
    constructor(game) {
        super('DIVING', game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.frameY = 6;
        this.game.player.maxFrame = 6;
        this.game.player.vy = 15;
    }
    handleInput(input) {
        this.game.particle.unshift(new Fire(this.game, this.game.player.x + 30, this.game.player.y + 80));

        if (this.game.player.onGround()) {
            this.game.particle.unshift(new Splash(this.game, this.game.player.x + 30, this.game.player.y + 80));
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes('Enter') && this.game.player.onGround()  && this.game.player.energy >= 20) {
            this.game.player.setState(states.ROLLING, 2);
        }
    }
}

export class Hit extends State {
    constructor(game) {
        super('HIT', game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.frameY = 4;
        this.game.player.maxFrame = 10;
    }
    handleInput(input) {
        if (this.game.player.frameX >= 10 && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (this.game.player.frameX >= 10 && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 0);
        }
    }
}


