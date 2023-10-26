

export default class Canvas {

    constructor(cnf) {
        this.cnf    = cnf;
        this.canvas = document.querySelector('#game');
        this.ctx    = this.canvas.getContext('2d');
        this.w      = null;
        this.h      = null;

        this.resize();
    }

    resize() {
        this.w = this.canvas.width  = this.cnf.window.w;
        this.h = this.canvas.height = this.cnf.window.h;

        this.drawBg('1');
    }

    drawLine() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(200,200,200,.5)';
        this.ctx.moveTo(this.w / 2, 0);
        this.ctx.lineTo(this.w / 2, this.h);
        this.ctx.setLineDash([this.h / 35]);
        this.ctx.lineWidth = 3
        this.ctx.stroke();
    }

    drawBg(alfa) {
        this.ctx.fillStyle = `rgba(10,10,10,${alfa})`
        this.ctx.fillRect(0,0,this.w, this.h);
    }

    update() {
        this.drawBg('.5');
        this.drawLine();
    }

}