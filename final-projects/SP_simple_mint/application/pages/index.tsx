import { useState, useEffect } from "react";
import type { NextPage } from "next";
import {
  Web3Button,
  useContract,
  useContractRead,
  useAddress,
  useNFTs,
  ThirdwebNftMedia
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { contractAddress } from "../config/parameters";

const Home: NextPage = () => {
  const { contract } = useContract(contractAddress);
  const { data: owner, isLoading: ownerLoading, error: ownerError } = useContractRead(contract, "owner");
  const { data: nfts, isLoading } = useNFTs(contract);
  const [address, setAddress] = useState("");
  const userAddress = useAddress();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    if (userAddress) {
      setAddress(userAddress);
    }
  }, [userAddress]);

  //Example of event handler
  useEffect(() => {
    if (contract) {
      contract.events.listenToAllEvents((event) => {
        console.log(event.eventName) // the name of the emitted event
        console.log(event.data) // event payload
      });    }
  }, [contract]);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = nfts?.slice(startIndex, endIndex);

  // Render mint status based on the contract address and user ownership
  const renderMintStatus = () => {
    if (contractAddress === "") {
      // If contract address is not set, display configuration message
      return (
        <p className={styles.description}>
          Get started by configuring your desired network and contract address in{" "}
          <code className={styles.code}>config/parameters.tsx</code>!
        </p>
      );
    } else {
      // If contract address is set, display mint status and input form
      return (
        <>
          {!userAddress ? (
            <span className={styles.description}>Connect your wallet</span>
          ) : (
            <span className={styles.description}>
              {owner !== userAddress
                ? "Mint disabled, you need to be the owner to use this function"
                : "Insert the destination address for the NFT in the input below"}
            </span>
          )}
          <div className={styles.addressInputForm}>
            {!userAddress || owner !== userAddress ? (
              ""
            ) : (
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                placeholder="Enter address"
                className={styles.addressInput}
                disabled={owner !== userAddress}
              />
            )}
            <div className={styles.connect}>
              <Web3Button
                contractAddress={contractAddress}
                action={(contract) => contract.call("safeMint", [address])}
                onSuccess={(result) =>
                  alert("Success, tx hash: " + result.receipt.transactionHash)
                }
                onError={(error) => alert(error)}
                isDisabled={owner !== userAddress}
              >
                {owner !== userAddress ? "Connected" : "Mint NFT"}
              </Web3Button>
            </div>
          </div>
        </>
      );
    }
  };
  

  return (
    <>
      <title>CDW NFT</title>
      <meta name="description" content="Conflux Developers Workshop Onchain NFT" />
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Conflux Developers Workshop Onchain NFT!
          </h1>
          {renderMintStatus()}

          {!isLoading ? (
            <>
              {/* Pagination */}
              <div className={styles.pagination}>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={endIndex >= (nfts?.length || 0)}
                >
                  Next
                </button>
              </div>
              <div className={styles.grid}>
                {/* Render the NFT cards */}
                {currentItems?.map((e) => (
                  <div key={e.metadata.id} className={styles.card}>
                    <div className={styles.nftInfo}>
                      <span>{e.metadata.name}{" #" + e.metadata.id}</span>
                      <ThirdwebNftMedia metadata={e.metadata} />
                      <span className={styles.owner}>Owner: {e.owner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className={styles.description}>Loading...</p>
          )}
        </main>
      </div>
    </>
  );
};

export default Home;
