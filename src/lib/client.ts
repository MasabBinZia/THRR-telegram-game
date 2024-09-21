import { createThirdwebClient } from "thirdweb";

const clientId= import.meta.env.VITE_CLIENT_ID;

export const client = createThirdwebClient({
    clientId: clientId,
})

// pX-cNp79lxiSEvPidOhuOErxL9Lg7XKtzzoV8ZeuFGBnopcf-TIPfCGb0wlAUaWWsXEiB7O35L9XP61gEXpgKw