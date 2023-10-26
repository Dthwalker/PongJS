export default class Pong {

    constructor(cnf, ctx) {
        this.cnf    = cnf;
        this.ctx    = ctx;
        this.mouse  = 0;
        this.player = new Rocket(this.cnf.window.w - 10, this.cnf.window.h / 2, this.cnf.rSize);
        this.enemy  = new Rocket(10, this.cnf.window.h / 2, this.cnf.rSize);
        this.ball   = new Ball(this.cnf.window.w/2, this.cnf.window.h/2, this.cnf.bSpeed);
        this.top    = this.cnf.rSize / 2 + this.cnf.bSize;
        this.bot    = this.cnf.window.h - this.cnf.rSize / 2 - this.cnf.bSize;
        this.score  = [0,0];
        this.clock  = 0;
        this.end    = false;
    }

    printScore() {
        if (this.end) {
            this.ctx.fillStyle = 'rgba(200,200,200, 1)';
            this.ctx.font = '30px monospace'
            let txt = this.score[0] == 10 ? 'you are winner' : 'you are looser'
            this.ctx.fillText(txt, this.cnf.window.w / 2 - 110, this.cnf.window.h / 2);
        }
        this.ctx.fillStyle = 'rgba(200,200,200, .5)';
        this.ctx.font = '24px monospace'
        this.ctx.fillText(this.score[0], this.cnf.window.w / 2 + 10, 20);
        this.ctx.fillText(this.score[1], this.cnf.window.w / 2 - 23, 20);
    }

    playerMove() {
        if (this.mouse < this.top) {
            this.player.y = this.top;
        } else if (this.mouse > this.bot) {
            this.player.y = this.bot
        } else {
            this.player.y = this.mouse;
        }
        if (this.clock == 0) {
            this.player.setSpeed()
        }
    }

    ballMove() {
        this.ball.move();
        let [x, y] = [this.ball.x, this.ball.y];

        let checkRockets = (rocket) => y > rocket.top && y < rocket.bot

        if (x >= this.player.x - 1 && x < this.player.x + this.ball.speed * this.ball.dx && checkRockets(this.player) ||
            x <= this.enemy.x + 1 && x > this.enemy.x + this.ball.speed * this.ball.dx && checkRockets(this.enemy)) {
                x > this.cnf.window.w / 2 ? this.ball.x = this.player.x - 2 : 
                                            this.ball.x = this.enemy.x + 2
                x = this.ball.x
                this.ball.dx *= -1.02;

                if (x > this.cnf.window.w / 2 ) {
                    this.ball.dy = (y - (this.player.top + this.cnf.rSize / 2)) * 0.1
                    let ns = Math.sqrt(this.player.speed) * 0.7
                    this.ball.speed = ns > 2 ? ns : 2
                }
        }

        if (y <= 0 || y >= this.cnf.window.h) this.ball.dy *= -1;

        if (x < 0 || x > this.cnf.window.w) {
            this.ball = new Ball(this.cnf.window.w/2, this.cnf.window.h/2, this.cnf.bSpeed);
            x > this.cnf.window.w ? this.score[1]++ : this.score[0]++
            this.score.includes(10) ? this.end = true : null;
        }
    }

    enemyMove() {
        this.enemy.y < this.top ? this.enemy.y = this.top :
        this.enemy.y > this.bot ? this.enemy.y = this.bot :
        this.enemy.y += (this.ball.y - this.enemy.y) * 0.2
        if (this.clock == 0) {
            this.enemy.setSpeed();
        }
    }


    draw() {
        [this.enemy, this.player]
            .forEach(e => e.draw(this.ctx));
        this.ball.draw(this.ctx, this.cnf.bSize);
    }

    update() {
        this.clock < 5 ? this.clock++ : this.clock = 0;
        this.playerMove();
        this.ballMove();
        this.enemyMove();
        this.printScore()
        this.draw();
    }

    controls(cnv) {
        addEventListener('mousemove', ({clientY}) => {
            let canvas = cnv.getBoundingClientRect().y;
            this.mouse = clientY - canvas;
        });
    }

}


class Rocket {

    constructor(x, y, size) {
        this.x     = x;
        this.y     = y;
        this.size  = size;
        this.color = 'white';
        this.lPose = y;
        this.speed = 0;
    }

    get top() { return this.y - this.size / 2 }
    get bot() { return this.top + this.size }

    setSpeed() {
        this.speed = Math.abs(this.y - this.lPose);
        this.lPose = this.y;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - 1, this.top,
                     2, this.size);
    }

}


class Ball extends Rocket {

    constructor(x,y,speed) {
        super(x,y);
        this.speed = speed;
        this.dx = 2;
        this.dy = 0;
    }



    move() {
        this.x += this.dx * this.speed;
        this.y += this.dy * (this.speed * 0.5);
    }

    draw(ctx, size) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - size / 2 , this.y - size / 2,
                     size, size);
    }

}