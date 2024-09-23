"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const baseUrl = `https://rs.ok-skins.com/sell/full/730/2G8f5A_usdt.json?Expires=1727092777&OSSAccessKeyId=LTAI5tDg2x1cneB9QAAst1ck&Signature=ImyMypPQOqrYqMDa0A%2F0OaJxuBI%3D`;
function getRandomIntegers(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(baseUrl);
        if (!response.ok) {
            console.log(response.statusText);
            throw new Error("Failed to fetch data");
        }
        return yield response.json();
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
    });
}
function calculateMinPrices(data) {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker(path_1.default.resolve(__dirname, "worker.js"), {
            workerData: data,
        });
        worker.on("message", (result) => {
            resolve(result);
        });
        worker.on("error", reject);
        worker.on("exit", (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield fetchData();
            const result = yield calculateMinPrices(data);
            console.log(result);
        }
        catch (error) {
            console.error("Error:", error);
        }
    });
}
main();
