import React, { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

export function CameraZoom({ targetZoom, easing }) {
    const { camera } = useThree()
    const zoomRef = useRef(camera.zoom)

    useFrame(() => {
        // Interpola zoom verso targetZoom
        zoomRef.current += (targetZoom - zoomRef.current) * easing   
        camera.zoom = zoomRef.current
        camera.updateProjectionMatrix()
    })

    useEffect(() => {
        zoomRef.current = camera.zoom
    }, [camera.zoom])

    return null
}
