import axios_ins from "axios";

export const axios = axios_ins.create({
    baseURL: `${import.meta.env.WXT_SERVER_URL}/api`,
});
