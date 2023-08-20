import { useEffect, useState } from "react";

type UseFetchReturnType = {
    data: any;
    isLoading: boolean;
    error: Error | null;
};

const useFetch = (
    url: string,
    method: "GET" | "POST" | "DELETE" | "UPDATE" | "PUT"
): UseFetchReturnType => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setIsLoading(true);

        fetch(url, {
            method: method,
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            mode: "cors",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Request failed");
                return res.json();
            })
            .then((data) => {
                setData(data);
                setError(null);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => setIsLoading(false));
    }, [url, method]);

    return { data, isLoading, error };
};

export default useFetch;
