import Phaser from '../lib/phaser.js'

export default class GameScene extends Phaser.Scene
{
    constructor()
    {
        super('game-scene')

        // Defining there variables here to let them can be accessed in all of the functions in this class
        this.player
        this.ball
        this.cursors

        // Variable to determine if we started playing
        this.gameStarted = false
    }

    /**
     * The function loads assets as Phaser begins to run the scene. The images are
     * loaded as key value pairs, we reference the assets by their keys of course
     */
    preload()
    {
        this.load.image('paddle', 'assets/images/paddle1.png');      
        this.load.image('ball', 'assets/images/ball_32_32.png');
//        this.load.image('paddle', 'assets/images/paddle1.png');      
//        this.load.image('ball', 'assets/images/fireball1.png');

//        this.load.image('ball', 'assets/images/basketball.png');
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
        this.player = this.physics.add.sprite(
            this.physics.world.bounds.width / 2, // x position 
            this.physics.world.bounds.height - 40, // y position 
            'paddle' // key of image for the sprite
        )

        // Let's add the ball
        this.ball = this.physics.add.sprite(
            this.physics.world.bounds.width / 2, // x position 
            this.physics.world.bounds.height - 80, // y position
            'ball' // key of image for the sprite
        )

        // Ensure that the player and ball can't leave the screen
        this.player.setCollideWorldBounds(true);
        this.ball.setCollideWorldBounds(true);

        /**
         * The bounce ensures that the ball retains its velocity after colliding with
         * an object.
        */
        this.ball.setBounce(1, 1)

        /**
         * Setup collision, enable top, left, and right collosion, only disable collision with the bottom of the game world,
         * so the ball falls to the bottom, which means that the game is over
         */
        this.physics.world.setBoundsCollision(true, true, true, false);

        // Make the player immovable
        this.player.setImmovable()

        /* Add collision for the player and the ball.
         * If collision happens, function hitPlayer() will be called
         */ 
        this.physics.add.collider(this.ball, this.player, this.hitPlayer, null, this)

        // Manage key presses
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update()
    {
        // Check if the ball left the scene i.e. game over
        if (this.isGameOver())
        {
            // Output "Game Over" in console window
            console.log("Game Over")

            // Then we restart the game
            this.gameStarted = false
            this.scene.restart()
        }

        /**
         * Check the cursor and move the velocity accordingly. With Arcade Physics we
         * adjust velocity for movement as opposed to manipulating xy values directly
         */
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-200)
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(200)
        }
        else
        {
            this.player.setVelocityX(0)
        }       

        // The game only begins when the user presses Spacebar to release the paddle
        if (!this.gameStarted)
        {
            // The ball should follow the paddle while the user selects where to start
            this.ball.setX(this.player.x)

            // If space key is down, let the game start
            if(this.cursors.space.isDown)
            {
                this.gameStarted = true
                this.ball.setVelocityY(-200)
                this.ball.setVelocityX(Phaser.Math.Between(-200, 200))

            }
        }
    }

    hitPlayer(ball, player)
    {

    }

    // Checks if the user lost the game
    isGameOver()
    {
        return this.ball.body.y > this.physics.world.bounds.height
    }
}
