import axios from "axios";
export const baseURL = 'https://api-metrix.victum-re.online';

export const headers = { 
    "Accept": "*/*",
    'Content-Type': 'application/json',
};

const axiosAPIInstance = axios.create({ baseURL, headers });

const Fetcher = async (args) => {
    //console.log("🚀 ~ file: Petition.js:7 ~ Fetcher ~ args:", args)
    let response = {};
    try { 
        response = await axiosAPIInstance(args);
    } catch (error) {
        //console.log("🚀 ~ file: Petition.js:11 ~ Fetcher ~ error:", error)
        response = error
        if (error.response) response = error.response;
        else if (error.request) response = error.request;
        else response = error.message;
    } finally { return response; }
}

export default Fetcher;