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


export function downloadNotebook(jsonData, filename = "notebook.ipynb") {
    // Convert JSON object to string
    const jsonString = JSON.stringify(jsonData, null, 2);
    
    // Create a blob object from the JSON string
    const blob = new Blob([jsonString], { type: "application/json" });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create an anchor element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    
    // Programmatically click the anchor to trigger the download
    a.click();
    
    // Cleanup: Remove the anchor and revoke the URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}