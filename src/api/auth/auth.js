import Fetcher from "../Fetcher";

export const login = async ({ email, password, code, }) => {
    //console.log('email, password, code: ', email, password, code);
    let fetch = { status: 0 };
    try {
        let data = {
            email: email.trim(),
            password: password.trim()
        };
        let dataCode = {};
        let sendCode = false;
        if (code !== "") sendCode = true;
        const response = await Fetcher({
            method: "POST",
            url: '/auth/' + (sendCode ? `verify_code` : `signon`),
            data: sendCode ? dataCode : JSON.stringify(data)
        });
        if (response?.status === 200) {
            let response_data = response?.data;
            if (response_data?.user?.hast_two_factor === 1) {
                return fetch = { status: 1 };
            }
            fetch = { status: 2, data: { ...response_data, email } };
        }
    } catch (error) {
        console.log("catch login ~ error", error);
    } finally {
        return fetch;
    }
};