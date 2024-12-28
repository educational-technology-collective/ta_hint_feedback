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

const requestBodyAll = {
    "method": "GET",
    "port": "9004",
    "path": "feedback_generation/monitor/",
    "params": {
        "secret_key": "secret_tokens_to_prevent_data_leakage", 
        "data_name": "TA_feedback"
    }
}

const requestBodySubmit = (feedback, taId, reqId) => (
    {
        "method": "POST",
        "port": "9004",
        "path": "feedback_generation/ta_interface/",
        "body": {
            "request_id": reqId,
            "action": "save",
            "TA_feedback": feedback,
            "TA_id": taId
        }
    }

)


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

export const getAllHF = async () => {
    const response = await fetch(HOST_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBodyAll)
    })
    const data = await response.json()
    return data
}

export const submitFeedback = async (feedback, taId, reqId) => {
    // reqId = reqId.toString();
    console.log("Submitting feedback: ", feedback, taId, reqId);
    const response = await fetch(HOST_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBodySubmit(feedback, taId, reqId))
    })
    const data = await response.json()
    return data
}
