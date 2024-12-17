import { HOST_URL } from "./config"
const requestBody = {
    "method": "GET",
    "port": "9004",
    "path": "feedback_generation/ta_interface/",
    "params": {
        "action": "fetch_one",
        "TA_id": "luang"
    }
}


export const getOneHF = async () => {
    const response = await fetch(HOST_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    const data = await response.json()
    return data
}