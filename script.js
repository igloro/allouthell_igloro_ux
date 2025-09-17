async function loadItems() {

    //try first to load from https://abesttools.com/game/itemjson
    try {
        
        const response = await fetch("https://abesttools.com/game/itemjson?v=2");
        const data = await response.json();
        window.items = data; // now 'items' is globally available

        // Now run the rest of your code that depends on items
        initInventory(window.items);
    } catch (err) {
        
        try {
            const response = await fetch("https://abesttools.com/public/assets/json/allouthell.json");
            const data = await response.json();
            window.items = data; // now 'items' is globally available
    
            // Now run the rest of your code that depends on items
            initInventory(window.items);
        } catch (err) {
            console.error("Failed to load items.json:", err);
        }
    }
}

//check for #eventText if last message contains font color red 
function isLastMessageRed() {
    const eventText = document.getElementById("eventText");
    if (eventText) {
        const lastMessage = eventText.lastElementChild;
        if (lastMessage && lastMessage.style.color === "red") {
            return true;
        }
    }
    return false;
}

function initInventory() {
    const missingItems = [];

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
        eventText.scrollTop = eventText.scrollHeight; // scroll #eventText to bottom
    }

    //inside #contentcolumn remove div.title
    document.querySelectorAll(".title").forEach(title => title.remove());

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

    //check for .inv table for each tr inside it and for each data-vault-type="inventory" assign class '.inventory_b'
    const tables = document.querySelectorAll("table.inv");
    tables.forEach(table => {
        const rows = table.querySelectorAll("tr");
        rows.forEach(row => {
            const dataVaultType = row.getAttribute("data-vault-type");
            if (dataVaultType === "inventory" || true) {
                const firstTd = row.querySelector("td:first-child");
                const secondTd = row.querySelector("td:nth-child(2)");

                if (firstTd && secondTd) {
                    const textContent = secondTd.textContent;

                    let actionUrl = false;
                    let actionText = '';
                    let secondActionUrl = false;
                    let secondActionText = '';

                    if (Object.keys(items).some(key => textContent.includes(key))) {
                        row.classList.add("inventory_b");

                        //inside the row check for first td if it has align="right" then hide it
                        if (firstTd.getAttribute("align") === "right") {
                            firstTd.style.display = "none";
                        }

                        if (firstTd.querySelectorAll("a").length > 2) {
                            actionUrl = firstTd.querySelectorAll("a")[0].href;
                            actionText = firstTd.querySelectorAll("a")[0].textContent;
                        }
                    }
                    else {
                        missingItems.push(textContent);
                    }

                    var mouseoverAttr = undefined;

                    if (secondTd.querySelector("a")) {
                        secondActionUrl = secondTd.querySelector("a").href;
                        mouseoverAttr = secondTd.querySelector("a").getAttribute("onmouseover") || "";

                        if (mouseoverAttr.includes("Remove item")) {
                            secondActionText = 'Remove item';
                        } else if (mouseoverAttr.includes("Open")) {
                            secondActionText = 'Open';
                        } else if (mouseoverAttr.includes("Close")) {
                            secondActionText = 'Close';
                        } else {
                            let explodeONV = mouseoverAttr.split("TITLE,'");
                            if (explodeONV[1]) {
                                explodeONV = explodeONV[1].split("'");
                                secondActionText = explodeONV[0];
                            }
                        }
                    }

                    // check for number like (1)
                    const match = textContent.match(/\((\d+)\)/);
                    const numberValue = match ? match[1] : false;

                    //check for [1] number like
                    const match2 = textContent.match(/\[(\d+)\]/);
                    const numberValue2 = match2 ? match2[1] : false;

                    if (row.classList.contains("inventory_b")) {

                        //check textContent if contains ( or [ . explode and take first part if exists, else leave as it is
                        var textContentClean = textContent;
                        if (textContent.includes("(")) {
                            textContentClean = textContent.split("(")[0];
                        } else if (textContent.includes("[")) {
                            textContentClean = textContent.split("[")[0];
                        }
                        
                        //strtolower 
                        textContentClean = textContentClean.toLowerCase();

                        const itemName = Object.keys(items).find(key => key.toLowerCase().trim() === textContentClean.trim());
                        const itemImage = items[itemName];

                        console.log(textContentClean + ": " + itemName);

                        const imageElement = document.createElement("img");
                        let secondActionUsed = false;

                        if(itemName != undefined) {
                            secondTd.innerHTML = "";
                            imageElement.src = itemImage;
                            imageElement.title = textContent;
                        }

                        if (actionUrl !== false) {
                            const aElement = document.createElement("a");
                            aElement.href = actionUrl;
                            aElement.appendChild(imageElement);
                            secondTd.appendChild(aElement);

                            if (actionText !== '') {
                                imageElement.title = actionText + " " + itemName;
                            }
                        } else if (secondActionUrl !== false) {
                            secondActionUsed = true;
                            const aElement = document.createElement("a");
                            aElement.href = secondActionUrl;
                            aElement.appendChild(imageElement);
                            secondTd.appendChild(aElement);
                            imageElement.title = secondActionText + " " + itemName;
                        } else {
                            secondTd.appendChild(imageElement);
                        }

                        if (numberValue !== false) {
                            const spanElement = document.createElement("span");
                            spanElement.classList.add("count_b");
                            spanElement.textContent = numberValue;
                            secondTd.appendChild(spanElement);
                        }
                        else if (numberValue2 !== false) {
                            const spanElement = document.createElement("span");
                            spanElement.classList.add("count_b");
                            spanElement.textContent = numberValue2;
                            secondTd.appendChild(spanElement);
                        }

                        secondTd.setAttribute("data-name", itemName);
                        //add attribute .inventory_b_inner
                        secondTd.classList.add("inventory_b_inner");

                        if (secondActionUrl !== false && !secondActionUsed) {
                            const aElement = document.createElement("a");
                            aElement.href = secondActionUrl;
                            aElement.classList.add("second_url");
                            aElement.textContent = "*";
                            aElement.title = secondActionText;
                            secondTd.appendChild(aElement);
                        }
                    }
                }
            }
        });
    });

    // After everything, report missing items
    if (missingItems.length > 0) {

        console.log("Reporting missing items:", missingItems);
        fetch("https://abesttools.com/game/allouthellmissingitems", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "items=" + encodeURIComponent(JSON.stringify(missingItems))
        }).catch(err => console.error("Failed to report missing items:", err));
    }
}

