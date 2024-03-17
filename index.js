// function to get total blogs
function getTotalBlogs() {
    chrome.storage.local.get(null, (data)=>{
        const totalBlogs = data.blogs ? data.blogs.length : 0;
        console.log("Total Blogs ", totalBlogs)
        updateTotalBlogsDOMElement(totalBlogs)
    })
}

// update DOM element innerText
function updateTotalBlogsDOMElement(totalBlogs) {
    console.log("updating DOM - ", totalBlogs);
    const ele = document.getElementById("totalBlogs");
    console.log(ele, ele.innerText);
    ele.innerText = totalBlogs;
    console.log(ele, ele.innerText);
    void ele.offsetHeight;
}

const saveButton = document.getElementById('save-btn');

saveButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({
        action: 'saveBlog'
    })
})

const clearButton = document.getElementById("clear-btn");

clearButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({
        action: 'clearBlogs'
    })
})

// download json file
const jsonDownloadButton = document.getElementById("download-json-btn")
jsonDownloadButton.addEventListener("click", () => {
    chrome.storage.local.get(null, (data)=>{
        var jsonData = JSON.stringify(data.blogs);
        var blob = new Blob([jsonData], {type: "application/json"})

        const url = URL.createObjectURL(blob);
        const anchorTag = document.createElement("a");
        anchorTag.href = url
        anchorTag.download = "my_file.json"
        anchorTag.click();
        
    })
})

// updatingDOM
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateDOM") {
        getTotalBlogs()
    } else if (message.action === 'incorrectURL') {
        const messageText = document.getElementById('message-text');
        messageText.innerText = "Incorrect URL"
        const alertBox = document.getElementById('alert-box');
        alertBox.classList.remove('d-none')
        alertBox.classList.add('error-div')
        alertBox.style.display = 'flex';    
    }
})

// removing alert message
const crossBtn = document.getElementById('cross-btn')
crossBtn.addEventListener('click', () => {
    console.log('asad')
    const alertBox = document.getElementById('alert-box');
    alertBox.style.display = 'none';
})

// updating totalBlogs DOM element
getTotalBlogs()
