import { Data } from "@/types/data"
import mockData from "@/data.json"

interface Columns {
    [x: string]: Data[]
}

const builder = () => {
    const columns: Columns = {};

    const elemnts = mockData.map((data: Data, idx: number) => {
        if (!columns[data.type]) {
            columns[data.type] = [];
        }

        return {
            ...data,
            id: idx,
            queueing: false
        }
    });

    return {
        columns: columns,
        elements: elemnts
    }
};

export default builder;