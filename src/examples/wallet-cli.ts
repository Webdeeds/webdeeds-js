import {
  WebdeedsClient,
  WebdeedsApiAdapter,
  Wallet,
  FilePersistenceAdapter,
} from "../index";
import prompts from "prompts";

async function main() {
  // Initialize the Webdeeds client
  const client = new WebdeedsClient({
    // baseUrl: "http://localhost:3000",
  });

  // Create the API adapter
  const apiAdapter = new WebdeedsApiAdapter(client);

  // Create the persistence adapter (using file persistence)
  const persistenceAdapter = new FilePersistenceAdapter("wallet.dat");

  // Initialize the wallet
  const wallet = new Wallet(persistenceAdapter, apiAdapter);

  // Main menu loop
  while (true) {
    const response = await prompts({
      type: "select",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { title: "List wallet contents", value: "list" },
        { title: "Send webdeed", value: "send" },
        { title: "Receive webdeed", value: "receive" },
        { title: "Exit", value: "exit" },
      ],
      initial: 0,
    });

    if (!response.action || response.action === "exit") {
      console.log("Goodbye!");
      break;
    }

    // Process the selected action
    switch (response.action) {
      case "list":
        await listWalletContents(wallet);
        break;
      case "send":
        await sendWebDeed(wallet);
        break;
      case "receive":
        await receiveWebDeed(wallet);
        break;
    }
  }
}

// Function to list wallet contents
async function listWalletContents(wallet: Wallet) {
  console.log("\nWallet contents:");
  const walletItems = await wallet.list();

  if (walletItems.length === 0) {
    console.log("Your wallet is empty.");
    return;
  }

  walletItems.forEach((item) => {
    console.log(`- ${item.itemId}: ${item.totalAmount} units`);
  });
  console.log(""); // Empty line for better readability
}

// Function to send web deed
async function sendWebDeed(wallet: Wallet) {
  const walletItems = await wallet.list();

  if (walletItems.length === 0) {
    console.log("\nYour wallet is empty. Nothing to send.\n");
    return;
  }

  // Create choices from wallet items
  const choices = walletItems.map((item) => ({
    title: `${item.itemId}: ${item.totalAmount} units`,
    value: item.itemId,
  }));

  const selectItemResponse = await prompts({
    type: "select",
    name: "itemId",
    message: "Select an item to send:",
    choices,
    initial: 0,
  });

  if (!selectItemResponse.itemId) {
    console.log("\nSend cancelled.\n");
    return;
  }

  const selectedItem = walletItems.find(
    (item) => item.itemId === selectItemResponse.itemId
  );

  const amountResponse = await prompts({
    type: "number",
    name: "amount",
    message: "How many units would you like to send?",
    initial: 1,
    min: 1,
    max: selectedItem ? selectedItem.totalAmount : 1,
    validate: (value: number) =>
      value > (selectedItem?.totalAmount || 0)
        ? `You only have ${selectedItem?.totalAmount} units available`
        : true,
  });

  if (!amountResponse.amount) {
    console.log("\nSend cancelled.\n");
    return;
  }

  try {
    const outputToSend = await wallet.send(
      selectItemResponse.itemId,
      amountResponse.amount
    );
    console.log("\nOutput to send to recipient:");
    console.log(outputToSend);
    console.log(
      '\nThe recipient can receive this output using the "Receive web deed" option.\n'
    );
  } catch (error) {
    console.error("\nError sending web deed:", error, "\n");
  }
}

// Function to receive web deed
async function receiveWebDeed(wallet: Wallet) {
  const response = await prompts({
    type: "text",
    name: "output",
    message: "Paste the output string to receive:",
  });

  if (!response.output) {
    console.log("\nReceive cancelled.\n");
    return;
  }

  try {
    await wallet.receive([response.output]);
    console.log("\nWeb deed received successfully!\n");
  } catch (error) {
    console.error("\nError receiving web deed:", error, "\n");
  }
}

// Run the CLI application
main().catch(console.error);
