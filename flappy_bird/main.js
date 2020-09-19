import Phaser from './lib/phaser.js'
import GameScene from './scenes/GameScene.js'

// This object contains all the Phaser configurations to load our game
const config = {
  	/**
   	 * The type can be Phaser.CANVAS, Phaser.WEBGL or Phaser.AUTO. AUTO means that
   	 * Phaser will try to render with WebGL, and fall back to Canvas if it fails
   	 */
	type: Phaser.AUTO,
	backgroundColor:0x87ceeb,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 320,
		height: 400
	},
	/**
  	 * The physics engine determines how objects interact with the world. Phaser
   	 * supports three physics engines out of the box: arcade, impact and matter.
     * Arcade is understood to be the simplest one to implement
   	*/

	pixelArt: true,

	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 0
			}
		}
	},
	/**
   	 * A scene is "self-contained" game world - all the logic and state of a game
   	 * component. For e.g. it's common to a game menu to be one scene, whereas the
     * first level is another scene. Phaser has a Scene object, but we can provide
     * a regular JS object with these function names:
     */
	scene: [GameScene]
}

// Create the game instance
export default new Phaser.Game(config)
