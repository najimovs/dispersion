import * as THREE from "three"
import { MapControls } from "three/addons/controls/MapControls"

export function setupScene() {

	const canvas = document.getElementById( "gl" )
	const scene = new THREE.Scene()

	const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100 )
	camera.position.set( 5, 5, 5 )
	camera.lookAt( 0, 0, 0 )

	const renderer = new THREE.WebGLRenderer( { canvas, antialias: true } )
	renderer.setPixelRatio( window.devicePixelRatio )
	renderer.setSize( window.innerWidth, window.innerHeight )

	const controls = new MapControls( camera )
	controls.enableDamping = true
	controls.zoomToCursor = true
	controls.connect( renderer.domElement )

	canvas.addEventListener( "contextmenu", e => e.preventDefault() )

	window.addEventListener( "resize", () => {

		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		renderer.setSize( window.innerWidth, window.innerHeight )
	} )

	const render = () => {

		requestAnimationFrame( render )

		controls.update()
		renderer.render( scene, camera )
	}

	render()

	//

	return {
		canvas,
		scene,
		camera,
		renderer,
		controls,
	}
}
