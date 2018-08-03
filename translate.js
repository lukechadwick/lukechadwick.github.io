document.addEventListener('DOMContentLoaded', createEventListeners)

function createEventListeners() {
    var beginClick = document.getElementById("begin");
    beginClick.onclick = fetchImage;
    var answerCheck = document.getElementById("submit-answer");
    answerCheck.onclick = checkAnswer;
}

function fetchImage() {
    let imgToTranslate = getIMG("https://picsum.photos/500/500/?random");
}

function checkAnswer() {
  //string cmp
  let aiAnswer = document.getElementById("translation").innerHTML;
  let answer = document.getElementById("answer").value;

  if (aiAnswer == answer){
    alert("win")
    fetchImage();
  }
  else{
    alert("fail")
    fetchImage();
  }
}

function startTranslate() {
    var e = document.getElementById("languageSelect");
    var languageValue = e.options[e.selectedIndex].value;
    //alert(languageValue);

    var text = document.getElementById("target").innerHTML
    var key = "AIzaSyApkbdj2rRQyrsyPJsS4H1rRnxYNSqa-tA";
    var source = "en";
    var dest = languageValue;

    var url = 'https://www.googleapis.com/language/translate/v2?';
    url += 'key=' + key + '&source=' + source + '&target=' + dest + '&callback=showIt&q=' + text;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);

}

function showIt(response) {
    if (response.data) {
        document.getElementById("translation").innerHTML = response.data.translations[0].translatedText;
    } else
        alert("Error:" + response.error.message)
}

function getIMG(url) {
    let bloburl = void 0;

    let img = new Image;

    const getResourceName = fetch(url)
        .then(response => Promise.all([response.url, response.blob()]))
        .then(([resource, blob]) => {
            bloburl = URL.createObjectURL(blob);
            img.src = bloburl;
            document.getElementById("imgTranslate").src = img.src

            recognition(resource);
            return resource
        });
    getResourceName.then(res => console.log(res)).catch(err => console.log(err))
}

function recognition(src) {
    var b = JSON.stringify({
        "requests": [{
            "image": {
                "source": {
                    "imageUri": src
                }
            },
            "features": [{
                "type": "LABEL_DETECTION",
                "maxResults": 1
            }]
        }]
    });
    var e = new XMLHttpRequest;

    e.onload = function() {
        console.log(e.responseText)

        var myObject = JSON.parse(e.responseText);

        var i = JSON.parse(e.response);
        value = i.responses[0].labelAnnotations[0]["description"];
        value2 = i.responses[0].labelAnnotations[0]["score"];
        value3 = Math.round( (value2 *= 100) * 10 ) / 10

        document.getElementById("target").innerHTML = value;
        document.getElementById("detected").innerHTML = "AI Detected Image: " + value;
        document.getElementById("confidence").innerHTML = "AI Confidence: " + value3 + "%";

        startTranslate();
    };
    e.open("POST", "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyApkbdj2rRQyrsyPJsS4H1rRnxYNSqa-tA", !0);
    e.send(b)
}