window.addEventListener("load", () => {
    const rightcolumn2 = document.createElement("div");
    rightcolumn2.id = "rightcolumn2";
    const rightcolumn = document.getElementById("rightcolumn");
    rightcolumn.parentNode.insertBefore(rightcolumn2, rightcolumn.nextSibling);

    const stats = document.querySelector(".stats");
    if (rightcolumn && rightcolumn2 && stats) {
        rightcolumn.removeChild(stats);
        rightcolumn2.appendChild(stats);
    } else {
        console.log("stats or rightcolumn not exists");
    }
});

//on #eventText change this this function
window.addEventListener("load", () => {
    const eventText = document.getElementById("eventText");
    var notifiedLastMessageRed = false;

    //get current stage of .event-entry messages
    const AllMessages = document.querySelectorAll(".event-entry");
    const lastThreeMessages = Array.from(AllMessages).slice(AllMessages.length - 3, AllMessages.length);
    const lastThreeMessagesWithRed = Array.from(lastThreeMessages).filter(message => message.querySelector("font[color='red']")).length >= 0;
    
    
    if (lastThreeMessagesWithRed) {
        notifiedLastMessageRed = true;
    }

    if (eventText) {
        let lastMessageRed = false;
        setInterval(async () => {
            try {
                const response = await fetch("https://www.allouthell.com/ajax/ajax_Events.php");
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");

                const AllMessages = doc.querySelectorAll(".event-entry");
                const lastThreeMessages = Array.from(AllMessages).slice(AllMessages.length - 3, AllMessages.length);
                const lastThreeMessagesWithRed = Array.from(lastThreeMessages).filter(message => message.querySelector("font[color='red']")).length >= 0;
                
                
                if (lastThreeMessagesWithRed && !notifiedLastMessageRed) {
                    alert('Attacked');
                    notifiedLastMessageRed = true;

                } else if (!lastThreeMessagesWithRed && notifiedLastMessageRed) {
                    
                    notifiedLastMessageRed = false;
                }
            } catch (err) {
                console.error("Failed to fetch events:", err);
            }
        }, 5000);
    }
});

loadItems();
