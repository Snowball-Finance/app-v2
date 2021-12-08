export const StorageKeys = {
    infiniteApproval: 'infiniteApproval',
    showAdvanced: 'showAdvanced',
    slippage: 'slippage',
}
export const storage = {
    write: (key, data) => {
        localStorage[key] = JSON.stringify(data);
    },
    read: (key, ifDoesntExist) => {
        try {
            return JSON.parse(localStorage[key]);
        } catch (error) {


            if (ifDoesntExist) {
                localStorage[key] = JSON.stringify(ifDoesntExist);
                return ifDoesntExist;
            }
            return null;

        }
    },
    sessionStorage: {
        write: (key, data) => {
            sessionStorage[key] = JSON.stringify(data);
        },
        read: (key) => {
            return JSON.parse(sessionStorage[key]);
        },
    },
};
