import { PropertyValues, type scheme } from "../../core/types";
import { useSyncExternalStore } from "react";

const useSessionStorage = (storageName: 'newCollection' | 'collections' | 'tableValues') => {
    const item = useSyncExternalStore(subscribe, getSnapshot, () => undefined);

    //Return the current value from the browser API
    function getSnapshot() {
        //alert("sessionStorage changed")
        return sessionStorage.getItem(storageName);
    }

    // Parse the json string
    // You should probably further narrow down the JSON.parse type because JSON.parse returns any
    const value = typeof item === "string" ? JSON.parse(item) : null;

    const setValue = (value: any) => {
        sessionStorage.setItem(storageName, JSON.stringify(value));
        //The event name has to match the eventListeners defined in the subscribe function
        window.dispatchEvent(new StorageEvent("custom-storage-event-name"));
    };

    return [value as scheme | scheme[] | PropertyValues[], setValue] as const;
};

function subscribe(callback: () => void) {
    window.addEventListener("custom-storage-event-name", callback);
    return () => {
        window.removeEventListener("custom-storage-event-name", callback);
    };
}



export default useSessionStorage