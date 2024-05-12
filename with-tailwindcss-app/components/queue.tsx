"use client";

import { Data } from "@/types/data";
import { useCallback, useEffect, useState } from "react";
import builder from "@/lib/builder";
import shuffle from "@/lib/shuffle";

const Queue = () => {
    const { elements, columns } = builder();

    const [queue, setQueue] = useState<Data[]>([]);

    const [allElements, setAllElements] = useState<Data[]>(elements);
    const [allColumns, setAllColumns] = useState(columns);

    // extra
    const [isAutoQueueing, setIsAutoQueueing] = useState(false);

    const shuffleElements = () => {
        setAllElements(shuffle(allElements.slice()));
    };

    const enqueue = useCallback((item: Data) => {
        const timeout = setTimeout(() => {
            setQueue(prevQueue => prevQueue.filter(el => el.id !== item.id));
            setAllElements(prevAllElements => [...prevAllElements, { ...item, queueing: false }]);
            setAllColumns(prevColumns => ({
                ...prevColumns,
                [item.type]: prevColumns[item.type].filter(el => el.id !== item.id)
            }));
        }, 5000);

        setQueue(prevQueue => [...prevQueue, { ...item, queueing: true, timeoutId: timeout }]);
        setAllElements(prevAllElements => prevAllElements.filter((el) => el.id !== item.id));
        setAllColumns((prev) => {
            return {
                ...prev,
                [item.type]: [...prev[item.type], { ...item, queueing: true, timeoutId: timeout }]
            }
        });

        return () => clearTimeout(timeout);
    }, []);

    const dequeue = useCallback((item: Data) => {
        const newQueue = queue.filter((el) => el.id !== item.id);
        clearTimeout(item.timeoutId!);

        setQueue(newQueue);
        setAllElements(prevAllElements => [...prevAllElements, { ...item, queueing: false }]);
        setAllColumns(prevColumns => ({
            ...prevColumns,
            [item.type]: prevColumns[item.type].filter((el) => el.id !== item.id)
        }));

    }, [queue]);

    useEffect(() => {
        const time = setTimeout(() => {
            if (isAutoQueueing) {
                if (allElements.length > 0) {
                    setAllElements(shuffle(allElements.slice()));
                    enqueue(allElements[Math.floor(Math.random() * allElements.length)]);
                };

                if (allElements.length === 0) {
                    setIsAutoQueueing(false);
                }
            }

        }, 100);

        return () => clearTimeout(time);
    }, [isAutoQueueing, allElements, enqueue]);


    return (
        <>
            <div className="flex h-full space-x-2">

                {/* Setting */}
                <div className="min-w-48 shadow-xl h-full border-gray-500 border rounded-xl p-2 flex flex-col space-y-4">
                    <h2 className="text-center font-bold">Setting</h2>

                    <button
                        onClick={shuffleElements}
                        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Shuffle Elements
                    </button>

                    <button
                        onClick={() => {
                            setIsAutoQueueing(!isAutoQueueing);
                        }}
                        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Animate
                    </button>
                </div>


                {/* All Elements */}
                <div className="min-w-48 shadow-xl h-full text-center border-gray-500 border rounded-xl">
                    <h2 className="mb-4 mt-4">All Elements: {allElements.length}</h2>
                    <hr />
                    <ul className="mt-4">
                        {allElements.map((el) => (
                            <li
                                className="py-1 last:pb-8"
                                key={el.id}
                            >
                                <button
                                    onClick={() => enqueue(el)}
                                    type="button"
                                    className="w-full text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    {el.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Queue */}
                <div className="min-w-48 shadow-xl h-full text-center border-gray-500 border rounded-xl">
                    <h2 className="mb-4 mt-4">Queue: {queue.length}</h2>
                    <hr />
                    <ul className="mt-4">
                        {queue.map((el) => (
                            <li
                                className="py-1 last:pb-8"
                                key={el.id}
                            >
                                <p
                                    className="cursor-not-allowed w-full text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    {el.name}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>


                {/* Details */}
                <div className="flex-1 border-gray-500 border rounded-xl p-8">
                    <div className="flex h-full space-x-4">
                        {Object.keys(allColumns).map((key, idx) => (
                            <div key={idx} className="flex-1 justify-center shadow-xl border-lg h-full text-center rounded-xl border border-gray-400">
                                <h2 className="mb-4 mt-4">{key}</h2>
                                <hr />

                                <ul className="mt-4">
                                    {allColumns[key].map((el) => (
                                        <li
                                            className="py-1 last:pb-8"
                                            key={el.id}
                                        >
                                            <button
                                                onClick={() => dequeue(el)}
                                                type="button"
                                                className="w-full text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                            >
                                                {el.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ >

    )
}

export default Queue;