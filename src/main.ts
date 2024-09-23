import { Worker } from "worker_threads";
import path from "path";

import { Item, Result } from "./interfaces";

// TODO change url
const baseUrl = `https://`;

function getRandomIntegers(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchData(): Promise<Item[]> {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    console.log(response.statusText);
    throw new Error("Failed to fetch data");
  }
  return await response.json();

  // const data = Array.from({ length: 1000000 }, () => ({
  //   id: Math.floor(Math.random() * 1000000).toString(),
  //   price: Math.random() * 100000, // Example price
  //   cnyPrice: Math.random() * 1000,
  //   delivery: getRandomIntegers(1, 2),
  //   marketHashName: "string st " + getRandomIntegers(1, 20),
  //   steamId: Math.random() * 1000,
  //   assetId: Math.random() * 1000,
  //   classId: Math.random() * 1000,
  //   instanceId: Math.random() * 1000,
  // }));
  // return data;
}

function calculateMinPrices(data: Item[]) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, "worker.js"), {
      workerData: data,
    });

    worker.on("message", (result: Result[]) => {
      resolve(result);
    });

    worker.on("error", reject);

    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

async function main() {
  try {
    const data = await fetchData();

    const result = await calculateMinPrices(data);

    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
