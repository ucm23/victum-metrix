import Fetcher from "../Fetcher";

export const get_company = async ({ id }) => {
    let fetch = { status: false, data: null };
    try {
        const response = await Fetcher({
            method: "GET",
            url: `/auth/companies/${id}`
        });
        if (response?.status === 200) {
            fetch = { status: true, data: response?.data };
        }
    } catch (error) {
        console.log("catch get_company ~ error", error);
    } finally {
        return fetch;
    }
};

export const get_users = async ({ id }) => {
    let fetch = { status: false, data: [] };
    try {
        const response = await Fetcher({
            method: "GET",
            url: `/auth/users?company_id=${id}`
        });
        if (response?.status === 200) {
            fetch = { status: true, data: response?.data?.data };
        }
    } catch (error) {
        console.log("catch get_users ~ error", error);
    } finally {
        return fetch;
    }
};

export const get_evaluated_participants = async ({ company_id, evaluator_user_id, mode }) => {
    let fetch = { status: false, data: [], rubric: [] };
    try {
        const response0 = await Fetcher({
            method: "GET",
            url: `/main/scheduled_evaluations?company_id=${company_id}&evaluator_user_id=${evaluator_user_id}`
        });

        const response = await Fetcher({
            method: "GET",
            url: `/main/evaluated_participants?evaluator_user_id=${evaluator_user_id}&is_evaluator=${mode}`
        });
        //console.log('response: ', response);

        if (response?.status === 200 && response0?.status === 200) {
            fetch.status = true;
            fetch.data = response?.data?.data;
            fetch.rubric = response0?.data?.data;
        }
        console.log('fetch: ', fetch);
    } catch (error) {
        console.log("catch get_evaluated_participants ~ error", error);
    } finally {
        return fetch;
    }
};

export const get_scheduled_evaluations = async ({ company_id, evaluator_user_id }) => {
    let fetch = { status: false, data: [] };
    try {
        const response = await Fetcher({
            method: "GET",
            url: `/main/scheduled_evaluations?company_id=${company_id}&evaluator_user_id=${evaluator_user_id}`
        });
        if (response?.status === 200) {
            fetch = { status: true, data: response?.data?.data };
        }
    } catch (error) {
        console.log("catch get_scheduled_evaluations ~ error", error);
    } finally {
        return fetch;
    }
};

export const index_scheduled_evaluations = async ({ id, behavior_role_id, self_evaluation }) => {
    let fetch = { status: false, data: [] };
    try {
        const response = await Fetcher({
            method: "GET",
            url: `/main/scheduled_evaluations/${id}?behavior_role_id=${behavior_role_id}&self_evaluation=${self_evaluation}`
        });
        if (response?.status === 200) {
            fetch = { status: true, data: response?.data };
        }
    } catch (error) {
        console.log("catch index_scheduled_evaluations ~ error", error);
    } finally {
        return fetch;
    }
};

export const send_response = async ({ id, responses }) => {
    //console.log('responses: ', responses);
    let fetch = { status: false };
    try {
        const response = await Fetcher({
            method: "PUT",
            url: `/main/evaluated_participants/${id}`,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                "responses": responses
            })
        });

        if (response?.status === 200) {
            fetch = { status: true, };
        }
    } catch (error) {
        console.log("catch send_response ~ error", error);
    } finally {
        return fetch;
    }
};