import { orpcClient } from '@/orpc/orpc';

function Auth() {
    return {
        signUp: async function (values: {
            name: string;
            email: string;
            password: string;
        }) {
            try {
                const create_user = await orpcClient.create(values);
                return create_user;
            } catch (error) {
                console.error('User creation failed');
            }
        },
    };
}

export const auth = Auth();
