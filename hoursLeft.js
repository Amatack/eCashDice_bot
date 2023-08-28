export function hoursLeft(timeLeft){
    let split = timeLeft.split(":")
    split[0] = 23 - split[0]
    split[1] = 60 - split[1]

    if(split[1] === 60) {
        split[1] = 0
        split[0]++
    }

    if(split[0] < 10)  split[0] = "0" + split[0]
    if(split[1] < 10)  split[1] = "0" + split[1]
    
    return split

}