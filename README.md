# fetch-leetcode-submission
Help you to fetch your leetcode submissions.

The script runs on Chrome, which means you don't need any running environment. Just install the Chrome.

After runned it,  the browser will download a formatted markdown file. This is a generated file [**demo**](https://github.com/duteng/leetcode/blob/master/README.md).

## How to use
1. Using Chrome to open the [leetcode](http://leetcode.com), log in, then the redirect to the the [submission page](https://leetcode.com/submissions/#/1)
2. Open the Chrome Developer Tools console tab.
3. Paste the code in index.js in console, then press the Enter in keyboard.

![fetch1](https://user-images.githubusercontent.com/1821507/48863702-336f9d00-ee05-11e8-9958-3c98a37568f0.gif)

## Need to know
1. The script will retry when the request failed. You don't have stop the script when some request failed with 400.
(My experience is that a same request may failed more than 50 times. Just retry, it will succeed finally)
2. You can customize the markdown template, header or footer. You also can dump a JSON file.
3. If you wanna have a try of the script, set `onlyFetchFirstPage = true`, will only fetch the first page submissions. 
   If you wanna dump all, `onlyFetchFirstPage = false`
4. A draft script.. Still need update.
