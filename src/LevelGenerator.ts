const ADDITIONAL_CIRCLES: number = 3;
const WORLD_MAX_WIDTH: number = 800;
const WORLD_MAX_HEIGHT: number = 600;
const MAX_CIRCLE_RADIUS: number = 100;
const MIN_CIRCLE_RADIUS: number = 10;
const MAX_DEAD_ENDS: number = 3;
const CORRIDOR_CREATE_PROBABILITY = 0.5;

class CircleDistance {
    indexA: number;
    indexB: number;
    distance: number;
}

export default class LevelGenerator {

    public static generateCircles(levelNum: number): Phaser.Geom.Circle[] {
        const rooms: Phaser.Geom.Circle[] = [];
        for (let i: number = 0; i < levelNum + ADDITIONAL_CIRCLES; i++) {
            let x: number = Math.random() * WORLD_MAX_WIDTH;
            let y: number = Math.random() * WORLD_MAX_HEIGHT;
            let radius: number = (Math.random() * (MIN_CIRCLE_RADIUS - MAX_CIRCLE_RADIUS)) + MIN_CIRCLE_RADIUS;
            rooms.push(new Phaser.Geom.Circle(x, y, radius));
        }
        return rooms;
    }

    public static generateMinimumCorridors(circles: Phaser.Geom.Circle[]) {
        const corridors: Phaser.Geom.Line[] = [];
        const distances: CircleDistance[] = [];
        for (let i: number = 0; i < circles.length; i++) {
            for (let j: number = i; j < circles.length; j++) {
                if (i != j) {
                    const distance = Phaser.Math.Distance.Between(
                        circles[i].x, circles[i].y,
                        circles[j].x, circles[j].y
                    )
                    distances.push({
                        indexA: i,
                        indexB: j,
                        distance
                    })
                }
            }
        }

        distances.sort((a: CircleDistance, b: CircleDistance): number => {
            return b - a;
        })
    }
}

let circles: Phaser.Geom.Circle[] = LevelGenerator.generateCircles(1);
let connections: Phaser.Geom.Line[] = LevelGenerator.generateCorridors(circles, 1);
