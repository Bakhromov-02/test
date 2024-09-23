"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
function calculateMinPrices(data) {
    const priceMap = {};
    data.forEach((item) => {
        const key = item.marketHashName;
        if (!priceMap[key]) {
            priceMap[key] = {
                min_manual_price: item === null || item === void 0 ? void 0 : item.price,
                min_auto_price: item === null || item === void 0 ? void 0 : item.price,
            };
        }
        if (item.delivery === 1) {
            priceMap[key].min_manual_price = Math.min(priceMap[key].min_manual_price, item.price);
        }
        else if (item.delivery === 2) {
            priceMap[key].min_auto_price = Math.min(priceMap[key].min_auto_price, item.price);
        }
    });
    const results = Object.keys(priceMap).map((key) => ({
        marketHashName: key,
        min_manual_price: priceMap[key].min_manual_price,
        min_auto_price: priceMap[key].min_auto_price,
    }));
    return results;
}
const data = worker_threads_1.workerData;
const minPrices = calculateMinPrices(data);
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(minPrices);
