import { Float, MeshTransmissionMaterial, Text, useGLTF } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef, useState } from "react"
import { MathUtils } from "three"

export default function Model({ mouse, isZooming }) {

    const breakpoint = window.innerWidth;

    const mesh = useRef()
    const { nodes } = useGLTF("/medias/torus.glb")
    const { viewport } = useThree()
    const [isHovered, setIsHovered] = useState(false)

    useFrame(() => {
        // floating
        if (isHovered) {
            mesh.current.position.x = MathUtils.lerp(mesh.current.position.x, (mouse.x.current - .5) * 9, 0.01)
            mesh.current.position.y = MathUtils.lerp(mesh.current.position.y, -(mouse.y.current - .5) * 9, 0.01)
        } else {
            mesh.current.position.x = MathUtils.lerp(mesh.current.position.x, 0, 0.005)
            mesh.current.position.y = MathUtils.lerp(mesh.current.position.y, 0, 0.005)
        }

        // rotation
        if (isHovered) {
            // mesh.current.rotation.x = MathUtils.lerp(
            //     mesh.current.rotation.x,
            //     Math.PI / 2,
            //     0.003
            // )
            mesh.current.rotation.x -= 0.004;
        } else {
            mesh.current.rotation.x += 0.007
        }

        if (isZooming) {
            mesh.current.rotation.x = MathUtils.lerp(
                mesh.current.rotation.x,
                Math.PI / 2,
                0.07
            )
            mesh.current.rotation.y = MathUtils.lerp(
                mesh.current.rotation.y,
                Math.PI / 2,
                0.07
            )
            mesh.current.position.x = MathUtils.lerp(mesh.current.position.x, 0, 0.1)
            mesh.current.position.y = MathUtils.lerp(mesh.current.position.y, 0, 0.1)
        }

        if (mesh.current.rotation.x >= 2 * Math.PI)
            mesh.current.rotation.x = 0
    })

    return (
        <Float>
            <group scale={breakpoint > 1024 ? viewport.width / 12 : viewport.width / 6}>
                <Text font="/fonts/Orbitron-VariableFont_wght.ttf" position={[0, 0, -2]} fontSize={breakpoint > 1024 ? 1.4 : 0.85}>{"    "}elevate your{'\n'}experience</Text>
                <mesh
                    ref={mesh} onPointerEnter={() => setIsHovered(true)} onPointerLeave={() => setIsHovered(false)} {...nodes.Torus005}>
                    <MeshTransmissionMaterial thickness={.3} roughness={0.2} transmission={1} ior={1} chromaticAberration={0.2} backside />
                </mesh>
            </group>
        </Float>
    )
}
