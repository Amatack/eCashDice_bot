export function taskSchedule(Hours, callback){
    setInterval(() => {
        Hours--
        if(Hours === 0){
            Hours = 28800
        }
        callback(Hours)
    }, 3000)
    // esto es una hora:
    // 3600000
    // esto es una hora si divides sus ms totales / 3
    // 1200000
}