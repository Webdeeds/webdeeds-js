import { WebdeedsClient } from "..";

// Create a client with custom configuration
const client = new WebdeedsClient({
  baseUrl: "http://localhost:3000",
});

// Example: Create a mint request
async function mintExample() {
  try {
    const response = await client.mint.create({
      metadata: {
        name: "Red Rubies",
        description: "Precious gemstones",
        image: "https://picsum.photos/800",
      },
      outputs: [
        "+999999.ID_PLACEHOLDER.test-secret-replace-me-1",
        "+1.ID_PLACEHOLDER.test-secret-replace-me-2",
      ],
    });

    console.log("Mint created:", response);
  } catch (error) {
    console.error("Error creating mint:", error);
  }
}

// Example: Create a swap request
async function swapExample() {
  try {
    const response = await client.swap.create({
      inputs: [
        "+999999.deed_2v40jIxeXtFFHuPB5vnUV0QEpmX.test-secret-replace-me-1",
        "+1.deed_2v40jIxeXtFFHuPB5vnUV0QEpmX.test-secret-replace-me-2",
      ],
      outputs: [
        "+1000000.deed_2v40jIxeXtFFHuPB5vnUV0QEpmX.test-secret-replace-me-3",
      ],
    });

    console.log("Swap created:", response);
  } catch (error) {
    console.error("Error creating swap:", error);
  }
}

// Example: Get registry item by ID
async function getItemExample(itemId: string) {
  try {
    const item = await client.registry.getItemById(itemId);
    console.log("Item retrieved:", item);
  } catch (error) {
    console.error("Error retrieving item:", error);
  }
}

// Run examples
async function runExamples() {
  // await mintExample();
  // await swapExample();
  await getItemExample("deed_2v40jIxeXtFFHuPB5vnUV0QEpmX");
}

// Run the examples (uncomment to run)
runExamples().catch(console.error);
