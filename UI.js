export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 50;
        this.fontFamily = 'Banger';
        this.color = 'black';
        this.margin = 20;
    }

    draw(context) {
        context.save(); 

        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.textAlign = 'left';
        context.fillStyle = this.color;

        // Draw Score
        context.fillText(`Score: ${this.game.score}`, this.margin, this.margin + this.fontSize / 2);

        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.fillStyle = this.color;
        context.fillText(`Time: ` + Math.floor(this.game.time * 0.001), this.margin, this.margin + this.fontSize *2);
        if(this.game.gameOver) {
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.font = `${this.fontSize * 2}px ${this.fontFamily}`;
            if(this.game.score >= 10) {
                context.fillText('Boo - Yah', this.game.width * 0.5, this.game.height * 0.5);
            }
            else {
                context.fillText('Haiyaaa !', this.game.width * 0.5, this.game.height * 0.5);
                context.font = `${this.fontSize}px ${this.fontFamily}`;
                context.fillText('You are a loser', this.game.width * 0.5, this.game.height * 0.5 + this.fontSize);
            }
        } 
        context.restore(); 
    }
}
