var ship = 
{ 
    type: 'ship', 
    components: [
        {
            type: 'shape',
            shape: 
            {
                type: 'wedge',
                sides: 3, radius: 30,
                fill: 'red',
                stroke: 'black',
                strokeWidth: 2,
                angleDeg: 45,
                offset: [15,7]
            },
            rotation: 3.55
        },
        {
            type: 'spatial',
            velocity: 
            {
                x: 0, y: 0
            },
            position:
            {
                x: 0, y: 0
            }
        },
        {
            type: 'controller'
        },
        {
            type: 'accellerator',
            magnitude: 200
        },
        //{
        //    type: 'gravity',
        //    magnitude: -98.8
        //},
        {
            type: 'exhaust',
            pipes: 3
        },
        {
            type: 'rotation',
            initial: Math.PI/2.0,
            speed: 0.05
        },
        {
            type: 'gun',
            spread: 0.1,
            barrels: 1
        },
        {
            type: 'collision'
        },
        {
            type: 'explodeonkill',
            particlesize: 20,
            particlecount: 100,
            size: 5
        },
        {
            type: 'dieonasteroidcollision'
        },
        {
            type: 'destroyoutofbounds'
        }
    ]
}

var bullet = 
{
    type: 'bullet', 
    components: [
        {
            type: 'shape',
            shape: 
            {
                type: 'wedge',
                sides: 3, radius: 7,
                fill: 'black',
                stroke: 'none',
                strokeWidth: 0,
                angleDeg: 45
            },
            rotation: 3.55
        },
        {
            type: 'spatial',
            velocity: { x: 0, y: 0 },
            position: { x: 0, y: 0 }
        },
        {
            type: 'rotation',
            initial: 0,
            speed: 0
        },
        {
            type: 'collision'
        },
        {
            type: 'explodeonkill',
            particlesize: 5,
            particlecount: 5,
            size: 1
        },
        {
            type: 'dieonasteroidcollision'
        },
        {
            type: 'destroyoutofbounds'
        }
    ]
};

var asteroid = 
{

    type: 'asteroid', 
    components: [
        {
            type: 'shape',
            shape: 
            {
                type: 'regularpolygon',
                sides: Math.floor((Math.random()*10)+5), radius: 25,
                fill: 'gray',
                stroke: 'black',
                strokeWidth: 2,
            } 
        },
        {
            type: 'spatial',
            velocity: { x: 0, y: 0 },
            position: { x: 0, y: 0 }
        },
        {
            type: 'gravity',
            magnitude: -98.8
        },
        {
            type: 'rotation',
            initial: Math.PI/2.0,
            speed: 0.1
        },
        {
            type: 'asteroidsize',
            size: 1
        },
        {
            type: 'continuousrotation',
            direction: Math.random()-0.5
        },
        {
            type: 'collision'
        },
        {
            type: 'explodeonkill',
            particlesize: 5,
            particlecount: 5,
            size: 0.5
        },
        {
            type: 'destroyoutofbounds'
        },
        {
            type: 'points',
            points: 100
        }
    ]
};

var particle = 
{
    type: 'particle', 
    components: [
        {
            type: 'shape',
            shape: 
            {
                type: 'circle',
                radius: 5,
                fill: 'red',
                stroke: 'black',
                strokeWidth: 2,
            } 
        },
        {
            type: 'spatial',
            velocity: { x: 0, y: 0 },
            position: { x: 0, y: 0 }
        },
        {
            type: 'lifetime',
            lifetime: 1
        },
        { 
            type: 'size',
            size: 5
        }
    ]
};
