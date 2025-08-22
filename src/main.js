import * as THREE from "three"
import { setupScene } from "./setupScene"

const { scene } = setupScene()

const geometry = new THREE.SphereGeometry( 1, 64, 64 )
const material = new THREE.PointsMaterial( { sizeAttenuation: false, size: 1 } )
const object = new THREE.Points( geometry, material )
scene.add( object )
