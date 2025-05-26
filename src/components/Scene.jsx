import { Canvas, useThree } from "@react-three/fiber";
import Model from "./Model";
import { Environment, Html } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "motion/react";
import { CameraZoom } from "./CameraZoom";


export default function Scene() {
    const canvasRef = useRef(null)
    const [easing, setEasing] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1)
    const [isZooming, setIsZooming] = useState(false)
    const mouse = {
        x: useMotionValue(0),
        y: useMotionValue(0),
    }

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e
        const { innerWidth, innerHeight } = window
        const x = clientX / innerWidth;
        const y = clientY / innerHeight
        mouse.x.set(x)
        mouse.y.set(y)
    }

    // Funzione per fare screenshot e mostrare overlay
    function startZoom() {
        if (!canvasRef.current) return

        setEasing(0.002)
        setIsZooming(true)
        setZoomLevel(40)

        // dopo 2s finisci zoom e nascondi overlay
        setTimeout(() => {
            setEasing(0.25)
            setIsZooming(false)
            setZoomLevel(1)
        }, 10000)
    }

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove)
    })
    return (
        <>
            <Canvas ref={canvasRef} frameloop={isZooming ? 'demand' : 'always'} style={{ background: 'black' }}>
                <CameraZoom targetZoom={zoomLevel} easing={easing} />
                <ZoomableScene zooming={isZooming} />
                <directionalLight intensity={3} position={[0, 3, 2]} />
                <Environment preset="city" />
                <Model isZooming={isZooming} mouse={mouse} />
                <Html style={{ position: "absolute", left: '50%', transform: 'translateX(-50%)' }} position={[0, -3.3, 0]}>
                    <button onClick={startZoom} className="hover:border-b px-2 py-1 text-sm lg:text-xl text-white text-nowrap cursor-pointer hover:scale-[1.1] transition-transform whitespace-nowrap ">
                        start your journey
                    </button>
                </Html>
            </Canvas>
        </>
    )
}


function ZoomableScene({ zooming }) {
    const { invalidate } = useThree()

    useEffect(() => {
        if (zooming) {
            // Aggiorna solo su richiesta (per esempio ogni 100ms)
            const interval = setInterval(() => invalidate(), 50)
            return () => clearInterval(interval)
        } else {
            // Quando non zoomi, invalida sempre (render continuo)
            invalidate()
        }
    }, [zooming, invalidate])

    return null
}