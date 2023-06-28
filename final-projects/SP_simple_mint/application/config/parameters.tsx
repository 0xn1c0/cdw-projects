import { Localhost, ConfluxEspace, ConfluxEspaceTestnet, Chain} from "@thirdweb-dev/chains";
/** Change these values to configure the application for your own use. **/

// Your smart contract address (available on the thirdweb dashboard)
// For existing collections: import your existing contracts on the dashboard: https://thirdweb.com/dashboard
export const contractAddress:string = "0x1988D0927157a6288BC4cBdF4945677265532aE3";

// The name of the chain your contract is deployed to.
// Provide a string for standard chains, or import one from @thirdweb-dev/chains package.
// Learn more: https://portal.thirdweb.com/react/react.thirdwebprovider#activechain-recommended

// export const chain:Chain = Localhost;
// export const chain:Chain = ConfluxEspaceTestnet;
export const chain:Chain = ConfluxEspace;