// Question 1
interface Data {
    type: string;
    name: string;
    id?: number;
    queueing?: boolean;
    timeoutId?: NodeJS.Timeout | null;
};


// Question 2
interface Hair {
    color: string;
    type: string;
}

interface Coordinates {
    lat: number;
    lng: number;
}

interface Address {
    address: string;
    city: string;
    coordinates: Coordinates;
    postalCode: string;
    state: string;
}

interface Bank {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
}

interface Company {
    address: Address;
    department: string;
    name: string;
    title: string;
}

interface Crypto {
    coin: string;
    wallet: string;
    network: string;
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: "male" | "female";
    email: string;
    phone: string;
    username: string;
    password: string;
    birthDate: string;
    image: string;
    bloodGroup: string;
    height: number;
    weight: number;
    eyeColor: string;
    hair: Hair;
    domain: string;
    ip: string;
    address: Address;
    macAddress: string;
    university: string;
    bank: Bank;
    company: Company;
    ein: string;
    ssn: string;
    userAgent: string;
    crypto: Crypto;
}

type RefromData = {
    male: number;
    female: number;
    ageRange: string;
    minAge?: number;
    maxAge?: number;
    hair: Record<string, number>;
    addressUser: Record<string, string>;
};



export type { Data, User, RefromData };