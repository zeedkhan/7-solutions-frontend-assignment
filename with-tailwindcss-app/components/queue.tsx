"use client";

import { Data } from "@/types/data";
import { useCallback, useEffect, useRef, useState } from "react";
import builder from "@/lib/builder";
import shuffle from "@/lib/shuffle";

const Queue = () => {
    const { elements, columns } = builder();

    const [queue, setQueue] = useState<Data[]>([]);

    const [allElements, setAllElements] = useState<Data[]>(elements);
    const [allColumns, setAllColumns] = useState(columns);

    const innerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const outerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const [removeNext, setRemoveNext] = useState(false);

    // setup 
    const [innerDelay, setInnerDelay] = useState(1);
    const [outerDelay, setOuterDelay] = useState(5);

    // extra
    const [isAutoQueueing, setIsAutoQueueing] = useState(false);

    const enqueue = useCallback((item: Data) => {
        setQueue([...queue, { ...item, queueing: true }]);
        setAllElements(allElements.filter((el) => el.id !== item.id));
        setAllColumns((prev) => {
            return {
                ...prev,
                [item.type]: [...prev[item.type], item]
            }
        });
    }, [queue, allElements]);

    const shuffleElements = () => {
        setAllElements(shuffle(allElements.slice()));
    };

    const dequeue = useCallback((item: Data, reset: Boolean = false) => {
        setQueue(queue.filter((el) => {
            if (el.id !== item.id) {
                return {
                    ...el,
                    queueing: false
                }
            }
        }));
        setAllElements([...allElements, item]);
        setAllColumns((prev) => {
            return {
                ...prev,
                [item.type]: prev[item.type].filter((el) => el.id !== item.id)
            }
        });

        if (reset) {
            setRemoveNext(false);
        };

    }, [allElements, queue]);

    const nextTask = useCallback(() => {
        if (queue.length > 0) {
            dequeue(queue[0]);
            setRemoveNext(true);
        } else {
            setRemoveNext(false);
        }
    }, [queue, dequeue]);


    useEffect(() => {
        // stop the interval when autoQueueing is on
        if (isAutoQueueing) {
            return;
        };

        // run the next task based on current state
        if (removeNext) {
            innerIntervalRef.current = setInterval(() => {
                nextTask();
            }, innerDelay * 1000);
        } else {
            outerIntervalRef.current = setTimeout(() => {
                nextTask();
            }, outerDelay * 1000);
        };

        return () => {
            if (outerIntervalRef.current) {
                clearTimeout(outerIntervalRef.current);
            }
            if (innerIntervalRef.current) {
                clearInterval(innerIntervalRef.current);
            }
        };
    }, [queue, removeNext, innerDelay, outerDelay, dequeue, nextTask, isAutoQueueing]);

    useEffect(() => {
        if (isAutoQueueing && allElements.length > 0) {
            enqueue(allElements[Math.floor(Math.random() * allElements.length)]);
        };

        if (allElements.length === 0) {
            setIsAutoQueueing(false);
        }

    }, [isAutoQueueing, allElements, enqueue])


    return (
        <>
            <div className="pb-8">
                <p>In this apporach I use data structure called Queue to handle all elements.</p>
                <p>The benefits of this apporach are</p>
                <ul>
                    <li>Easy to handle multiple tasks</li>
                    <li>Easy to know or check any queue</li>
                    <li>It can be optimize to match the requirement</li>
                </ul>
                <p>I have build extra function eg: Shuffle, Auto Queue and optimize to capable with dynamic column(s) based on the type(s) of data.</p>
            </div>

            <div className="flex h-full space-x-2">

                {/* Setting */}
                <div className="min-w-48 shadow-xl h-full border-gray-500 border rounded-xl p-2 flex flex-col space-y-4">
                    <h2 className="text-center font-bold">Setting</h2>

                    <div>
                        <label htmlFor="outer-delay" className="text-sm">Outer Delay</label>
                        <input
                            onChange={(e) => setOuterDelay(parseInt(e.target.value))}
                            min={1}
                            type="number"
                            value={outerDelay}
                            className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    </div>

                    <div>
                        <label htmlFor="inner-delay" className="text-sm">Inner Delay</label>
                        <input
                            onChange={(e) => setInnerDelay(parseInt(e.target.value))}
                            min={1}
                            type="number"
                            value={innerDelay}
                            className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    </div>

                    <button
                        onClick={shuffleElements}
                        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Shuffle Elements
                    </button>

                    <button
                        onClick={() => setIsAutoQueueing(!isAutoQueueing)}
                        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        autoQueue
                    </button>
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
                                                onClick={() => dequeue(el, true)}
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