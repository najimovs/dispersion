import * as THREE from "three"
import { setupScene } from "./setupScene"

const { scene } = setupScene()

const geometry = new THREE.SphereGeometry( 1, 64, 64 )
const material = new THREE.PointsMaterial( { sizeAttenuation: false, size: 1 } )
const object = new THREE.Points( geometry, material )
scene.add( object )

// Velocity
const velocity = []

for ( let i = 0; i < geometry.attributes.position.count; i++ ) {

	velocity.push( Math.random() - 0.5 )
}

geometry.setAttribute( "velocity", new THREE.Float32BufferAttribute( velocity, 1 ) )

// Dispersion
const positionAttribute = geometry.attributes.position
const velocityAttribute = geometry.attributes.velocity
const tmp = new THREE.Vector3()
const scale = 0.5

for( let i = 0; i < positionAttribute.count; i++ ) {

	tmp.fromBufferAttribute( positionAttribute, i )
	tmp.addScaledVector( tmp, velocityAttribute.getX( i ) * scale )
	positionAttribute.setXYZ( i, ...tmp )
}
