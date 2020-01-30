import Arweave from "arweave/web";

export const arweave = Arweave.init({
  host: "gateway.arweave.co",
  port: 443,
  protocol: "https"
});

export async function saveTransaction(user, state) {
  const { address, wallet } = user;
  const { data, tags } = state;
  const tx = await arweave.createTransaction({ data }, wallet);

  tx["last_tx"] = await arweave.api.get("/tx_anchor").then(x => x.data);

  for (const [tagKey, tagValue] of Object.entries(tags)) {
    tx.addTag(tagKey, tagValue);
  }

  await arweave.transactions.sign(tx, wallet);
  await arweave.transactions.post(tx);

  tx["owner"] = address;
  tx["tags"] = tags;

  return tx;
}
