import { RefromData, User } from "@/types/data";
import { toSmall } from "@/utils";

const initData: RefromData = {
    male: 0,
    female: 0,
    ageRange: '',
    minAge: Infinity,
    maxAge: -Infinity,
    hair: {},
    addressUser: {},
}

const groupDepartment = (users: User[]): Map<string, RefromData> => {
    const departmentMap = new Map<string, RefromData>();

    users.map((user) => {
        const { gender, hair, age, address, firstName, lastName } = user;
        const department = toSmall(user.company.department);

        if (!departmentMap.has(department)) {
            departmentMap.set(department, initData);
        };

        const reformData = departmentMap.get(department) as RefromData;

        const range = `${Math.min(reformData?.minAge || Infinity, age)} - ${Math.max(reformData?.maxAge || -Infinity, age)}`;

        const newData: RefromData = {
            ...reformData,
            [gender]: reformData[gender] + 1,
            minAge: Math.min(reformData?.minAge || Infinity, age),
            maxAge: Math.max(reformData?.maxAge || -Infinity, age),
            ageRange: range,
            hair: {
                ...reformData.hair,
                ...{ [hair.color]: reformData.hair[hair.color] ? reformData.hair[hair.color] + 1 : 1 }
            },
            addressUser: {
                ...reformData.addressUser,
                ...{ [firstName + lastName]: address.postalCode }
            }
        };

        departmentMap.set(department, newData);
    });

    return departmentMap;
};

export default groupDepartment;