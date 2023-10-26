import Config from "./Config.js"
import Canvas from "./Canvas.js"
import Pong from "./Pong.js";


class Main {

    static start() {
        this.cnf    = new Config();
        this.canvas = new Canvas(this.cnf);
        this.pong   = new Pong(this.cnf, this.canvas.ctx);

        this.pong.controls(this.canvas.canvas)
        this.#gameLoop();
    }

    static #gameLoop() {
        this.canvas.update();
        this.pong.update();

        if (!this.pong.end)
            requestAnimationFrame(this.#gameLoop.bind(this))
    }

}

Main.start();