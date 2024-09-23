import { workerData, parentPort } from 'worker_threads';
import { Item, Result } from './interfaces';

function calculateMinPrices(data: Item[]): Result[] {
  const priceMap: Record<
    string,
    { min_manual_price: number; min_auto_price: number }
  > = {};

  data.forEach((item) => {
    const key = item.marketHashName;

    if (!priceMap[key]) {
      priceMap[key] = {
        min_manual_price: item?.price,
        min_auto_price: item?.price,
      };
    }

    if (item.delivery === 1) {
      priceMap[key].min_manual_price = Math.min(
        priceMap[key].min_manual_price,
        item.price
      );
    } else if (item.delivery === 2) {
      priceMap[key].min_auto_price = Math.min(
        priceMap[key].min_auto_price,
        item.price
      );
    }
  });

  const results: Result[] = Object.keys(priceMap).map((key) => ({
    marketHashName: key,
    min_manual_price: priceMap[key].min_manual_price,
    min_auto_price: priceMap[key].min_auto_price,
  }));

  return results;
}

const data: Item[] = workerData as Item[];
const minPrices = calculateMinPrices(data);

parentPort?.postMessage(minPrices);
