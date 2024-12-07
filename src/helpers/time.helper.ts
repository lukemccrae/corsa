import { toHHMMSS } from "./avgPace.helper";

export const calcElapsed = (t1: string, t2: string) => {
        let time1 = new Date(t1).getTime();
        let time2 = new Date(t2).getTime();
        return toHHMMSS((time2 - time1) / 1000);
    ``
}