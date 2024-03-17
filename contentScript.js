(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message['action'] === 'scrape') {
            console.log("Extracting blog ... ")
            let blogTitle = document.querySelector('[data-testid="storyTitle"]')
            blogTitle = blogTitle ? blogTitle.innerText : "";
    
            let authorName = document.querySelector('[data-testid="authorName"]')
            authorName = authorName ? authorName.innerText : ""
    
            let publishedIn = document.querySelector('[data-testid="publicationName"]')
            publishedIn = publishedIn ? publishedIn.innerText : ""
            
            let storyPublishDate = document.querySelector('[data-testid="storyPublishDate"]')
            storyPublishDate = storyPublishDate ? storyPublishDate.innerText : ""
            
            let blogText = []
            const blogTextBody = document.getElementsByClassName("pw-post-body-paragraph");
    
            for (let i = 0; i < blogTextBody.length; i++) {
                blogText.push(blogTextBody[i] ? blogTextBody[i].innerText : "")
            }
            
            blogContent = blogText.join("\n");
    
            const preTags = document.getElementsByTagName("pre")
            
            let preTagsText = []
            for (let i = 0; i < preTags.length; i++) {
                preTagsText.push(
                    preTags[i] ? preTags[i].innerText : "" 
                )
            } 
    
            const pictures = document.getElementsByTagName("picture");
            let images = []
            for (let i = 0; i < pictures.length; i++) {
                images.push(
                    pictures[i].querySelector("img").src
                )
            }

            const currentDate = new Date()
            const extractedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`

            const data = {
                "id": window.location.href,
                "blogTitle": blogTitle,
                "authorName": authorName,
                "publishedIn": publishedIn,
                "storyPublishedDate": storyPublishDate,
                "blogContent": blogContent,
                "preTagsText": preTagsText,
                "images": images,
                "extractedDate": extractedDate
            }
            
            sendResponse(data)
        }
    });

})();
