let scrapedData = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // saves blog in chrome.storage.local
    if (message.action === 'saveBlog') {
        
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            // sending request for current tab
            chrome.tabs.sendMessage(tabs[0].id, {action: "scrape"}, (response)=>{
                scrapedData = response;
                try {
                    // fetching previous data
                    var previousBlogs = null;
                    chrome.storage.local.get(null, (data) => {
                        previousBlogs = data.blogs
                        
                        if (scrapedData && scrapedData?.blogContent === '') {
                            chrome.runtime.sendMessage({
                                action: 'incorrectURL'
                            })
                        } else if (!previousBlogs) {
                            previousBlogs = [scrapedData]
                        } else if (scrapedData) {
                            previousBlogs = previousBlogs.filter(blog => blog.id !== scrapedData.id)
                            previousBlogs.push(scrapedData);
                        }
            
                        if (previousBlogs) {
                            chrome.storage.local.set({
                                'blogs': previousBlogs
                            }).then(
                                ()=>{
                                    chrome.runtime.sendMessage({
                                        action: 'updateDOM'
                                    })
                            }, 
                                ()=>{console.error("Failed to add blog ", scrapedData)}
                            )
                        }
                    });
                } catch (err) {
                    console.error(err)
                }
            });
        })

    }

    // clear the chrome.storage.local
    if (message.action === 'clearBlogs') {
        chrome.storage.local.clear(() => {
            chrome.runtime.sendMessage({
                action: 'updateDOM'
            })
        })
    }

});
    