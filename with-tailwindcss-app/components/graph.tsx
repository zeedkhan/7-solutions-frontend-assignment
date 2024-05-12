"use client";

import mockData from "@/data.json"
import shuffle from "@/lib/shuffle";
import { Data } from "@/types/data";
import { useCallback, useEffect, useRef, useState } from "react";

type Graph = Record<string, Data[]>

const keys = ["Todo", ...Array.from(new Set(mockData.map((item) => item.type)))];
const init: Graph = keys.reduce((a, v) => ({ ...a, [v]: [] }), {});

const Graph = () => {
    const [graph, setGraph] = useState<Graph>(init);
    const [queue, setQueue] = useState<Data[]>([]);

    useEffect(() => {
        const updatedGraph: Graph = { ...init };
        console.log(updatedGraph)
        mockData.forEach((item: Data, idx) => {
            updatedGraph["Todo"] = [...updatedGraph["Todo"], {
                ...item,
                id: idx,
                queueing: false
            }];
        });
        setGraph(updatedGraph);
    }, []);

    const popQueue = useCallback(() => {
        const updatedGraph: Graph = { ...graph };
        const [item] = queue;
        if (!item) return;
        updatedGraph["Todo"] = [...updatedGraph["Todo"], { ...item, queueing: false }];
        updatedGraph[item.type] = updatedGraph[item.type].filter((el) => el.id !== item.id);
        setQueue((prev) => prev.slice(1));
        setGraph(updatedGraph);
    }, [queue, graph]);

    const switchState = (from: string, item: Data) => {
        const updatedGraph: Graph = { ...graph };
        if (from === "Todo") {
            updatedGraph[from] = updatedGraph[from].filter((el) => el.id !== item.id);
            updatedGraph[item.type] = [...updatedGraph[item.type], { ...item, queueing: true }];
            setQueue([...queue, { ...item, queueing: true }]);
        } else {
            updatedGraph[from] = updatedGraph[from].filter((el) => el.id !== item.id);
            updatedGraph["Todo"] = [...updatedGraph["Todo"], { ...item, queueing: false }];
            setQueue((prev) => prev.filter((el) => el.id !== item.id));
        }
        setGraph(updatedGraph);
    };

    const shuffleElements = () => {
        const updatedGraph: Graph = { ...graph };
        keys.forEach((key) => {
            updatedGraph[key] = shuffle(updatedGraph[key].slice());
        });
        setGraph(updatedGraph);
    }

    const outerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const counterTimeRef = useRef<NodeJS.Timeout | null>(null);

    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (queue.length > 0) {
            counterTimeRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);


            outerIntervalRef.current = setInterval(() => {
                popQueue();
            }, 5 * 1000);
        }

        return () => {
            if (outerIntervalRef.current) {
                clearTimeout(outerIntervalRef.current);
            }
            if (counterTimeRef.current) {
                clearTimeout(counterTimeRef.current);
            }
            setSeconds(0);
        };
    }, [queue, popQueue, graph]);


    return (
        <>
            <div className="pb-8">
                <p>In this apporach I use data structure called Graph as an Object to handle all elements and keys.</p>
                <p>The benefits of this apporach are</p>
                <ul>
                    <li>1: Short Code</li>
                    <li>2: Easy to swap element between path</li>
                    <li>3: Optimized</li>
                </ul>
                <p>I have build extra function eg: Shuffle, Auto Queue and optimize to capable with dynamic column(s) based on the type(s) of data.</p>
            </div>

            <div className="flex justify-around">
                <div className="rounded-xl border shadow-xl min-w-48">
                    <h2 className="py-2 text-center">Details:</h2>
                    <hr />
                    <ul className="px-4 py-2">
                        <li className="py-2">
                            <h1>
                                Timer: {seconds}
                            </h1>
                        </li>
                        <li className="py-2">
                            <button
                                onClick={() => popQueue()}
                                className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Click to dequeue
                            </button>
                        </li>
                        <li className="py-2 ">
                            <button
                                onClick={() => shuffleElements()}
                                className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Shuffle
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Main Render */}
                {Object.keys(graph).map((column) => (
                    <div key={column} className="rounded-xl border shadow-xl min-w-48">
                        <h2 className="py-2 text-center">{column} ({graph[column].length})</h2>
                        <hr />
                        <ul className="px-4 py-2">
                            {graph[column].map((el) => (
                                <li key={el.id} className="py-2">
                                    <button
                                        onClick={() => switchState(column, el)}
                                        type="button"
                                        className="w-full text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    >
                                        {el.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    )
};


export default Graph;