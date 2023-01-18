export function getName(sender){
    let name = sender.username || sender.first_name
    if(name === sender.username) name = "@"+name
    return name
}