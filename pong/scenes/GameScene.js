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
        this.keys = {}
        this.score = 0
        this.score2 = 0
        this.scoreText

        // Variable to determine if we started playing
        this.gameStarted = false
    }

    /**
     * The function loads assets as Phaser begins to run the scene. The images are
     * loaded as key value pairs, we reference the assets by their keys of course
     */
    preload()
    {
        this.load.image('paddle', 'assets/images/paddle_128_32.png');      
        this.load.image('ball', 'assets/images/fireball.png');
        
    }

    /**
     * We create our game world in this function. The initial state of our game is
     * defined here. We also set up our physics rules here
     */
    create()
    {
        this.scoreText = this.add.text(16, 16, '|', { color: '#fff', fontSize: 24 })
        this.scoreText.text = ` ${this.score2}|${this.score}`
        /**
         * Coordinates start at 0,0 from the top left
         * As we move rightward, the x value increases
         * As we move downward, the y value increases.
         */
        this.player = this.physics.add.sprite(
            600, // x position 
            240, // y position 
            'paddle' // key of image for the sprite
        )

        this.player2 = this.physics.add.sprite(
            50, // x position 
            240, // y position 
            'paddle' // key of image for the sprite
        )

        // Let's add the ball
        this.ball = this.physics.add.sprite(
            320, // x position 
            400, // y position
            'ball' // key of image for the sprite
        )
        this.ball.setScale(0.125)

        // Ensure that the player and ball can't leave the screen
        this.player.setCollideWorldBounds(true);
        this.ball.setCollideWorldBounds(true);
        this.player2.setCollideWorldBounds(true);
        /**
         * The bounce ensures that the ball retains its velocity after colliding with
         * an object.
        */
        this.ball.setBounce(1.02, 1.02)

        /**
         * Setup collision, enable top, left, and right collosion, only disable collision with the bottom of the game world,
         * so the ball falls to the bottom, which means that the game is over
         */
        this.physics.world.setBoundsCollision(false, false, true, true);

        // Make the player immovable
        this.player.setImmovable()
        this.player2.setImmovable()
        /* Add collision for the player and the ball.
         * If collision happens, function hitPlayer() will be called
         */ 
        this.physics.add.collider(this.ball, this.player, this.hitPlayer, null, this)
        this.physics.add.collider(this.ball, this.player2, this.hitPlayer2, null, this)
        // Manage key presses
        this.cursors = this.input.keyboard.createCursorKeys()

        this.keys.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.keys.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)    
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
        else if (this.isGameOver2())
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
        if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-200)
        }
        else if (this.cursors.down.isDown)
        {
            this.player.setVelocityY(200)
        }
        else
        {
            this.player.setVelocityY(0)
        }

        if (this.keys.w.isDown)
        {
            this.player2.setVelocityY(-200)
        }
        else if (this.keys.s.isDown)
        {
            this.player2.setVelocityY(200)
        }
        else
        {
            this.player2.setVelocityY(0)
        }

        

        // The game only begins when the user presses Spacebar to release the paddle
        if (!this.gameStarted)
        {
            // The ball should follow the paddle while the user selects where to start
            this.ball.setY(this.player.y)

            // If space key is down, let the game start
            if(this.cursors.space.isDown)
            {
                this.gameStarted = true

                // Set velocity of Y direction, negative means up
                this.ball.setVelocityY(-300)
                let thing = Phaser.Math.Between(100, 220)
                let thing1 = Phaser.Math.Between(-100, -220)
                let thing2 = Phaser.Math.Between(1, 2)
                if (thing2 === 1)
                {
                    this.ball.setVelocityX(thing)
                }
                else{
                    this.ball.setVelocityX(thing1)
                }

            }
        }
    }

    // Checks if the user lost the game
    isGameOver()
    {
        if (this.ball.x > 630)
        {
            this.score2 += 1
            this.scoreText.text = ` ${this.score2}|: ${this.score}`
            return this.ball.x > 630
        }
    }
    isGameOver2()
    {
        
        if (this.ball.x < 0)
        {
            this.score += 1
            this.scoreText.text = ` ${this.score2}|: ${this.score}`
            return this.ball.x < 0
        }
    }
}
