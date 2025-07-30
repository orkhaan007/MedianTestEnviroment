"use client"
import { useState, useEffect } from "react"

const getAccessToken = () => localStorage.getItem("access_token")
const setAccessToken = (token) => localStorage.setItem("access_token", token)

const refreshAccessToken = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
        })
        if (!response.ok) throw new Error("Failed to refresh token")

        const data = await response.json()
        if (data.accessToken) {
            setAccessToken(data.accessToken)
            return data.accessToken
        } else {
            throw new Error("No access token returned")
        }
    } catch (err) {
        console.error("Token refresh error:", err)
        throw err
    }
}

export const useFetchData = ({ url, tokenRequired = false, options = {}, trigger }) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const tryFetch = async (token) => {
                const finalOptions = {
                    ...options,
                    headers: {
                        ...(options.headers || {}),
                        ...(tokenRequired && {
                            Authorization: `Bearer ${token}`
                        }),
                    },
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, finalOptions)

                if (response.status === 401) throw new Error("unauthorized")

                const result = await response.json()

                return result
            }

            try {
                const token = getAccessToken()
                const result = await tryFetch(token)
                setData(result)
            } catch (err) {
                if (err === "unauthorized") {
                    try {
                        const newToken = await refreshAccessToken()
                        const result = await tryFetch(newToken)
                        setData(result)
                    } catch (refreshErr) {
                        setError(refreshErr)
                    }
                } else {
                    setError(err)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [url, trigger])

    return { loading, data, error }
}