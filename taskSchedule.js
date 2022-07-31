export function taskSchedule(Hours, callback){
    setInterval(() => {
        Hours--
        if(Hours === 0){
            Hours = 15
        }
        callback(Hours)
    }, 1000)
}