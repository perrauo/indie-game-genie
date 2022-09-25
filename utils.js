// const https = require('https');

function getSiblings(e) {
    // for collecting siblings
    let siblings = []; 
    // if no parent, return no sibling
    if(!e.parentNode) {
        return siblings;
    }
    // first child of the parent node
    let sibling  = e.parentNode.firstChild;
    
    // collecting siblings
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== e) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }
    return siblings;
}

function getElementByClassName(elem, classname) 
{
    var elements = elem.getElementsByClassName(classname);
    var requiredElement = elements[0];
    return requiredElement;
}

function getElementsByAttributePrefix(elem, attribute, prefix) 
{
    var matchingElements = [];
    var allElements = elem.getElementsByTagName('*');
    for (var i = 0, n = allElements.length; i < n; i++) {
        if (allElements[i].getAttribute(attribute) !== null) {
            if (allElements[i].getAttribute(attribute).startsWith(prefix))
                matchingElements.push(allElements[i]);
        }
    }
    return matchingElements;
}

exports.getHoursAgo = function(numOfHours, date = new Date()) {
    date.setHours(date.getHours() - numOfHours);
  
    return date;
}

exports.convertEpochToDate = function (epoch) 
{
    if (epoch < 10000000000)
    epoch *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
    var epoch = epoch + (new Date().getTimezoneOffset() * -1); //for timeZone        

    return new Date(epoch);

}

exports.convertDateToEpoch = function (date) {

    return Math.round(new Date(date).getTime() / 1000.0);
}




// async function asyncGet(url, fn) 
// {
//     return new Promise((resolve)=>
//     {
//         https.get(url, fn);
//     });
// }

// exports.getElementByClassName = getElementByClassName;
// exports.getSiblings = getSiblings;
// exports.getElementsByAttributePrefix = getElementsByAttributePrefix;
// exports.asyncGet = asyncGet;