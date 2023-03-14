const users = [];

// Join user to chat

function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);// pushes the user inside the array [user1,user2,user3] (user is actually an object)

  return user;// returns 
}



function getCurrentUser(id){
    return users.find(user => user.id ===id);
}

// user leaves the chat

function userLeave(id){
     const index = users.findIndex(user => user.id ===id);

     if(index!==-1){
        return users.splice(index,1)[0];
     }
}

// to get the room users

function getRoomUsers(room){
    return users.filter(user => user.room===room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}



