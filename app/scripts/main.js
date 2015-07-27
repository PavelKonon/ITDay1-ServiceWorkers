if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function (registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function (err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

function printText(text) {
  var node = document.createElement("p");
  var textnode = document.createTextNode(text);
  node.appendChild(textnode);
  var parent = document.querySelector(".dashboard");
  parent.insertBefore(node, parent.firstChild);
}

function doAction() {
  fetch('https://numbersapi.p.mashape.com/6/21/date', {
    headers: {
      'Accept': 'Accept: text/plain',
      'X-Mashape-Key': '2caA1hl5c8msh85QDOmR2UgJMvXhp13ymIsjsnrupoGpud7nSQ'
    }
  }).then(function (resp) {
    return resp.text();
  }).then(function (text) {
    printText('Yoda: ' + text)
  });
  return false;
}
