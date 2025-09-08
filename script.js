setTimeout(() => {
    const contentcolumn = document.getElementById("contentwrapper");
    const rightcolumn2 = document.getElementById("rightcolumn2");
    if (contentcolumn && rightcolumn2) {
        rightcolumn2.parentNode.insertBefore(contentcolumn, rightcolumn2.nextSibling);
    }

    //move #eventText to right next to #mapDis inside #rightcolumn 
    const eventText = document.getElementById("eventText");
    const mapDis = document.getElementById("mapDis");
    if (eventText && mapDis) {
        mapDis.parentNode.insertBefore(eventText, mapDis.nextSibling);

        //scroll #eventText to bottom
        eventText.scrollTop = eventText.scrollHeight;

    }

    //inside #contentcolumn remove div.title
    const titles = document.querySelectorAll(".title");
    titles.forEach(title => {
        title.remove();
    });

    //inside #contentcolumn find div.actions and move it to #rightcolumn and place at end
    const actions = document.querySelector(".actions");
    const rightcolumn = document.getElementById("rightcolumn");
    if (actions && rightcolumn) {
        rightcolumn.appendChild(actions);
    }

    //inside #contentcolumn find .content-box.room and move it inside #contentcolumn at end
    const room = document.querySelector(".content-box.room");
    if (room && contentcolumn) {
        contentcolumn.appendChild(room);
    }

}, 200);

window.addEventListener("load", () => {
    const rightcolumn2 = document.createElement("div");
    rightcolumn2.id = "rightcolumn2";
    const rightcolumn = document.getElementById("rightcolumn");
    rightcolumn.parentNode.insertBefore(rightcolumn2, rightcolumn.nextSibling);
    
    const stats = document.querySelector(".stats");
    if (rightcolumn && rightcolumn2 && stats) {
        rightcolumn.removeChild(stats);
        rightcolumn2.appendChild(stats);
    }
    else 
    {
        console.log("stats or rightcolumn not exists");

        if(!rightcolumn2)
        {
            console.log("rightcolumn2 not exists");
        }
        if(!stats)
        {
            console.log("stats not exists");
        }
        if(!rightcolumn)
        {
            console.log("rightcolumn not exists");
        }
    
        console.log("error");
    }
});

