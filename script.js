async function loadItems() {
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

function initInventory() {

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

                    var actionUrl = false;
                    var actionText = '';

                    var secondActionUrl = false;
                    var secondActionText = '';

                    if (Object.keys(items).some(key => textContent.includes(key))) {

                        row.classList.add("inventory_b");

                        //inside the row check for first td if it has align="right" then hide it
                        if (firstTd.getAttribute("align") === "right") {
                            firstTd.style.display = "none";
                        }

                        //if firstTd contains more then 3 a hrefs then copy link from third url which is not .inv-up-btn and not .inv-down-btn
                        //assign to actionUrl
                        if (firstTd.querySelectorAll("a").length > 2) {
                            //take first url from a href
                            actionUrl = firstTd.querySelectorAll("a")[0].href;
                            actionText = firstTd.querySelectorAll("a")[0].textContent;
                        }
                    }


                    //check for secondTd if it has a href
                    if (secondTd.querySelector("a")) {
                        //take first url from a href
                        secondActionUrl = secondTd.querySelector("a").href;

                        //check attribute onmouseover if has text - Remove item
                        if( secondTd.querySelector("a").getAttribute("onmouseover").includes("Remove item") )
                        {
                            secondActionText = 'Remove item';
                        }
                        else if( secondTd.querySelector("a").getAttribute("onmouseover").includes("Open") )
                        {
                            secondActionText = 'Open';
                        }
                        else if( secondTd.querySelector("a").getAttribute("onmouseover").includes("Close") )
                        {
                            secondActionText = 'Close';
                        }
                        else {

                            let explodeONV = secondTd.querySelector("a").getAttribute("onmouseover").split("TITLE,'");
                            explodeONV = explodeONV[1].split("'");
                            secondActionText = explodeONV[0];
                            //take first
                        }
                        
                    }

                    //for second td check if it has number between brackets like (1) . Remove brackets and add span around number.
                    const match = textContent.match(/\((\d+)\)/);
                    const number = match && match[1];
                    let numberValue = false;
                    if (number) {

                        //get only number value in span
                        //const numberValue = textContent.replace(/\((\d+)\)/, `<span>${number}</span>`);
                        numberValue = match[1];
                    }
                    
                    if(row.classList.contains("inventory_b"))
                    {
                        const itemName = Object.keys(items).find(key => textContent.includes(key));
                        const itemImage = items[itemName];
                        const imageElement = document.createElement("img");
                        imageElement.src = itemImage;
                        imageElement.title = itemName;
                        secondTd.innerHTML = "";

                        let secondActionUsed = false;

                        if(actionUrl !== false)
                        {
                            const aElement = document.createElement("a");
                            aElement.href = actionUrl;
                            aElement.appendChild(imageElement);
                            secondTd.appendChild(aElement);

                            //actionText if exists then change image title to actionText + " " + itemName
                            if(actionText !== '')
                            {
                                imageElement.title = actionText + " " + itemName;
                            }
                        }
                        else if(secondActionUrl !== false)
                        {
                            secondActionUsed = true;
                            const aElement = document.createElement("a");
                            aElement.href = secondActionUrl;
                            aElement.appendChild(imageElement);
                            secondTd.appendChild(aElement);
                            imageElement.title = secondActionText + " " + itemName;
                        }
                        else
                        {
                            secondTd.appendChild(imageElement);
                        }

                        if(numberValue !== false)
                        {
                            //add number value in span.count_b into secondTd
                            const spanElement = document.createElement("span");
                            spanElement.classList.add("count_b");
                            spanElement.textContent = numberValue;
                            secondTd.appendChild(spanElement);
                            
                        }
                        //if secondActionUrl is not false add it as data-url and secondActionText as data-text
                        secondTd.setAttribute("data-name", itemName);

                        if(secondActionUrl !== false && !secondActionUsed)
                        {
                            //append <a href= to secondTd
                            const aElement = document.createElement("a");
                            aElement.href = secondActionUrl;
                            //add Class second_url
                            aElement.classList.add("second_url");
                            aElement.textContent = "*";
                            aElement.title = secondActionText;
                            secondTd.appendChild(aElement);
                            //addClass second_url
                        }
                    }
                }
            }
        });
    });
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

loadItems();

