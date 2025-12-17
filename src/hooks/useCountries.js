// import { useQuery } from '@tanstack/react-query';
// import { countryAPI } from '../services/api';

// export const useCountries = () => {
//     return useQuery({
//         queryKey: ['countries'],
//         queryFn: async () => {
//             const response = await countryAPI.getCountries();
//             return response.data;
//         },
//         staleTime: 1000 * 60 * 60 * 24,
//         gcTime: 1000 * 60 * 60 * 24 * 7,
//         refetchOnMount: false,
//         refetchOnWindowFocus: false,
//     });
// };

import { useQuery } from '@tanstack/react-query';
import { countryAPI } from '../services/api';

export const useCountries = () => {
    return useQuery({
        queryKey: ['countries'],
        queryFn: async () => {
            const response = await countryAPI.getCountries();
            return response.data;
        },
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24 * 7,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};