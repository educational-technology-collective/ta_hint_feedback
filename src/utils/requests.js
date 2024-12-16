import { HOST_URL } from "./config"

export const getOneHF = async () => {
    const response = await fetch(HOST_URL + 'feedback_generation/getOne')
    const data = await response.json()
    return data
}