export function taskSchedule(Hours, callback){
    setInterval(() => {
        Hours--
        if(Hours === 0){
            Hours = 20
        }
        callback(Hours)
    }, 1000)
}