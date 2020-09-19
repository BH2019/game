import Phaser from '../lib/phaser.js'

export default class GameScene extends Phaser.Scene
{
    constructor()
    {
        super('game-scene')

        // Defining there variables here to let them can be accessed in all of the functions in this class
        this.bird
        this.pipeGroup

        // Variable to determine if we started playing
        this.gameStarted = false

        this.rightMostPipe = undefined

        this.pipePool = []

        this.gameOptions = {

            // horizontal bird speed
            birdSpeed: 125,
            
            // bird gravity, will make bird fall if you don't flap
            birdGravity: 800,

            // flap thrust
            birdFlapPower: 300,

            // distance range from next pipe, in pixels
            pipeDistance: [220, 280],

            // hole range between pipes, in pixels
            pipeHole: [100, 130],
//            pipeHole: [350, 380],

            // minimum pipe height, in pixels. Affects hole position
            minPipeHeight: 50,
//            minPipeHeight: 20,

        }
    }

    /**
     * The function loads assets as Phaser begins to run the scene. The images are
     * loaded as key value pairs, we reference the assets by their keys of course
     */
    preload()
    {
        this.load.image('pipe', 'assets/images/pipe.png');
        this.load.image('bird', 'assets/images/bird.png');
    }

    /**
     * We create our game world in this function. The initial state of our game is
     * defined here. We also set up our physics rules here
     */
    create()
    {
        /**
         * Coordinates start at 0,0 from the top left
         * As we move rightward, the x value increases
         * As we move downward, the y value increases.
         */
        this.bird = this.physics.add.sprite(
            80,
            this.physics.world.bounds.height / 2,
            'bird' // key of image for the sprite
        )
        this.bird.body.gravity.y = this.gameOptions.birdGravity

        this.pipeGroup = this.physics.add.group()
        for(let i=0; i<4; i++)
        {
            this.pipePool.push(this.pipeGroup.create(0, 0, 'pipe'))
            this.pipePool.push(this.pipeGroup.create(0, 0, 'pipe'))
            this.placePipes()
        }

        this.pipeGroup.setVelocityX(-this.gameOptions.birdSpeed);

        this.physics.add.collider(this.bird, this.pipeGroup, this.gameOver, null, this)

        this.input.on('pointerdown', this.flap, this);
    }

    placePipes()
    {
        if(this.rightMostPipe == undefined)
        {
            var rightMostPipeX = 100
        }
        else {
            var rightMostPipeX = this.rightMostPipe.getBounds().left
        }

        let pipeX = rightMostPipeX + Phaser.Math.Between(this.gameOptions.pipeDistance[0], this.gameOptions.pipeDistance[1])

        let pipeHoleHeight = Phaser.Math.Between(this.gameOptions.pipeHole[0], this.gameOptions.pipeHole[1]);
        let pipeHolePosition = Phaser.Math.Between(this.gameOptions.minPipeHeight + pipeHoleHeight / 2, this.physics.world.bounds.height - this.gameOptions.minPipeHeight - pipeHoleHeight / 2);

        console.log(pipeHoleHeight, pipeHolePosition)

        let pipeY1 = pipeHolePosition - pipeHoleHeight / 2
        let pipeY2 = pipeHolePosition + pipeHoleHeight / 2

        console.log(pipeX, pipeY1, pipeY2)

        this.pipePool[0].x = pipeX
        this.pipePool[0].y = pipeY1
        this.pipePool[1].x = pipeX
        this.pipePool[1].y = pipeY2

        this.pipePool[0].setImmovable(true)
        this.pipePool[1].setImmovable(true)

        this.pipePool[0].setOrigin(0, 1)
        this.pipePool[1].setOrigin(0, 0)

        this.rightMostPipe = this.pipePool[0]

        this.pipePool = []
    }

    update()
    {
        if (this.bird.y<0 || this.bird.y>this.physics.world.bounds.height)
        {
            this.gameOver()
        }

        this.pipeGroup.getChildren().forEach(function(pipe){
            if(pipe.getBounds().right < 0)
            {
                this.pipePool.push(pipe)
                if(this.pipePool.length == 2)
                {
                    console.log("placePipe in update")
                    this.placePipes()
                }
            }
        }, this)        
    }

    flap()
    {
        console.log("flap")
        this.bird.setVelocityY(-this.gameOptions.birdFlapPower)
    }

    gameOver()
    {
        console.log("gameOver")
        this.rightMostPipe = undefined
        this.scene.start("game-scene")
    }
}
