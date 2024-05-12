const toSmall = (str: string) => {
    return str.replace(/\s/g, '-').toLowerCase();
};

const toBig = (str: string) => {
    return str.replace(/-/g, ' ').split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" ");
};

export {
    toSmall,
    toBig
}