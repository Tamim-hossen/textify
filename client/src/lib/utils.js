export function formatMessageTime(date) {
  const currentDate = new Date()
  const today = {
    year: currentDate.getFullYear(),
    month: currentDate.toLocaleDateString("en-US",{month:"short"}),
    day: currentDate.getDate(),
  };

  const messageDate= new Date(date)
  const messageTime = {
    year: messageDate.getFullYear(),
    month: messageDate.toLocaleDateString("en-US",{month:"short"}),
    day: messageDate.getDate(),
    time: messageDate.toLocaleTimeString("en-US", {
        
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }
  if(messageTime.year !== today.year){
    return (
      `${messageTime.month}-${messageTime.day}-${messageTime.year}, ${messageTime.time}`
    )
  }

  else if(messageTime.month !== today.month){
    return (
      `${messageTime.month}-${messageTime.day}, ${messageTime.time}`
    )
  }

  else if(messageTime.day !== today.day){
    if(messageTime.day === today.day-1){
      return (
        `Yesterday at ${messageTime.time}`
      )
    }
    else{
      return (
        `${messageTime.month}-${messageTime.day}, ${messageTime.time}`
      )
    }
  }
  else{
    return (
      `${messageTime.time}`
    )
  }
    
    
    
  }