import { userContract } from "./modules/users/users.contract";
import { serviceContract } from "./modules/services/service.contract";

export const contract = {
    user: userContract,
    service: serviceContract,
};
