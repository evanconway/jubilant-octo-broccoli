const ADDITIONAL_CIRCLES: number = 3;
const WORLD_MAX_WIDTH: number = 800;
const WORLD_MAX_HEIGHT: number = 600;
const MAX_CIRCLE_RADIUS: number = 100;
const MIN_CIRCLE_RADIUS: number = 10;
const MAX_DEAD_ENDS: number = 3;
const CORRIDOR_CREATE_PROBABILITY = 0.5;

class Edge {
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
        const edges: Edge[] = []

        const visited: Set<number> = new Set<number>();

        let current: number = 0;

        visited.add(current);
        for (let i: number = 0; i < circles.length; i++) {
            if (!visited.has(i)) {
                edges.push({
                    indexA: current,
                    indexB: i,
                    distance: Phaser.Math.Distance.Between(
                        circles[current].x, circles[current].y,
                        circles[i].x, circles[i].y
                    )
                });
            }
        }

        edges.sort((a: Edge, b: Edge): number => {
            return b.distance - a.distance;
        });

        // gave up here lol, going to hand write levels

        // for (let i: number = 0; i < edges.length; i++) {
        //     if (!visited.has(edges[i].indexB) {
                
        //     }
        // }
    }
}

// let circles: Phaser.Geom.Circle[] = LevelGenerator.generateCircles(1);
// let connections: Phaser.Geom.Line[] = LevelGenerator.generateMinimumCorridors(circles);
