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

        this.firstBounce = 0

        this.gameOptions = {
            bounceHeight: 300,
            ballGravity: 1200,
            ballPower: 1200,
            obstacleSpeed: 250,
            obstacleDistanceRange: [150, 300]
        }
    }

    /**
     * The function loads assets as Phaser begins to run the scene. The images are
     * loaded as key value pairs, we reference the assets by their keys of course
     */
    preload()
    {
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('ball', 'assets/images/ball.png');
        this.load.image('obstacle', 'assets/images/obstacle.png');
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
            this.physics.world.bounds.width / 10 * 2, // x position 
            this.physics.world.bounds.height / 4 * 3 - this.gameOptions.bounceHeight, // y position 
            'ball' // key of image for the sprite
        )
        this.player.body.gravity.y = this.gameOptions.ballGravity;
        this.player.setBounce(1);
        this.player.setCircle(25);

        this.ground = this.physics.add.sprite(
            this.physics.world.bounds.width / 2,
            this.physics.world.bounds.height / 4 * 3,
            'ground'
        )
        this.ground.setImmovable(true);

        this.obstacleGroup = this.physics.add.group()
        let obstacleX = this.physics.world.bounds.width
        for(let i=0; i<10; i++)
        {
            let obstacle = this.obstacleGroup.create(obstacleX, this.ground.getBounds().top, 'obstacle')
            obstacle.setOrigin(0.5, 1);
            obstacle.setImmovable(true)
            obstacleX += Phaser.Math.Between(this.gameOptions.obstacleDistanceRange[0], this.gameOptions.obstacleDistanceRange[1])
        }

        this.obstacleGroup.setVelocityX(-this.gameOptions.obstacleSpeed);

        /* Add collision for the player and the ball.
         * If collision happens, function hitPlayer() will be called
         */ 
        this.physics.add.collider(this.player, this.ground, function(){
            if(this.firstBounce == 0)
            {
                this.firstBounce = this.player.body.velocity.y
            }
            else {
                this.player.body.velocity.y = this.firstBounce
            }
        }, null, this)

        this.input.on('pointerdown', this.boost, this);

        this.physics.add.collider(this.player, this.obstacleGroup, function(){
            console.log("Game Over")
            this.scene.start();
        }, null, this);

        console.log("created")
    }

    update()
    {
        this.obstacleGroup.getChildren().forEach(function(obstacle){
            if(obstacle.getBounds().right < 0){
//                this.updateScore(1);
                obstacle.x = this.getRightmostObstacle() + Phaser.Math.Between(this.gameOptions.obstacleDistanceRange[0], this.gameOptions.obstacleDistanceRange[1]);
            }
        }, this)

    }

    boost(){
        if(this.firstBounce != 0){
            this.player.body.velocity.y = this.gameOptions.ballPower;
        }
    }

    getRightmostObstacle(){
        let rightmostObstacle = 0;
        this.obstacleGroup.getChildren().forEach(function(obstacle){
            rightmostObstacle = Math.max(rightmostObstacle, obstacle.x);
        });
        return rightmostObstacle;
    }
}
