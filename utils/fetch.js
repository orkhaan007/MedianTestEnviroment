"use client"
import { useState, useEffect } from "react"

export const fetchData = async ({ url, options }) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    try {
        setLoading(true)
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + url, options)
        const data = await response.json()

        if (!response.ok) {
            setError(data)
        } else {
            setData(data)
        }
    } catch (error) {
        console.error("Error fetching data:", error)
    }
    finally {
        setLoading(false)
    }

    return { loading, data, error }
}