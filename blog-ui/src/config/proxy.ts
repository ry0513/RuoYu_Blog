const proxy: Record<string, ProxyContent> = {
    development: {
        host: "/api",
        cdn: "",
    },
    test: {
        host: "",
        cdn: "",
    },
    production: {
        host: "http://127.0.0.1:3005/api",
        cdn: "",
    },
};

export default proxy;
