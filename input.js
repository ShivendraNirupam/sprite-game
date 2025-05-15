export class InputHandler{
    constructor(game) {
        this.game = game;
        this.key = [];
        window.addEventListener('keydown', (e) => {
            if(((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S')
                || (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W')
                || (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A')
                || (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D')
                || (e.key === 'Enter')
            ) && this.key.indexOf(e.key) === -1){
                this.key.push(e.key);
            }
            
           
        });
         window.addEventListener('keyup', (e) => {
            if((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S')
                || (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W')
                || (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A')
                || (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D')
                || (e.key === 'Enter')
            ){
                this.key.splice(this.key.indexOf(e.key), 1);
            }
           
        });
    }
}