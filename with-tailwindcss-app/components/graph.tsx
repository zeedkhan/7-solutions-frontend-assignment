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

    useEffect(() => {
        const updatedGraph: Graph = { ...init };
        mockData.forEach((item: Data, idx) => {
            updatedGraph["Todo"] = [...updatedGraph["Todo"], {
                ...item,
                id: idx,
                queueing: false,
                timeoutId: null,
            }];
        });
        setGraph(updatedGraph);
    }, []);

    const switchState = useCallback((from: string, item: Data) => {
        if (from === "Todo") {
            const time = setTimeout(() => {
                setGraph((prevGraph) => ({
                    ...prevGraph,
                    [item.type]: [...prevGraph[item.type].filter((el) => el.id !== item.id)],
                    Todo: [...prevGraph["Todo"], { ...item, queueing: false }]
                }));
            }, 5000);

            // Remove item from the graph Todo
            const updatedItem = { ...item, queueing: true, timeoutId: time };
            setGraph((prevGraph) => ({
                ...prevGraph,
                ["Todo"]: [...prevGraph["Todo"].filter((el) => el.id !== item.id)],
                [item.type]: [...prevGraph[item.type], updatedItem]
            }));

        } else {
            clearTimeout(item.timeoutId!);
            setGraph((prevGraph) => ({
                ...prevGraph,
                [from]: [...prevGraph[from].filter((el) => el.id !== item.id)],
                Todo: [...prevGraph["Todo"], { ...item, queueing: false }]
            }));
        };
    }, []);

    const autoAdd = () => {
        shuffleElements();
        const allValues = Object.values(graph);
        let i = 1;
        for (const row of allValues) {
            shuffle(row);
            for (const col of row) {
                setTimeout(() => {
                    switchState("Todo", col);
                }, i * 50);
                i++;
            }
        }
    };

    const shuffleElements = () => {
        const updatedGraph: Graph = { ...graph };
        keys.forEach((key) => {
            updatedGraph[key] = shuffle(updatedGraph[key].slice());
        });
        setGraph(updatedGraph);
    };

    return (
        <>
            <div className="flex justify-around">
                <div className="rounded-xl border shadow-xl min-w-48">
                    <h2 className="py-2 text-center">Details:</h2>
                    <hr />
                    <ul className="px-4 py-2">
                        <li className="py-2 ">
                            <button
                                onClick={() => shuffleElements()}
                                className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Shuffle
                            </button>
                        </li>
                        <li className="py-2 ">
                            <button
                                onClick={() => autoAdd()}
                                className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Auto add
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