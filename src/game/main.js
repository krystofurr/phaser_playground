import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { AUTO, Game } from 'phaser';
import DungeonScene from '../game/scenes/DungeonScene';
import Raycaster from 'phaser-raycaster';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#221f1fff',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        DungeonScene
    ],
    plugins: {
        scene: [
            {
                key: 'PhaserRaycaster',
                plugin: Raycaster,
                mapping: 'raycaster'
            }
        ]
    }
};

const StartGame = (parent) => {

    return new Game({ ...config, parent });

}

export default StartGame;
