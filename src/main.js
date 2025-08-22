import * as THREE from "three"
import { setupScene } from "./setupScene"

const { scene, canvas, camera } = setupScene()

const geometry = new THREE.SphereGeometry( 1, 128, 128 )
const material = new THREE.PointsMaterial( { sizeAttenuation: false, size: 1 } )
const object = new THREE.Points( geometry, material )
scene.add( object )

// Velocity
const velocity = []

const originalPositions = []

for ( let i = 0; i < geometry.attributes.position.count; i++ ) {

	velocity.push( 0 )
	
	const x = geometry.attributes.position.getX( i )
	const y = geometry.attributes.position.getY( i )
	const z = geometry.attributes.position.getZ( i )

	originalPositions.push( x, y, z )
}

geometry.setAttribute( "velocity", new THREE.Float32BufferAttribute( velocity, 1 ) )
geometry.setAttribute( "originalPosition", new THREE.Float32BufferAttribute( originalPositions, 3 ) )

const mouse = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
const radius = 0.5

canvas.addEventListener( "pointermove", onPointerMove )

function onPointerMove( event ) {

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
	mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1

	raycaster.setFromCamera( mouse, camera )
	const intersects = raycaster.intersectObject( object )

	if ( intersects.length > 0 ) {

		const intersect = intersects[ 0 ]
		const coordinates = intersect.point

		setVelocityForNearbyVertices( coordinates )
	}
	else {

		setReturnVelocityForAllVertices()
	}
}

function setVelocityForNearbyVertices( coordinates ) {

	const positionAttribute = geometry.attributes.position
	const velocityAttribute = geometry.attributes.velocity
	const vertex = new THREE.Vector3()

	for ( let i = 0; i < positionAttribute.count; i++ ) {

		vertex.fromBufferAttribute( positionAttribute, i )
		const distance = vertex.distanceTo( coordinates )

		if ( distance <= radius ) {

			const normalizedDistance = distance / radius
			const velocityValue = ( 1 - normalizedDistance ) * ( Math.random() * 0.5 + 0.5 )
			velocityAttribute.setX( i, velocityValue )
		}
	}

	velocityAttribute.needsUpdate = true
}

function setReturnVelocityForAllVertices() {

	const velocityAttribute = geometry.attributes.velocity

	for ( let i = 0; i < velocityAttribute.count; i++ ) {

		velocityAttribute.setX( i, - 0.5 )
	}

	velocityAttribute.needsUpdate = true
}

//

let lastTime = 0

update()

function update( time = 0 ) {

	requestAnimationFrame( update )
	
	const deltaTime = ( time - lastTime ) / 1_000
	lastTime = time
	
	disperse( deltaTime )
}

// Dispersion
function disperse( deltaTime ) {

	const positionAttribute = geometry.attributes.position
	const velocityAttribute = geometry.attributes.velocity
	const originalPositionAttribute = geometry.attributes.originalPosition
	const tmp = new THREE.Vector3()
	const original = new THREE.Vector3()
	const speed = 5 // units per second
	const scale = 1 // small scale for fine movement

	for( let i = 0; i < positionAttribute.count; i++ ) {

		const velocity = velocityAttribute.getX( i )
		
		if ( velocity > 0 ) {

			tmp.fromBufferAttribute( positionAttribute, i )
			tmp.addScaledVector( tmp, velocity * scale * speed * deltaTime )
			positionAttribute.setXYZ( i, ...tmp )
		}
		else if ( velocity < 0 ) {

			tmp.fromBufferAttribute( positionAttribute, i )
			original.fromBufferAttribute( originalPositionAttribute, i )

			const direction = original.clone().sub( tmp )
			tmp.add( direction.multiplyScalar( Math.abs( velocity ) * scale * speed * deltaTime ) )
			positionAttribute.setXYZ( i, ...tmp )

			if ( tmp.distanceTo( original ) < 0.01 ) {

				positionAttribute.setXYZ( i, ...original )
				velocityAttribute.setX( i, 0 )
			}
		}
	}

	positionAttribute.needsUpdate = true
	velocityAttribute.needsUpdate = true
}
