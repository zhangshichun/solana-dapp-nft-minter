import {
  Metaplex,
  walletAdapterIdentity,
  irysStorage,
} from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRef, useState } from "react";
import { FileURLSelectorRef } from "./FileURLSelector";
import FileURLSelector from "components/FileURLSelector";
import { notify } from "../utils/notifications";
import cx from "classnames";
import { useNetworkConfiguration } from "../contexts/NetworkConfigurationProvider";

const Minter = () => {
  const mURLSelectorRef = useRef<FileURLSelectorRef>(null);
  const [ntfName, setNtfName] = useState<string | null>("DEFAULT-NTF-NAME");
  const [loading, setLoading] = useState(false);
  const { networkConfiguration } = useNetworkConfiguration();
  const [modalVisible, setModalVisible] = useState(false);
  const [mintResult, setMintResult] = useState<any>(null);
  console.log(
    "🔨🔪@zsc:: ~ Minter ~ networkConfiguration:",
    networkConfiguration
  );

  const { connection } = useConnection();
  const wallet = useWallet();

  const onMintClick = async () => {
    try {
      setLoading(true);
      const fileURL = mURLSelectorRef.current.getValue();
      const metaplex = new Metaplex(connection);
      metaplex.use(walletAdapterIdentity(wallet)).use(
        irysStorage({
          address: `https://${networkConfiguration}.irys.xyz`,
          providerUrl: `https://api.${networkConfiguration}.solana.com`,
          timeout: 60000,
        })
      );
      const { uri } = await metaplex.nfts().uploadMetadata({
        name: ntfName,
        symbol: "The Symbol",
        description: "The Description",
        image: fileURL,
      });
      const res = await metaplex.nfts().create({
        uri,
        name: ntfName,
        sellerFeeBasisPoints: 0.1,
        tokenOwner: wallet.publicKey,
      });
      const { nft, response } = res;
      setMintResult({
        address: nft.address.toBase58(),
        signature: response.signature,
      });
      setModalVisible(true);
      console.log("🔨🔪@zsc:: ~ res ~ res:", res);
    } catch (err) {
      console.error(err);
      notify({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div>
        <FileURLSelector ref={mURLSelectorRef} />
      </div>
      <div>
        <label className="text-gray-500">Input a Name of your NTF</label>
        <input
          className="input input-bordered w-full"
          value={ntfName}
          onChange={(e) => setNtfName(e.target.value)}
        />
      </div>
      <div>
        {!loading && (
          <span className="loading loading-spinner text-secondary"></span>
        )}
        {!loading && (
          <button
            onClick={onMintClick}
            className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
          >
            Start Mint!
          </button>
        )}
        <div
          id="my-modal"
          className={cx("modal", { "modal-open": modalVisible })}
        >
          <div className="modal-box">
            <p className="text-sm break-all">
              <p className="text-lg">Mint Success!!</p>

              <p>
                address:
                <a
                  href={`https://explorer.solana.com/address/${mintResult?.address}?cluster=${networkConfiguration}`}
                  target="_blank"
                  rel="noreferrer"
                  className="link link-secondary"
                >
                  {mintResult?.address}
                </a>
              </p>
              <p>
                signature:
                <a
                  href={`https://explorer.solana.com/tx/${mintResult?.signature}?cluster=${networkConfiguration}`}
                  target="_blank"
                  rel="noreferrer"
                  className="link link-secondary"
                >
                  {mintResult?.signature}
                </a>
              </p>
            </p>
            <div className="modal-action">
              <div className="btn" onClick={() => setModalVisible(false)}>
                Close
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minter;
