import {
  WebdeedsApiAdapter,
  Wallet,
  MemoryPersistenceAdapter,
  FilePersistenceAdapter,
  WebdeedsClient,
} from "../index";

async function main() {
  // Initialize the Webdeeds client
  const client = new WebdeedsClient({
    // baseUrl: "http://localhost:3000",
  });

  // Create the API adapter
  const apiAdapter = new WebdeedsApiAdapter(client);

  // Create the persistence adapter (using in-memory for this example)
  const persistenceAdapter = new FilePersistenceAdapter("wallet.dat");

  // Initialize the wallet
  const wallet = new Wallet(persistenceAdapter, apiAdapter);

  try {
    // Example: Mint a new deed
    console.log("Minting a new deed...");
    const mintResponse = await client.mint.create({
      metadata: {
        name: "Example Deed",
        description: "This is an example deed created for testing the wallet",
      },
      outputs: ["+100.PLACEHOLDER.secret123"],
    });

    console.log(`Minted deed with ID: ${mintResponse.itemId}`);

    // Receive the initial output into the wallet
    console.log("Receiving the minted deed into the wallet...");
    await wallet.receive(mintResponse.outputs);

    // List wallet contents
    console.log("Wallet contents:");
    const walletItems = await wallet.list();
    walletItems.forEach((item) => {
      console.log(`- ${item.itemId}: ${item.totalAmount} units`);
    });

    // Send a portion to someone else
    if (walletItems.length > 0) {
      const itemId = walletItems[0].itemId;
      console.log(`Sending 25 units of ${itemId}...`);
      const outputToSend = await wallet.send(itemId, 25);

      console.log("Output to send to recipient:");
      console.log(outputToSend);

      // In a real scenario, the recipient would receive this output
      // and add it to their wallet using wallet.receive([outputToSend])

      // List wallet contents after sending
      console.log("Wallet contents after sending:");
      const updatedWalletItems = await wallet.list();
      updatedWalletItems.forEach((item) => {
        console.log(`- ${item.itemId}: ${item.totalAmount} units`);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the example
main().catch(console.error);
